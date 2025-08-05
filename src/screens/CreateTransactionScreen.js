import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useWallet } from '../contexts/WalletContext';
import * as blockchainService from '../services/blockchain';

const CreateTransactionScreen = ({ navigation }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { wallet, updateBalance } = useWallet();

  const handleSend = async () => {
    if (!recipient || !amount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      await blockchainService.createTransaction(
        wallet.address,
        recipient,
        amount,
        wallet.privateKey
      );
      
      // Update the balance after successful transaction
      await updateBalance(wallet.address);
      
      Alert.alert('Success', 'Transaction created successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating transaction:', error);
      Alert.alert('Error', 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Transaction</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Recipient Address"
        value={recipient}
        onChangeText={setRecipient}
        autoCapitalize="none"
        autoCorrect={false}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />
      
      <Text style={styles.balanceText}>
        Available: {wallet?.balance || 0} CLT
      </Text>
      
      <Button
        title={loading ? 'Sending...' : 'Send'}
        onPress={handleSend}
        disabled={loading || !recipient || !amount}
      />
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  balanceText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
});

export default CreateTransactionScreen;
