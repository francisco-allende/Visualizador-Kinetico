import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useOrientation} from './useOrientation';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faThumbsUp} from '@fortawesome/free-solid-svg-icons';
import {format} from 'date-fns';
import {AppColors} from '../assets/styles/default-styles';

const {width, height} = Dimensions.get('window');

const SensorPhotoGallery = ({photos, onVote}) => {
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

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
      {photos[currentIndex] && (
        <>
          <Image
            source={{uri: photos[currentIndex].imageUrl}}
            style={[styles.image, isLoading ? styles.hiddenImage : null]}
            resizeMode="contain"
            onLoad={handleImageLoad}
          />
          <View style={styles.infoContainer}>
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
      <Text style={styles.orientationInfo}>
        Orientación: {orientation} | Foto: {currentIndex + 1}/{photos.length}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: width,
    height: height * 0.7,
  },
  hiddenImage: {
    opacity: 0,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    padding: 15,
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
    backgroundColor: AppColors.purple,
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
  orientationInfo: {
    position: 'absolute',
    bottom: 20,
    color: '#fff',
    fontSize: 14,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

export default SensorPhotoGallery;
