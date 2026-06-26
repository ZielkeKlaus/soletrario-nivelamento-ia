import questoes from '../database/questoes.json';

// Embaralha também as opções para não fixar a posição da resposta certa
const embaralharArray = (array) => [...array].sort(() => Math.random() - 0.5);

// Mapeia o título exibido na CategoryScreen para o valor de "tema" no questoes.json
// (os dois precisam estar em sincronia para que a filtragem funcione)
const TEMA_MAP = {
  'X/CH':          'X/CH',
  'ACENTUAÇÃO':    'Acentuação',
  'SÍLABA TÔNICA': 'Sílaba Tônica',
  'R/RR':          'R ou RR',
  'SS/Ç':          'SS ou Ç',
};

export const getQuestoesPorTema = (tema) => {
  const temaJson = TEMA_MAP[tema] ?? tema; // fallback: usa o valor original
  const filtradas = questoes.filter(q => q.tema === temaJson);
  // Embaralha as questões E as opções de cada uma
  return embaralharArray(filtradas).map(q => ({
    ...q,
    opcoes: embaralharArray(q.opcoes),
  }));
};

// Retorna N questões aleatórias misturadas de todos os temas
export const getQuestoesMistas = (quantidade = 20) => {
  return embaralharArray(questoes)
    .slice(0, quantidade)
    .map(q => ({ ...q, opcoes: embaralharArray(q.opcoes) }));
};

export const validarResposta = (questao, respostaUsuario) => {
  if (respostaUsuario === questao.res_correta) {
    return {
      acertou: true,
      mensagem: 'Mandou bem! O Nico esta orgulhoso!',
    };
  } else {
    return {
      acertou: false,
      mensagem: questao.dica_nico,
    };
  }
};
