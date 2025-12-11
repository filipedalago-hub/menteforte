import { useState, useCallback } from 'react';
import { haptics } from '../lib/haptics';

type ToastType = 'success' | 'error' | 'warning' | 'xp' | 'achievement' | 'goal' | 'streak';

interface ToastConfig {
  message: string;
  type?: ToastType;
  duration?: number;
  withHaptics?: boolean;
}

export function usePremiumToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('success');
  const [duration, setDuration] = useState(1300);

  const show = useCallback(
    ({ message, type = 'success', duration = 1300, withHaptics = true }: ToastConfig) => {
      setMessage(message);
      setType(type);
      setDuration(duration);
      setIsVisible(true);

      if (withHaptics) {
        switch (type) {
          case 'success':
          case 'xp':
          case 'achievement':
          case 'goal':
          case 'streak':
            haptics.success();
            break;
          case 'error':
            haptics.error();
            break;
          case 'warning':
            haptics.warning();
            break;
          default:
            haptics.light();
        }
      }
    },
    []
  );

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  return {
    isVisible,
    message,
    type,
    duration,
    show,
    hide,
  };
}
