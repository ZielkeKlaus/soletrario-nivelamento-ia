export const Colors = {
  // ===== CORES QUE VOCÊ JÁ TINHA (mantidas) =====
  background: '#C19AFA',      // Roxo claro (fundo Home/Category)
  white: '#FFFFFF',
  actionButton: '#28E13B',    // Verde (botão play gigante)
  border: '#4B0082',          // Roxo escuro para sombra/borda

  // ===== NOVAS CORES (extraídas das suas telas reais) =====
  gameBackground: '#7B2CBF',  // Roxo escuro (fundo da GameScreen)
  questionBox: '#A66A38',     // Marrom (caixa de imagem/pergunta)
  categoryBox: '#42D0A4',     // Verde-água (card categoria / palavra)
  primary: '#FFDE00',         // Amarelo (botões de opção / destaques)
  secondary: '#42D0A4',       // Verde-água (botões secundários)
  orange: '#FF9F00',          // Laranja (botões de sílaba tônica)
  purpleCard: '#C874FF',      // Roxo do contador de placar
  text: '#000000',            // Texto escuro padrão

  // ===== CORES PARA O FEEDBACK DO NICO (vamos usar no Passo 4) =====
  correct: '#42D0A4',         // Verde = acertou
  wrong: '#FF5C5C',           // Vermelho suave = errou
  yellowDark: '#EED200',      // Amarelo escuro (ícone do placar)
};

export const Fonts = {
  // ===== ATUALIZADO: agora aponta pras fontes reais que o App.js carrega =====
  titles: 'LuckiestGuy',  // Fonte dos títulos grandes (era 'System')
  body: 'LilitaOne',      // Fonte dos textos/botões (era 'System')

  // Aliases extras (caso algum componente use outro nome)
  content: 'LilitaOne',   // NicoFeedback usava 'Fonts.content'
};

// ===== MÉTRICAS (mantidas, sem alterações) =====
export const Metrics = {
  borderRadius: 20,
  borderWidth: 3,
};