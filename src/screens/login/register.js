import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEyeSlash, faUser} from '@fortawesome/free-solid-svg-icons';
import {AppColors, AppTxt, AppButton} from '../../assets/styles/default-styles';
import useAuthenticationApi from '../../api/authentication';
import showToast from '../../functions/showToast';

const RegisterScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordValue, setShowPasswordValue] = useState(true);

  const {registerUser} = useAuthenticationApi(
    email,
    password,
    setIsLoading,
    navigation,
  );

  const handleRegister = async () => {
    if (!email || !password) {
      showToast('error', 'Por favor, completa todos los campos.', 3000);
      return;
    }
    await registerUser();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconContainer}>
        <FontAwesomeIcon icon={faUser} size={80} color={AppColors.white} />
      </View>
      <View style={styles.form}>
        <Text style={styles.title}>Crear Usuario</Text>

        <View style={styles.inputContainer}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Tu nombre de usuario"
            placeholderTextColor={AppColors.lightgray}
            style={styles.inputStyle}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Contraseña"
            placeholderTextColor={AppColors.lightgray}
            style={styles.inputStyle}
            secureTextEntry={showPasswordValue}
          />
          <TouchableOpacity
            style={styles.btnShowPassword}
            onPress={() => setShowPasswordValue(!showPasswordValue)}>
            <FontAwesomeIcon
              icon={faEyeSlash}
              style={{color: AppColors.lightgray}}
              size={25}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={isLoading}>
          <Text style={styles.buttonText}>Crear</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('Login')}
          disabled={isLoading}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primary,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  form: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.white,
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: AppColors.lightgray,
    marginBottom: 25,
  },
  inputStyle: {
    flex: 1,
    color: AppColors.white,
    fontSize: 18,
    paddingVertical: 12,
  },
  btnShowPassword: {
    padding: 10,
  },
  button: {
    backgroundColor: AppColors.secondary,
    marginTop: 20,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 15,
  },
  buttonText: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
