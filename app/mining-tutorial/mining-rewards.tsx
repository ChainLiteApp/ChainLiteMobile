import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackHeader from '@/components/ui/BackHeader';
import { updateTutorialProgress } from '../../utils/tutorialProgress';

export default function MiningRewards() {
  const router = useRouter();

  useEffect(() => {
    updateTutorialProgress(5, true);
  }, []);

  const handlePrevious = () => router.back();

  const handleComplete = () => {
    // Mark tutorial as completed
    router.push('..');
  };

  const rewardTypes = [
    {
      title: 'Block Reward',
      amount: '6.25 BTC',
      description: 'Fixed amount of new coins created with each block',
      icon: 'cube' as const
    },
    {
      title: 'Transaction Fees',
      amount: 'Varies',
      description: 'Fees paid by users for transactions included in the block',
      icon: 'cash' as const
    }
  ];

  const halvingInfo = [
    { block: 0, reward: '50 BTC' },
    { block: 210000, reward: '25 BTC' },
    { block: 420000, reward: '12.5 BTC' },
    { block: 630000, reward: '6.25 BTC' },
    { block: 840000, reward: '3.125 BTC' },
  ];

  return (
    <LinearGradient colors={["#0b331f", "#0e2a1e"]} style={styles.container}>
      <BackHeader title="Mining Rewards" onBack={handlePrevious} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="trophy-outline" size={40} color="#35d07f" />
          </View>
          
          <Text style={styles.title}>Mining Rewards</Text>
          <Text style={styles.subtitle}>Incentivizing Network Security</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.paragraph}>
            Miners are rewarded for their computational work with newly minted cryptocurrency and transaction fees. This serves two purposes:
          </Text>
          
          <View style={styles.rewardsContainer}>
            {rewardTypes.map((reward, index) => (
              <View key={index} style={styles.rewardCard}>
                <View style={styles.rewardIconContainer}>
                  <Ionicons name={reward.icon} size={24} color="#35d07f" />
                </View>
                <Text style={styles.rewardTitle}>{reward.title}</Text>
                <Text style={styles.rewardAmount}>{reward.amount}</Text>
                <Text style={styles.rewardDescription}>{reward.description}</Text>
              </View>
            ))}
          </View>
          
          <Text style={styles.paragraph}>
            The block reward is halved approximately every 4 years (every 210,000 blocks) in an event called "halving." This creates a predictable and diminishing issuance rate.
          </Text>
          
          <View style={styles.halvingContainer}>
            <Text style={styles.sectionTitle}>Bitcoin Halving History</Text>
            {halvingInfo.map((halving, index) => (
              <View key={index} style={styles.halvingRow}>
                <Text style={styles.halvingBlock}>Block {halving.block.toLocaleString()}</Text>
                <Text style={styles.halvingReward}>{halving.reward}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.completionBox}>
            <Ionicons name="checkmark-circle" size={24} color="#35d07f" style={styles.completionIcon} />
            <View>
              <Text style={styles.completionTitle}>Tutorial Complete!</Text>
              <Text style={styles.completionText}>
                You've learned the fundamentals of cryptocurrency mining. Start mining or explore more advanced topics!
              </Text>
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
          <TouchableOpacity style={styles.primaryButton} onPress={handleComplete}>
            <Text style={styles.primaryButtonText}>Finish Tutorial</Text>
            <Ionicons name="checkmark" size={20} color="#fff" />
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
    marginBottom: 24,
  },
  rewardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 16,
  },
  rewardCard: {
    flex: 1,
    backgroundColor: 'rgba(53, 208, 127, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  rewardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(53, 208, 127, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  rewardAmount: {
    color: '#35d07f',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  rewardDescription: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  halvingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  halvingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  halvingBlock: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
  },
  halvingReward: {
    color: '#35d07f',
    fontSize: 14,
    fontWeight: '600',
  },
  completionBox: {
    backgroundColor: 'rgba(53, 208, 127, 0.1)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 3,
    borderLeftColor: '#35d07f',
  },
  completionIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  completionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  completionText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 20,
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
