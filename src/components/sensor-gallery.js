import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
} from 'react-native';
import {useOrientation} from './useOrientation';

const {width, height} = Dimensions.get('window');

const SensorPhotoGallery = ({photos}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const {orientation, isInitialRender} = useOrientation();
  const [lastOrientation, setLastOrientation] = useState(null);

  useEffect(() => {
    if (isInitialRender || orientation === lastOrientation) return;

    switch (orientation) {
      case 'leftTilt':
        setIsLoading(true);
        setCurrentIndex(prevIndex => (prevIndex + 1) % photos.length);
        break;
      case 'rightTilt':
        setIsLoading(true);
        setCurrentIndex(
          prevIndex => (prevIndex - 1 + photos.length) % photos.length,
        );
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

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}
      {photos[currentIndex] && (
        <Image
          source={{uri: photos[currentIndex].imageUrl}}
          style={[styles.image, isLoading ? styles.hiddenImage : null]}
          resizeMode="contain"
          onLoad={handleImageLoad}
        />
      )}
      <Text style={styles.infoText}>Orientación: {orientation}</Text>
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
    height: height,
  },
  hiddenImage: {
    opacity: 0,
  },
  infoText: {
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
