import {NativeModules} from 'react-native';

export const toggleDebuggingMenu = enabled => {
  if (__DEV__) {
    NativeModules.DevSettings.setIsDebuggingRemotely(enabled);
  }
};
