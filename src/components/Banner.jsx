// src/components/Banner.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const Banner = ({ navigation }) => {
  return (
    <View style={styles.bannerContainer}>
      <Text style={styles.bannerText}>Bienvenido a la APP de ABCall</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CrearIncidente')}>
          <FontAwesome name="user" size={50} color="#4a7dfc" />
          <Text style={styles.buttonText}>Aquí podrás crear el incidente</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ConsultarIncidentes')}>
          <FontAwesome name="check-square" size={50} color="#4a7dfc" />
          <Text style={styles.buttonText}>Usa esta función para consultar los incidentes.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chatbot')}>
          <FontAwesome name="search" size={50} color="#4a7dfc" />
          <Text style={styles.buttonText}>Interactúa con nuestro chatbot de IA generativa para resolver tus inquietudes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    paddingVertical: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  button: {
    width: 100,
    alignItems: 'center',
    margin: 15,
  },
  buttonText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default Banner;
