import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useFonts } from 'expo-font';
import { LuckiestGuy_400Regular } from '@expo-google-fonts/luckiest-guy';
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';

import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/firebase';

import HomeScreen from './src/screens/HomeScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import GameScreen from './src/screens/GameScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';
import LoginScreen from './src/screens/LoginScreen';
import ResultScreen from './src/screens/ResultScreen';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Carregamento das fontes (seu código original, preservado)
  const [fontsLoaded] = useFonts({
    LuckiestGuy: LuckiestGuy_400Regular,
    LilitaOne: LilitaOne_400Regular,
  });

  // Listener de autenticação Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioLogado) => {
      setUser(usuarioLogado);
      setAuthLoading(false);
    });

    return unsubscribe; // limpa o listener ao desmontar
  }, []);

  // Aguarda AMBOS: fontes carregadas + Firebase respondeu
  if (!fontsLoaded || authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFDE00" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          // ✅ Logado → fluxo normal do jogo
          <>
            <Stack.Screen name="Home"     component={HomeScreen} />
            <Stack.Screen name="Category" component={CategoryScreen} />
            <Stack.Screen name="Game"     component={GameScreen} />
            <Stack.Screen name="Exercise" component={ExerciseScreen} />
            <Stack.Screen name="Result"   component={ResultScreen} />
          </>
        ) : (
          // 🔒 Não logado → tela de login
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#C19AFA', // roxo da identidade visual
    justifyContent: 'center',
    alignItems: 'center',
  },
});
