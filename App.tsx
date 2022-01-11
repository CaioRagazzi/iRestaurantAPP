import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';

import Navigation from './navigation';

export default function App() {

  return (
    <SafeAreaProvider>
      <NativeBaseProvider>
        <PaperProvider>
          <Navigation />
          <StatusBar />
        </PaperProvider>
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
}
