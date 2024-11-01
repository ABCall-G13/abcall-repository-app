// App.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Banner from './src/components/Banner';
import BottomNavigation from './src/components/BottomNavigation';

// Importa las pantallas a las que navegas
import CrearIncidente from './src/screens/CrearIncidente';
import ConsultarIncidentes from './src/screens/ConsultarIncidentes';
import Chatbot from './src/screens/Chatbot';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <View style={styles.container}>
        <View style={styles.content}>
          <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Banner} />
            <Stack.Screen name="CrearIncidente" component={CrearIncidente} />
            <Stack.Screen name="ConsultarIncidentes" component={ConsultarIncidentes} />
            <Stack.Screen name="Chatbot" component={Chatbot} />
          </Stack.Navigator>
        </View>
        <BottomNavigation />
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default App;
