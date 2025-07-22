import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  User, 
  Plus, 
  Grid3x3 as Grid3X3, 
  MessageSquare,
  PhoneCall,
  Clock,
  Users,
  Video,
  VideoOff
} from 'lucide-react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

interface CallHistoryItem {
  id: string;
  name: string;
  number: string;
  type: 'incoming' | 'outgoing' | 'missed';
  duration: string;
  time: string;
}

export default function CallScreen() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [activeTab, setActiveTab] = useState<'dialer' | 'history' | 'contacts'>('dialer');
  const { colors } = useTheme();

  const pulseAnim = new Animated.Value(1);
  const fadeAnim = new Animated.Value(0);

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  const callHistory: CallHistoryItem[] = [
    { id: '1', name: 'John Doe', number: '+1 (555) 123-4567', type: 'incoming', duration: '5:23', time: '2 hours ago' },
    { id: '2', name: 'Sarah Wilson', number: '+1 (555) 987-6543', type: 'outgoing', duration: '12:45', time: '4 hours ago' },
    { id: '3', name: 'Mike Johnson', number: '+1 (555) 456-7890', type: 'missed', duration: '0:00', time: '1 day ago' },
    { id: '4', name: 'Emily Davis', number: '+1 (555) 321-0987', type: 'outgoing', duration: '8:12', time: '2 days ago' },
    { id: '5', name: 'Alex Brown', number: '+1 (555) 654-3210', type: 'incoming', duration: '3:45', time: '3 days ago' },
  ];

  const contacts = [
    { id: '1', name: 'John Doe', number: '+1 (555) 123-4567', status: 'online' },
    { id: '2', name: 'Sarah Wilson', number: '+1 (555) 987-6543', status: 'offline' },
    { id: '3', name: 'Mike Johnson', number: '+1 (555) 456-7890', status: 'busy' },
    { id: '4', name: 'Emily Davis', number: '+1 (555) 321-0987', status: 'online' },
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    if (isCallActive) {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => pulse());
      };
      pulse();

      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = (name: string, number: string) => {
    setIsCallActive(true);
    setCallDuration(0);
  };

  const endCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
    Alert.alert('Call Ended', 'The call has been ended successfully.');
  };

  const getCallTypeIcon = (type: string) => {
    switch (type) {
      case 'incoming':
        return <Phone color="#10B981" size={16} />;
      case 'outgoing':
        return <PhoneCall color="#3B82F6" size={16} />;
      case 'missed':
        return <PhoneOff color="#EF4444" size={16} />;
      default:
        return <Phone color="#64748B" size={16} />;
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  if (isCallActive) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#1E293B', '#334155', '#475569']}
          style={styles.background}
        >
          <Animated.View 
            style={[
              styles.content,
              { opacity: fadeAnim }
            ]}
          >
            <View style={styles.statusBar}>
              <Text style={styles.statusText}>Connected</Text>
              <View style={styles.indicator}>
                <View style={styles.indicatorDot} />
              </View>
            </View>

            <View style={styles.callerSection}>
              <Animated.View 
                style={[
                  styles.avatarContainer,
                  { transform: [{ scale: pulseAnim }] }
                ]}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#EC4899']}
                  style={styles.avatar}
                >
                  <User color="white" size={48} />
                </LinearGradient>
              </Animated.View>

              <Text style={styles.callerName}>John Doe</Text>
              <Text style={styles.callerNumber}>+1 (555) 123-4567</Text>
              
              <View style={styles.durationContainer}>
                <Text style={styles.duration}>{formatDuration(callDuration)}</Text>
              </View>
            </View>

            <View style={styles.controlsContainer}>
              <BlurView intensity={20} style={styles.controlsBlur}>
                <View style={styles.controls}>
                  <TouchableOpacity
                    style={[
                      styles.controlButton,
                      isMuted && styles.activeControlButton,
                    ]}
                    onPress={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? (
                      <MicOff color={isMuted ? 'white' : '#64748B'} size={24} />
                    ) : (
                      <Mic color="#64748B" size={24} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.endCallButton}
                    onPress={endCall}
                  >
                    <LinearGradient
                      colors={['#EF4444', '#DC2626']}
                      style={styles.endCallGradient}
                    >
                      <PhoneOff color="white" size={28} />
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.controlButton,
                      isSpeakerOn && styles.activeControlButton,
                    ]}
                    onPress={() => setIsSpeakerOn(!isSpeakerOn)}
                  >
                    <Volume2 
                      color={isSpeakerOn ? 'white' : '#64748B'} 
                      size={24} 
                    />
                  </TouchableOpacity>
                </View>
              </BlurView>
            </View>

            <View style={styles.additionalActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Plus color="rgba(255, 255, 255, 0.8)" size={20} />
                <Text style={styles.actionText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.actionButton,
                  isVideoOn && styles.activeActionButton,
                ]}
                onPress={() => setIsVideoOn(!isVideoOn)}
              >
                {isVideoOn ? (
                  <Video color="white" size={20} />
                ) : (
                  <VideoOff color="rgba(255, 255, 255, 0.8)" size={20} />
                )}
                <Text style={[styles.actionText, isVideoOn && { color: 'white' }]}>Video</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MessageSquare color="rgba(255, 255, 255, 0.8)" size={20} />
                <Text style={styles.actionText}>Message</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={['#8B5CF6', '#3B82F6']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Call Center</Text>
          <Text style={styles.headerSubtitle}>Make calls and manage contacts</Text>
        </View>
      </LinearGradient>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            { backgroundColor: colors.surface },
            activeTab === 'dialer' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('dialer')}
        >
          <Text style={[
            styles.tabText,
            { color: colors.text },
            activeTab === 'dialer' && styles.activeTabText,
          ]}>
            Dialer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            { backgroundColor: colors.surface },
            activeTab === 'history' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[
            styles.tabText,
            { color: colors.text },
            activeTab === 'history' && styles.activeTabText,
          ]}>
            History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            { backgroundColor: colors.surface },
            activeTab === 'contacts' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('contacts')}
        >
          <Text style={[
            styles.tabText,
            { color: colors.text },
            activeTab === 'contacts' && styles.activeTabText,
          ]}>
            Contacts
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'dialer' && (
          <View style={styles.dialerContainer}>
            <View style={[styles.numberDisplay, { backgroundColor: colors.surface }]}>
              <Text style={[styles.numberText, { color: colors.text }]}>+1 (555) 123-4567</Text>
            </View>
            
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => startCall('John Doe', '+1 (555) 123-4567')}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.callButtonGradient}
              >
                <Phone color="white" size={28} />
                <Text style={styles.callButtonText}>Start Call</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={[styles.quickActions, { backgroundColor: colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
              <View style={styles.actionGrid}>
                <TouchableOpacity style={styles.quickActionButton}>
                  <Video color="#8B5CF6" size={24} />
                  <Text style={[styles.quickActionText, { color: colors.text }]}>Video Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionButton}>
                  <MessageSquare color="#3B82F6" size={24} />
                  <Text style={[styles.quickActionText, { color: colors.text }]}>Message</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickActionButton}>
                  <Users color="#EC4899" size={24} />
                  <Text style={[styles.quickActionText, { color: colors.text }]}>Conference</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'history' && (
          <View style={styles.historyContainer}>
            {callHistory.map((call) => (
              <View key={call.id} style={[styles.historyItem, { backgroundColor: colors.surface }]}>
                <View style={styles.historyIcon}>
                  {getCallTypeIcon(call.type)}
                </View>
                <View style={styles.historyDetails}>
                  <Text style={[styles.historyName, { color: colors.text }]}>{call.name}</Text>
                  <Text style={[styles.historyNumber, { color: colors.textSecondary }]}>{call.number}</Text>
                </View>
                <View style={styles.historyMeta}>
                  <Text style={[styles.historyDuration, { color: colors.textSecondary }]}>{call.duration}</Text>
                  <Text style={[styles.historyTime, { color: colors.textSecondary }]}>{call.time}</Text>
                </View>
                <TouchableOpacity
                  style={styles.callBackButton}
                  onPress={() => startCall(call.name, call.number)}
                >
                  <Phone color="#8B5CF6" size={20} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'contacts' && (
          <View style={styles.contactsContainer}>
            {contacts.map((contact) => (
              <View key={contact.id} style={[styles.contactItem, { backgroundColor: colors.surface }]}>
                <View style={styles.contactAvatar}>
                  <LinearGradient
                    colors={['#8B5CF6', '#EC4899']}
                    style={styles.avatarGradient}
                  >
                    <User color="white" size={20} />
                  </LinearGradient>
                </View>
                <View style={styles.contactDetails}>
                  <Text style={[styles.contactName, { color: colors.text }]}>{contact.name}</Text>
                  <Text style={[styles.contactNumber, { color: colors.textSecondary }]}>{contact.number}</Text>
                </View>
                <View style={styles.contactStatus}>
                  <View style={[
                    styles.statusDot,
                    { backgroundColor: 
                      contact.status === 'online' ? '#10B981' :
                      contact.status === 'busy' ? '#EF4444' : '#94A3B8'
                    }
                  ]} />
                  <Text style={[styles.statusText, { color: colors.textSecondary }]}>{contact.status}</Text>
                </View>
                <TouchableOpacity
                  style={styles.contactCallButton}
                  onPress={() => startCall(contact.name, contact.number)}
                >
                  <Phone color="#10B981" size={20} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#8B5CF6',
  },
  tabText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  activeTabText: {
    color: 'white',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 8,
  },
  statusText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  callerSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  callerName: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: 'white',
    textAlign: 'center',
  },
  callerNumber: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  durationContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  duration: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: 'white',
  },
  controlsContainer: {
    marginBottom: 40,
  },
  controlsBlur: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeControlButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.8)',
  },
  endCallButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
  },
  endCallGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  additionalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 40,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  activeActionButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
  },
  actionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  // New styles for call center content
  dialerContainer: {
    padding: 24,
    gap: 24,
  },
  numberDisplay: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  numberText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
  },
  callButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  callButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  callButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: 'white',
  },
  quickActions: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickActionButton: {
    alignItems: 'center',
    gap: 8,
    padding: 16,
  },
  quickActionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  historyContainer: {
    padding: 24,
    gap: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyDetails: {
    flex: 1,
    gap: 2,
  },
  historyName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  historyNumber: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  historyMeta: {
    alignItems: 'flex-end',
    gap: 2,
  },
  historyDuration: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  historyTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  callBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactsContainer: {
    padding: 24,
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  avatarGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactDetails: {
    flex: 1,
    gap: 2,
  },
  contactName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  contactNumber: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  contactStatus: {
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  contactCallButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});