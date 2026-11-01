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
  getPortfolio,
  PortfolioResponse,
} from '../../services/api';

export default function PortfolioScreen() {
  const [portfolio, setPortfolio] =
    useState<PortfolioResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadPortfolio();
    }, []),
  );

  async function loadPortfolio() {
    try {
      setLoading(true);
      setError(null);

      const data = await getPortfolio();

      setPortfolio(data);
    } catch {
      setError('Portfeli neizdevās ielādēt.');
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

  if (error || !portfolio) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error ?? 'Portfelis nav pieejams.'}
        </Text>
      </View>
    );
  }

  const isProfit =
    portfolio.totalProfitLoss >= 0;

  const isHighRisk =
    portfolio.riskLevel === 'HIGH';

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.phoneShell}>
        <View style={styles.header}>
          <Text style={styles.headerBrand}>
            augt
          </Text>

          <Text style={styles.headerTitle}>
            Portfelis
          </Text>
        </View>

        <FlatList
          data={portfolio.positions}
          keyExtractor={(item) => item.symbol}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <>
              <Text style={styles.label}>
                Portfeļa vērtība
              </Text>

              <Text style={styles.totalValue}>
                {portfolio.totalValue.toFixed(2)} €
              </Text>

              <Text
                style={[
                  styles.totalProfit,
                  isProfit
                    ? styles.positive
                    : styles.negative,
                ]}
              >
                {isProfit ? '+' : ''}
                {portfolio.totalProfitLoss.toFixed(2)} €
                {' · '}
                {isProfit ? '+' : ''}
                {portfolio.totalProfitLossPercent.toFixed(2)}%
              </Text>

              <View style={styles.summaryRow}>
                <View style={styles.summaryCard}>
                  <Text style={styles.summaryLabel}>
                    Virtuālā nauda
                  </Text>

                  <Text style={styles.summaryValue}>
                    {portfolio.cash.toFixed(2)} €
                  </Text>
                </View>

                <View style={styles.summaryCard}>
                  <Text style={styles.summaryLabel}>
                    Ieguldīts
                  </Text>

                  <Text style={styles.summaryValue}>
                    {portfolio.investedValue.toFixed(2)} €
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.riskCard,
                  isHighRisk
                    ? styles.riskCardHigh
                    : styles.riskCardNormal,
                ]}
              >
                <Text style={styles.riskEyebrow}>
                  PORTFEĻA KONCENTRĀCIJAS RISKS
                </Text>

                <Text
                  style={[
                    styles.riskTitle,
                    isHighRisk
                      ? styles.riskHighText
                      : styles.riskNormalText,
                  ]}
                >
                  {isHighRisk
                    ? 'Augsts risks'
                    : 'Nav augsta koncentrācijas riska'}
                </Text>

                <Text style={styles.riskText}>
                  Lielākā pozīcija veido{' '}
                  {portfolio.highestConcentration.toFixed(1)}%
                  {' '}no ieguldītās portfeļa vērtības.
                </Text>

                <Text style={styles.riskExplanation}>
                  {isHighRisk
                    ? 'Vairāk nekā 70% no ieguldītās vērtības atrodas vienā instrumentā. Tas nozīmē, ka portfelis ir mazāk diversificēts.'
                    : 'Neviena pozīcija nepārsniedz 70% no ieguldītās portfeļa vērtības.'}
                </Text>
              </View>

              <Pressable
                style={styles.historyButton}
                onPress={() =>
                  router.push('/history')
                }
              >
                <Text style={styles.historyButtonText}>
                  Skatīt darījumu vēsturi →
                </Text>
              </Pressable>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>
                  Visas pozīcijas
                </Text>

                <Text style={styles.positionCount}>
                  {portfolio.positions.length}{' '}
                  {portfolio.positions.length === 1
                    ? 'aktīvs'
                    : 'aktīvi'}
                </Text>
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>
                Portfelis vēl ir tukšs
              </Text>

              <Text style={styles.emptyText}>
                Iegādājies pirmo instrumentu Tirgus sadaļā.
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const positionIsProfit =
              item.profitLoss >= 0;

            return (
              <View style={styles.positionCard}>
                <View style={styles.positionTop}>
                  <View style={styles.symbolBox}>
                    <Text style={styles.symbolLetter}>
                      {item.symbol.charAt(0)}
                    </Text>
                  </View>

                  <View style={styles.positionInfo}>
                    <Text style={styles.symbol}>
                      {item.symbol}
                    </Text>

                    <Text style={styles.quantity}>
                      {item.quantity} vienības
                    </Text>
                  </View>

                  <View style={styles.positionRight}>
                    <Text style={styles.positionValue}>
                      {item.marketValue.toFixed(2)} €
                    </Text>

                    <Text
                      style={[
                        styles.positionProfit,
                        positionIsProfit
                          ? styles.positive
                          : styles.negative,
                      ]}
                    >
                      {positionIsProfit ? '+' : ''}
                      {item.profitLoss.toFixed(2)} €
                      {' · '}
                      {positionIsProfit ? '+' : ''}
                      {item.profitLossPercent.toFixed(2)}%
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailsRow}>
                  <View>
                    <Text style={styles.detailLabel}>
                      Vidējā pirkuma cena
                    </Text>

                    <Text style={styles.detailValue}>
                      {item.averagePurchasePrice.toFixed(2)} €
                    </Text>
                  </View>

                  <View style={styles.detailRight}>
                    <Text style={styles.detailLabel}>
                      Tirgus cena
                    </Text>

                    <Text style={styles.detailValue}>
                      {item.currentPrice.toFixed(2)} €
                    </Text>
                  </View>
                </View>

                <View style={styles.concentrationRow}>
                  <Text style={styles.detailLabel}>
                    Daļa portfelī
                  </Text>

                  <Text style={styles.concentrationValue}>
                    {item.concentrationPercent.toFixed(1)}%
                  </Text>
                </View>

                <Pressable
                  style={styles.sellButton}
                  onPress={() =>
                    router.push({
                      pathname: '/trade/sell',
                      params: {
                        symbol: item.symbol,
                        quantity: item.quantity.toString(),
                        price: item.currentPrice.toString(),
                        averagePurchasePrice:
                          item.averagePurchasePrice.toString(),
                      },
                    })
                  }
                >
                  <Text style={styles.sellButtonText}>
                    Pārdot
                  </Text>
                </Pressable>
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
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E8EF',
  },

  headerBrand: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222138',
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
    padding: 20,
    paddingBottom: 40,
  },

  label: {
    color: '#6D6B7D',
    fontSize: 12,
  },

  totalValue: {
    marginTop: 6,
    fontSize: 36,
    fontWeight: '700',
    color: '#222138',
  },

  totalProfit: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: '600',
  },

  positive: {
    color: '#287A64',
  },

  negative: {
    color: '#B64C5A',
  },

  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },

  summaryLabel: {
    color: '#9997A6',
    fontSize: 11,
  },

  summaryValue: {
    marginTop: 6,
    color: '#222138',
    fontSize: 16,
    fontWeight: '700',
  },

  riskCard: {
    marginTop: 18,
    borderRadius: 18,
    padding: 18,
  },

  riskCardNormal: {
    backgroundColor: '#EAF5F1',
  },

  riskCardHigh: {
    backgroundColor: '#FBECEF',
  },

  riskEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6D6B7D',
  },

  riskTitle: {
    marginTop: 7,
    fontSize: 16,
    fontWeight: '700',
  },

  riskNormalText: {
    color: '#287A64',
  },

  riskHighText: {
    color: '#B64C5A',
  },

  riskText: {
    marginTop: 8,
    color: '#222138',
    fontSize: 12,
    fontWeight: '600',
  },

  riskExplanation: {
    marginTop: 5,
    color: '#6D6B7D',
    fontSize: 11,
    lineHeight: 17,
  },

  historyButton: {
    marginTop: 16,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E9E8EF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  historyButtonText: {
    color: '#584DBD',
    fontSize: 12,
    fontWeight: '700',
  },

  sectionHeader: {
    marginTop: 28,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    color: '#222138',
    fontSize: 18,
    fontWeight: '700',
  },

  positionCount: {
    color: '#584DBD',
    fontSize: 12,
    fontWeight: '600',
  },

  positionCard: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
  },

  positionTop: {
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

  positionInfo: {
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

  positionRight: {
    alignItems: 'flex-end',
  },

  positionValue: {
    color: '#222138',
    fontSize: 14,
    fontWeight: '700',
  },

  positionProfit: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#E9E8EF',
    marginVertical: 14,
  },

  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  detailRight: {
    alignItems: 'flex-end',
  },

  detailLabel: {
    color: '#9997A6',
    fontSize: 10,
  },

  detailValue: {
    marginTop: 3,
    color: '#6D6B7D',
    fontSize: 11,
    fontWeight: '600',
  },

  concentrationRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  concentrationValue: {
    color: '#584DBD',
    fontSize: 11,
    fontWeight: '700',
  },

  sellButton: {
    marginTop: 16,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7267D9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sellButtonText: {
    color: '#584DBD',
    fontSize: 12,
    fontWeight: '700',
  },

  empty: {
    marginTop: 30,
    alignItems: 'center',
  },

  emptyTitle: {
    color: '#222138',
    fontSize: 15,
    fontWeight: '700',
  },

  emptyText: {
    marginTop: 5,
    color: '#6D6B7D',
    fontSize: 12,
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