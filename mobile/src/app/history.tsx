import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  getTradeHistory,
  TradeHistoryItem,
} from '../services/api';

export default function HistoryScreen() {
  const [history, setHistory] = useState<TradeHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, []),
  );

  async function loadHistory() {
    try {
      setLoading(true);
      setError(null);

      const data = await getTradeHistory();

      setHistory(data);
    } catch {
      setError('Darījumu vēsturi neizdevās ielādēt.');
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    return date.toLocaleString('lv-LV', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error}
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
            Darījumu vēsture
          </Text>
        </View>

        <FlatList
          data={history}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              <Text style={styles.title}>
                Tavi darījumi
              </Text>

              <Text style={styles.subtitle}>
                Šeit redzami visi virtuālie pirkumi un pārdošanas.
              </Text>
            </>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                Darījumu vēl nav
              </Text>

              <Text style={styles.emptyText}>
                Kad veiksi pirmo pirkumu vai pārdošanu,
                tas parādīsies šeit.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const isBuy = item.type === 'BUY';

            return (
              <View style={styles.card}>
                <View style={styles.topRow}>
                  <View
                    style={[
                      styles.typeBadge,
                      isBuy
                        ? styles.buyBadge
                        : styles.sellBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeText,
                        isBuy
                          ? styles.buyText
                          : styles.sellText,
                      ]}
                    >
                      {isBuy ? 'PIRKUMS' : 'PĀRDOŠANA'}
                    </Text>
                  </View>

                  <Text style={styles.date}>
                    {formatDate(item.createdAt)}
                  </Text>
                </View>

                <View style={styles.instrumentRow}>
                  <View style={styles.symbolBox}>
                    <Text style={styles.symbolLetter}>
                      {item.symbol.charAt(0)}
                    </Text>
                  </View>

                  <View style={styles.instrumentInfo}>
                    <Text style={styles.symbol}>
                      {item.symbol}
                    </Text>

                    <Text style={styles.quantity}>
                      {item.quantity}{' '}
                      {item.quantity === 1
                        ? 'vienība'
                        : 'vienības'}
                    </Text>
                  </View>

                  <Text style={styles.total}>
                    {item.total.toFixed(2)} €
                  </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.row}>
                  <Text style={styles.label}>
                    Cena par vienību
                  </Text>

                  <Text style={styles.value}>
                    {item.price.toFixed(2)} €
                  </Text>
                </View>

                {item.type === 'SELL' &&
                  item.realizedProfitLoss !== undefined && (
                    <View style={styles.row}>
                      <Text style={styles.label}>
                        Realizētais P/L
                      </Text>

                      <Text
                        style={[
                          styles.value,
                          item.realizedProfitLoss >= 0
                            ? styles.positive
                            : styles.negative,
                        ]}
                      >
                        {item.realizedProfitLoss >= 0 ? '+' : ''}
                        {item.realizedProfitLoss.toFixed(2)} €
                      </Text>
                    </View>
                  )}
              </View>
            );
          }}
        />
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
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222138',
  },

  subtitle: {
    marginTop: 6,
    marginBottom: 22,
    color: '#6D6B7D',
    fontSize: 13,
    lineHeight: 19,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },

  buyBadge: {
    backgroundColor: '#EEECFF',
  },

  sellBadge: {
    backgroundColor: '#EAF5F1',
  },

  typeText: {
    fontSize: 9,
    fontWeight: '700',
  },

  buyText: {
    color: '#584DBD',
  },

  sellText: {
    color: '#287A64',
  },

  date: {
    color: '#9997A6',
    fontSize: 10,
  },

  instrumentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
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

  quantity: {
    marginTop: 2,
    color: '#6D6B7D',
    fontSize: 11,
  },

  total: {
    color: '#222138',
    fontSize: 15,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#E9E8EF',
    marginVertical: 14,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  label: {
    color: '#9997A6',
    fontSize: 11,
  },

  value: {
    color: '#6D6B7D',
    fontSize: 11,
    fontWeight: '600',
  },

  positive: {
    color: '#287A64',
  },

  negative: {
    color: '#B64C5A',
  },

  empty: {
    marginTop: 50,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222138',
  },

  emptyText: {
    marginTop: 7,
    textAlign: 'center',
    color: '#6D6B7D',
    fontSize: 12,
    lineHeight: 18,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  errorText: {
    color: '#B64C5A',
  },
});