import React, {useState, useEffect, useMemo} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {useOrientation} from './useOrientation';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faThumbsUp} from '@fortawesome/free-solid-svg-icons';
import {format} from 'date-fns';
import {AppColors} from '../assets/styles/default-styles';

const {width, height} = Dimensions.get('window');

const SensorPhotoGallery = ({photos, onVote, text}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const {orientation, isInitialRender} = useOrientation();
  const [lastOrientation, setLastOrientation] = useState(null);

  useEffect(() => {
    if (isInitialRender || orientation === lastOrientation) return;

    switch (orientation) {
      case 'rightTilt':
        setIsLoading(true);
        setCurrentIndex(
          prevIndex => (prevIndex - 1 + photos.length) % photos.length,
        );
        break;
      case 'leftTilt':
        setIsLoading(true);
        setCurrentIndex(prevIndex => (prevIndex + 1) % photos.length);
        break;
      case 'horizontal':
        setIsLoading(true);
        setCurrentIndex(0);

        // Mantener la posición actual para vertical y horizontal
        break;
    }

    setLastOrientation(orientation);
  }, [orientation, isInitialRender, photos.length]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleVote = () => {
    if (onVote && photos[currentIndex]) {
      onVote(photos[currentIndex].id);
    }
  };

  const getImageContainerStyle = useMemo(() => {
    const isPortrait = orientation === 'vertical';
    return {
      flex: isPortrait ? 0.8 : 1,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden', // Oculta cualquier contenido que se salga del contenedor
      width: '100%', // Asegura que el contenedor ocupe todo el ancho disponible
    };
  }, [orientation]);

  const getImageStyle = useMemo(() => {
    const isPortrait = orientation === 'vertical';
    return {
      width: isPortrait ? width * 0.9 : width,
      height: isPortrait ? height : height,
      resizeMode: isPortrait ? 'contain' : 'cover',
    };
  }, [orientation]);

  const getInfoContainerStyle = useMemo(() => {
    const isPortrait = orientation === 'vertical';
    return {
      position: 'absolute',
      bottom: 0,
      left: 6,
      right: 6,
      backgroundColor: isPortrait ? 'rgba(0, 0, 0, 0.7)' : 'transparent',
      padding: 15,
    };
  }, [orientation]);

  if (photos.length === 0) {
    return null;
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            text == 'Cosas Lindas' ? AppColors.primary : AppColors.darkGreen,
        },
      ]}>
      <Text style={styles.title}>Galería {text}</Text>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
      {photos[currentIndex] && (
        <>
          <View style={getImageContainerStyle}>
            <Image
              source={{uri: photos[currentIndex].imageUrl}}
              style={[getImageStyle, isLoading ? styles.hiddenImage : null]}
              resizeMode="contain"
              onLoad={handleImageLoad}
            />
          </View>
          <View style={getInfoContainerStyle}>
            <Text style={styles.userName}>
              {photos[currentIndex].userName} subió esta foto
            </Text>
            <Text style={styles.dateText}>
              {format(
                photos[currentIndex].createdAt.toDate(),
                'dd/MM/yyyy HH:mm:ss',
              )}
            </Text>
            <Text style={styles.voteCount}>
              Votos: {photos[currentIndex].votes || 0}
            </Text>
            <TouchableOpacity style={styles.voteButton} onPress={handleVote}>
              <FontAwesomeIcon
                icon={faThumbsUp}
                size={20}
                color={AppColors.white}
              />
              <Text style={styles.voteButtonText}>Votar</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};
// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.secondary,
    textAlign: 'center',
    marginVertical: 10,
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 5,
    // Añadimos múltiples sombras para crear un efecto de contorno
    textShadowOffset: {width: 0, height: 0},
    textShadowColor: '#000',
    textShadowRadius: 1,
  },
  hiddenImage: {
    opacity: 0,
  },
  userName: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    color: AppColors.lightgray,
    fontSize: 14,
    marginTop: 5,
  },
  voteCount: {
    color: AppColors.lightgray,
    fontSize: 14,
    marginTop: 5,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.secondary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  voteButtonText: {
    color: AppColors.white,
    marginLeft: 10,
    fontSize: 16,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default SensorPhotoGallery;
