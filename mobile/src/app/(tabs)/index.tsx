import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  ActivityIndicator,
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

export default function HomeScreen() {
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
      setError('Datus neizdevās ielādēt.');
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
          {error ?? 'Dati nav pieejami.'}
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={loadPortfolio}
        >
          <Text style={styles.retryButtonText}>
            Mēģināt vēlreiz
          </Text>
        </Pressable>
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
          <Text style={styles.brand}>
            augt
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.hello}>
            Labrīt, Elizabete
          </Text>

          <Text style={styles.title}>
            Tavs mācību portfelis
          </Text>

          <View style={styles.portfolioCard}>
            <Text style={styles.portfolioLabel}>
              Kopējā vērtība
            </Text>

            <Text style={styles.portfolioValue}>
              {portfolio.totalValue.toFixed(2)} €
            </Text>

            <Text
              style={[
                styles.portfolioProfit,
                isProfit
                  ? styles.profitPositive
                  : styles.profitNegative,
              ]}
            >
              {isProfit ? '+' : ''}
              {portfolio.totalProfitLoss.toFixed(2)} €
              {' · '}
              {isProfit ? '+' : ''}
              {portfolio.totalProfitLossPercent.toFixed(2)}%
            </Text>

            <View style={styles.cardDivider} />

            <View style={styles.cardBottomRow}>
              <View>
                <Text style={styles.cardSmallLabel}>
                  Virtuālā nauda
                </Text>

                <Text style={styles.cardSmallValue}>
                  {portfolio.cash.toFixed(2)} €
                </Text>
              </View>

              <View style={styles.cardRight}>
                <Text style={styles.cardSmallLabel}>
                  Ieguldīts
                </Text>

                <Text style={styles.cardSmallValue}>
                  {portfolio.investedValue.toFixed(2)} €
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Ko vēlies darīt?
            </Text>
          </View>

          <View style={styles.actionsRow}>
            <Pressable
              style={styles.actionCard}
              onPress={() => router.push('/market')}
            >
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>
                  ↗
                </Text>
              </View>

              <Text style={styles.actionTitle}>
                Izpētīt tirgu
              </Text>

              <Text style={styles.actionText}>
                Apskati akcijas un ETF
              </Text>
            </Pressable>

            <Pressable
              style={styles.actionCard}
              onPress={() => router.push('/portfolio')}
            >
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>
                  ▣
                </Text>
              </View>

              <Text style={styles.actionTitle}>
                Mans portfelis
              </Text>

              <Text style={styles.actionText}>
                Apskati savas pozīcijas
              </Text>
            </Pressable>
          </View>

          <View
            style={[
              styles.riskCard,
              isHighRisk
                ? styles.riskHigh
                : styles.riskNormal,
            ]}
          >
            <Text style={styles.riskEyebrow}>
              PORTFEĻA RISKS
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
                ? 'Augsta koncentrācija'
                : 'Portfelis nav pārmērīgi koncentrēts'}
            </Text>

            <Text style={styles.riskText}>
              Lielākā pozīcija veido{' '}
              {portfolio.highestConcentration.toFixed(1)}%
              {' '}no ieguldītās vērtības.
            </Text>

            <Pressable
              style={styles.riskLink}
              onPress={() => router.push('/portfolio')}
            >
              <Text style={styles.riskLinkText}>
                Skatīt analīzi →
              </Text>
            </Pressable>
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipEyebrow}>
              MĀCĪBU ATZIŅA
            </Text>

            <Text style={styles.tipTitle}>
              Diversifikācija palīdz samazināt risku
            </Text>

            <Text style={styles.tipText}>
              Sadalot ieguldījumus vairākos instrumentos,
              viena uzņēmuma cenu svārstības mazāk ietekmē
              visu portfeli.
            </Text>

            <Pressable
              onPress={() => router.push('/learn')}
            >
              <Text style={styles.learnLink}>
                Uzzināt vairāk →
              </Text>
            </Pressable>
          </View>
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
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9E8EF',
  },

  brand: {
    fontSize: 19,
    fontWeight: '700',
    color: '#222138',
  },

  content: {
    flex: 1,
    padding: 20,
  },

  hello: {
    color: '#6D6B7D',
    fontSize: 13,
  },

  title: {
    marginTop: 4,
    color: '#222138',
    fontSize: 25,
    fontWeight: '700',
  },

  portfolioCard: {
    marginTop: 22,
    backgroundColor: '#242342',
    borderRadius: 24,
    padding: 22,
  },

  portfolioLabel: {
    color: '#C7C5D5',
    fontSize: 11,
  },

  portfolioValue: {
    marginTop: 7,
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
  },

  portfolioProfit: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '700',
  },

  profitPositive: {
    color: '#8ED9C2',
  },

  profitNegative: {
    color: '#F2A3AD',
  },

  cardDivider: {
    height: 1,
    backgroundColor: '#3C3A5A',
    marginVertical: 18,
  },

  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cardRight: {
    alignItems: 'flex-end',
  },

  cardSmallLabel: {
    color: '#A8A6B9',
    fontSize: 10,
  },

  cardSmallValue: {
    marginTop: 4,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  sectionHeader: {
    marginTop: 26,
    marginBottom: 10,
  },

  sectionTitle: {
    color: '#222138',
    fontSize: 18,
    fontWeight: '700',
  },

  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
  },

  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: '#EEECFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionIconText: {
    color: '#584DBD',
    fontSize: 17,
    fontWeight: '700',
  },

  actionTitle: {
    marginTop: 13,
    color: '#222138',
    fontSize: 13,
    fontWeight: '700',
  },

  actionText: {
    marginTop: 4,
    color: '#6D6B7D',
    fontSize: 10,
    lineHeight: 15,
  },

  riskCard: {
    marginTop: 16,
    padding: 17,
    borderRadius: 18,
  },

  riskNormal: {
    backgroundColor: '#EAF5F1',
  },

  riskHigh: {
    backgroundColor: '#FBECEF',
  },

  riskEyebrow: {
    color: '#6D6B7D',
    fontSize: 9,
    fontWeight: '700',
  },

  riskTitle: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '700',
  },

  riskNormalText: {
    color: '#287A64',
  },

  riskHighText: {
    color: '#B64C5A',
  },

  riskText: {
    marginTop: 6,
    color: '#6D6B7D',
    fontSize: 11,
    lineHeight: 16,
  },

  riskLink: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },

  riskLinkText: {
    color: '#584DBD',
    fontSize: 11,
    fontWeight: '700',
  },

  tipCard: {
    marginTop: 16,
    padding: 17,
    borderRadius: 18,
    backgroundColor: '#EEECFF',
  },

  tipEyebrow: {
    color: '#584DBD',
    fontSize: 9,
    fontWeight: '700',
  },

  tipTitle: {
    marginTop: 6,
    color: '#222138',
    fontSize: 14,
    fontWeight: '700',
  },

  tipText: {
    marginTop: 6,
    color: '#6D6B7D',
    fontSize: 11,
    lineHeight: 16,
  },

  learnLink: {
    marginTop: 10,
    color: '#584DBD',
    fontSize: 11,
    fontWeight: '700',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7FB',
  },

  errorText: {
    color: '#B64C5A',
    fontSize: 13,
  },

  retryButton: {
    marginTop: 14,
    paddingHorizontal: 18,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#7267D9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});