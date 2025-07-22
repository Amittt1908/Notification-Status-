import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Bell, 
  Shield, 
  Smartphone, 
  Volume2, 
  Vibrate,
  Moon,
  Palette,
  ChevronRight,
  Settings
} from 'lucide-react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useTheme } from '@/contexts/ThemeContext';

export default function ProfileScreen() {
  const [soundEnabled, setSoundEnabled] = React.useState(true);
  const [vibrationEnabled, setVibrationEnabled] = React.useState(true);
  const { isDarkMode, toggleDarkMode, colors } = useTheme();

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const profileData = {
    name: 'Amit Madanlal Jat',
    email: 'amit.jat@example.com',
    id: 'AMJ2025',
    joinDate: 'January 2025',
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#EC4899', '#8B5CF6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
              style={styles.avatar}
            >
              <User color="white" size={32} />
            </LinearGradient>
          </View>
          <Text style={styles.userName}>{profileData.name}</Text>
          <Text style={styles.userEmail}>{profileData.email}</Text>
          <View style={styles.userMeta}>
            <Text style={styles.userMetaText}>ID: {profileData.id}</Text>
            <Text style={styles.userMetaText}>Member since {profileData.joinDate}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Notification Settings</Text>
          
          <View style={[styles.settingCard, { backgroundColor: colors.surface }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Volume2 color="#8B5CF6" size={20} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Sound Notifications</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: colors.border, true: '#8B5CF6' }}
                thumbColor={soundEnabled ? '#ffffff' : colors.textSecondary}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Vibrate color="#EC4899" size={20} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Vibration</Text>
              </View>
              <Switch
                value={vibrationEnabled}
                onValueChange={setVibrationEnabled}
                trackColor={{ false: colors.border, true: '#EC4899' }}
                thumbColor={vibrationEnabled ? '#ffffff' : colors.textSecondary}
              />
            </View>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Bell color="#3B82F6" size={20} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Notification Categories</Text>
              </View>
              <ChevronRight color={colors.textSecondary} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>App Preferences</Text>
          
          <View style={[styles.settingCard, { backgroundColor: colors.surface }]}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Moon color="#64748B" size={20} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: colors.border, true: '#64748B' }}
                thumbColor={isDarkMode ? '#ffffff' : colors.textSecondary}
              />
            </View>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Palette color="#F59E0B" size={20} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Theme Customization</Text>
              </View>
              <ChevronRight color={colors.textSecondary} size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Smartphone color="#10B981" size={20} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Device Settings</Text>
              </View>
              <ChevronRight color={colors.textSecondary} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Security & Privacy</Text>
          
          <View style={[styles.settingCard, { backgroundColor: colors.surface }]}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Shield color="#EF4444" size={20} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Privacy Settings</Text>
              </View>
              <ChevronRight color={colors.textSecondary} size={20} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Settings color="#64748B" size={20} />
                <Text style={[styles.settingLabel, { color: colors.text }]}>Advanced Settings</Text>
              </View>
              <ChevronRight color={colors.textSecondary} size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.assignmentInfo, { backgroundColor: colors.surface }]}>
          <Text style={[styles.assignmentTitle, { color: colors.text }]}>Assignment Info</Text>
          <Text style={[styles.assignmentText, { color: colors.textSecondary }]}>
            This app demonstrates advanced push notification handling for mobile devices.
            Built with Expo, React Native, and TypeScript.
          </Text>
          <Text style={styles.assignmentDeadline}>
            📅 Deadline: July 20th, 2025
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  profileSection: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  userName: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: 'white',
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  userMeta: {
    gap: 4,
    alignItems: 'center',
  },
  userMetaText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  content: {
    padding: 24,
    gap: 24,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginLeft: 4,
  },
  settingCard: {
    borderRadius: 20,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  assignmentInfo: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  assignmentTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 12,
  },
  assignmentText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  assignmentDeadline: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#3B82F6',
  },
});