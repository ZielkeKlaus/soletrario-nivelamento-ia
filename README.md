# 🎯 Soletrário — Diagnóstico de Nivelamento com IA

Componente de **diagnóstico de nivelamento gramatical** do projeto **Soletrário**, um jogo/aplicativo mobile educativo com 5 fases de exercícios de gramática.

Este módulo utiliza um **Modelo de Linguagem (LLM)** via **OpenRouter** para avaliar as respostas do usuário a um mini-teste diagnóstico e **recomendar por qual fase ele deve começar**, identificando suas maiores dificuldades.

> Atividade prática da disciplina **Fundamentos de Inteligência Artificial** — Análise e Desenvolvimento de Sistemas (ADS).

---

## 🎮 Sobre o Soletrário

O Soletrário é um jogo mobile com **5 fases**, cada uma focada em um tema de gramática:

| Fase | Tema |
|------|------|
| 1 | Sílaba Tônica |
| 2 | R / RR |
| 3 | SS / Ç |
| 4 | CH / X |
| 5 | Acentuação |

Antes de iniciar o jogo, o usuário passa por um **diagnóstico inteligente** que identifica seu nível e indica o melhor ponto de partida.

---

## 🎯 Objetivo

Avaliar o conhecimento gramatical do usuário em 5 áreas e gerar um **relatório de nivelamento** com:

- Nível geral (Iniciante / Intermediário / Avançado)
- Desempenho em cada uma das 5 áreas
- **Fase recomendada para começar**
- Uma dica motivacional personalizada

---

## ⚙️ Como funciona

| Etapa | Descrição |
|-------|-----------|
| **Entrada** | O usuário responde a um mini-teste com perguntas das 5 áreas |
| **Processamento** | As respostas são enviadas a um LLM via OpenRouter, com um prompt de "avaliador pedagógico" |
| **Saída** | A IA retorna um diagnóstico estruturado com a fase recomendada |

---

## 🧠 Modelo utilizado

