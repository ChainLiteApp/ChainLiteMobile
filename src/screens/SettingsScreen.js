import React from 'react';
import { View, Text, StyleSheet, Switch, Button } from 'react-native';
import { useWallet } from '../contexts/WalletContext';

const SettingsScreen = () => {
  const { wallet, clearWallet } = useWallet();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  const handleClearWallet = () => {
    // In a real app, you would show a confirmation dialog first
    clearWallet();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.settingItem}>
        <Text>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>
      
      <View style={styles.settingItem}>
        <Text>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
        />
      </View>
      
      {wallet && (
        <View style={styles.dangerZone}>
          <Text style={styles.dangerZoneTitle}>Danger Zone</Text>
          <Button
            title="Clear Wallet Data"
            onPress={handleClearWallet}
            color="#ff3b30"
          />
          <Text style={styles.warningText}>
            Warning: This will remove your wallet and all associated data from this device.
          </Text>
        </View>
      )}
      
      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>ChainLite v1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dangerZone: {
    marginTop: 40,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ff3b30',
    borderRadius: 8,
  },
  dangerZoneTitle: {
    color: '#ff3b30',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  warningText: {
    marginTop: 10,
    fontSize: 12,
    color: '#666',
  },
  versionContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  versionText: {
    color: '#999',
    fontSize: 12,
  },
});

export default SettingsScreen;
