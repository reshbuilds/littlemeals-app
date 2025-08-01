import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChildrenProvider } from '../src/contexts/ChildrenContext';
import '../global.css';

export default function RootLayout() {
  return (
    <ChildrenProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </ChildrenProvider>
  );
}