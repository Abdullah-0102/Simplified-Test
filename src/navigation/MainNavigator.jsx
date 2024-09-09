import React, { useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/login';
import ForgotPasswordScreen from '../screens/forgotPassword';
import SetNewPasswordScreen from '../screens/setNewPassword';
import Homepage from '../screens/homepage';
import TapOnMyLocationSuggested from '../screens/tapOnLocation';
import SpecificSurvey from '../screens/specificSurvey';
import AddNewLocation1 from '../screens/addNewLocation-1';
import HowItWorks from '../screens/howItWorks';
import GetHelpScreen from '../screens/getHelp';
import { UserContext } from '../contexts/userContext';

const Stack = createStackNavigator();

const Navigator = () => {
  const { isFirstTimeUser, loading } = useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          setIsLoggedIn(true); // Token exists, user is logged in
        }
      } catch (error) {
        console.error('Error checking auth token:', error);
      } finally {
        setIsCheckingAuth(false); // Auth check completed
      }
    };

    checkAuthToken();
  }, []);

  if (loading || isCheckingAuth) {
    // You can replace this with a more sophisticated loading indicator if you prefer
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isFirstTimeUser ? 'HowItWorks' : isLoggedIn ? 'HomePage' : 'Login'}>
        <Stack.Screen
          name="HowItWorks"
          options={{ headerShown: false }}
        >
          {props => <HowItWorks {...props} isFirstTimeUser={isFirstTimeUser} />}
        </Stack.Screen>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
          options={{ title: '' }}
        />
        <Stack.Screen
          name="SetNewPasswordScreen"
          component={SetNewPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomePage"
          component={Homepage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TapOnLocation"
          component={TapOnMyLocationSuggested}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddNewLocation1"
          component={AddNewLocation1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GetHelp"
          component={GetHelpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SpecificSurvey"
          component={SpecificSurvey}
          options={({ route }) => ({
            headerTitle: route.params.location,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
