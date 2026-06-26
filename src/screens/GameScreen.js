import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { getQuestoesPorTema, validarResposta } from '../services/gameLogic';
import NicoFeedback from '../components/NicoFeedback';

const GameScreen = ({ route, navigation }) => {
  const { category } = route.params || { category: 'X/CH' };
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [confirmedAnswer, setConfirmedAnswer] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [firstAttemptCorrectAnswers, setFirstAttemptCorrectAnswers] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [showNicoFeedback, setShowNicoFeedback] = useState(false);
  const [nicoMessage, setNicoMessage] = useState('');

  // 🔴 Fix: useRef para evitar valor stale na navegação
  const correctAnswersRef = useRef(0);
  const firstAttemptCorrectAnswersRef = useRef(0);

  useEffect(() => {
    const loadedQuestions = getQuestoesPorTema(category);
    setQuestions(loadedQuestions);
    setQuestionIndex(0);
  }, [category]);

  const currentQuestion = isReviewMode
    ? wrongQuestions[questionIndex]
    : questions[questionIndex];

  // Apenas atualiza a seleção visual, sem validar ainda
  const handleSelect = (option) => {
    if (confirmedAnswer) return;
    setSelectedOption(option);
  };

  // Valida a resposta após clicar em "Confirmar Resposta"
  const handleConfirmAnswer = (correctAnswer) => {
    setConfirmedAnswer(true);
    const isCorrect = selectedOption === correctAnswer;
    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      console.log('Correto!');

      // 🔴 Fix: atualiza ref e state juntos
      correctAnswersRef.current += 1;
      setCorrectAnswers(correctAnswersRef.current);

      if (!isReviewMode) {
        firstAttemptCorrectAnswersRef.current += 1;
        setFirstAttemptCorrectAnswers(firstAttemptCorrectAnswersRef.current);
      }

    } else {
      console.log('Errado!');

      // 🟡 Fix: só adiciona wrongQuestions fora do modo revisão
      if (!isReviewMode) {
        setWrongQuestions(prev => [...prev, currentQuestion]);
      }

      setNicoMessage(
        `A resposta correta era "${correctAnswer}".\n\n${currentQuestion.dica_nico}`
      );
      setShowNicoFeedback(true);
    }
  };

  // Reseta estado para a próxima questão
  const resetQuestion = () => {
    setSelectedOption(null);
    setConfirmedAnswer(false);
    setIsAnswerCorrect(null);

    const currentList = isReviewMode
      ? wrongQuestions
      : questions;

    if (questionIndex < currentList.length - 1) {
      setQuestionIndex(prev => prev + 1);
      return;
    }

    // Terminou a fase normal
    if (!isReviewMode && wrongQuestions.length > 0) {
      console.log('Correcao de Erros');
      setIsReviewMode(true);
      setQuestionIndex(0);
      return;
    }

    // 🔴 Fix: usa refs para garantir valores atualizados na navegação
    navigation.navigate('Result', {
      category,
      correctAnswers: correctAnswersRef.current,
      firstAttemptCorrectAnswers: firstAttemptCorrectAnswersRef.current,
      totalQuestions: questions.length
    });
  };

  const handleCloseNico = () => {
    setShowNicoFeedback(false);
    resetQuestion();
  };

  // Função para ajustar tamanho da fonte dinamicamente baseado na quantidade de opções
  const getDynamicFontSize = (optionsCount) => {
    if (optionsCount <= 2) return 52;
    if (optionsCount <= 4) return 32;
    return 22;
  };

  // ---------------------------------------------------------
  // LAYOUT 1: Completar a palavra (X/CH, R/RR, SS/Ç)
  // ---------------------------------------------------------
  const renderCompleteWordLayout = () => {
    const wordData = {
      word: currentQuestion.pergunta,
      options: currentQuestion.opcoes,
      correct: currentQuestion.res_correta,
      imagePlaceholder: currentQuestion.imagem_sugestao
    };

    const dynamicFontSize = getDynamicFontSize(wordData.options.length);

    return (
      <>
        <View style={styles.imageContainer}>
          <Text style={styles.imagePlaceholderText}>{wordData.imagePlaceholder}</Text>
        </View>
        <View style={styles.wordContainer}>
          <Text style={styles.wordText}>{wordData.word}</Text>
        </View>
        <View style={styles.squareOptionsContainer}>
          {wordData.options.map((opt) => {
            const isSelected = selectedOption === opt;
            const isCorrect = opt === wordData.correct;
            let bgColor = '#FFDE00';

            if (confirmedAnswer) {
              if (isSelected && isAnswerCorrect) {
                bgColor = '#27AE60';
              } else if (isSelected && !isAnswerCorrect) {
                bgColor = '#FF4D4D';
              } else if (isCorrect && !isAnswerCorrect) {
                bgColor = '#27AE60';
              }
            } else if (isSelected) {
              bgColor = '#00BCD4';
            }

            return (
              <Pressable
                key={opt}
                style={({ pressed }) => [
                  styles.squareOptionButton,
                  {
                    backgroundColor: bgColor,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    opacity: pressed ? 0.85 : 1,
                  }
                ]}
                onPress={() => handleSelect(opt)}
                disabled={confirmedAnswer}
              >
                <Text style={[styles.squareOptionText, { fontSize: dynamicFontSize }]}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>
        {selectedOption && !confirmedAnswer && (
          <Pressable
            style={({ pressed }) => [
              styles.confirmButton,
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.85 : 1,
              }
            ]}
            onPress={() => handleConfirmAnswer(wordData.correct)}
          >
            <Text style={styles.confirmButtonText}>CONFIRMAR RESPOSTA</Text>
          </Pressable>
        )}
        {confirmedAnswer && (
          <Pressable
            style={({ pressed }) => [
              styles.nextButton,
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.85 : 1,
              }
            ]}
            onPress={resetQuestion}
          >
            <Text style={styles.nextButtonText}>PRÓXIMA →</Text>
          </Pressable>
        )}
      </>
    );
  };

  // ---------------------------------------------------------
  // LAYOUT 2: Múltipla Escolha Vertical (Acentuação)
  // ---------------------------------------------------------
  const renderMultipleChoiceLayout = () => {
    const options = currentQuestion.opcoes;
    const correct = currentQuestion.res_correta;
    const dynamicFontSize = getDynamicFontSize(options.length);

    return (
      <>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {currentQuestion.pergunta}
          </Text>
        </View>
        <View style={styles.verticalOptionsContainer}>
          {options.map((option, index) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === correct;
            let bgColor = '#FFDE00';

            if (confirmedAnswer) {
              if (isSelected && isAnswerCorrect) {
                bgColor = '#27AE60';
              } else if (isSelected && !isAnswerCorrect) {
                bgColor = '#FF4D4D';
              } else if (isCorrect && !isAnswerCorrect) {
                bgColor = '#27AE60';
              }
            } else if (isSelected) {
              bgColor = '#00BCD4';
            }

            return (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  styles.rectOptionButton,
                  {
                    backgroundColor: bgColor,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    opacity: pressed ? 0.85 : 1,
                  }
                ]}
                onPress={() => handleSelect(option)}
                disabled={confirmedAnswer}
              >
                <Text style={[styles.rectOptionText, { fontSize: dynamicFontSize }]}>{option}</Text>
              </Pressable>
            );
          })}
        </View>
        {selectedOption && !confirmedAnswer && (
          <Pressable
            style={({ pressed }) => [
              styles.confirmButton,
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.85 : 1,
              }
            ]}
            onPress={() => handleConfirmAnswer(correct)}
          >
            <Text style={styles.confirmButtonText}>CONFIRMAR RESPOSTA</Text>
          </Pressable>
        )}
        {confirmedAnswer && (
          <Pressable
            style={({ pressed }) => [
              styles.nextButton,
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.85 : 1,
              }
            ]}
            onPress={resetQuestion}
          >
            <Text style={styles.nextButtonText}>PRÓXIMA →</Text>
          </Pressable>
        )}
      </>
    );
  };

  // ---------------------------------------------------------
  // LAYOUT 3: Sílaba Tônica
  // ---------------------------------------------------------
  const renderSyllableLayout = () => {
    const syllables = currentQuestion.opcoes;
    const correct = currentQuestion.res_correta;
    const dynamicFontSize = getDynamicFontSize(syllables.length);

    // 🟡 Fix: usa campo `palavra` se disponível, senão faz o parse como fallback
    const palavra = currentQuestion.palavra
      || currentQuestion.pergunta
          .replace("Qual é a sílaba tônica da palavra '", '')
          .replace("'?", '');

    return (
      <>
        <View style={styles.syllableQuestionContainer}>
          <Text style={styles.syllableInstructionText}>Indique a sílaba tônica em</Text>
          <Text style={styles.syllableWordText}>{palavra}</Text>
        </View>
        <View style={styles.verticalOptionsContainer}>
          {syllables.map((syllable, index) => {
            const isSelected = selectedOption === syllable;
            const isCorrect = syllable === correct;
            let bgColor = '#FF9F00';

            if (confirmedAnswer) {
              if (isSelected && isAnswerCorrect) {
                bgColor = '#27AE60';
              } else if (isSelected && !isAnswerCorrect) {
                bgColor = '#FF4D4D';
              } else if (isCorrect && !isAnswerCorrect) {
                bgColor = '#27AE60';
              }
            } else if (isSelected) {
              bgColor = '#1E88E5';
            }

            return (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  styles.orangeOptionButton,
                  {
                    backgroundColor: bgColor,
                    transform: [{ scale: pressed ? 0.97 : 1 }],
                    opacity: pressed ? 0.85 : 1,
                  }
                ]}
                onPress={() => handleSelect(syllable)}
                disabled={confirmedAnswer}
              >
                <Text style={[styles.orangeOptionText, { fontSize: dynamicFontSize }]}>{syllable}</Text>
              </Pressable>
            );
          })}
        </View>
        {selectedOption && !confirmedAnswer && (
          <Pressable
            style={({ pressed }) => [
              styles.confirmButton,
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.85 : 1,
              }
            ]}
            onPress={() => handleConfirmAnswer(correct)}
          >
            <Text style={styles.confirmButtonText}>CONFIRMAR RESPOSTA</Text>
          </Pressable>
        )}
        {confirmedAnswer && (
          <Pressable
            style={({ pressed }) => [
              styles.nextButton,
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.85 : 1,
              }
            ]}
            onPress={resetQuestion}
          >
            <Text style={styles.nextButtonText}>PRÓXIMA →</Text>
          </Pressable>
        )}
      </>
    );
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={true}>

        {/* Cabeçalho */}
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [
              styles.backButton,
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.85 : 1,
              }
            ]}
            onPress={() => navigation.goBack()}
          >
            {/* 🟡 Fix: estilo backArrow adicionado ao StyleSheet */}
            <Text style={styles.backArrow}>❮</Text>
          </Pressable>
          <View>
            <Text style={styles.progressText}>
              {String(questionIndex + 1).padStart(2, '0')}/
              {String(
                isReviewMode
                  ? wrongQuestions.length
                  : questions.length
              ).padStart(2, '0')}
            </Text>
            {isReviewMode && (
              <Text style={styles.reviewModeText}>
                CORREÇÃO DE ERROS
              </Text>
            )}
          </View>
        </View>

        {/* Renderização Condicional */}
        {category === 'ACENTUAÇÃO'
          ? renderMultipleChoiceLayout()
          : category === 'SÍLABA TÔNICA'
            ? renderSyllableLayout()
            : renderCompleteWordLayout()}

      </ScrollView>

      <NicoFeedback
        visible={showNicoFeedback}
        message={nicoMessage}
        isCorrect={isAnswerCorrect}
        onClose={handleCloseNico}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7B2CBF',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 25,
    marginTop: 15,
    marginBottom: 10,
  },
  backButton: {
    width: 50,
    height: 50,
    backgroundColor: '#FFDE00',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // 🟡 Fix: estilo adicionado
  backArrow: {
    fontSize: 22,
    color: '#000000',
    fontFamily: 'LilitaOne',
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontFamily: 'LuckiestGuy',
  },
  // 🟡 Fix: estilo extraído do inline para o StyleSheet
  reviewModeText: {
    color: '#FFDE00',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'LilitaOne',
  },

  // --- Layout 1 ---
  imageContainer: {
    width: 350, height: 220, backgroundColor: '#A66A38',
    borderRadius: 15, justifyContent: 'center', alignItems: 'center',
    marginTop: 10, elevation: 5,
  },
  imagePlaceholderText: { color: '#000000', fontSize: 26, fontFamily: 'LilitaOne' },
  wordContainer: {
    width: 350, height: 70, backgroundColor: '#42D0A4',
    borderRadius: 15, borderWidth: 2, borderColor: '#000',
    justifyContent: 'center', alignItems: 'center', marginTop: 15, elevation: 5,
  },
  wordText: { color: '#FFFFFF', fontSize: 50, fontFamily: 'LilitaOne' },
  squareOptionsContainer: { flexDirection: 'row', justifyContent: 'space-between', width: 350, marginTop: 20, gap: 10 },
  squareOptionButton: {
    width: 160, height: 160, borderRadius: 15,
    borderWidth: 2, borderColor: '#000',
    justifyContent: 'center', alignItems: 'center', elevation: 5,
  },
  squareOptionText: {
    color: '#FFFFFF', fontSize: 60, fontFamily: 'LilitaOne',
    textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 4,
  },

  // --- Layout 2 ---
  questionContainer: {
    width: 350, height: 150, backgroundColor: '#A66A38',
    borderRadius: 15, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 15, marginTop: 15, elevation: 5,
  },
  questionText: { color: '#FFFFFF', fontSize: 26, fontFamily: 'LilitaOne', textAlign: 'center', lineHeight: 30 },
  verticalOptionsContainer: { marginTop: 15, gap: 16, alignItems: 'center', width: '100%', paddingHorizontal: 15 },
  rectOptionButton: {
    width: 320, height: 60, borderRadius: 15,
    justifyContent: 'center', alignItems: 'center', elevation: 5,
  },
  rectOptionText: {
    color: '#FFFFFF', fontSize: 22, fontFamily: 'LilitaOne',
    textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 4,
  },

  // --- Layout 3 ---
  syllableQuestionContainer: {
    width: 350, height: 140, backgroundColor: '#A66A38',
    borderRadius: 15, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 15, marginTop: 15, elevation: 5,
  },
  syllableInstructionText: { color: '#FFFFFF', fontSize: 26, fontFamily: 'LilitaOne', textAlign: 'center' },
  syllableWordText: {
    color: '#FFFFFF', fontSize: 48, fontFamily: 'LilitaOne',
    textAlign: 'center', marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 4,
  },
  orangeOptionButton: {
    width: 320, height: 70, borderRadius: 15,
    justifyContent: 'center', alignItems: 'center', elevation: 5,
  },
  orangeOptionText: {
    color: '#FFFFFF', fontSize: 44, fontFamily: 'LilitaOne',
    textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 4,
  },

  // --- Botão Confirmar Resposta ---
  confirmButton: {
    marginTop: 15,
    backgroundColor: '#FFB500',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#000',
    elevation: 5,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'LilitaOne',
  },

  // --- Botão Próxima ---
  nextButton: {
    marginTop: 15,
    backgroundColor: '#27AE60',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#000',
    elevation: 5,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'LilitaOne',
  },
});

export default GameScreen;
