import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Bell, Send, Settings, Smartphone, Phone, MessageSquare, Calendar } from 'lucide-react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useNotifications } from '@/contexts/NotificationContext';
import { useTheme } from '@/contexts/ThemeContext';
import NotificationHeadsUp from '@/components/NotificationHeadsUp';

export default function HomeScreen() {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [permissionStatus, setPermissionStatus] = useState<string>('unknown');
  const { addNotification, showHeadsUp, setShowHeadsUp, currentHeadsUpNotification } = useNotifications();
  const { colors } = useTheme();

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
      }
    });
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#8B5CF6',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      setPermissionStatus(finalStatus);

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        setPermissionStatus(finalStatus);
      }

      if (finalStatus !== 'granted') {
        Alert.alert('Permission Required', 'Push notification permissions are required for the full app experience.');
        return;
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      Alert.alert('Physical Device Required', 'Push notifications require a physical device.');
    }

    return token;
  }

  const sendLocalNotification = async (type: 'call' | 'message' | 'reminder' | 'general', title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { type, screen: type === 'call' ? 'call' : 'notifications' },
        sound: 'default',
        badge: 1,
      },
      trigger: null, // Show immediately
    });
  };

  const handleHeadsUpAccept = () => {
    setShowHeadsUp(false);
    // Navigate to call screen or handle call acceptance
    Alert.alert('Call Accepted', 'Connecting to call...');
  };

  const handleHeadsUpDecline = () => {
    setShowHeadsUp(false);
    Alert.alert('Call Declined', 'Call has been declined');
  };

  const handleHeadsUpDismiss = () => {
    setShowHeadsUp(false);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#8B5CF6', '#3B82F6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appTitle}>NotifyPro</Text>
          <Text style={styles.subtitle}>Advanced Push Notification Demo</Text>
        </View>
      </LinearGradient>

        <View style={styles.content}>
          <View style={[styles.statusCard, { backgroundColor: colors.surface }]}>
          <View style={styles.statusHeader}>
            <Smartphone color="#8B5CF6" size={24} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Device Status</Text>
          </View>
          <View style={styles.statusItem}>
              <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Push Token:</Text>
              <Text style={[styles.statusValue, { color: colors.text }]}>
              {expoPushToken ? '✅ Generated' : '❌ Not Available'}
            </Text>
          </View>
          <View style={styles.statusItem}>
              <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Permissions:</Text>
            <Text style={[
                styles.statusValue,
                { color: colors.text },
              { color: permissionStatus === 'granted' ? '#10B981' : '#EF4444' }
            ]}>
              {permissionStatus === 'granted' ? '✅ Granted' : '❌ ' + permissionStatus}
            </Text>
          </View>
          <View style={styles.statusItem}>
              <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Device:</Text>
              <Text style={[styles.statusValue, { color: colors.text }]}>
              {Device.isDevice ? '📱 Physical Device' : '💻 Simulator'}
            </Text>
          </View>
        </View>

          <View style={[styles.actionsCard, { backgroundColor: colors.surface }]}>
          <View style={styles.actionHeader}>
            <Bell color="#EC4899" size={24} />
              <Text style={[styles.cardTitle, { color: colors.text }]}>Test Notifications</Text>
          </View>
          
            <View style={styles.notificationButtons}>
              <TouchableOpacity
                style={styles.notificationTypeButton}
                onPress={() => sendLocalNotification('call', 'Incoming Call 📞', 'John Doe is calling you...')}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.buttonGradient}
                >
                  <Phone color="white" size={20} />
                  <Text style={styles.buttonText}>Call Notification</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.notificationTypeButton}
                onPress={() => sendLocalNotification('message', 'New Message 💬', 'Hey! How are you doing today?')}
              >
                <LinearGradient
                  colors={['#3B82F6', '#1D4ED8']}
                  style={styles.buttonGradient}
                >
                  <MessageSquare color="white" size={20} />
                  <Text style={styles.buttonText}>Message</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.notificationTypeButton}
                onPress={() => sendLocalNotification('reminder', 'Meeting Reminder 📅', 'Team standup in 10 minutes')}
              >
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.buttonGradient}
                >
                  <Calendar color="white" size={20} />
                  <Text style={styles.buttonText}>Reminder</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

          <TouchableOpacity
              style={styles.secondaryButton}
          >
              <Settings color={colors.textSecondary} size={20} />
              <Text style={[styles.secondaryButtonText, { color: colors.textSecondary }]}>Notification Settings</Text>
          </TouchableOpacity>
        </View>

          <View style={[styles.featuresCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Features Implemented</Text>
          <View style={styles.featuresList}>
              <Text style={[styles.featureItem, { color: colors.textSecondary }]}>• Dynamic notification creation</Text>
              <Text style={[styles.featureItem, { color: colors.textSecondary }]}>• WhatsApp-style heads-up notifications</Text>
              <Text style={[styles.featureItem, { color: colors.textSecondary }]}>• Notification history management</Text>
              <Text style={[styles.featureItem, { color: colors.textSecondary }]}>• Dark mode support</Text>
              <Text style={[styles.featureItem, { color: colors.textSecondary }]}>• Badge count tracking</Text>
              <Text style={[styles.featureItem, { color: colors.textSecondary }]}>• Call interface simulation</Text>
          </View>
        </View>
        </View>
      </ScrollView>

      {/* Heads-up Notification */}
      <NotificationHeadsUp
        visible={showHeadsUp}
        title={currentHeadsUpNotification?.title || ''}
        body={currentHeadsUpNotification?.body || ''}
        type={currentHeadsUpNotification?.type || 'general'}
        onAccept={handleHeadsUpAccept}
        onDecline={handleHeadsUpDecline}
        onDismiss={handleHeadsUpDismiss}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  appTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  content: {
    padding: 24,
    gap: 20,
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  cardTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1E293B',
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  statusValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1E293B',
  },
  actionsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  notificationButtons: {
    gap: 12,
    marginBottom: 16,
  },
  notificationTypeButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    gap: 8,
  },
  secondaryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#64748B',
  },
  featuresCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuresList: {
    marginTop: 16,
    gap: 8,
  },
  featureItem: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
});