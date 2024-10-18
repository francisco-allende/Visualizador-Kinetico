import {NativeModules} from 'react-native';
import {accelerometer, gyroscope} from 'react-native-sensors';

export const checkSensorAvailability = async sensorType => {
  return new Promise(resolve => {
    const subscription = sensorType.subscribe(
      () => {
        subscription.unsubscribe();
        resolve(true);
      },
      () => {
        resolve(false);
      },
    );

    // Asegúrate de resolver false si no hay respuesta después de un tiempo
    setTimeout(() => {
      subscription.unsubscribe();
      resolve(false);
    }, 1000);
  });
};

export const isGyroscopeAvailable = () => checkSensorAvailability(gyroscope);
export const isAccelerometerAvailable = () =>
  checkSensorAvailability(accelerometer);
