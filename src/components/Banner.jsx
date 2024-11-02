// src/components/Banner.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Banner = ({ navigation }) => {
  return (
    <View style={styles.bannerContainer}>
      <Text style={styles.bannerText}>Bienvenido a la APP de ABCall</Text>
      
      <ScrollView contentContainerStyle={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CrearIncidente')}>
          <FontAwesome name="check-square" size={50} color="#4a7dfc" />
          <Text style={styles.buttonText}>Aquí podrás crear el incidente</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ConsultarIncidentes')}>
          <FontAwesome name="search" size={50} color="#4a7dfc" />
          <Text style={styles.buttonText}>Usa esta función para consultar los incidentes.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chatbot')}>
          <FontAwesome name="user" size={50} color="#4a7dfc" />
          <Text style={styles.buttonText}>Interactúa con nuestro chatbot de IA generativa para resolver tus inquietudes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  bannerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonsContainer: {
    flexGrow: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    width: '80%',
    alignItems: 'center',
    marginVertical: 15,
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default Banner;
