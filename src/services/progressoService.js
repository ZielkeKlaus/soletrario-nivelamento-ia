// src/services/progressoService.js
import { db } from '../firebase';
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
} from 'firebase/firestore';

// ─────────────────────────────────────────────
// Salva o progresso de uma fase no Firestore.
// Só atualiza se a nova pontuação de estrelas
// for MAIOR que o recorde anterior.
// ─────────────────────────────────────────────
// Firestore não aceita "/" em IDs de documento (ex: "SS/Ç" viraria 2 segmentos)
// Esta função substitui "/" por "_" para criar um ID válido
const sanitizarTema = (tema) => tema.replace(/\//g, '_');

export const salvarProgresso = async (uid, tema, estrelas) => {
  try {
    const temaId = sanitizarTema(tema);
    // Caminho: usuarios/{uid}/progresso/{temaId}
    const docRef = doc(db, 'usuarios', uid, 'progresso', temaId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const dadosAtuais = docSnap.data();

      // Só salva se for um novo recorde
      if (estrelas <= dadosAtuais.estrelas) {
        console.log(`Progresso de "${tema}" nao atualizado (recorde atual: ${dadosAtuais.estrelas} estrelas)`);
        return;
      }
    }

    await setDoc(docRef, {
      tema,
      estrelas,
      atualizadoEm: new Date().toISOString(),
    });

    console.log(`Progresso salvo: "${tema}" -> ${estrelas} estrelas`);
  } catch (error) {
    console.error('Erro ao salvar progresso:', error);
  }
};

// ─────────────────────────────────────────────
// Busca o progresso de UMA fase específica.
// Retorna { estrelas: number } ou { estrelas: 0 }
// ─────────────────────────────────────────────
export const buscarProgressoTema = async (uid, tema) => {
  try {
    const temaId = sanitizarTema(tema);
    const docRef = doc(db, 'usuarios', uid, 'progresso', temaId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data(); // { tema, estrelas, atualizadoEm }
    }

    return { estrelas: 0 }; // Fase ainda não jogada
  } catch (error) {
    console.error('Erro ao buscar progresso do tema:', error);
    return { estrelas: 0 };
  }
};

// ─────────────────────────────────────────────
// Busca o TOTAL de estrelas somando todas as fases.
// Retorna um número inteiro (ex: 7)
// ─────────────────────────────────────────────
export const buscarTotalEstrelas = async (uid) => {
  try {
    const progressoRef = collection(db, 'usuarios', uid, 'progresso');
    const snapshot = await getDocs(progressoRef);

    let total = 0;
    snapshot.forEach((docSnap) => {
      total += docSnap.data().estrelas || 0;
    });

    console.log(`Total de estrelas do usuario: ${total}`);
    return total;
  } catch (error) {
    console.error('Erro ao buscar total de estrelas:', error);
    return 0;
  }
};
