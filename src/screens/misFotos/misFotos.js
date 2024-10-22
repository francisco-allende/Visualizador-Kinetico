import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useAuthContext} from '../../utils/auth.context';
import GoBackScreen from '../../components/go-back';
import {AppColors} from '../../assets/styles/default-styles';
import {format} from 'date-fns';

const {width} = Dimensions.get('window');

const MisFotosScreen = ({navigation}) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNoPhotosMessage, setShowNoPhotosMessage] = useState(false);
  const {user} = useAuthContext();

  useEffect(() => {
    const fetchPhotos = async () => {
      if (!user?.email) return;

      try {
        const photosSnapshot = await firestore()
          .collection('photos')
          .where('user', '==', user.email)
          .orderBy('createdAt', 'desc')
          .get();

        const photosData = photosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          imageLoading: true,
        }));

        setPhotos(photosData);
      } catch (error) {
        console.error('Error al obtener las fotos: ', error);
      } finally {
        setLoading(false);
        setTimeout(() => {
          setShowNoPhotosMessage(true);
        }, 1000);
      }
    };

    fetchPhotos();
  }, [user]);

  const handleImageLoad = id => {
    setPhotos(prevPhotos =>
      prevPhotos.map(photo =>
        photo.id === id ? {...photo, imageLoading: false} : photo,
      ),
    );
  };

  const renderPhotoItem = ({item}) => (
    <View style={styles.photoItem}>
      <View style={styles.photoContainer}>
        {item.imageLoading && (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color={AppColors.white}
          />
        )}
        <Image
          source={{uri: item.imageUrl}}
          style={styles.photo}
          onLoad={() => handleImageLoad(item.id)}
        />
      </View>
      <View style={styles.photoInfoContainer}>
        <Text style={styles.photoInfoText}>
          Sección:{' '}
          <Text style={styles.highlightText}>
            {item.tipo === 'linda' ? 'Linda' : 'Fea'}
          </Text>
        </Text>
        <Text style={styles.photoInfoText}>
          Votos: <Text style={styles.highlightText}>{item.votes || 0}</Text>
        </Text>
        <Text style={styles.photoInfoText}>
          Fecha:{' '}
          <Text style={styles.highlightText}>
            {format(item.createdAt.toDate(), 'dd/MM/yyyy HH:mm:ss')}
          </Text>
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={AppColors.white} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GoBackScreen navigation={navigation} />
      <Text style={styles.title}>Mis Fotos</Text>
      {photos.length > 0 ? (
        <FlatList
          data={photos}
          keyExtractor={item => item.id}
          renderItem={renderPhotoItem}
          contentContainerStyle={styles.photoList}
        />
      ) : showNoPhotosMessage ? (
        <Text style={styles.noPhotosText}>Aún no has subido fotos.</Text>
      ) : (
        <ActivityIndicator size="large" color={AppColors.white} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.white,
    textAlign: 'center',
    marginVertical: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  photoList: {
    padding: 16,
  },
  photoItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  photoContainer: {
    position: 'relative',
    width: '100%',
    height: width * 0.6,
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  photoInfoContainer: {
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  photoInfoText: {
    color: AppColors.lightgray,
    fontSize: 16,
    marginBottom: 5,
  },
  highlightText: {
    color: AppColors.white,
    fontWeight: 'bold',
  },
  noPhotosText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
    color: AppColors.white,
    fontStyle: 'italic',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.primary,
  },
});

export default MisFotosScreen;
