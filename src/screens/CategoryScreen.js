// src/screens/CategoryScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import { auth } from '../firebase';
import {
  buscarProgressoTema,
  buscarTotalEstrelas,
} from '../services/progressoService';

// ── Componentes SVG (extraídos do Figma) ──────────────────────────────────

const ArrowLeft = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <Svg width={65} height={65} viewBox="0 0 65 65" fill="none">
      <Rect width={65} height={65} rx={15} fill="#FFDE00" />
      <Rect x="0.5" y="0.5" width={64} height={64} rx={14.5} stroke="black" />
      <Path
        d="M32.3184 15.2158V25.6123L50.5 25.6123V38.3877L32.3184 38.3877V48.7842L15.7031 32L32.3184 15.2158Z"
        fill="white" stroke="black"
      />
    </Svg>
  </TouchableOpacity>
);

const ArrowRight = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <Svg width={65} height={65} viewBox="0 0 65 65" fill="none">
      <Rect width={65} height={65} rx={15} fill="#FFDE00" />
      <Rect x="0.5" y="0.5" width={64} height={64} rx={14.5} stroke="black" />
      <Path
        d="M32.6816 15.2158V25.6123L14.5 25.6123V38.3877L32.6816 38.3877V48.7842L49.2969 32L32.6816 15.2158Z"
        fill="white" stroke="black"
      />
    </Svg>
  </TouchableOpacity>
);

const PlayOctagon = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <Svg width={175} height={175} viewBox="0 0 175 175" fill="none">
      {/* Octágono verde */}
      <Path
        d="M123.764 0H51.2361L0 51.2361V123.764L51.2361 175H123.764L175 123.764V51.2361Z"
        fill="#28E13B"
      />
      {/* Triângulo play centralizado */}
      <Path d="M66 50L66 125L132 87.5Z" fill="white" />
    </Svg>
  </TouchableOpacity>
);

const CATEGORIES = [
  { id: '1', title: 'X/CH',         fontSize: 50 },
  { id: '2', title: 'ACENTUAÇÃO',   fontSize: 30 },
  { id: '3', title: 'SÍLABA TÔNICA',fontSize: 26 },
  { id: '4', title: 'R/RR',         fontSize: 50 },
  { id: '5', title: 'SS/Ç',         fontSize: 50 },
];

const CategoryScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex]       = useState(0);
  const [totalEstrelas, setTotalEstrelas]     = useState(0);
  const [estrelasMap, setEstrelasMap]         = useState({}); // { 'X/CH': 2, ... }
  const [carregando, setCarregando]           = useState(true);

  // ─── Recarrega dados toda vez que a tela recebe foco ───
  // Isso garante que ao voltar do ResultScreen os dados atualizem
  useFocusEffect(
    useCallback(() => {
      const carregarProgresso = async () => {
        setCarregando(true);
        const uid = auth.currentUser?.uid;

        if (!uid) {
          setCarregando(false);
          return;
        }

        // Busca estrelas de todas as fases em paralelo
        const resultados = await Promise.all(
          CATEGORIES.map((cat) => buscarProgressoTema(uid, cat.title))
        );

        // Monta o mapa { tema: estrelas }
        const mapa = {};
        CATEGORIES.forEach((cat, index) => {
          mapa[cat.title] = resultados[index].estrelas;
        });

        // Busca total
        const total = await buscarTotalEstrelas(uid);

        setEstrelasMap(mapa);
        setTotalEstrelas(total);
        setCarregando(false);
      };

      carregarProgresso();
    }, [])
  );

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev < CATEGORIES.length - 1 ? prev + 1 : 0
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : CATEGORIES.length - 1
    );
  };

  const currentCategory = CATEGORIES[currentIndex];

  // Estrelas da fase atual (0 a 3)
  const estrelasAtual = estrelasMap[currentCategory.title] ?? 0;

  return (
    <SafeAreaView style={styles.container}>

      {/* ── Cabeçalho ── */}
      <View style={styles.header}>
        <ArrowLeft onPress={() => navigation.goBack()} />

        {/* Total de estrelas */}
        <View style={styles.scoreContainer}>
          <Text style={styles.starIcon}>⭐</Text>
          {carregando ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.scoreText}>{totalEstrelas}</Text>
          )}
        </View>
      </View>

      {/* ── Título ── */}
      <Text style={styles.title}>SELECIONE{'\n'}UMA FASE</Text>

      {/* ── Carrossel ── */}
      <View style={styles.selectorContainer}>
        <ArrowLeft onPress={handlePrev} />

        {/* Card da fase */}
        <View style={styles.categoryCard}>
          <Text
            style={[styles.categoryText, { fontSize: currentCategory.fontSize }]}
          >
            {currentCategory.title}
          </Text>
          <Text style={styles.cardStars}>
            {estrelasAtual > 0
              ? '⭐'.repeat(estrelasAtual)
              : '☆☆☆'}
          </Text>
        </View>

        <ArrowRight onPress={handleNext} />
      </View>

      {/* ── Botão Play (octágono SVG) ── */}
      <PlayOctagon
        onPress={() => navigation.navigate('Game', { category: currentCategory.title })}
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C19AFA',
    alignItems: 'center',
  },

  // ── Header ──
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  // scoreContainer segue as specs do Figma: 114x50, fundo #C874FF
  scoreContainer: {
    width: 114,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C874FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    gap: 6,
    elevation: 4,
  },
  starIcon: {
    fontSize: 20,
  },
  scoreText: {
    fontFamily: 'LuckiestGuy',
    fontSize: 22,
    color: '#FFFFFF',
  },

  // ── Título ──
  title: {
    fontFamily: 'LuckiestGuy',
    fontSize: 60,
    color: '#FFDE00',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 28,
    lineHeight: 68,
    // Simula -webkit-text-stroke: 1px #000 via sombras em 4 direções
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },

  // ── Carrossel ──
  // As setas usam SVG (65x65), o card usa dimensões fixas do Figma (212x94)
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  categoryCard: {
    width: 212,
    height: 94,
    backgroundColor: '#42D0A4',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    // Aproximação do box-shadow do Figma
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  categoryText: {
    fontFamily: 'LuckiestGuy',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
  },
  cardStars: {
    fontSize: 22,
    letterSpacing: 4,
  },
});

export default CategoryScreen;
