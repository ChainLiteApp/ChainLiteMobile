import { NavigationContainer } from '@react-navigation/native';
import { View, Platform, StatusBar as RNStatusBar } from 'react-native';
import CustomStatusBar from './components/CustomStatusBar';
import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WalletProvider } from './src/contexts/WalletContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <WalletProvider>
        <SafeAreaView 
          style={{ 
            flex: 1, 
            backgroundColor: '#0F172A',
            paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 
          }}
          edges={['top']}
        >
          <CustomStatusBar />
          <View style={{ flex: 1 }}>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </View>
        </SafeAreaView>
      </WalletProvider>
    </SafeAreaProvider>
  );
}
