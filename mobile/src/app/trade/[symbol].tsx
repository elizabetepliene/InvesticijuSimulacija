import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  getInstruments,
  Instrument,
} from '../../services/api';

const AVAILABLE_CASH = 3724.18;

export default function TradeScreen() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();

  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInstrument();
  }, [symbol]);

  async function loadInstrument() {
    try {
      setLoading(true);

      const instruments = await getInstruments();

      const found = instruments.find(
        (item) => item.symbol === symbol,
      );

      setInstrument(found ?? null);
    } finally {
      setLoading(false);
    }
  }

  const total = useMemo(() => {
    if (!instrument) {
      return 0;
    }

    return instrument.price * quantity;
  }, [instrument, quantity]);

  const canBuy = total <= AVAILABLE_CASH;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#7267D9"
        />
      </View>
    );
  }

  if (!instrument) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Instruments nav atrasts.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.phoneShell}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>←</Text>
          </Pressable>

          <Text style={styles.headerTitle}>Pirkums</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.steps}>
            <View style={styles.stepActive}>
              <Text style={styles.stepNumberActive}>1</Text>
            </View>

            <View style={styles.stepLine} />

            <View style={styles.stepInactive}>
              <Text style={styles.stepNumber}>2</Text>
            </View>

            <View style={styles.stepLine} />

            <View style={styles.stepInactive}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
          </View>

          <View style={styles.stepLabels}>
            <Text style={styles.stepLabelActive}>Summa</Text>
            <Text style={styles.stepLabel}>Pārskats</Text>
            <Text style={styles.stepLabel}>Gatavs</Text>
          </View>

          <View style={styles.instrumentCard}>
            <View style={styles.symbolBox}>
              <Text style={styles.symbolLetter}>
                {instrument.symbol.charAt(0)}
              </Text>
            </View>

            <View style={styles.instrumentInfo}>
              <Text style={styles.symbol}>{instrument.symbol}</Text>
              <Text style={styles.name}>{instrument.name}</Text>
            </View>

            <View style={styles.priceBlock}>
              <Text style={styles.price}>
                {instrument.price.toFixed(2)} €
              </Text>

              <Text
                style={[
                  styles.change,
                  instrument.changePercent >= 0
                    ? styles.positive
                    : styles.negative,
                ]}
              >
                {instrument.changePercent >= 0 ? '+' : ''}
                {instrument.changePercent.toFixed(2)}%
              </Text>
            </View>
          </View>

          <View style={styles.quantityCard}>
            <Text style={styles.question}>
              Cik vienības vēlies iegādāties?
            </Text>

            <View style={styles.counter}>
              <Pressable
                onPress={() =>
                  setQuantity((current) =>
                    Math.max(1, current - 1),
                  )
                }
                style={styles.counterButton}
              >
                <Text style={styles.counterButtonText}>−</Text>
              </Pressable>

              <View style={styles.counterValue}>
                <Text style={styles.counterValueText}>
                  {quantity}
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  setQuantity((current) => current + 1)
                }
                style={styles.counterButton}
              >
                <Text style={styles.counterButtonText}>+</Text>
              </Pressable>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Kopējā summa
              </Text>

              <Text style={styles.summaryValue}>
                {total.toFixed(2)} €
              </Text>
            </View>

            <View style={styles.cashRow}>
              <Text style={styles.cashLabel}>
                Pieejamā virtuālā nauda
              </Text>

              <Text style={styles.cashValue}>
                {AVAILABLE_CASH.toFixed(2)} €
              </Text>
            </View>

            {!canBuy && (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  Nepietiek virtuālās naudas šim pirkumam.
                </Text>
              </View>
            )}
          </View>

          <Pressable
            disabled={!canBuy}
            style={[
              styles.continueButton,
              !canBuy && styles.continueButtonDisabled,
            ]}
            onPress={() =>
              router.push({
                pathname: '/trade/review',
                params: {
                  symbol: instrument.symbol,
                  quantity: quantity.toString(),
                },
              })
            }
          >
            <Text style={styles.continueButtonText}>
              Turpināt →
            </Text>
          </Pressable>

          <Text style={styles.disclaimer}>
            Reāla nauda netiek izmantota
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
    fontSize: 24,
    color: '#222138',
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

  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  stepActive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#7267D9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepInactive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9E8EF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepNumberActive: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  stepNumber: {
    color: '#9997A6',
    fontSize: 12,
    fontWeight: '700',
  },

  stepLine: {
    width: 76,
    height: 1,
    backgroundColor: '#E9E8EF',
  },

  stepLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginTop: 8,
  },

  stepLabelActive: {
    color: '#584DBD',
    fontSize: 11,
    fontWeight: '600',
  },

  stepLabel: {
    color: '#9997A6',
    fontSize: 11,
  },

  instrumentCard: {
    marginTop: 26,
    minHeight: 74,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  symbolBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#242342',
    alignItems: 'center',
    justifyContent: 'center',
  },

  symbolLetter: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  instrumentInfo: {
    flex: 1,
    marginLeft: 12,
  },

  symbol: {
    color: '#222138',
    fontSize: 15,
    fontWeight: '700',
  },

  name: {
    marginTop: 2,
    color: '#6D6B7D',
    fontSize: 12,
  },

  priceBlock: {
    alignItems: 'flex-end',
  },

  price: {
    color: '#222138',
    fontSize: 14,
    fontWeight: '700',
  },

  change: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: '600',
  },

  positive: {
    color: '#287A64',
  },

  negative: {
    color: '#B64C5A',
  },

  quantityCard: {
    marginTop: 18,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },

  question: {
    textAlign: 'center',
    color: '#6D6B7D',
    fontSize: 12,
  },

  counter: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  counterButton: {
    width: 56,
    height: 54,
    backgroundColor: '#EEECFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  counterButtonText: {
    color: '#584DBD',
    fontSize: 24,
    fontWeight: '600',
  },

  counterValue: {
    width: 72,
    height: 54,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E9E8EF',
  },

  counterValueText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222138',
  },

  divider: {
    marginTop: 24,
    height: 1,
    backgroundColor: '#E9E8EF',
  },

  summaryRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  summaryLabel: {
    color: '#6D6B7D',
    fontSize: 12,
  },

  summaryValue: {
    color: '#222138',
    fontSize: 18,
    fontWeight: '700',
  },

  cashRow: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cashLabel: {
    color: '#9997A6',
    fontSize: 11,
  },

  cashValue: {
    color: '#6D6B7D',
    fontSize: 11,
  },

  warningBox: {
    marginTop: 18,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FBECEF',
  },

  warningText: {
    textAlign: 'center',
    color: '#B64C5A',
    fontSize: 12,
    fontWeight: '600',
  },

  continueButton: {
    marginTop: 'auto',
    height: 52,
    borderRadius: 15,
    backgroundColor: '#7267D9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  continueButtonDisabled: {
    opacity: 0.4,
  },

  continueButtonText: {
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

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorText: {
    color: '#B64C5A',
  },
});