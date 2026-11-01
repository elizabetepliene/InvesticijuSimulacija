import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

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

export default function InstrumentDetailsScreen() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();

  const [instrument, setInstrument] = useState<Instrument | null>(null);
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

  const isPositive = instrument.changePercent >= 0;

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
            Instrumenta detaļas
          </Text>
        </View>

        <View style={styles.content}>

          <View style={styles.symbolBox}>
            <Text style={styles.symbolLetter}>
              {instrument.symbol.charAt(0)}
            </Text>
          </View>

          <Text style={styles.symbol}>
            {instrument.symbol}
          </Text>

          <Text style={styles.name}>
            {instrument.name}
          </Text>

          <Text style={styles.type}>
            {instrument.type === 'ETF' ? 'ETF' : 'Akcija'}
          </Text>

          <View style={styles.priceSection}>
            <Text style={styles.price}>
              {instrument.price.toFixed(2)} €
            </Text>

            <Text
              style={[
                styles.change,
                isPositive
                  ? styles.positive
                  : styles.negative,
              ]}
            >
              {isPositive ? '+' : ''}
              {instrument.changePercent.toFixed(2)}%
            </Text>
          </View>

          <Text style={styles.updated}>
            Cena atjaunota nesen
          </Text>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              Ko tu pērc?
            </Text>

            <Text style={styles.infoText}>
              {instrument.type === 'ETF'
                ? 'ETF ir fonds, kas apvieno vairākus aktīvus vienā ieguldījumā. Tas var palīdzēt diversificēt portfeli.'
                : 'Akcija ir uzņēmuma īpašumtiesību daļa. Tās vērtība var pieaugt vai samazināties atkarībā no uzņēmuma un tirgus rezultātiem.'}
            </Text>
          </View>

          <View style={styles.learningCard}>
            <Text style={styles.learningLabel}>
              MĀCĪBU ATZIŅA
            </Text>

            <Text style={styles.learningText}>
              Diversifikācija palīdz samazināt risku,
              sadalot ieguldījumus starp vairākiem aktīviem.
            </Text>
          </View>

          <Pressable
            style={styles.buyButton}
            onPress={() =>
              router.push({
                pathname: '/trade/[symbol]',
                params: { symbol: instrument.symbol },
              })
            }
          >
            <Text style={styles.buyButtonText}>
              Pirkt
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

  symbolBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#242342',
    alignItems: 'center',
    justifyContent: 'center',
  },

  symbolLetter: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  symbol: {
    marginTop: 18,
    fontSize: 26,
    fontWeight: '700',
    color: '#222138',
  },

  name: {
    marginTop: 4,
    fontSize: 15,
    color: '#6D6B7D',
  },

  type: {
    marginTop: 5,
    fontSize: 12,
    color: '#9997A6',
  },

  priceSection: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
  },

  price: {
    fontSize: 36,
    fontWeight: '700',
    color: '#222138',
  },

  change: {
    fontSize: 14,
    fontWeight: '600',
  },

  positive: {
    color: '#287A64',
  },

  negative: {
    color: '#B64C5A',
  },

  updated: {
    marginTop: 6,
    fontSize: 11,
    color: '#9997A6',
  },

  infoCard: {
    marginTop: 28,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222138',
  },

  infoText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: '#6D6B7D',
  },

  learningCard: {
    marginTop: 14,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#EEECFF',
  },

  learningLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#584DBD',
  },

  learningText: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: '#222138',
  },

  buyButton: {
    marginTop: 'auto',
    height: 52,
    borderRadius: 15,
    backgroundColor: '#7267D9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buyButtonText: {
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