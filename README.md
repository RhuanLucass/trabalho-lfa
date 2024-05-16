# Manual de Utilização - Simulador de Autômatos Finitos

Aluno: **Rhuan Lucas Barbosa Fernandes**  
Professor: **Eduardo G. R. Miranda**  
Trabalho realizado para a disciplina de Linguagens Formais e Autômatos de Engenharia de Computação (CEFET/MG - Leopoldina).

Este é um programa desenvolvido em JavaScript/Node.js para simulação de autômatos finitos determinísticos (AFDs) e autômatos finitos não determinísticos com movimentos vazios (AFN-λ).

## Requisitos

- [Node.js](https://nodejs.org/en/download/) instalado na sua máquina.

## Como Executar

Para executar o programa, siga as instruções abaixo:

1. No terminal, navegue até o diretório do projeto.

2. Execute o comando:

```bash
node scripts.js
```

3. Siga as instruções exibidas no terminal para interagir com o programa.

## Funcionalidades

O programa oferece as seguintes funcionalidades:

- Possibilidade de especificação de AFDs e AFNs-λ através de definições formais em arquivos JSON.
- Verificação se palavras são aceitas ou não pelos autômatos.

## Como Especificar Autômatos em Arquivos JSON

Para especificar um autômato em um arquivo JSON, siga a estrutura abaixo:

```json
{
  "alfabeto": ["a", "b"],
  "estados": ["q1", "q2", "q3", "qf1"],
  "estado_inicial": "q1",
  "estados_finais": ["qf1"],
  "transicoes": [ ["q1", "a", "q1"],
    ["q1", "b", "q1"],
    ["q1", "&", "q2"],
    ["q2", "b", "q3"],
    ["q3", "b", "qf1"]
  ]
}
```

- "alfabeto": Lista de símbolos do alfabeto.
- "estados": Lista de estados do autômato.
- "estado_inicial": Estado inicial do autômato.
- "estados_finais": Lista de estados finais do autômato.
- "transicoes": Lista de transições no formato `[estado_atual, símbolo, próximo_estado]`.

## Como Especificar as Palavras em Arquivos txt

As palavras no arquivo .txt podem ser especificadas de três maneiras:
1. Separadas por espaço:

```txt
ab aa abab
```

2. Separadas por vírgula:

```txt
ab, aa, abab
```

3. Separadas por quebra de linha:

```txt
ab
aa
abab
```

## Como Utilizar o Programa

Ao executar o script, você será guiado pelas seguintes etapas:

1. Escolha se deseja simular um AFD ou um AFN-&.
2. Envie o nome ou diretório do arquivo .json contendo a definição formal do autômato especificado anteriormente.
3. Selecione como deseja enviar as palavras para verificação:
   3.1. **Através de arquivo .txt:** envie o nome ou diretório do arquivo .txt.
   3.2. **Via terminal:** digite a palavra para ser verificada.
       3.2.1. No envio via terminal é realizado o tratamento de apenas uma palavra por vez, podendo enviar outra após a verificação.
4. Aguarde o resultado da verificação para cada palavra.

**Obs.:** Em todas as etapas é possível decidir se deseja enviar novamente a resposta caso ocorra de realizar o envio inválido.

No diretório do programa encontram-se dois arquivos .json, ambos contendo exemplos de autômatos referentes ao nome do arquivo, e dois arquivos .txt, cada um contendo palavras para serem testadas em seus respectivos autômatos.
