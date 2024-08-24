import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkIfFirstTimeUser = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (!hasLaunched) {
          console.log('First time user');
          setIsFirstTimeUser(true);
          await AsyncStorage.setItem('hasLaunched', 'true');
        }
      } catch (error) {
        console.error('Error checking if first time user:', error);
      } finally {
        setLoading(false);
      }
    };
    checkIfFirstTimeUser();
  }, []);

  return (
    <UserContext.Provider value={{ isFirstTimeUser, setIsFirstTimeUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};