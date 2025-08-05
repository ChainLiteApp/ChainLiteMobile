import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useWallet } from '../contexts/WalletContext';
import { Ionicons } from '@expo/vector-icons';

const CreateWalletScreen = ({ navigation }) => {
  const { createNewWallet } = useWallet();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateWallet = async () => {
    try {
      setIsCreating(true);
      await createNewWallet();
      navigation.goBack();
    } catch (error) {
      console.error('Error creating wallet:', error);
      Alert.alert('Error', 'Failed to create wallet');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Ionicons name="wallet" size={64} color="#007AFF" style={styles.icon} />
        <Text style={styles.title}>Create New Wallet</Text>
        <Text style={styles.subtitle}>
          A new wallet will be generated with a unique address and private key.
        </Text>
        
        <View style={styles.warningBox}>
          <Ionicons name="warning" size={20} color="#FF9500" />
          <Text style={styles.warningText}>
            IMPORTANT: Save your private key in a secure location. If you lose it,
            you will lose access to your funds.
          </Text>
        </View>

        <TouchableOpacity 
          style={[styles.button, isCreating && styles.buttonDisabled]}
          onPress={handleCreateWallet}
          disabled={isCreating}
        >
          {isCreating ? (
            <Text style={styles.buttonText}>Creating...</Text>
          ) : (
            <Text style={styles.buttonText}>Create New Wallet</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  warningText: {
    marginLeft: 8,
    flex: 1,
    color: '#E6A100',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CreateWalletScreen;
