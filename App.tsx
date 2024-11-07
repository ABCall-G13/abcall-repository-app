/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Banner from './src/components/Banner';
import CrearIncidente from './src/screens/CrearIncidente';
import ConsultarIncidentes from './src/screens/ConsultarIncidentes';
import Chatbot from './src/screens/Chatbot';
import BottomNavigation from './src/components/BottomNavigation';

type HomeStackRoutes = {
  Home: undefined;
  CrearIncidente: undefined;
  ConsultarIncidentes: undefined;
  Chatbot: undefined;
};

const Stack = createNativeStackNavigator<HomeStackRoutes>();

function App() {
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default App;
