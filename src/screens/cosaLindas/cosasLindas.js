import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import showToast from '../../functions/showToast';
import firestore from '@react-native-firebase/firestore';
import {useAuthContext} from '../../utils/auth.context';
import GoBackScreen from '../../components/go-back';
import imgManager from '../../functions/imgManager';
import {AppColors} from '../../assets/styles/default-styles';
import {useFocusEffect} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCamera,
  faThumbsUp,
  faChartPie,
  faImages,
} from '@fortawesome/free-solid-svg-icons';
import PhotoStats from '../stats/photo-stats';
import {format} from 'date-fns';
import SensorPhotoGallery from '../../components/sensor-gallery';

const {width} = Dimensions.get('window');

const CosasLindasScreen = ({navigation}) => {
  const {user} = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [confirmedImages, setConfirmedImages] = useState([]);
  const [pendingImages, setPendingImages] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
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

      fetchImages();
    }, []),
  );

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
      // Actualizar la lista de imágenes confirmadas
      const newConfirmedSnapshot = await firestore()
        .collection('photos')
        .where('estado', '==', 'confirmada')
        .where('tipo', '==', 'linda')
        .orderBy('createdAt', 'desc')
        .get();

      const newConfirmedImages = newConfirmedSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setConfirmedImages(newConfirmedImages);
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
      // Actualizar la lista de imágenes para reflejar el nuevo voto
      const updatedImages = confirmedImages.map(img =>
        img.id === photoId ? {...img, votes: (img.votes || 0) + 1} : img,
      );
      setConfirmedImages(updatedImages);
    } else {
      showToast('error', 'Ya votaste por esta foto', 2000);
    }
  };

  const renderImageItem = ({item}) => (
    <View style={styles.imageContainer}>
      <Image source={{uri: item.imageUrl}} style={styles.image} />
      <View style={styles.imageInfo}>
        <Text style={styles.userName}>{item.userName} subió esta foto</Text>
        <Text style={styles.dateText}>
          {format(item.createdAt.toDate(), 'dd/MM/yyyy HH:mm:ss')}
        </Text>
        <Text style={styles.voteCount}>Votos: {item.votes || 0}</Text>
        <TouchableOpacity
          style={styles.voteButton}
          onPress={() => handleVote(item.id)}>
          <FontAwesomeIcon
            icon={faThumbsUp}
            size={20}
            color={AppColors.white}
          />
          <Text style={styles.voteButtonText}>Votar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPendingImageItem = ({item}) => (
    <View style={styles.pendingImageContainer}>
      <Image
        source={{uri: `file://${item.path}`}}
        style={styles.pendingImage}
      />
    </View>
  );

  const toggleGallery = () => {
    setShowGallery(!showGallery);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GoBackScreen />
      <Text style={styles.title}>Cosas Lindas</Text>

      <TouchableOpacity style={styles.galleryButton} onPress={toggleGallery}>
        <FontAwesomeIcon icon={faImages} size={24} color={AppColors.white} />
        <Text style={styles.galleryButtonText}>Ver Galería</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cameraButton} onPress={handleCamera}>
        <FontAwesomeIcon icon={faCamera} size={24} color={AppColors.white} />
      </TouchableOpacity>

      <Modal visible={showGallery} animationType="slide">
        <SensorPhotoGallery photos={confirmedImages} onVote={handleVote} />
        <TouchableOpacity style={styles.closeButton} onPress={toggleGallery}>
          <Text style={styles.closeButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120E29', // Fondo oscuro similar al login
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: AppColors.purple,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.white,
    textAlign: 'center',
    marginVertical: 20,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  cameraButton: {
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
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.purple,
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  galleryButtonText: {
    color: AppColors.white,
    marginLeft: 10,
    fontSize: 18,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: AppColors.purple,
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: AppColors.white,
    fontSize: 16,
  },
  noImagesText: {
    color: AppColors.white,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#120E29',
  },
});

export default CosasLindasScreen;
