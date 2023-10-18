/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BaseView from './components/BaseView';
import ListView from './components/ListView';
import Dataset from './components/Dataset';
function App(): JSX.Element {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="BaseView"
          component={BaseView}
          options={{headerShown: false}}
        />
        <Stack.Screen name="ListView" component={ListView} />
        <Stack.Screen name="Dataset" component={Dataset} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
