// src/screens/Chatbot.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Chatbot = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chatbot</Text>
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

export default Chatbot;
