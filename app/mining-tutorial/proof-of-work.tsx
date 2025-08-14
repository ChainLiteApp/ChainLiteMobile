import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackHeader from '@/components/ui/BackHeader';
import { updateTutorialProgress } from '../../utils/tutorialProgress';

export default function ProofOfWork() {
  const router = useRouter();

  useEffect(() => {
    // Mark this step as completed when the component mounts
    updateTutorialProgress(2, true);
  }, []);

  const handleNext = () => {
    router.push('/mining-tutorial/finding-the-nonce');
  };

  const handlePrevious = () => {
    router.back();
  };

  return (
    <LinearGradient colors={["#0b331f", "#0e2a1e"]} style={styles.container}>
      <BackHeader title="Proof of Work" onBack={handlePrevious} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="finger-print-outline" size={40} color="#35d07f" />
          </View>
          
          <Text style={styles.title}>Proof of Work</Text>
          <Text style={styles.subtitle}>The Consensus Mechanism</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.paragraph}>
            Proof of Work (PoW) is the original consensus algorithm in a blockchain network. It requires participants to perform work that is computationally intensive but easy for others to verify.
          </Text>
          
          <Text style={styles.paragraph}>
            Miners compete to solve complex mathematical puzzles. The first to solve it gets to add a new block to the blockchain and is rewarded with cryptocurrency.
          </Text>
          
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={24} color="#35d07f" style={styles.infoIcon} />
            <Text style={styles.infoText}>
              The difficulty of the puzzle adjusts automatically to maintain a consistent block time, typically around 10 minutes per block in Bitcoin's case.
            </Text>
          </View>
          
          <Text style={styles.paragraph}>
            This process makes it extremely difficult to alter any aspect of the blockchain, as it would require redoing the work for all subsequent blocks.
          </Text>
          
          <View style={styles.keyPoints}>
            <Text style={styles.sectionTitle}>Key Characteristics:</Text>
            <View style={styles.keyPoint}>
              <Ionicons name="checkmark-circle" size={20} color="#35d07f" style={styles.keyPointIcon} />
              <Text style={styles.keyPointText}>Computationally intensive</Text>
            </View>
            <View style={styles.keyPoint}>
              <Ionicons name="checkmark-circle" size={20} color="#35d07f" style={styles.keyPointIcon} />
              <Text style={styles.keyPointText}>Energy-consuming but secure</Text>
            </View>
            <View style={styles.keyPoint}>
              <Ionicons name="checkmark-circle" size={20} color="#35d07f" style={styles.keyPointIcon} />
              <Text style={styles.keyPointText}>Decentralized validation</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handlePrevious}>
            <Ionicons name="arrow-back" size={20} color="#35d07f" />
            <Text style={styles.secondaryButtonText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
            <Text style={styles.primaryButtonText}>Next: Finding the Nonce</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = {
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
  infoBox: {
    backgroundColor: 'rgba(53, 208, 127, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#35d07f',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    flexDirection: 'row',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  keyPoints: {
    marginTop: 24,
    gap: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#35d07f',
    borderRadius: 14,
    padding: 16,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    flex: 0.5,
  },
  secondaryButtonText: {
    color: '#35d07f',
    fontSize: 16,
    fontWeight: '600',
  },
};
