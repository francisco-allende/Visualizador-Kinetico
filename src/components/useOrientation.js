import {useState, useEffect, useRef} from 'react';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';

export const useOrientation = () => {
  const [orientation, setOrientation] = useState('horizontal');
  const [isInitialRender, setIsInitialRender] = useState(true);
  const lastVerticalTime = useRef(0);

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 100);
    let subscription;

    const subscribe = () => {
      subscription = accelerometer.subscribe(({x, y, z}) => {
        let newOrientation;
        const now = Date.now();

        if (Math.abs(y) > 7) {
          newOrientation = 'vertical';
          lastVerticalTime.current = now;
        } else if (Math.abs(x) > 3 && now - lastVerticalTime.current > 500) {
          newOrientation = x > 0 ? 'rightTilt' : 'leftTilt';
        } else if (Math.abs(z) > 8) {
          newOrientation = 'horizontal';
        } else {
          newOrientation = orientation;
        }

        if (newOrientation !== orientation) {
          console.log(
            'Nueva orientación:',
            newOrientation,
            'X:',
            x,
            'Y:',
            y,
            'Z:',
            z,
          );
          setOrientation(newOrientation);
        }
      });
    };

    subscribe();

    const timer = setTimeout(() => {
      setIsInitialRender(false);
    }, 1000);

    return () => {
      subscription && subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, [orientation]);

  return {orientation, isInitialRender};
};
