import React from "react";
import { Text, View } from "react-native-web";
import Constants from "expo-constants";

const Main = () => {
  return (
    <View style={{marginTop: Constants.statusBarHeight,  flexGrow: 1}}>
      <Text>Open up App.js to start working on your app!</Text>
    </View>
  );
}

export default Main;