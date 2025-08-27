import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackHeader from '@/components/ui/BackHeader';
import { updateTutorialProgress } from '../../utils/tutorialProgress';

export default function BlockValidation() {
  const router = useRouter();

  useEffect(() => {
    updateTutorialProgress(4, true);
  }, []);

  const handleNext = () => router.push('/mining-tutorial/mining-rewards');
  const handlePrevious = () => router.back();

  const steps = [
    {
      title: 'Transaction Verification',
      description: 'Each transaction is checked for validity, including signatures and available funds.'
    },
    {
      title: 'Proof of Work',
      description: 'The block\'s nonce is verified to ensure sufficient computational work was done.'
    },
    {
      title: 'Block Linking',
      description: 'The block\'s reference to the previous block hash is verified for chain integrity.'
    }
  ];

  return (
    <LinearGradient colors={["#0b331f", "#0e2a1e"]} style={styles.container}>
      <BackHeader title="Block Validation" onBack={handlePrevious} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="shield-checkmark-outline" size={40} color="#35d07f" />
          </View>
          
          <Text style={styles.title}>Block Validation</Text>
          <Text style={styles.subtitle}>Ensuring Blockchain Integrity</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.paragraph}>
            Block validation is where network nodes verify that a new block meets all consensus rules before adding it to the blockchain.
          </Text>
          
          <View style={styles.processContainer}>
            {steps.map((step, index) => (
              <View key={index}>
                <View style={styles.processStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepDescription}>{step.description}</Text>
                  </View>
                </View>
                {index < steps.length - 1 && <View style={styles.processConnector} />}
              </View>
            ))}
          </View>
          
          <View style={styles.noteBox}>
            <Ionicons name="alert-circle-outline" size={24} color="#ffd700" style={styles.noteIcon} />
            <Text style={styles.noteText}>
              Blocks that don't follow the consensus rules are rejected by honest nodes, making the blockchain resistant to tampering.
            </Text>
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
            <Text style={styles.primaryButtonText}>Next: Mining Rewards</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
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
  processContainer: {
    marginVertical: 16,
  },
  processStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#35d07f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  stepDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    lineHeight: 20,
  },
  processConnector: {
    height: 20,
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginLeft: 13,
    marginBottom: 8,
  },
  noteBox: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderLeftWidth: 3,
    borderLeftColor: '#ffd700',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  noteText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
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
});
