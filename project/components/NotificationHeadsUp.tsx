import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Phone, PhoneOff, User, X } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface NotificationHeadsUpProps {
  visible: boolean;
  title: string;
  body: string;
  type: 'call' | 'message' | 'reminder' | 'general';
  onAccept?: () => void;
  onDecline?: () => void;
  onDismiss?: () => void;
  autoHide?: boolean;
  duration?: number;
}

export default function NotificationHeadsUp({
  visible,
  title,
  body,
  type,
  onAccept,
  onDecline,
  onDismiss,
  autoHide = true,
  duration = 5000,
}: NotificationHeadsUpProps) {
  const translateY = useRef(new Animated.Value(-200)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      showNotification();
      if (autoHide && type !== 'call') {
        const timer = setTimeout(() => {
          onDismiss?.();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      hideNotification();
    }
  }, [visible]);

  const showNotification = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideNotification = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -200,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      translateX.setValue(0);
      scale.setValue(0.9);
    });
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10;
    },
    onPanResponderMove: (_, gestureState) => {
      translateX.setValue(gestureState.dx);
      if (gestureState.dy < 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (Math.abs(gestureState.dx) > width * 0.25 || gestureState.dy < -80) {
        // Swipe to dismiss
        const toValue = gestureState.dy < -80 ? -200 : (gestureState.dx > 0 ? width : -width);
        const animateProperty = gestureState.dy < -80 ? translateY : translateX;
        
        Animated.timing(animateProperty, {
          toValue,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          onDismiss?.();
        });
      } else {
        // Snap back
        Animated.parallel([
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }),
        ]).start();
      }
    },
  });

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [
            { translateY },
            { translateX },
            { scale },
          ],
          opacity,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <BlurView intensity={30} style={styles.blur}>
        <View style={styles.content}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={
                type === 'call' ? ['#10B981', '#059669'] :
                type === 'message' ? ['#3B82F6', '#1D4ED8'] :
                type === 'reminder' ? ['#F59E0B', '#D97706'] :
                ['#8B5CF6', '#7C3AED']
              }
              style={styles.icon}
            >
              {type === 'call' ? (
                <Phone color="white" size={24} />
              ) : (
                <User color="white" size={24} />
              )}
            </LinearGradient>
          </View>

          {/* Content */}
          <View style={styles.textContent}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.body} numberOfLines={2}>
              {body}
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            {type === 'call' ? (
              <>
                <TouchableOpacity
                  style={styles.declineButton}
                  onPress={onDecline}
                >
                  <PhoneOff color="white" size={20} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={onAccept}
                >
                  <Phone color="white" size={20} />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.dismissButton}
                onPress={onDismiss}
              >
                <X color="#64748B" size={20} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  blur: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  iconContainer: {
    alignSelf: 'flex-start',
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  textContent: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 17,
    color: '#1E293B',
  },
  body: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#64748B',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    backgroundColor: '#10B981',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  declineButton: {
    backgroundColor: '#EF4444',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  dismissButton: {
    backgroundColor: '#F1F5F9',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});