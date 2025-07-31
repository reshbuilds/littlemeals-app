import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LogScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Log Meals
      </Text>
      <Text style={styles.subtitle}>
        Main meal logging screen
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
  },
});

export default LogScreen;