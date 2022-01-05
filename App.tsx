import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from 'native-base';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Navigation from './navigation';

export default function App() {

    return (
      <SafeAreaProvider>
        <NativeBaseProvider>
          <Navigation />
          <StatusBar />
        </NativeBaseProvider>
      </SafeAreaProvider>
    );
}
