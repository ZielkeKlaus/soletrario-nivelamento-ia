import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, Alert } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const HomeScreen = ({ navigation }) => {
  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => signOut(auth),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Botão de logout — canto superior direito */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

      {/* Título */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>SOLETRÁRIO</Text>
      </View>

      {/* Mascote Nico */}
      <Image 
        source={require('../../assets/images/nico_normal.png')} 
        style={styles.nicoImage}
        resizeMode="contain"
      />

      {/* Mensagem de boas-vindas do Nico */}
      <View style={styles.welcomeBubble}>
        <Text style={styles.welcomeText}>Ola! Vamos soletrar juntos?</Text>
      </View>

      {/* Botão Jogar */}
      <TouchableOpacity 
        style={styles.buttonContainer}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Category')}
      >
        <Text style={styles.buttonText}>JOGAR</Text>
      </TouchableOpacity>

      {/* Botão Praticar */}
      <TouchableOpacity
        style={styles.practiceButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Exercise')}
      >
        <Text style={styles.practiceButtonText}>PRATICAR</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C19AFA',
    alignItems: 'center',
    justifyContent: 'center', 
  },

  // ── Logout ────────────────────────────────────────────────────────────────
  logoutButton: {
    position: 'absolute',
    top: 48,
    right: 20,
    backgroundColor: '#FFDE00',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    paddingHorizontal: 14,
    paddingVertical: 6,
    elevation: 4,
    zIndex: 10,
  },
  logoutText: {
    fontFamily: 'LuckiestGuy',
    fontSize: 16,
    color: '#7B2CBF',
  },

  logoContainer: {
    marginBottom: 20,
  },
  logoText: {
    fontFamily: 'LuckiestGuy',
    fontSize: 60,
    color: '#FFDE00',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  nicoImage: {
    width: 250,
    height: 250,
    marginBottom: 8,
  },

  // ── Balão de boas-vindas ──────────────────────────────────────────────────
  welcomeBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 24,
    marginHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  welcomeText: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: '#6B3FA0',
    textAlign: 'center',
  },

  // ── Botão JOGAR ───────────────────────────────────────────────────────────
  buttonContainer: {
    width: 300,
    height: 80,
    backgroundColor: '#42D0A4',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 14,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 44,
    fontFamily: 'LilitaOne',
  },

  // ── Botão PRATICAR ────────────────────────────────────────────────────────
  practiceButton: {
    width: 300,
    height: 56,
    backgroundColor: '#FF9F00',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  practiceButtonText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: 'LilitaOne',
  },
});

export default HomeScreen;
