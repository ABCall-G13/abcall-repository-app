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
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UserValidation')}>
          <Icon name="user" size={110} color="#4a7dfc"/>
          <Text style={styles.buttonText}>Aquí podrás crear el incidente</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ConsultarIncidentes')}>
          <Text style={styles.buttonText}>Usa esta función para consultar los incidentes.</Text>
          <Icon name="check-square" size={110} color="#3366CC"/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chatbot')}>
          <Icon name="search" size={110} color="#3366CC"  />
          <Text style={styles.buttonText}>Interactua con nuestro chatbot de IA generativa quien te ayudara a resolver tus inquietudes</Text>
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
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 40,
    width: '100%',
    marginVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 15,
    width: '50%',
    color: '#555',
    margin: 20,
    textAlign: 'left',
  },

});

export default Banner;
