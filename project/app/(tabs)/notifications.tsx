import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Phone, MessageSquare, Calendar, X } from 'lucide-react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { useNotifications } from '@/contexts/NotificationContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function NotificationsScreen() {
  const { notifications, markAsRead, removeNotification, unreadCount } = useNotifications();
  const { colors } = useTheme();

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone color="white" size={20} />;
      case 'message':
        return <MessageSquare color="white" size={20} />;
      case 'reminder':
        return <Calendar color="white" size={20} />;
      default:
        return <Bell color="white" size={20} />;
    }
  };

  const getNotificationColors = (type: string) => {
    switch (type) {
      case 'call':
        return ['#10B981', '#059669'];
      case 'message':
        return ['#3B82F6', '#1D4ED8'];
      case 'reminder':
        return ['#F59E0B', '#D97706'];
      default:
        return ['#8B5CF6', '#7C3AED'];
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={['#8B5CF6', '#EC4899']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell color="#94A3B8" size={48} />
            <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>No notifications</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              You'll see notifications here when they arrive
            </Text>
          </View>
        ) : (
          notifications.map((notification, index) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onRemove={removeNotification}
              getIcon={getNotificationIcon}
              getColors={getNotificationColors}
              formatTime={formatTime}
              index={index}
              colors={colors}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

import { NotificationItem } from '@/contexts/NotificationContext';

interface NotificationCardProps {
  notification: NotificationItem;
  onMarkAsRead: (id: string) => void;
  onRemove: (id: string) => void;
  getIcon: (type: string) => React.ReactNode;
  getColors: (type: string) => string[];
  formatTime: (date: Date) => string;
  index: number;
  colors: any;
}
function NotificationCard({
  notification,
  onMarkAsRead,
  onRemove,
  getIcon,
  getColors,
  formatTime,
  index,
  colors,
}: NotificationCardProps) {
  const slideAnim = new Animated.Value(4);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 0,
        delay: index * 0,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 0,
        delay: index * 0,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.notificationCard,
        { backgroundColor: colors.surface },
        {
          transform: [
            { translateX: slideAnim },
            { scale: scaleAnim },
          ],
        },
        !notification.read && styles.unreadCard,
      ]}
    >
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => onMarkAsRead(notification.id)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={getColors(notification.type)}
          style={styles.iconContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {getIcon(notification.type)}
        </LinearGradient>

        <View style={styles.textContent}>
          <View style={styles.titleRow}>
            <Text style={[styles.notificationTitle, { color: colors.text }]} numberOfLines={1}>
              {notification.title}
            </Text>
            <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
              {formatTime(notification.timestamp)}
            </Text>
          </View>
          <Text style={[styles.notificationBody, { color: colors.textSecondary }]} numberOfLines={2}>
            {notification.body}
          </Text>
          {!notification.read && <View style={styles.unreadDot} />}
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onRemove(notification.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X color={colors.textSecondary} size={20} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: 'white',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 16,
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#64748B',
  },
  emptySubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  notificationCard: {
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    flex: 1,
  },
  timestamp: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  notificationBody: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  unreadDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B5CF6',
  },
  deleteButton: {
    padding: 8,
  },
});