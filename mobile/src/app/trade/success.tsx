import { router, useLocalSearchParams } from 'expo-router';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function SuccessScreen() {
  const { symbol, quantity, total } = useLocalSearchParams<{
    symbol: string;
    quantity: string;
    total: string;
  }>();

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.phoneShell}>
        <View style={styles.content}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>

          <Text style={styles.title}>
            Pirkums veiksmīgs
          </Text>

          <Text style={styles.text}>
            {quantity} {symbol} vienības pievienotas tavam portfelim.
          </Text>

          <Text style={styles.total}>
            {total} €
          </Text>

          <Pressable
            style={styles.primaryButton}
            onPress={() => router.replace('/portfolio')}
          >
            <Text style={styles.primaryButtonText}>
              Skatīt portfeli
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.secondaryButtonText}>
              Atgriezties sākumā
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#EFEFF4',
    alignItems: 'center',
  },

  phoneShell: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    backgroundColor: '#F7F7FB',
  },

  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E8F5F0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  successIconText: {
    color: '#287A64',
    fontSize: 32,
    fontWeight: '700',
  },

  title: {
    marginTop: 24,
    fontSize: 26,
    fontWeight: '700',
    color: '#222138',
  },

  text: {
    marginTop: 10,
    textAlign: 'center',
    color: '#6D6B7D',
    fontSize: 13,
  },

  total: {
    marginTop: 18,
    fontSize: 28,
    fontWeight: '700',
    color: '#222138',
  },

  primaryButton: {
    marginTop: 36,
    width: '100%',
    height: 52,
    borderRadius: 15,
    backgroundColor: '#7267D9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  secondaryButton: {
    marginTop: 12,
    minHeight: 44,
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: '#584DBD',
    fontSize: 12,
    fontWeight: '600',
  },
});