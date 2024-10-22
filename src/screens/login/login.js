import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Keyboard,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faEyeSlash,
  faLock,
  faPhoneAlt,
} from '@fortawesome/free-solid-svg-icons';
import {AppColors, AppTxt, AppButton} from '../../assets/styles/default-styles';
import {AuthContext} from '../../utils/auth.context';
import useAuthenticationApi from '../../api/authentication';
import showToast from '../../functions/showToast';
import auth from '@react-native-firebase/auth';
import {
  faUser,
  faUserSecret,
  faFlask,
  faDoorOpen,
} from '@fortawesome/free-solid-svg-icons';

const LoginScreen = ({navigation}) => {
  const {signIn} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordValue, setShowPasswordValue] = useState(true);
  const [keyboardShown, setKeyboardShown] = useState(false);

  const {doLogin, registerUser} = useAuthenticationApi(
    email,
    password,
    setIsLoading,
    navigation,
  );

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      'keyboardDidShow',
      _keyboardDidShow,
    );
    const hideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide,
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const _keyboardDidShow = () => setKeyboardShown(true);
  const _keyboardDidHide = () => setKeyboardShown(false);

  const isValidEmail = email => /\S+@\S+\.\S+/.test(email);
  const isValidPassword = password => password.length >= 6;

  const handleLogin = async isEasyLogin => {
    if (!isValidEmail(email)) {
      showToast('error', 'Por favor, ingresa un email válido.', 5000);
      return;
    }

    if (!isValidPassword(password)) {
      showToast(
        'error',
        'La contraseña debe tener al menos 6 caracteres.',
        5000,
      );
      return;
    }

    await doLogin();
  };

  const easyLogin = async userEmail => {
    await auth().signInWithEmailAndPassword(userEmail, '12345678');
    navigation.navigate('Home');
  };

  return (
    <View onPress={() => Keyboard.dismiss} style={styles.container}>
      <View style={styles.titleContainer}>
        <ImageBackground
          style={styles.backgroundImage}
          imageStyle={{resizeMode: 'stretch'}}
          source={require('../../assets/img/portada.jpg')}
        />
      </View>

      <View style={styles.form}>
        <Text style={styles.welcomeTitle}>
          Bienvenido a Visualizador Kinético!
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            value={email}
            onChangeText={text => setEmail(text)}
            placeholder="Tu nombre de usuario"
            placeholderTextColor={AppColors.lightgray}
            style={styles.inputStyle}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Tu contraseña"
            placeholderTextColor={AppColors.lightgray}
            style={styles.inputStyle}
            secureTextEntry={showPasswordValue}
            onChangeText={text => setPassword(text)}
          />

          <TouchableOpacity
            style={styles.btnShowPassword}
            onPress={() => {
              setShowPasswordValue(!showPasswordValue);
            }}>
            <FontAwesomeIcon
              icon={faEyeSlash}
              style={{color: AppColors.lightgray}}
              size={25}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.leftFloatingButtons}>
            <TouchableOpacity
              style={[
                styles.quickLoginButton,
                styles.loginButton,
                !email?.length || !password?.length || isLoading
                  ? styles.buttonDisabled
                  : null,
              ]}
              onPress={handleLogin}
              disabled={!email?.length || !password?.length || isLoading}>
              <View style={styles.iconContainer}>
                <FontAwesomeIcon
                  icon={faDoorOpen}
                  size={20}
                  color={AppColors.white}
                />
              </View>
              <Text style={styles.quickLoginText}>Ingresar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickLoginButton, styles.anonimoButton]}
              onPress={() => easyLogin('anonimo@yopmail.com')}>
              <View style={styles.iconContainer}>
                <FontAwesomeIcon
                  icon={faUserSecret}
                  size={20}
                  color={AppColors.white}
                />
              </View>
              <Text style={styles.quickLoginText}>Anónimo</Text>
            </TouchableOpacity>
          </View>

          {/* Botones flotantes derechos */}
          <View style={styles.rightFloatingButtons}>
            <TouchableOpacity
              style={[styles.quickLoginButton, styles.testerButton]}
              onPress={() => easyLogin('tester@yopmail.com')}>
              <View style={styles.iconContainer}>
                <FontAwesomeIcon
                  icon={faFlask}
                  size={20}
                  color={AppColors.white}
                />
              </View>
              <Text style={styles.quickLoginText}>Tester</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickLoginButton, styles.adminButton]}
              onPress={() => easyLogin('adminuno@yopmail.com')}>
              <View style={styles.iconContainer}>
                <FontAwesomeIcon
                  icon={faUser}
                  size={20}
                  color={AppColors.white}
                />
              </View>
              <Text style={styles.quickLoginText}>Admin</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.createAccountButton}
          onPress={() =>
            navigation.navigate('Register', {navigation: navigation})
          }
          disabled={isLoading}>
          <Text style={styles.buttonText}>Crear Cuenta</Text>
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
  form: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderColor: AppColors.lightgray,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputStyle: {
    color: AppColors.white,
    paddingRight: 5,
    fontSize: 18,
    flex: 1,
    paddingVertical: 10,
  },
  welcomeTitle: {
    textAlign: 'center',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 30,
    color: AppColors.white,
  },
  btnShowPassword: {
    padding: 10,
  },
  titleContainer: {
    height: 220,
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '200%',
    height: '100%',
    transform: [{scaleX: 0.5}],
  },
  buttonContainer: {
    marginTop: 30,
    position: 'relative',
    height: 200, // Dar espacio para los botones flotantes
  },
  button: {
    backgroundColor: AppColors.secondary,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: AppColors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Botones flotantes izquierdos
  leftFloatingButtons: {
    position: 'absolute',
    left: -20,
    top: '20%',
    transform: [{translateY: -50}],
    gap: 15,
  },
  // Botones flotantes derechos
  rightFloatingButtons: {
    position: 'absolute',
    right: -20,
    top: '20%',
    transform: [{translateY: -50}],
    gap: 15,
  },
  quickLoginButton: {
    width: 175,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  iconContainer: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  loginButton: {
    backgroundColor: AppColors.secondary,
    borderWidth: 1,
    borderColor: '#6B7FD7',
  },
  adminButton: {
    backgroundColor: AppColors.darkGreen,
    borderWidth: 1,
    borderColor: '#6B7FD7',
  },
  anonimoButton: {
    backgroundColor: '#6B4E71',
    borderWidth: 1,
    borderColor: '#8B6E91',
  },
  testerButton: {
    backgroundColor: '#557A95',
    borderWidth: 1,
    borderColor: '#7599B4',
  },
  quickLoginText: {
    color: AppColors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  createAccountButton: {
    backgroundColor: AppColors.secondary,
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
  },
});

export default LoginScreen;
