import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.phoneShell}>
        <View style={styles.content}>
          <Text style={styles.hello}>Labrīt, Elizabete</Text>
          <Text style={styles.title}>Tavs mācību portfelis</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Kopējā vērtība</Text>
            <Text style={styles.value}>9 621,18 €</Text>
            <Text style={styles.positive}>+339,90 € · +6,12%</Text>
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
  content: {
    padding: 20,
    paddingTop: 28,
  },
  hello: {
    color: '#6D6B7D',
    fontSize: 13,
  },
  title: {
    marginTop: 4,
    fontSize: 26,
    fontWeight: '700',
    color: '#222138',
  },
  card: {
    marginTop: 24,
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#242342',
  },
  label: {
    color: '#C9C7D9',
    fontSize: 12,
  },
  value: {
    marginTop: 10,
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
  },
  positive: {
    marginTop: 8,
    color: '#71C9A9',
    fontSize: 13,
    fontWeight: '600',
  },
});