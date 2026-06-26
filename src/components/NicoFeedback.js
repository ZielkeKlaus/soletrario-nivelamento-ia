import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Colors, Fonts } from '../styles/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const PANEL_HEIGHT     = 320;
const PANEL_MAX_HEIGHT = 420; // ✅ novo

const NICO_SIZE           = 160;
const NICO_VISIBLE_HEIGHT = 110;

const NicoFeedback = ({ visible, message, isCorrect = false, onClose }) => {
  const translateY = useRef(new Animated.Value(PANEL_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 6,
        speed: 14,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: PANEL_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const panelColor  = isCorrect ? '#27AE60' : '#E74C3C';
  const buttonColor = isCorrect ? '#1E8449' : '#C0392B';
  const labelText   = isCorrect ? '✓  Correto!' : '✗  Errado!';

  const nicoSource = isCorrect
    ? require('../../assets/images/nico_normal.png')
    : require('../../assets/images/nico_pensativo.png');

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      statusBarTranslucent={true}
    >
      <View style={styles.overlay} pointerEvents="none" />

      <Animated.View
        style={[styles.nicoWrapper, { transform: [{ translateY }] }]}
        pointerEvents="none"
      >
        <Image
          source={nicoSource}
          style={styles.nicoImage}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.panel,
          { backgroundColor: panelColor },
          { transform: [{ translateY }] },
        ]}
      >
        <Text style={styles.labelText}>{labelText}</Text>

        <View style={styles.divider} />

        <Text style={styles.hintTitle}>Dica do Nico:</Text>

        {/* ✅ Sem numberOfLines — texto completo */}
        <Text style={styles.hintText}>{message}</Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: buttonColor }]}
          onPress={onClose}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>CONTINUAR</Text>
        </TouchableOpacity>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  nicoWrapper: {
    position: 'absolute',
    bottom: PANEL_HEIGHT - NICO_VISIBLE_HEIGHT,
    right: 16,
    zIndex: 10,
    overflow: 'hidden',
    width: NICO_SIZE,
    height: NICO_VISIBLE_HEIGHT,
  },
  nicoImage: {
    width: NICO_SIZE,
    height: NICO_SIZE,
  },

  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: PANEL_HEIGHT,      // ✅ altura mínima
    maxHeight: PANEL_MAX_HEIGHT,  // ✅ altura máxima
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 30,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  labelText: {
    fontFamily: Fonts.titles,
    fontSize: 28,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  divider: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.35)',
    marginBottom: 12,
  },
  hintTitle: {
    fontFamily: Fonts.titles,
    fontSize: 16,
    color: 'rgba(255,255,255,0.80)',
    marginBottom: 4,
  },
  hintText: {
    fontFamily: Fonts.content,
    fontSize: 17,
    color: '#FFFFFF',
    lineHeight: 23,
    flexShrink: 1,   // ✅ encolhe sem cortar
    flexWrap: 'wrap', // ✅ quebra de linha garantida
    marginBottom: 8,  // ✅ respiro antes do botão
  },
  button: {
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.20)',
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    fontFamily: Fonts.titles,
    fontSize: 20,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
});

export default NicoFeedback;
