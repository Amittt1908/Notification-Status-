import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ThemeProvider>
      <NotificationProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="auto" />
      </NotificationProvider>
    </ThemeProvider>
  );
}
