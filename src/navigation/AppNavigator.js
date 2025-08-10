import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

// Screens
import CreateTransactionScreen from '../screens/CreateTransactionScreen';
import HomeScreen from '../screens/HomeScreen';
import NodesScreen from '../screens/NodesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import WalletScreen from '../screens/WalletScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#0F172A' }
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
      />
      <Stack.Screen 
        name="Wallet" 
        component={WalletScreen}
      />
      <Stack.Screen 
        name="Transactions" 
        component={TransactionsScreen}
      />
      <Stack.Screen 
        name="Nodes" 
        component={NodesScreen}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
      />
      <Stack.Screen 
        name="CreateTransaction" 
        component={CreateTransactionScreen}
      />
    </Stack.Navigator>
  );
}
