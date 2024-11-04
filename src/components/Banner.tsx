// src/components/Banner.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationProp } from '@react-navigation/native';

interface BannerProps {
  navigation: NavigationProp<any>;
}

const Banner: React.FC<BannerProps> = ({ navigation }) => {
  return (
    <View style={styles.bannerContainer}>
      <Text style={styles.bannerText}>Bienvenido a la APP de ABCall</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CrearIncidente')}>
          <Icon name="user" size={20} color="#4a7dfc" />
          <Text style={styles.buttonText}>Aquí podrás crear el incidente</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ConsultarIncidentes')}>
          <Icon name="check-square" size={20} color="#4a7dfc" />
          <Text style={styles.buttonText}>Usa esta función para consultar los incidentes.</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chatbot')}>
          <Icon name="search" size={20} color="#4a7dfc" />
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