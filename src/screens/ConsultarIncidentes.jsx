// src/screens/ConsultarIncidentes.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ConsultarIncidentes = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Consultar Incidentes</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default ConsultarIncidentes;
