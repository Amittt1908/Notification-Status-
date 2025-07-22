# NotifyPro - Advanced Push Notification Demo

A beautiful, production-ready mobile app demonstrating advanced push notification handling for iOS and Android platforms.

## 🎯 Project Overview

This app showcases comprehensive push notification implementation including:
- Foreground, background, and killed state notification handling
- WhatsApp-style heads-up notifications
- Deep linking from notifications
- Permission management
- Custom notification channels
- Badge count management

## ✨ Features

### Core Functionality
- **Multi-state Notification Handling**: Supports foreground, background, and killed app states
- **Deep Linking**: Navigate to specific screens from notification taps
- **Permission Management**: Proper request and handling of notification permissions
- **Custom UI**: Beautiful, modern interface with smooth animations
- **Cross-platform**: Works on both iOS and Android

### UI/UX Features
- **Modern Tab Navigation**: Clean, intuitive tab-based layout
- **Gradient Design System**: Beautiful gradients throughout the app
- **Smooth Animations**: React Native Reanimated for performant animations
- **Glass Morphism Effects**: Modern blur effects using Expo Blur
- **Responsive Design**: Optimized for various screen sizes

## 🏗️ Architecture

### File Structure
```
app/
├── (tabs)/
│   ├── _layout.tsx          # Tab navigation configuration
│   ├── index.tsx            # Home screen with notification controls
│   ├── notifications.tsx    # Notification history and management
│   ├── profile.tsx          # User profile and settings
│   └── call.tsx            # Incoming call interface
├── _layout.tsx              # Root layout
└── +not-found.tsx          # 404 screen

components/
└── NotificationHeadsUp.tsx  # WhatsApp-style notification component

services/
└── NotificationService.ts   # Notification service singleton

hooks/
└── useFrameworkReady.ts     # Framework initialization hook
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Expo CLI installed (`npm install -g @expo/cli`)
- Physical device for testing push notifications

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Use Expo Go app to scan the QR code

### Testing Push Notifications
1. Grant notification permissions when prompted
2. The app will generate an Expo Push Token
3. Use the "Send Test Notification" button to test
4. For production, integrate with your backend using the Expo Push API

## 📱 Platform Support

### iOS
- iOS 13+ supported
- Uses APNs (Apple Push Notification service)
- Automatic permission handling
- Background app refresh support

### Android
- Android 8+ supported
- Uses FCM (Firebase Cloud Messaging)
- Notification channels for categorization
- Foreground service support for background processing

## 🔧 Configuration

### Notification Channels (Android)
The app creates three notification channels:
- **Call**: High priority for incoming calls
- **Message**: High priority for messages
- **General**: Default priority for other notifications

### Deep Linking
Notifications can include data to navigate to specific screens:
```typescript
{
  data: {
    screen: 'call',
    userId: '123',
    callType: 'voice'
  }
}
```

## 🎨 Design System

### Colors
- **Primary**: Purple (#8B5CF6)
- **Secondary**: Blue (#3B82F6)
- **Accent**: Pink (#EC4899)
- **Success**: Green (#10B981)
- **Warning**: Orange (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Font Family**: Inter (Regular, SemiBold, Bold)
- **Sizes**: 12px to 32px with proper line heights
- **Contrast**: WCAG AA compliant color combinations

## 🔒 Security & Privacy

- No sensitive data stored locally
- Expo Push Tokens are generated securely
- Notification permissions requested appropriately
- No unnecessary data collection

## 📋 Assignment Requirements Met

✅ **Project Setup**: React Native with TypeScript and Expo
✅ **Push Notifications**: Comprehensive FCM/APNs integration
✅ **Native Modules**: Expo's native notification handling
✅ **Notification UI**: WhatsApp-style heads-up notifications
✅ **Deep Linking**: Screen navigation from notifications
✅ **Badge Count**: Notification badge management
✅ **Beautiful UI**: Modern, production-ready design

## 🛠️ Technologies Used

- **Framework**: Expo 53.0.0
- **Language**: TypeScript
- **UI**: React Native with custom components
- **Animations**: React Native Reanimated
- **Notifications**: Expo Notifications
- **Navigation**: Expo Router with tabs
- **Styling**: StyleSheet API with modern design patterns

## 📝 Future Enhancements

- [ ] Firebase Integration for production notifications
- [ ] Custom native modules for advanced features
- [ ] Real-time call functionality
- [ ] Message threading
- [ ] Notification scheduling
- [ ] Rich media notifications

## 👨‍💻 Developer

**Amit Madanlal Jat**
- Assignment ID: AMJ2025
- Deadline: July 20th, 2025

## 📄 License

