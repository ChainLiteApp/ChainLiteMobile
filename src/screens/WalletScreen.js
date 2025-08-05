import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  ActivityIndicator,
  Dimensions,
  Share
} from 'react-native';
import { useWallet } from '../contexts/WalletContext';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import QRCode from 'react-native-qrcode-svg';

const { width } = Dimensions.get('window');

const WalletScreen = ({ navigation }) => {
  const { wallet, balance, clearWallet, refreshBalance } = useWallet();
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  const copyToClipboard = async (text, message = 'Address copied to clipboard') => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Clipboard.setStringAsync(text);
      Alert.alert('Copied!', message);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refreshBalance();
    } catch (error) {
      console.error('Error refreshing balance:', error);
      Alert.alert('Error', 'Failed to refresh balance');
    } finally {
      setRefreshing(false);
    }
  };

  const shareAddress = async () => {
    try {
      await Share.share({
        message: `My ChainLite Wallet Address: ${wallet.address}`,
        title: 'My Wallet Address'
      });
    } catch (error) {
      console.error('Error sharing address:', error);
    }
  };

  const handleClearWallet = () => {
    Alert.alert(
      'Clear Wallet',
      'This will remove your wallet. Make sure you have backed up your private key.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: clearWallet, style: 'destructive' },
      ]
    );
  };

  if (!wallet) {
    return (
      <View style={styles.centered}>
        <Ionicons name="wallet-outline" size={60} color="#ccc" style={styles.walletIcon} />
        <Text style={styles.noWalletText}>No wallet found</Text>
        <Text style={styles.noWalletSubtext}>Create a new wallet to start using ChainLite</Text>
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => blockchainService.createWallet()}
        >
          <Text style={styles.primaryButtonText}>Create New Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('ImportWallet')}
        >
          <Text style={styles.secondaryButtonText}>Import Existing Wallet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#007AFF']}
          tintColor="#007AFF"
        />
      }
    >
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Your Balance</Text>
        <View style={styles.balanceRow}>
          <Text style={styles.balance}>{parseFloat(balance).toFixed(2)}</Text>
          <Text style={styles.currency}>CLT</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.addressContainer}
          onPress={() => copyToClipboard(wallet.address, 'Wallet address copied to clipboard')}
          onLongPress={() => setShowQrCode(!showQrCode)}
          activeOpacity={0.8}
        >
          <Text style={styles.address} numberOfLines={1} ellipsizeMode="middle">
            {wallet.address}
          </Text>
          <Ionicons name="copy-outline" size={16} color="#007AFF" />
        </TouchableOpacity>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={shareAddress}
          >
            <Ionicons name="share-social-outline" size={20} color="#007AFF" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Send')}
          >
            <Ionicons name="arrow-up" size={20} color="#FF3B30" />
            <Text style={[styles.actionButtonText, {color: '#FF3B30'}]}>Send</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('Receive')}
          >
            <Ionicons name="arrow-down" size={20} color="#34C759" />
            <Text style={[styles.actionButtonText, {color: '#34C759'}]}>Receive</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {showQrCode && (
        <View style={styles.qrContainer}>
          <QRCode
            value={wallet.address}
            size={width * 0.6}
            color="#000"
            backgroundColor="#fff"
          />
          <Text style={styles.qrHelpText}>Scan to receive funds</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Wallet Security</Text>
        
        <TouchableOpacity 
          style={styles.securityItem}
          onPress={() => setShowPrivateKey(!showPrivateKey)}
        >
          <View style={styles.securityItemLeft}>
            <Ionicons name="key-outline" size={22} color="#FF9500" />
            <Text style={styles.securityItemTitle}>Private Key</Text>
          </View>
          <View style={styles.securityItemRight}>
            <Text style={styles.securityItemAction}>
              {showPrivateKey ? 'Hide' : 'Show'}
            </Text>
            <Ionicons 
              name={showPrivateKey ? 'eye-off' : 'eye'} 
              size={20} 
              color="#007AFF"
            />
          </View>
        </TouchableOpacity>

        {showPrivateKey && (
          <View style={styles.privateKeyContainer}>
            <Text style={styles.privateKey} selectable>
              {wallet.privateKey}
            </Text>
            <TouchableOpacity 
              style={styles.copyButton}
              onPress={() => copyToClipboard(wallet.privateKey, 'Private key copied to clipboard')}
            >
              <Ionicons name="copy-outline" size={18} color="#007AFF" />
              <Text style={styles.copyButtonText}>Copy</Text>
            </TouchableOpacity>
            <View style={styles.warningBox}>
              <Ionicons name="warning-outline" size={16} color="#FF3B30" />
              <Text style={styles.warningText}>
                Never share your private key! Anyone with this key can access your funds.
              </Text>
            </View>
          </View>
        )}
        
        <View style={styles.divider} />
        
        <TouchableOpacity 
          style={[styles.securityItem, {marginBottom: 0}]}
          onPress={() => navigation.navigate('BackupWallet')}
        >
          <View style={styles.securityItemLeft}>
            <Ionicons name="save-outline" size={22} color="#007AFF" />
            <Text style={styles.securityItemTitle}>Backup Wallet</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Advanced</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('TransactionHistory')}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="time-outline" size={22} color="#007AFF" />
            <Text style={styles.menuItemText}>Transaction History</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
        
        <View style={styles.divider} />
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <View style={styles.menuItemLeft}>
            <Ionicons name="settings-outline" size={22} color="#007AFF" />
            <Text style={styles.menuItemText}>Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.dangerButton}
        onPress={handleClearWallet}
      >
        <Ionicons name="trash-outline" size={18} color="#fff" />
        <Text style={styles.dangerButtonText}>Clear Wallet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  walletIcon: {
    marginBottom: 20,
    opacity: 0.7,
  },
  noWalletText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  noWalletSubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    maxWidth: 300,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  balanceContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
    marginRight: 8,
  },
  currency: {
    fontSize: 20,
    color: '#666',
    marginBottom: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    width: '100%',
  },
  address: {
    flex: 1,
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#333',
    marginRight: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  actionButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    flex: 1,
    marginHorizontal: 5,
  },
  actionButtonText: {
    marginTop: 5,
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  qrContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 15,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrHelpText: {
    marginTop: 15,
    color: '#666',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 0,
    margin: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    padding: 20,
    paddingBottom: 10,
  },
  securityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingLeft: 20,
    marginBottom: 1,
  },
  securityItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityItemTitle: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  securityItemAction: {
    color: '#007AFF',
    marginRight: 8,
    fontSize: 14,
  },
  privateKeyContainer: {
    padding: 15,
    paddingTop: 0,
  },
  privateKey: {
    fontFamily: 'monospace',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 14,
    lineHeight: 20,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f7ff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  copyButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#fff8f8',
    borderLeftWidth: 3,
    borderLeftColor: '#FF3B30',
    padding: 12,
    borderRadius: 6,
  },
  warningText: {
    color: '#FF3B30',
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingLeft: 20,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    padding: 15,
    margin: 15,
    marginTop: 10,
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
    color: '#666',
    fontSize: 14,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  toggleButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  privateKeyContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  privateKey: {
    flex: 1,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default WalletScreen;
