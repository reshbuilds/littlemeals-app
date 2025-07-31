import React from 'react';
import { View, Text } from 'react-native';

export default function InsightsTab() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Insights</Text>
      <Text style={{ fontSize: 16, color: '#666', marginTop: 8 }}>Dashboard and analytics</Text>
    </View>
  );
}