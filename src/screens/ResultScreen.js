// src/screens/ResultScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { auth } from '../firebase';
import { salvarProgresso } from '../services/progressoService';

const ResultScreen = ({ route, navigation }) => {
  const {
    category,
    correctAnswers,
    firstAttemptCorrectAnswers,
    totalQuestions,
  } = route.params;

  const [salvando, setSalvando] = useState(true);

  // ─── Calcula estrelas (lógica original preservada) ───
  const getStars = () => {
    if (firstAttemptCorrectAnswers === totalQuestions) return 3;
    if (firstAttemptCorrectAnswers >= 23) return 2;
    if (firstAttemptCorrectAnswers >= 12) return 1;
    return 0;
  };

  const stars = getStars();

  // ─── Salva progresso ao montar a tela ───
  useEffect(() => {
    const salvar = async () => {
      const uid = auth.currentUser?.uid;

      if (!uid) {
        console.warn('⚠️ Usuário não autenticado. Progresso não salvo.');
        setSalvando(false);
        return;
      }

      await salvarProgresso(uid, category, stars);
      setSalvando(false);
    };

    salvar();
  }, []); // Executa apenas uma vez ao abrir a tela

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>FASE CONCLUÍDA</Text>

      <Text style={styles.category}>{category}</Text>

      <Text style={styles.resultLabel}>Acertos iniciais:</Text>
      <Text style={styles.score}>
        {firstAttemptCorrectAnswers}/{totalQuestions}
      </Text>

      <Text style={styles.resultLabel}>Acertos após revisão:</Text>
      <Text style={styles.score}>
        {correctAnswers}/{totalQuestions}
      </Text>

      {/* Estrelas conquistadas nesta fase */}
      <Text style={styles.starText}>
        {'★'.repeat(stars)}{'☆'.repeat(3 - stars)}
      </Text>

      {/* Feedback enquanto salva no Firebase */}
      {salvando && (
        <View style={styles.savingContainer}>
          <ActivityIndicator size="small" color="#FFDE00" />
          <Text style={styles.savingText}>Salvando progresso...</Text>
        </View>
      )}

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('Category')}
      >
        <Text style={styles.buttonText}>VOLTAR ÀS FASES</Text>
      </Pressable>

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
  title: {
    fontFamily: 'LuckiestGuy',
    fontSize: 40,
    color: '#FFDE00',
    textAlign: 'center',
    marginBottom: 10,
  },
  category: {
    fontFamily: 'LuckiestGuy',
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  resultLabel: {
    fontFamily: 'LilitaOne',
    fontSize: 18,
    color: '#7B2CBF',
    marginTop: 10,
  },
  score: {
    fontFamily: 'LuckiestGuy',
    fontSize: 48,
    color: '#FFDE00',
  },
  starText: {
    fontSize: 48,
    marginVertical: 20,
  },
  savingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  savingText: {
    fontFamily: 'LilitaOne',
    fontSize: 14,
    color: '#FFDE00',
  },
  button: {
    width: '100%',
    height: 70,
    backgroundColor: '#42D0A4',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 5,
  },
  buttonText: {
    fontFamily: 'LilitaOne',
    fontSize: 24,
    color: '#FFFFFF',
  },
});

export default ResultScreen;
