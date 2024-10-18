import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useAuthContext} from '../../utils/auth.context';
import GoBackScreen from '../../components/go-back';
import imgManager from '../../functions/imgManager';
import {AppColors} from '../../assets/styles/default-styles';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCamera, faChartPie} from '@fortawesome/free-solid-svg-icons';
import PhotoStats from '../stats/photo-stats';
import SensorPhotoGallery from '../../components/sensor-gallery';
import showToast from '../../functions/showToast';
import {useFocusEffect} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const CosasLindasScreen = ({navigation}) => {
  const {user} = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [confirmedImages, setConfirmedImages] = useState([]);
  const [pendingImages, setPendingImages] = useState([]);
  const [showStats, setShowStats] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchImagesCallBack = async () => {
        try {
          const confirmedSnapshot = await firestore()
            .collection('photos')
            .where('estado', '==', 'confirmada')
            .where('tipo', '==', 'linda')
            .orderBy('createdAt', 'desc')
            .get();

          const confirmedImages = confirmedSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));

          setConfirmedImages(confirmedImages);
          setPendingImages(imgManager.fotosTomadas);
        } catch (error) {
          console.error('Error fetching images: ', error);
        } finally {
          setLoading(false);
        }
      };

      fetchImagesCallBack();
    }, []),
  );

  const fetchImages = async () => {
    try {
      const confirmedSnapshot = await firestore()
        .collection('photos')
        .where('estado', '==', 'confirmada')
        .where('tipo', '==', 'linda')
        .orderBy('createdAt', 'desc')
        .get();

      const confirmedImages = confirmedSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setConfirmedImages(confirmedImages);
      setPendingImages(imgManager.fotosTomadas);
    } catch (error) {
      console.error('Error fetching images: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmImage = async () => {
    setLoading(true);
    try {
      for (const photo of imgManager.fotosTomadas) {
        const imageUrl = await imgManager.uploadImage(photo.path);
        await imgManager.saveImageUrlToFirestore(
          imageUrl,
          user,
          'confirmada',
          'linda',
        );
      }
      imgManager.clearPhotos();
      setPendingImages([]);
      showToast('success', 'Imágenes subidas con éxito', 3000);
      fetchImages();
    } catch (error) {
      console.error('Error confirming images: ', error);
      showToast('error', 'Error al subir las imágenes', 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectImage = () => {
    imgManager.clearPhotos();
    setPendingImages([]);
    showToast('info', 'Imágenes descartadas', 3000);
  };

  const handleCamera = () => {
    navigation.navigate('Camara', {navigation});
  };

  const handleVote = async photoId => {
    const success = await imgManager.voteForPhoto(photoId, user.uid);
    if (success) {
      showToast('success', 'Voto registrado con éxito', 2000);
      fetchImages();
    } else {
      showToast('error', 'Ya votaste por esta foto', 2000);
    }
  };

  const renderPendingImageItem = ({item}) => (
    <View style={styles.pendingImageContainer}>
      <Image
        source={{uri: `file://${item.path}`}}
        style={styles.pendingImage}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <GoBackScreen />
        <TouchableOpacity
          onPress={() => setShowStats(true)}
          style={styles.statsIcon}>
          <FontAwesomeIcon
            icon={faChartPie}
            size={24}
            color={AppColors.white}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {pendingImages.length > 0 ? (
          <>
            <Text style={styles.previewTitle}>Vista previa</Text>
            <FlatList
              data={pendingImages}
              renderItem={renderPendingImageItem}
              keyExtractor={(item, index) => `pending-${index}`}
              style={styles.previewList}
              contentContainerStyle={styles.previewListContent}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmImage}>
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectButton}
                onPress={handleRejectImage}>
                <Text style={styles.buttonText}>Rechazar</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            {confirmedImages.length > 0 ? (
              <SensorPhotoGallery
                photos={confirmedImages}
                onVote={handleVote}
              />
            ) : (
              <Text style={styles.noImagesText}>
                ¡Sé el primero en subir una cosa linda!
              </Text>
            )}
          </>
        )}
      </View>

      {pendingImages.length === 0 && (
        <TouchableOpacity style={styles.takePhotoButton} onPress={handleCamera}>
          <FontAwesomeIcon icon={faCamera} size={24} color={AppColors.white} />
        </TouchableOpacity>
      )}

      <Modal
        visible={showStats}
        animationType="slide"
        onRequestClose={() => setShowStats(false)}>
        <PhotoStats type="linda" />
        <TouchableOpacity
          style={styles.closeStatsButton}
          onPress={() => setShowStats(false)}>
          <Text style={styles.closeStatsButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120E29',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: AppColors.purple,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  previewTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.white,
    textAlign: 'center',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: AppColors.white,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: AppColors.success,
    padding: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: AppColors.danger,
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
  },
  buttonText: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  takePhotoButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: AppColors.purple,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 1,
  },
  noImagesText: {
    color: AppColors.white,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  statsIcon: {
    padding: 10,
  },
  closeStatsButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: AppColors.purple,
    padding: 10,
    borderRadius: 5,
  },
  closeStatsButtonText: {
    color: AppColors.white,
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#120E29',
  },
  pendingImageContainer: {
    width: '100%',
    marginBottom: 20,
  },
  pendingImage: {
    width: '100%',
    height: width * 0.6,
    borderRadius: 10,
  },
});

export default CosasLindasScreen;
