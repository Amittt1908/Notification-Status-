import { Tabs } from 'expo-router';
import { Bell, Chrome as Home, User, Phone } from 'lucide-react-native';
import { View } from 'react-native';
import { useNotifications } from '@/contexts/NotificationContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function TabLayout() {
  const { unreadCount } = useNotifications();
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          elevation: 8,
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
          height: 85,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <View style={{ 
              backgroundColor: color === '#8B5CF6' ? '#8B5CF620' : 'transparent',
              padding: 8,
              borderRadius: 12,
            }}>
              <Home size={size} color={color} strokeWidth={2.5} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarIcon: ({ size, color }) => (
            <View style={{ 
              backgroundColor: color === '#8B5CF6' ? '#8B5CF620' : 'transparent',
              padding: 8,
              borderRadius: 12,
            }}>
              <Bell size={size} color={color} strokeWidth={2.5} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="call"
        options={{
          title: 'Call',
          tabBarIcon: ({ size, color }) => (
            <View style={{ 
              backgroundColor: color === '#8B5CF6' ? '#8B5CF620' : 'transparent',
              padding: 8,
              borderRadius: 12,
            }}>
              <Phone size={size} color={color} strokeWidth={2.5} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <View style={{ 
              backgroundColor: color === '#8B5CF6' ? '#8B5CF620' : 'transparent',
              padding: 8,
              borderRadius: 12,
            }}>
              <User size={size} color={color} strokeWidth={2.5} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}