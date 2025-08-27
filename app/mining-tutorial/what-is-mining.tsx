import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackHeader from '@/components/ui/BackHeader';
import { updateTutorialProgress } from '../../utils/tutorialProgress';

export default function WhatIsMining() {
  const router = useRouter();

  useEffect(() => {
    // Mark this step as completed when the component mounts
    updateTutorialProgress(1, true);
  }, []);

  const handleNext = () => {
    router.push('/mining-tutorial/proof-of-work');
  };

  return (
    <LinearGradient colors={["#0b331f", "#0e2a1e"]} style={styles.container}>
      <BackHeader title="What is Mining?" onBack={() => router.back()} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="cube-outline" size={40} color="#35d07f" />
          </View>
          
          <Text style={styles.title}>Understanding Mining</Text>
          <Text style={styles.subtitle}>The Backbone of Blockchain</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.paragraph}>
            Mining is the process by which new transactions are added to a blockchain and new coins are introduced into circulation.
          </Text>
          
          <Text style={styles.paragraph}>
            Miners use powerful computers to solve complex mathematical problems that validate transactions. When a problem is solved, the transactions are added to a new block in the blockchain.
          </Text>
          
          <Text style={styles.paragraph}>
            This process requires significant computational power and energy but is essential for maintaining the security and decentralization of the network.
          </Text>
          
          <View style={styles.keyPoints}>
            <View style={styles.keyPoint}>
              <Ionicons name="checkmark-circle" size={20} color="#35d07f" style={styles.keyPointIcon} />
              <Text style={styles.keyPointText}>Verifies transactions</Text>
            </View>
            <View style={styles.keyPoint}>
              <Ionicons name="checkmark-circle" size={20} color="#35d07f" style={styles.keyPointIcon} />
              <Text style={styles.keyPointText}>Secures the network</Text>
            </View>
            <View style={styles.keyPoint}>
              <Ionicons name="checkmark-circle" size={20} color="#35d07f" style={styles.keyPointIcon} />
              <Text style={styles.keyPointText}>Creates new coins</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next: Proof of Work</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: 'rgba(53, 208, 127, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 20,
  },
  paragraph: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  keyPoints: {
    marginTop: 16,
    gap: 12,
  },
  keyPoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  keyPointIcon: {
    marginRight: 12,
  },
  keyPointText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(11, 51, 31, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  nextButton: {
    backgroundColor: '#35d07f',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

});
