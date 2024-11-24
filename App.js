// App.js

import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './src/screens/WelcomeScreen';
import Banner from './src/components/Banner';
import BottomNavigation from './src/components/BottomNavigation';

// Importa las otras pantallas
import CrearIncidente from './src/screens/CrearIncidente';
import ConsultarIncidentes from './src/screens/ConsultarIncidentes';
import Chatbot from './src/screens/Chatbot';

const Stack = createStackNavigator();

const App = () => {
  const navigationRef = useRef();
  const [currentRoute, setCurrentRoute] = useState('Welcome');

  useEffect(() => {
    const unsubscribe = navigationRef.current?.addListener('state', () => {
      const routeName = navigationRef.current.getCurrentRoute()?.name;
      setCurrentRoute(routeName);
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Home" component={Banner} />
            <Stack.Screen name="CrearIncidente" component={CrearIncidente} />
            <Stack.Screen name="ConsultarIncidentes" component={ConsultarIncidentes} />
            <Stack.Screen name="Chatbot" component={Chatbot} />
          </Stack.Navigator>
        </View>
        {/* Muestra la barra de navegación solo si la ruta actual no es 'Welcome' */}
        {currentRoute !== 'Welcome' && <BottomNavigation />}
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
