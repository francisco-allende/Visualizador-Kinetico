import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {AppColors} from '../../assets/styles/default-styles';

const SplashScreen = ({navigation}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000); // 3 segundos de duración

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={require('../../assets/img/icono-transparente-vk.png')}
          style={styles.icon}
        />
        <Text style={styles.title}>Visualizador Kinético</Text>
      </View>
      <View style={styles.bottomSection}>
        <Text style={styles.info}>Francisco Allende</Text>
        <Text style={styles.info}>División A141-2</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AppColors.darkGreen,
    paddingVertical: 50,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  bottomSection: {
    alignItems: 'center',
  },
  info: {
    fontSize: 24,
    color: 'white',
    marginBottom: 15,
  },
});

export default SplashScreen;
