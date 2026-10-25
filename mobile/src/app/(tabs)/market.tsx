import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  getInstruments,
  Instrument,
} from '../../services/api';

export default function MarketScreen() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadInstruments();
  }, []);

  async function loadInstruments() {
    try {
      setLoading(true);
      setError(null);

      const data = await getInstruments();
      setInstruments(data);
    } catch {
      setError('Tirgus datus neizdevās ielādēt.');
    } finally {
      setLoading(false);
    }
  }

  const filteredInstruments = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return instruments;
    }

    return instruments.filter((item) => {
      return (
        item.symbol.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query)
      );
    });
  }, [instruments, search]);

  function renderInstrument({ item }: { item: Instrument }) {
    const isPositive = item.changePercent >= 0;

    return (
      <Pressable style={styles.instrumentRow}>
        <View style={styles.instrumentLeft}>
          <View style={styles.symbolBox}>
            <Text style={styles.symbolLetter}>
              {item.symbol.charAt(0)}
            </Text>
          </View>

          <View style={styles.instrumentInfo}>
            <Text style={styles.symbol}>{item.symbol}</Text>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.type}>
              {item.type === 'ETF' ? 'ETF' : 'Akcija'}
            </Text>
          </View>
        </View>

        <View style={styles.priceBlock}>
          <Text style={styles.price}>
            {item.price.toFixed(2)} €
          </Text>

          <Text
            style={[
              styles.change,
              isPositive ? styles.positive : styles.negative,
            ]}
          >
            {isPositive ? '+' : ''}
            {item.changePercent.toFixed(2)}%
          </Text>
        </View>
      </Pressable>
    );
  }

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.phoneShell}>
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>↗</Text>
            </View>

            <Text style={styles.brandText}>augt</Text>
          </View>

          <Text style={styles.headerTitle}>Tirgus</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Ko vēlies izpētīt?</Text>

          <Text style={styles.subtitle}>
            Reāli dati, virtuāli darījumi.
          </Text>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Meklēt akciju vai ETF"
            placeholderTextColor="#9997A6"
            style={styles.searchInput}
          />

          {loading && (
            <View style={styles.stateContainer}>
              <ActivityIndicator
                size="large"
                color="#7267D9"
              />

              <Text style={styles.stateTitle}>
                Ielādējam tirgus datus
              </Text>

              <Text style={styles.stateText}>
                Saņemam aktuālās cenas no datu avota.
              </Text>
            </View>
          )}

          {!loading && error && (
            <View style={styles.stateContainer}>
              <View style={styles.errorIcon}>
                <Text style={styles.errorIconText}>!</Text>
              </View>

              <Text style={styles.stateTitle}>
                Datus neizdevās atjaunot
              </Text>

              <Text style={styles.stateText}>
                Pārbaudi savienojumu un mēģini vēlreiz.
              </Text>

              <Pressable
                onPress={loadInstruments}
                style={styles.retryButton}
              >
                <Text style={styles.retryButtonText}>
                  Mēģināt vēlreiz
                </Text>
              </Pressable>
            </View>
          )}

          {!loading &&
            !error &&
            filteredInstruments.length === 0 && (
              <View style={styles.stateContainer}>
                <Text style={styles.emptyIcon}>⌕</Text>

                <Text style={styles.stateTitle}>
                  Nekas nav atrasts
                </Text>

                <Text style={styles.stateText}>
                  Pamēģini citu uzņēmuma nosaukumu vai simbolu.
                </Text>

                <Pressable
                  onPress={() => setSearch('')}
                  style={styles.secondaryButton}
                >
                  <Text style={styles.secondaryButtonText}>
                    Notīrīt meklēšanu
                  </Text>
                </Pressable>
              </View>
            )}

          {!loading && !error && filteredInstruments.length > 0 && (
            <FlatList
              data={filteredInstruments}
              keyExtractor={(item) => item.symbol}
              renderItem={renderInstrument}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.list}
            />
          )}
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
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E8EF',
    backgroundColor: '#F7F7FB',
  },

  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  logo: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: '#7267D9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  brandText: {
    color: '#222138',
    fontSize: 18,
    fontWeight: '700',
  },

  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#222138',
    fontSize: 15,
    fontWeight: '600',
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 26,
  },

  title: {
    color: '#222138',
    fontSize: 26,
    fontWeight: '700',
  },

  subtitle: {
    marginTop: 4,
    color: '#6D6B7D',
    fontSize: 13,
  },

  searchInput: {
    marginTop: 22,
    height: 48,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9E8EF',
    paddingHorizontal: 14,
    fontSize: 13,
    color: '#222138',
  },

  list: {
    paddingTop: 18,
    paddingBottom: 30,
  },

  instrumentRow: {
    minHeight: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E8EF',
  },

  instrumentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  symbolBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#242342',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  symbolLetter: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  instrumentInfo: {
    flex: 1,
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

  type: {
    marginTop: 3,
    color: '#9997A6',
    fontSize: 11,
  },

  priceBlock: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },

  price: {
    color: '#222138',
    fontSize: 14,
    fontWeight: '700',
  },

  change: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
  },

  positive: {
    color: '#287A64',
  },

  negative: {
    color: '#B64C5A',
  },

  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 80,
  },

  stateTitle: {
    marginTop: 18,
    color: '#222138',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },

  stateText: {
    marginTop: 8,
    color: '#6D6B7D',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },

  errorIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FBECEF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorIconText: {
    color: '#B64C5A',
    fontSize: 26,
    fontWeight: '700',
  },

  emptyIcon: {
    color: '#584DBD',
    fontSize: 32,
  },

  retryButton: {
    marginTop: 24,
    minHeight: 48,
    paddingHorizontal: 26,
    borderRadius: 13,
    backgroundColor: '#7267D9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  secondaryButton: {
    marginTop: 24,
    minHeight: 48,
    paddingHorizontal: 24,
    borderRadius: 13,
    backgroundColor: '#EEECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButtonText: {
    color: '#584DBD',
    fontSize: 13,
    fontWeight: '700',
  },
});