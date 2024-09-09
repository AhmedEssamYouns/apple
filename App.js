import React, { useState, useEffect } from 'react';
import MainNav from './routes/main';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

// Prevent auto-hiding of the splash screen
SplashScreen.preventAutoHideAsync();

const fetchFonts = () => {
  return Font.loadAsync({
    'font': require('./assets/fonts/BadScript-Regular.ttf'),
    'title': require('./assets/fonts/Pacifico-Regular.ttf'),

  });
};

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await fetchFonts();
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
        SplashScreen.hideAsync();
      }
    };

    prepare();


  }, []);

  if (!fontsLoaded) {
    return null; // Render nothing or a loading component while fonts are loading
  }

  return <MainNav />;
};

export default App;
