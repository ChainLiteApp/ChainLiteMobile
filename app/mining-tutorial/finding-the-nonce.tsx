import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackHeader from '@/components/ui/BackHeader';
import { updateTutorialProgress } from '../../utils/tutorialProgress';

export default function FindingTheNonce() {
  const router = useRouter();

  useEffect(() => {
    updateTutorialProgress(3, true);
  }, []);

  const handleNext = () => router.push('block-validation');
  const handlePrevious = () => router.back();

  return (
    <LinearGradient colors={["#0b331f", "#0e2a1e"]} style={styles.container}>
      <BackHeader title="Finding the Nonce" onBack={handlePrevious} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="search-outline" size={40} color="#35d07f" />
          </View>
          
          <Text style={styles.title}>Finding the Nonce</Text>
          <Text style={styles.subtitle}>The Mining Puzzle</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.paragraph}>
            In cryptocurrency mining, a nonce is a number that miners are trying to find. It's the only part of the block header that miners can change to create a valid block hash.
          </Text>
          
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={24} color="#35d07f" style={styles.infoIcon} />
            <Text style={styles.infoText}>
              The nonce is a 32-bit field whose value is set so that the hash of the block will contain a run of leading zeros.
            </Text>
          </View>
          
          <View style={styles.keyPoints}>
            <Text style={styles.sectionTitle}>Key Points:</Text>
            <View style={styles.keyPoint}>
              <Ionicons name="checkmark-circle" size={20} color="#35d07f" style={styles.keyPointIcon} />
              <Text style={styles.keyPointText}>Nonce stands for "number used once"</Text>
            </View>
            <View style={styles.keyPoint}>
              <Ionicons name="checkmark-circle" size={20} color="#35d07f" style={styles.keyPointIcon} />
              <Text style={styles.keyPointText}>Miners try trillions of nonce values per second</Text>
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
            <Text style={styles.primaryButtonText}>Next: Block Validation</Text>
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
});
