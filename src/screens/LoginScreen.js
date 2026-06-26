import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../firebase';

const LoginScreen = () => {
  const [email, setEmail]       = useState('');
  const [senha, setSenha]       = useState('');
  const [isCadastro, setIsCadastro] = useState(false);
  const [loading, setLoading]   = useState(false);

  // Alterna modo e limpa os campos
  const alternarModo = () => {
    setEmail('');
    setSenha('');
    setIsCadastro(prev => !prev);
  };

  const handleAuth = async () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha e-mail e senha!');
      return;
    }

    setLoading(true);
    try {
      if (isCadastro) {
        await createUserWithEmailAndPassword(auth, email, senha);
      } else {
        await signInWithEmailAndPassword(auth, email, senha);
      }
    } catch (error) {
      const mensagens = {
        'auth/user-not-found':       'Usuário não encontrado.',
        'auth/wrong-password':       'Senha incorreta.',
        'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
        'auth/weak-password':        'A senha deve ter pelo menos 6 caracteres.',
        'auth/invalid-email':        'E-mail inválido.',
        'auth/invalid-credential':   'E-mail ou senha incorretos.',
      };
      Alert.alert('Erro', mensagens[error.code] || 'Algo deu errado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* ── Botão voltar (só aparece no modo Cadastro) ── */}
      {isCadastro && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={alternarModo}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
      )}

      {/* ── Logo ── */}
      <Text style={styles.logoText}>SOLETRÁRIO</Text>

      {/* ── Card do Formulário ── */}
      <View style={styles.card}>

        <Text style={styles.cardTitle}>
          {isCadastro ? 'CRIAR CONTA' : 'ENTRAR'}
        </Text>

        {/* Input E-mail */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="#A066D3"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Input Senha */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="#A066D3"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
        </View>

        {/* Botão Principal */}
        <TouchableOpacity
          style={styles.mainButton}
          activeOpacity={0.8}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="large" />
          ) : (
            <Text style={styles.mainButtonText}>
              {isCadastro ? 'CADASTRAR' : 'JOGAR!'}
            </Text>
          )}
        </TouchableOpacity>

      </View>

      {/* ── Alternar entre Login e Cadastro ── */}
      {/* Só mostra o toggle para ir ao Cadastro quando está no Login */}
      {!isCadastro && (
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Não tem conta?</Text>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={alternarModo}
            activeOpacity={0.7}
          >
            <Text style={styles.toggleButtonText}>CADASTRAR</Text>
          </TouchableOpacity>
        </View>
      )}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C19AFA',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  // ── Botão Voltar ──
  backButton: {
    position: 'absolute',
    top: 55,
    left: 25,
    width: 50,
    height: 50,
    backgroundColor: '#FFDE00',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  backButtonText: {
    fontFamily: 'LuckiestGuy',
    fontSize: 24,
    color: '#7B2CBF',
    lineHeight: 28,
  },

  // ── Logo ──
  logoText: {
    fontFamily: 'LuckiestGuy',
    fontSize: 60,
    color: '#FFDE00',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
    marginBottom: 40,
  },

  // ── Card ──
  card: {
    width: '100%',
    backgroundColor: '#7B2CBF',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#000',
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: {
    fontFamily: 'LuckiestGuy',
    fontSize: 36,
    color: '#FFDE00',
    marginBottom: 25,
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },

  // ── Inputs ──
  inputWrapper: {
    width: '100%',
    height: 60,
    backgroundColor: '#EDE0FF',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    marginBottom: 15,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: '#7B2CBF',
  },

  // ── Botão Principal ──
  mainButton: {
    width: '100%',
    height: 75,
    backgroundColor: '#42D0A4',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  mainButtonText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontFamily: 'LilitaOne',
  },

  // ── Toggle Cadastro ──
  toggleContainer: {
    marginTop: 25,
    alignItems: 'center',
    gap: 10,
  },
  toggleLabel: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: '#7B2CBF',
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: '#FFDE00',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  toggleButtonText: {
    fontFamily: 'LilitaOne',
    fontSize: 16,
    color: '#7B2CBF',
  },
});

export default LoginScreen;
