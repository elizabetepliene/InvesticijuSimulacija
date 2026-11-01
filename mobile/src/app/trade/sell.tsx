import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { sellInstrument } from '../../services/api';

export default function SellScreen() {
  const params = useLocalSearchParams<{
    symbol: string;
    quantity: string;
    price: string;
    averagePurchasePrice: string;
  }>();

  const symbol = params.symbol;
  const ownedQuantity = Number(params.quantity);
  const price = Number(params.price);
  const averagePurchasePrice =
    Number(params.averagePurchasePrice);

  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = quantity * price;

  const profitLoss =
    (price - averagePurchasePrice) * quantity;

  async function confirmSell() {
    try {
      setSubmitting(true);
      setError(null);

      await sellInstrument({
        symbol,
        quantity,
        price,
      });

      router.replace('/portfolio');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Pārdošanu neizdevās veikt.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.phoneShell}>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>←</Text>
          </Pressable>

          <Text style={styles.headerTitle}>
            Pārdot
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>
            Pārdot {symbol}
          </Text>

          <Text style={styles.subtitle}>
            Tavā portfelī: {ownedQuantity} vienības
          </Text>

          <View style={styles.card}>
            <Text style={styles.label}>
              Cik vienības vēlies pārdot?
            </Text>

            <View style={styles.counter}>
              <Pressable
                style={styles.counterButton}
                onPress={() =>
                  setQuantity((current) =>
                    Math.max(1, current - 1),
                  )
                }
              >
                <Text style={styles.counterButtonText}>
                  −
                </Text>
              </Pressable>

              <View style={styles.counterValue}>
                <Text style={styles.counterValueText}>
                  {quantity}
                </Text>
              </View>

              <Pressable
                style={styles.counterButton}
                onPress={() =>
                  setQuantity((current) =>
                    Math.min(
                      ownedQuantity,
                      current + 1,
                    ),
                  )
                }
              >
                <Text style={styles.counterButtonText}>
                  +
                </Text>
              </Pressable>
            </View>

            <Pressable
              style={styles.sellAllButton}
              onPress={() =>
                setQuantity(ownedQuantity)
              }
            >
              <Text style={styles.sellAllText}>
                Pārdot visas {ownedQuantity} vienības
              </Text>
            </Pressable>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.rowLabel}>
                Tirgus cena
              </Text>

              <Text style={styles.rowValue}>
                {price.toFixed(2)} €
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>
                Saņemsi virtuālajā kontā
              </Text>

              <Text style={styles.totalValue}>
                {total.toFixed(2)} €
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>
                Realizētais P/L
              </Text>

              <Text
                style={[
                  styles.profitValue,
                  profitLoss >= 0
                    ? styles.positive
                    : styles.negative,
                ]}
              >
                {profitLoss >= 0 ? '+' : ''}
                {profitLoss.toFixed(2)} €
              </Text>
            </View>
          </View>

          {error && (
            <Text style={styles.errorText}>
              {error}
            </Text>
          )}

          <Pressable
            disabled={submitting}
            style={[
              styles.confirmButton,
              submitting &&
                styles.confirmButtonDisabled,
            ]}
            onPress={confirmSell}
          >
            <Text style={styles.confirmButtonText}>
              {submitting
                ? 'Apstrādā...'
                : 'Apstiprināt pārdošanu'}
            </Text>
          </Pressable>

          <Text style={styles.disclaimer}>
            Darījums tiek veikts tikai mācību vidē
          </Text>
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

  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E8EF',
    paddingHorizontal: 16,
  },

  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
  },

  backText: {
    color: '#222138',
    fontSize: 24,
  },

  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: '#222138',
  },

  content: {
    flex: 1,
    padding: 20,
  },

  title: {
    marginTop: 20,
    fontSize: 26,
    fontWeight: '700',
    color: '#222138',
  },

  subtitle: {
    marginTop: 6,
    color: '#6D6B7D',
    fontSize: 13,
  },

  card: {
    marginTop: 24,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },

  label: {
    textAlign: 'center',
    fontSize: 12,
    color: '#6D6B7D',
  },

  counter: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  counterButton: {
    width: 58,
    height: 54,
    backgroundColor: '#EEECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  counterButtonText: {
    color: '#584DBD',
    fontSize: 24,
    fontWeight: '600',
  },

  counterValue: {
    width: 72,
    height: 54,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E9E8EF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  counterValueText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222138',
  },

  sellAllButton: {
    marginTop: 14,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sellAllText: {
    color: '#584DBD',
    fontSize: 12,
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#E9E8EF',
    marginVertical: 18,
  },

  row: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  rowLabel: {
    color: '#6D6B7D',
    fontSize: 12,
  },

  rowValue: {
    color: '#222138',
    fontSize: 13,
    fontWeight: '600',
  },

  totalValue: {
    color: '#222138',
    fontSize: 18,
    fontWeight: '700',
  },

  profitValue: {
    fontSize: 13,
    fontWeight: '700',
  },

  positive: {
    color: '#287A64',
  },

  negative: {
    color: '#B64C5A',
  },

  errorText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#B64C5A',
    fontSize: 12,
  },

  confirmButton: {
    marginTop: 'auto',
    height: 52,
    borderRadius: 15,
    backgroundColor: '#7267D9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  confirmButtonDisabled: {
    opacity: 0.5,
  },

  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  disclaimer: {
    marginTop: 10,
    textAlign: 'center',
    color: '#6D6B7D',
    fontSize: 11,
  },
});