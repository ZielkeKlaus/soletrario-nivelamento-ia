// ExerciseScreen — Modo "Prática Livre"
// Questões aleatórias misturadas de todos os temas, sem pontuação/estrelas.
// Visual idêntico ao GameScreen.
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet,
  SafeAreaView, ScrollView, Pressable,
} from 'react-native';
import NicoFeedback from '../components/NicoFeedback';
import { getQuestoesMistas } from '../services/gameLogic';

const TOTAL_QUESTOES = 20;

const ExerciseScreen = ({ navigation }) => {
  const [questoes]                    = useState(() => getQuestoesMistas(TOTAL_QUESTOES));
  const [indiceAtual, setIndice]       = useState(0);
  const [selectedOption, setSelected]  = useState(null);
  const [confirmedAnswer, setConfirmed]= useState(false);
  const [isAnswerCorrect, setCorrect]  = useState(null);
  const [acertos, setAcertos]          = useState(0);
  const [finalizado, setFinal]         = useState(false);
  const [showNicoFeedback, setShowNico]= useState(false);
  const [nicoMessage, setNicoMsg]      = useState('');

  const acertosRef = useRef(0);
  const questao    = questoes[indiceAtual];
  const total      = questoes.length;

  // ─── Seleciona opção (sem confirmar ainda) ────────────────────────────────
  const handleSelect = (option) => {
    if (confirmedAnswer) return;
    setSelected(option);
  };

  // ─── Confirma resposta (igual ao GameScreen) ──────────────────────────────
  const handleConfirm = (correctAnswer) => {
    setConfirmed(true);
    const isCorrect = selectedOption === correctAnswer;
    setCorrect(isCorrect);

    if (isCorrect) {
      acertosRef.current += 1;
      setAcertos(acertosRef.current);
    } else {
      setNicoMsg(`A resposta correta era "${correctAnswer}".\n\n${questao.dica_nico}`);
      setShowNico(true);
    }
  };

  // ─── Avança para próxima questão ─────────────────────────────────────────
  const resetQuestion = () => {
    setSelected(null);
    setConfirmed(false);
    setCorrect(null);

    if (indiceAtual + 1 < total) {
      setIndice(prev => prev + 1);
    } else {
      setFinal(true);
    }
  };

  const handleCloseNico = () => {
    setShowNico(false);
    resetQuestion();
  };

  const getDynamicFontSize = (count) => {
    if (count <= 2) return 52;
    if (count <= 4) return 32;
    return 22;
  };

  // ─── Layout 1: Completar palavra (lacuna_inicio / lacuna_meio) ────────────
  const renderCompleteWordLayout = () => {
    const { opcoes, res_correta, pergunta, imagem_sugestao } = questao;
    const dynSize = getDynamicFontSize(opcoes.length);

    return (
      <>
        <View style={styles.imageContainer}>
          <Text style={styles.imagePlaceholderText}>{imagem_sugestao}</Text>
        </View>
        <View style={styles.wordContainer}>
          <Text style={styles.wordText}>{pergunta}</Text>
        </View>
        <View style={styles.squareOptionsContainer}>
          {opcoes.map((opt) => {
            const isSelected = selectedOption === opt;
            const isCorrect  = opt === res_correta;
            let bgColor = '#FFDE00';
            if (confirmedAnswer) {
              if (isSelected && isAnswerCorrect)  bgColor = '#27AE60';
              else if (isSelected && !isAnswerCorrect) bgColor = '#FF4D4D';
              else if (isCorrect  && !isAnswerCorrect) bgColor = '#27AE60';
            } else if (isSelected) bgColor = '#00BCD4';

            return (
              <Pressable key={opt}
                style={({ pressed }) => [styles.squareOptionButton, { backgroundColor: bgColor, transform: [{ scale: pressed ? 0.97 : 1 }], opacity: pressed ? 0.85 : 1 }]}
                onPress={() => handleSelect(opt)} disabled={confirmedAnswer}>
                <Text style={[styles.squareOptionText, { fontSize: dynSize }]}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>
        {selectedOption && !confirmedAnswer && (
          <Pressable style={({ pressed }) => [styles.confirmButton, { opacity: pressed ? 0.85 : 1 }]}
            onPress={() => handleConfirm(res_correta)}>
            <Text style={styles.confirmButtonText}>CONFIRMAR RESPOSTA</Text>
          </Pressable>
        )}
        {confirmedAnswer && !showNicoFeedback && (
          <Pressable style={({ pressed }) => [styles.nextButton, { opacity: pressed ? 0.85 : 1 }]}
            onPress={resetQuestion}>
            <Text style={styles.nextButtonText}>PRÓXIMA →</Text>
          </Pressable>
        )}
      </>
    );
  };

  // ─── Layout 2: Múltipla escolha vertical (escolha / regra) ───────────────
  const renderMultipleChoiceLayout = () => {
    const { opcoes, res_correta, pergunta } = questao;
    const dynSize = getDynamicFontSize(opcoes.length);

    return (
      <>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{pergunta}</Text>
        </View>
        <View style={styles.verticalOptionsContainer}>
          {opcoes.map((opt, i) => {
            const isSelected = selectedOption === opt;
            const isCorrect  = opt === res_correta;
            let bgColor = '#FFDE00';
            if (confirmedAnswer) {
              if (isSelected && isAnswerCorrect)  bgColor = '#27AE60';
              else if (isSelected && !isAnswerCorrect) bgColor = '#FF4D4D';
              else if (isCorrect  && !isAnswerCorrect) bgColor = '#27AE60';
            } else if (isSelected) bgColor = '#00BCD4';

            return (
              <Pressable key={i}
                style={({ pressed }) => [styles.rectOptionButton, { backgroundColor: bgColor, transform: [{ scale: pressed ? 0.97 : 1 }], opacity: pressed ? 0.85 : 1 }]}
                onPress={() => handleSelect(opt)} disabled={confirmedAnswer}>
                <Text style={[styles.rectOptionText, { fontSize: dynSize }]}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>
        {selectedOption && !confirmedAnswer && (
          <Pressable style={({ pressed }) => [styles.confirmButton, { opacity: pressed ? 0.85 : 1 }]}
            onPress={() => handleConfirm(res_correta)}>
            <Text style={styles.confirmButtonText}>CONFIRMAR RESPOSTA</Text>
          </Pressable>
        )}
        {confirmedAnswer && !showNicoFeedback && (
          <Pressable style={({ pressed }) => [styles.nextButton, { opacity: pressed ? 0.85 : 1 }]}
            onPress={resetQuestion}>
            <Text style={styles.nextButtonText}>PRÓXIMA →</Text>
          </Pressable>
        )}
      </>
    );
  };

  // ─── Layout 3: Sílaba Tônica ──────────────────────────────────────────────
  const renderSyllableLayout = () => {
    const { opcoes, res_correta, pergunta } = questao;
    const dynSize = getDynamicFontSize(opcoes.length);

    return (
      <>
        <View style={styles.syllableQuestionContainer}>
          <Text style={styles.syllableInstructionText}>Indique a sílaba tônica em</Text>
          <Text style={styles.syllableWordText}>{pergunta}</Text>
        </View>
        <View style={styles.verticalOptionsContainer}>
          {opcoes.map((syl, i) => {
            const isSelected = selectedOption === syl;
            const isCorrect  = syl === res_correta;
            let bgColor = '#FF9F00';
            if (confirmedAnswer) {
              if (isSelected && isAnswerCorrect)  bgColor = '#27AE60';
              else if (isSelected && !isAnswerCorrect) bgColor = '#FF4D4D';
              else if (isCorrect  && !isAnswerCorrect) bgColor = '#27AE60';
            } else if (isSelected) bgColor = '#1E88E5';

            return (
              <Pressable key={i}
                style={({ pressed }) => [styles.orangeOptionButton, { backgroundColor: bgColor, transform: [{ scale: pressed ? 0.97 : 1 }], opacity: pressed ? 0.85 : 1 }]}
                onPress={() => handleSelect(syl)} disabled={confirmedAnswer}>
                <Text style={[styles.orangeOptionText, { fontSize: dynSize }]}>{syl}</Text>
              </Pressable>
            );
          })}
        </View>
        {selectedOption && !confirmedAnswer && (
          <Pressable style={({ pressed }) => [styles.confirmButton, { opacity: pressed ? 0.85 : 1 }]}
            onPress={() => handleConfirm(res_correta)}>
            <Text style={styles.confirmButtonText}>CONFIRMAR RESPOSTA</Text>
          </Pressable>
        )}
        {confirmedAnswer && !showNicoFeedback && (
          <Pressable style={({ pressed }) => [styles.nextButton, { opacity: pressed ? 0.85 : 1 }]}
            onPress={resetQuestion}>
            <Text style={styles.nextButtonText}>PRÓXIMA →</Text>
          </Pressable>
        )}
      </>
    );
  };

  // ─── Seleção de layout por tipo/tema ─────────────────────────────────────
  const renderLayout = () => {
    if (questao.tema === 'Sílaba Tônica') return renderSyllableLayout();
    if (questao.tipo === 'lacuna_inicio' || questao.tipo === 'lacuna_meio') return renderCompleteWordLayout();
    return renderMultipleChoiceLayout();
  };

  // ─── Tela de conclusão ────────────────────────────────────────────────────
  if (finalizado) {
    const msg =
      acertosRef.current === total          ? 'Perfeito! Nico está impressionado!'
      : acertosRef.current >= total * 0.7   ? 'Muito bem! Continue praticando!'
      : 'Nao desanime! A pratica leva a perfeicao!';

    return (
      <SafeAreaView style={[styles.container, styles.finishedContainer]}>
        <Text style={styles.finishedTitle}>PRÁTICA{'\n'}CONCLUÍDA!</Text>
        <Text style={styles.finishedScore}>{acertosRef.current}/{total}</Text>
        <Text style={styles.finishedLabel}>questões corretas</Text>
        <View style={styles.finishedBubble}>
          <Text style={styles.finishedMessage}>{msg}</Text>
        </View>
        <Pressable style={({ pressed }) => [styles.backHomeButton, { opacity: pressed ? 0.85 : 1 }]}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.backHomeText}>VOLTAR AO INÍCIO</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (!questao) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Cabeçalho */}
        <View style={styles.header}>
          <Pressable
            style={({ pressed }) => [styles.backButton, { transform: [{ scale: pressed ? 0.97 : 1 }], opacity: pressed ? 0.85 : 1 }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.backArrow}>❮</Text>
          </Pressable>

          <View style={{ alignItems: 'center' }}>
            <Text style={styles.progressText}>
              {String(indiceAtual + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
            </Text>
            <Text style={styles.practicaLabel}>PRÁTICA LIVRE</Text>
          </View>

          {/* Tag do tema da questão atual */}
          <View style={styles.temaTag}>
            <Text style={styles.temaText}>{questao.tema}</Text>
          </View>
        </View>

        {renderLayout()}

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
  container:     { flex: 1, backgroundColor: '#7B2CBF' },
  scrollContent: { alignItems: 'center', paddingBottom: 40 },

  // ── Cabeçalho (mesmo do GameScreen) ───────────────────────────────────────
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    width: '100%', paddingHorizontal: 25, marginTop: 15, marginBottom: 10,
  },
  backButton: {
    width: 50, height: 50, backgroundColor: '#FFDE00',
    borderRadius: 15, borderWidth: 2, borderColor: '#000',
    justifyContent: 'center', alignItems: 'center',
  },
  backArrow:    { fontSize: 22, color: '#000000', fontFamily: 'LilitaOne' },
  progressText: { color: '#FFFFFF', fontSize: 30, fontFamily: 'LuckiestGuy' },
  practicaLabel:{ color: '#FFDE00', fontSize: 12, fontFamily: 'LilitaOne', textAlign: 'center' },
  temaTag: {
    backgroundColor: '#FF9F00', paddingHorizontal: 10,
    paddingVertical: 6, borderRadius: 10, maxWidth: 100,
  },
  temaText: { fontFamily: 'LilitaOne', color: 'white', fontSize: 11, textAlign: 'center' },

  // ── Layout 1 (lacuna) — idêntico ao GameScreen ────────────────────────────
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
    color: '#FFFFFF', fontFamily: 'LilitaOne',
    textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 4,
  },

  // ── Layout 2 (escolha vertical) — idêntico ao GameScreen ─────────────────
  questionContainer: {
    width: 350, minHeight: 80, backgroundColor: '#A66A38',
    borderRadius: 15, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 15, paddingVertical: 18, marginTop: 15, elevation: 5,
  },
  questionText: { color: '#FFFFFF', fontSize: 26, fontFamily: 'LilitaOne', textAlign: 'center', lineHeight: 30 },
  verticalOptionsContainer: { marginTop: 15, gap: 16, alignItems: 'center', width: '100%', paddingHorizontal: 15 },
  rectOptionButton: {
    width: 320, height: 60, borderRadius: 15,
    justifyContent: 'center', alignItems: 'center', elevation: 5,
  },
  rectOptionText: {
    color: '#FFFFFF', fontFamily: 'LilitaOne',
    textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 4,
  },

  // ── Layout 3 (Sílaba Tônica) — idêntico ao GameScreen ────────────────────
  syllableQuestionContainer: {
    width: 350, minHeight: 80, backgroundColor: '#A66A38',
    borderRadius: 15, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 15, paddingVertical: 18, marginTop: 15, elevation: 5,
  },
  syllableInstructionText: { color: '#FFFFFF', fontSize: 26, fontFamily: 'LilitaOne', textAlign: 'center' },
  syllableWordText: {
    color: '#FFFFFF', fontSize: 48, fontFamily: 'LilitaOne', textAlign: 'center', marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 4,
  },
  orangeOptionButton: {
    width: 320, height: 70, borderRadius: 15,
    justifyContent: 'center', alignItems: 'center', elevation: 5,
  },
  orangeOptionText: {
    color: '#FFFFFF', fontFamily: 'LilitaOne',
    textShadowColor: 'rgba(0,0,0,0.25)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 4,
  },

  // ── Botão Confirmar e Próxima — idêntico ao GameScreen ────────────────────
  confirmButton: {
    marginTop: 15, backgroundColor: '#FFB500',
    paddingHorizontal: 40, paddingVertical: 12,
    borderRadius: 15, borderWidth: 2, borderColor: '#000', elevation: 5,
  },
  confirmButtonText: { color: '#FFFFFF', fontSize: 20, fontFamily: 'LilitaOne' },
  nextButton: {
    marginTop: 15, backgroundColor: '#27AE60',
    paddingHorizontal: 40, paddingVertical: 12,
    borderRadius: 15, borderWidth: 2, borderColor: '#000', elevation: 5,
  },
  nextButtonText: { color: '#FFFFFF', fontSize: 20, fontFamily: 'LilitaOne' },

  // ── Tela de conclusão ─────────────────────────────────────────────────────
  finishedContainer: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  finishedTitle: {
    fontFamily: 'LuckiestGuy', fontSize: 44, color: '#FFDE00',
    textAlign: 'center', marginBottom: 20,
    textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 4,
  },
  finishedScore:   { fontFamily: 'LuckiestGuy', fontSize: 72, color: '#FFFFFF', textAlign: 'center' },
  finishedLabel:   { fontFamily: 'LilitaOne', fontSize: 18, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginBottom: 24 },
  finishedBubble:  { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, paddingHorizontal: 24, paddingVertical: 16, marginBottom: 36 },
  finishedMessage: { fontFamily: 'LilitaOne', fontSize: 18, color: 'white', textAlign: 'center' },
  backHomeButton: {
    backgroundColor: '#42D0A4', borderRadius: 14,
    paddingHorizontal: 32, paddingVertical: 16,
    borderWidth: 3, borderColor: '#000', elevation: 4,
  },
  backHomeText: { fontFamily: 'LuckiestGuy', fontSize: 22, color: 'white' },
});

export default ExerciseScreen;
