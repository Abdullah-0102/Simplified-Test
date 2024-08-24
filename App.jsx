import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import * as Font from 'expo-font';
import Navigator from './src/navigation/MainNavigator';

import { UserProvider } from './src/contexts/userContext';
import { AuthProvider } from './src/contexts/authContext';

const loadFonts = async () => {
  await Font.loadAsync({
    'Inter-Bold': require('./src/fonts/Inter-Bold.ttf'),
    'Outfit-Black': require('./src/fonts/Outfit-Black.ttf'),
    'Outfit-Bold': require('./src/fonts/Outfit-Bold.ttf'),
    'Outfit-ExtraBold': require('./src/fonts/Outfit-ExtraBold.ttf'),
    'Outfit-ExtraLight': require('./src/fonts/Outfit-ExtraLight.ttf'),
    'Outfit-Light': require('./src/fonts/Outfit-Light.ttf'),
    'Outfit-Medium': require('./src/fonts/Outfit-Medium.ttf'),
    'Outfit-Regular': require('./src/fonts/Outfit-Regular.ttf'),
    'Outfit-SemiBold': require('./src/fonts/Outfit-SemiBold.ttf'),
    'Outfit-Thin': require('./src/fonts/Outfit-Thin.ttf'),
    'SourceSans3-Black': require('./src/fonts/SourceSans3-Black.ttf'),
    'SourceSans3-BlackItalic': require('./src/fonts/SourceSans3-BlackItalic.ttf'),
    'SourceSans3-Bold': require('./src/fonts/SourceSans3-Bold.ttf'),
    'SourceSans3-BoldItalic': require('./src/fonts/SourceSans3-BoldItalic.ttf'),
    'SourceSans3-ExtraBold': require('./src/fonts/SourceSans3-ExtraBold.ttf'),
    'SourceSans3-ExtraBoldItalic': require('./src/fonts/SourceSans3-ExtraBoldItalic.ttf'),
    'SourceSans3-ExtraLight': require('./src/fonts/SourceSans3-ExtraLight.ttf'),
    'SourceSans3-ExtraLightItalic': require('./src/fonts/SourceSans3-ExtraLightItalic.ttf'),
    'SourceSans3-Italic': require('./src/fonts/SourceSans3-Italic.ttf'),
    'SourceSans3-Light': require('./src/fonts/SourceSans3-Light.ttf'),
    'SourceSans3-LightItalic': require('./src/fonts/SourceSans3-LightItalic.ttf'),
    'SourceSans3-Medium': require('./src/fonts/SourceSans3-Medium.ttf'),
    'SourceSans3-MediumItalic': require('./src/fonts/SourceSans3-MediumItalic.ttf'),
    'SourceSans3-Regular': require('./src/fonts/SourceSans3-Regular.ttf'),
    'SourceSans3-SemiBold': require('./src/fonts/SourceSans3-SemiBold.ttf'),
    'SourceSans3-SemiBoldItalic': require('./src/fonts/SourceSans3-SemiBoldItalic.ttf'),
  });
};

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const fetchFonts = async () => {
      await loadFonts();
      setFontsLoaded(true);
    };
    fetchFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <UserProvider>
        <Navigator />
      </UserProvider>
    </AuthProvider>
  );
}
