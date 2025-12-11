import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

export const haptics = {
  light: async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {
      console.log('Haptics not available');
    }
  },

  medium: async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (e) {
      console.log('Haptics not available');
    }
  },

  heavy: async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (e) {
      console.log('Haptics not available');
    }
  },

  success: async () => {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch (e) {
      console.log('Haptics not available');
    }
  },

  warning: async () => {
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch (e) {
      console.log('Haptics not available');
    }
  },

  error: async () => {
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch (e) {
      console.log('Haptics not available');
    }
  },

  selection: async () => {
    try {
      await Haptics.selectionStart();
      setTimeout(() => Haptics.selectionEnd(), 100);
    } catch (e) {
      console.log('Haptics not available');
    }
  },
};
