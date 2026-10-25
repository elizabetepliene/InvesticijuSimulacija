import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function PortfolioScreen() {
  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.phoneShell}>
        <Text style={styles.title}>Portfelis</Text>
        <Text style={styles.text}>
          Šeit būs detalizēts portfeļa skats.
        </Text>
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
    padding: 20,
    backgroundColor: '#F7F7FB',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222138',
  },
  text: {
    marginTop: 16,
    color: '#6D6B7D',
  },
});