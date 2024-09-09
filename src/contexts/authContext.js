import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authState, setAuthState] = useState({
    token: null,
    gpsFeature: null,
    highResolutionUploads: null,
    roles: [],
    menu: [],
    locations:[],
  });

  const login = async (data) => {
    try {
      setAuthState({
        token: data.token,
        gpsFeature: data.gpsFeature,
        highResolutionUploads: data.highResolutionUploads,
        roles: data.roles,
        menu: data.menu,
        locations: data.locations,
      });
      await AsyncStorage.setItem('userToken', data.token);
      setUserToken(data.token);
    } catch (error) {
      console.error('Error storing the token', error);
    }
  };

  const logout = async () => {
    try {
      setAuthState({
        token: null,
        gpsFeature: null,
        highResolutionUploads: null,
        roles: [],
        menu: [],
        locations: [],
      });
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
    } catch (error) {
      console.error('Error removing the token', error);
    }
  };

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        setUserToken(token);
      }
    } catch (error) {
      console.error('Error reading the token', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, login, logout, userToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
