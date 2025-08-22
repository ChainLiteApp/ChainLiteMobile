import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { connectWalletStart, connectWalletSuccess, disconnectWallet, updateBalance } from '../app/features/wallet/walletSlice';

const WalletStatus = () => {
  const dispatch = useAppDispatch();
  const { address, isConnected, balance } = useAppSelector((state) => state.wallet);

  const handleConnect = () => {
    // In a real app, you would connect to a wallet here
    // For now, we'll just simulate a successful connection
    dispatch(connectWalletStart());
    // Simulate successful connection after a short delay
    setTimeout(() => {
      dispatch(
        connectWalletSuccess({
          address: '0x1234...abcd',
        })
      );
      // Update balance separately
      dispatch(updateBalance('1.5 ETH'));
    }, 1000);
  };

  const handleDisconnect = () => {
    dispatch(disconnectWallet());
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Wallet Status</Text>
      {isConnected ? (
        <View>
          <Text>Connected: {address}</Text>
          <Text>Balance: {balance}</Text>
          <Button title="Disconnect Wallet" onPress={handleDisconnect} />
        </View>
      ) : (
        <Button title="Connect Wallet" onPress={handleConnect} />
      )}
    </View>
  );
};

export default WalletStatus;
