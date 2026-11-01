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
  buyInstrument,
  getInstruments,
  Instrument,
} from '../../services/api';

const AVAILABLE_CASH = 3724.18;

export default function ReviewScreen() {
  const { symbol, quantity } = useLocalSearchParams<{
    symbol: string;
    quantity: string;
  }>();

  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const quantityNumber = Number(quantity ?? 1);

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
    } catch {
      setInstrument(null);
    } finally {
      setLoading(false);
    }
  }

  const total = useMemo(() => {
    if (!instrument) {
      return 0;
    }

    return instrument.price * quantityNumber;
  }, [instrument, quantityNumber]);

  const remainingCash = AVAILABLE_CASH - total;

  async function confirmPurchase() {
    if (!instrument) {
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      const result = await buyInstrument({
        symbol: instrument.symbol,
        quantity: quantityNumber,
        price: instrument.price,
      });

      router.replace({
        pathname: '/trade/success',
        params: {
          symbol: result.symbol,
          quantity: result.quantity.toString(),
          total: result.total.toFixed(2),
          remainingCash: result.remainingCash.toFixed(2),
        },
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Pirkumu neizdevās veikt.',
      );
    } finally {
      setSubmitting(false);
    }
  }

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

          <Text style={styles.headerTitle}>
            Pārskats
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.steps}>
            <View style={styles.stepDone}>
              <Text style={styles.stepDoneText}>✓</Text>
            </View>

            <View style={styles.stepLineActive} />

            <View style={styles.stepActive}>
              <Text style={styles.stepNumberActive}>2</Text>
            </View>

            <View style={styles.stepLine} />

            <View style={styles.stepInactive}>
              <Text style={styles.stepNumber}>3</Text>
            </View>
          </View>

          <View style={styles.stepLabels}>
            <Text style={styles.stepLabelDone}>
              Summa
            </Text>

            <Text style={styles.stepLabelActive}>
              Pārskats
            </Text>

            <Text style={styles.stepLabel}>
              Gatavs
            </Text>
          </View>

          <Text style={styles.title}>
            Pārbaudi darījuma informāciju
          </Text>

          <Text style={styles.subtitle}>
            Pirms apstiprināšanas pārliecinies, ka viss ir pareizi.
          </Text>

          <View style={styles.card}>
            <View style={styles.instrumentRow}>
              <View style={styles.symbolBox}>
                <Text style={styles.symbolLetter}>
                  {instrument.symbol.charAt(0)}
                </Text>
              </View>

              <View style={styles.instrumentInfo}>
                <Text style={styles.symbol}>
                  {instrument.symbol}
                </Text>

                <Text style={styles.name}>
                  {instrument.name}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.label}>
                Daudzums
              </Text>

              <Text style={styles.value}>
                {quantityNumber} vien.
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                Cena par vienību
              </Text>

              <Text style={styles.value}>
                {instrument.price.toFixed(2)} €
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>
                Kopējā summa
              </Text>

              <Text style={styles.totalValue}>
                {total.toFixed(2)} €
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <Text style={styles.remainingLabel}>
                Pēc darījuma paliks
              </Text>

              <Text style={styles.remainingValue}>
                {remainingCash.toFixed(2)} €
              </Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>
              Virtuāls darījums
            </Text>

            <Text style={styles.infoText}>
              Šis pirkums tiek veikts tikai mācību vidē.
              Reāla nauda netiek izmantota.
            </Text>
          </View>

          {submitError && (
            <Text style={styles.submitError}>
              {submitError}
            </Text>
          )}

          <Pressable
            disabled={submitting}
            style={[
              styles.confirmButton,
              submitting && styles.confirmButtonDisabled,
            ]}
            onPress={confirmPurchase}
          >
            <Text style={styles.confirmButtonText}>
              {submitting
                ? 'Apstrādā...'
                : 'Apstiprināt pirkumu'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            style={styles.backEditButton}
          >
            <Text style={styles.backEditText}>
              Mainīt daudzumu
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

  stepDone: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#7267D9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  stepDoneText: {
    color: '#FFFFFF',
    fontWeight: '700',
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

  stepLineActive: {
    width: 76,
    height: 2,
    backgroundColor: '#7267D9',
  },

  stepLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    marginTop: 8,
  },

  stepLabelDone: {
    color: '#584DBD',
    fontSize: 11,
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

  title: {
    marginTop: 30,
    color: '#222138',
    fontSize: 24,
    fontWeight: '700',
  },

  subtitle: {
    marginTop: 6,
    color: '#6D6B7D',
    fontSize: 13,
    lineHeight: 19,
  },

  card: {
    marginTop: 24,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },

  instrumentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  symbolBox: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: '#242342',
    alignItems: 'center',
    justifyContent: 'center',
  },

  symbolLetter: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  instrumentInfo: {
    marginLeft: 12,
  },

  symbol: {
    color: '#222138',
    fontSize: 16,
    fontWeight: '700',
  },

  name: {
    marginTop: 2,
    color: '#6D6B7D',
    fontSize: 12,
  },

  divider: {
    marginVertical: 18,
    height: 1,
    backgroundColor: '#E9E8EF',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },

  label: {
    color: '#6D6B7D',
    fontSize: 12,
  },

  value: {
    color: '#222138',
    fontSize: 13,
    fontWeight: '600',
  },

  totalValue: {
    color: '#222138',
    fontSize: 18,
    fontWeight: '700',
  },

  remainingLabel: {
    color: '#6D6B7D',
    fontSize: 12,
  },

  remainingValue: {
    color: '#287A64',
    fontSize: 15,
    fontWeight: '700',
  },

  infoBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#EEECFF',
  },

  infoTitle: {
    color: '#584DBD',
    fontSize: 12,
    fontWeight: '700',
  },

  infoText: {
    marginTop: 6,
    color: '#6D6B7D',
    fontSize: 12,
    lineHeight: 18,
  },

  submitError: {
    marginTop: 12,
    color: '#B64C5A',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
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

  backEditButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backEditText: {
    color: '#584DBD',
    fontSize: 12,
    fontWeight: '600',
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