import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export interface NotificationData {
  screen?: string;
  userId?: string;
  callType?: 'voice' | 'video';
  messageId?: string;
  [key: string]: any;
}

export class NotificationService {
  private static instance: NotificationService;
  private expoPushToken: string | null = null;

  private constructor() {
    this.setupNotificationHandler();
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private setupNotificationHandler() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }

  public async initialize(): Promise<string | null> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('call', {
        name: 'Incoming Calls',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#10B981',
        sound: 'default',
        enableVibrate: true,
      });

      await Notifications.setNotificationChannelAsync('message', {
        name: 'Messages',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 150, 150, 150],
        lightColor: '#3B82F6',
        sound: 'default',
      });

      await Notifications.setNotificationChannelAsync('general', {
        name: 'General Notifications',
        importance: Notifications.AndroidImportance.DEFAULT,
        lightColor: '#8B5CF6',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        throw new Error('Push notification permissions not granted');
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      this.expoPushToken = token;
      return token;
    } else {
      throw new Error('Must use physical device for Push Notifications');
    }
  }

  public getExpoPushToken(): string | null {
    return this.expoPushToken;
  }

  public async scheduleLocalNotification(
    title: string,
    body: string,
    data: NotificationData = {},
    channelId: string = 'general'
  ) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
        sound: 'default',
        badge: 1,
      },
      trigger: null, // Show immediately
    });
  }

  public async sendPushNotification(
    expoPushToken: string,
    title: string,
    body: string,
    data: NotificationData = {}
  ) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data,
      badge: 1,
    };

    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error sending push notification:', error);
      throw error;
    }
  }

  public async setBadgeCount(count: number) {
    await Notifications.setBadgeCountAsync(count);
  }

  public async clearAllNotifications() {
    await Notifications.dismissAllNotificationsAsync();
  }

  public addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ) {
    return Notifications.addNotificationReceivedListener(listener);
  }

  public addNotificationResponseReceivedListener(
    listener: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }
}

export default NotificationService.getInstance();