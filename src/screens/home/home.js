import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {AuthContext} from '../../utils/auth.context';
import {useNavigation} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faUserCircle, faDoorOpen} from '@fortawesome/free-solid-svg-icons';
import AppContainer from '../../assets/app-container/container';
import {AppColors} from '../../assets/styles/default-styles';

const HomeScreen = () => {
  const {signOut} = useContext(AuthContext);
  const navigation = useNavigation();

  const handleCosasLindas = () =>
    navigation.navigate('CosasLindas', {navigation: navigation});
  const handleCosasFeas = () =>
    navigation.navigate('CosasFeas', {navigation: navigation});

  const handleLogOut = async () => {
    await signOut();
    navigation.navigate('Login');
  };

  const handleUserPhotos = () => {
    navigation.navigate('MisFotos');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogOut}>
          <FontAwesomeIcon
            icon={faDoorOpen}
            size={25}
            style={styles.iconMenu}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Visualizador Kinético</Text>
        <TouchableOpacity onPress={handleUserPhotos}>
          <FontAwesomeIcon
            icon={faUserCircle}
            size={25}
            style={styles.iconMenu}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCosasLindas}>
          <ImageBackground
            source={require('../../assets/img/portada.jpg')}
            style={styles.buttonBackground}
            resizeMode="cover">
            <Text style={styles.buttonText}>Cosas Lindas</Text>
          </ImageBackground>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCosasFeas}>
          <ImageBackground
            source={require('../../assets/img/cosas_feas.jpg')}
            style={styles.buttonBackground}
            resizeMode="cover">
            <Text style={styles.buttonText}>Cosas Feas</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: AppColors.darkGreen,
  },
  headerText: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconMenu: {
    color: AppColors.white,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  button: {
    flex: 1,
    borderWidth: 5,
    borderColor: AppColors.background,
    borderTopWidth: 2, // Aumentamos el grosor del borde superior
    borderBottomWidth: 2,
  },
  buttonBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 80,
    textAlign: 'center',
    fontWeight: 'bold',
    color: AppColors.darkGreen,
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 5,
    // Añadimos múltiples sombras para crear un efecto de contorno
    textShadowOffset: {width: -2, height: -2},
    textShadowColor: '#fff',
    textShadowRadius: 1,
  },
});

export default HomeScreen;
