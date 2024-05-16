const fs = require('fs');
const readline = require('readline');
const { Automaton } = require('./Automaton');
// import { Automaton, Transition } from './Automaton';
let automatonObj;
let optionType;

// Criar interface de leitura para ler do terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Limpa o terminal para facilitar a leitura por parte do usuário
const clearTerminal = () => {
  process.stdout.write('\x1Bc');
};

// Esta função é chamada quando algum erro ocorre para que o usuário escolha se deseja realizar o mesmo processo novamente ou sair do programa
const tryAgain = (callToFunction) => {
  console.log("\n\nDeseja enviar novamente?");
  console.log('1- Sim');
  console.log('0- Não');
  rl.question("\nDigite o número referente a resposta:\n", (option) => {
    switch (option) {
      case '1':
        // Limpa o terminal e realiza a chamada da função passada como argumento
        clearTerminal();
        callToFunction();
        break;
      case '0':
        // Finaliza o programa
        console.log("\nPrograma finalizado!");
        rl.close();
        break;
      default:
        // Limpa o terminal e chama a função tryAgain para o usuário escolher se pretende enviar uma nova resposta ou não
        clearTerminal();
        console.log("\nOpção inválida!");
        tryAgain(callToFunction);
        break;
    }
  });
}

// Função que define o tipo de autômato a ser criado e recebe o array de palavras como argumento
const handleTypeAutomaton = (strings) => {
  // Verificação realizada a partir da variável optionType. Seu valor é definido no início do programa
  switch (optionType) {
    case '1':
      // Cria o autômato finito determinístico
      automatonObj.createDFA(strings);
      break;
    case '2':
      // Cria o autômato finito não determinístico com movimentos vazios
      automatonObj.createENFA(strings);
      break;
  }
}

// Realiza a conversão do conteúdo do arquivo contendo as palavras em um array de strings
const stringsFile = () => {
  clearTerminal();
  rl.question("\nInsira o nome do arquivo txt:\n", (txtFileName) => {
    // Ler o conteúdo do arquivo txt
    fs.readFile(txtFileName, 'utf8', (err, txtString) => {
      try {
        if (!txtFileName.endsWith('.txt')) {
          clearTerminal();
          // Verifica se o arquivo possui a extensão txt
          console.log(`\nArquivo "${txtFileName}" inválido! O arquivo deve ter a extensão .txt.`);
          // Chamada da função tryAgain para o usuário decidir se deseja enviar um novo nome
          tryAgain(stringsFile);
          return;
        }
        const strings = txtString.split(/\s+|,|\r\n/).filter(word => word.trim() !== '');

        // Exibir o objeto JavaScript no console
        console.log(`\nConteúdo do arquivo ${txtFileName}:`);
        console.log(strings);
        // Chamando método da classe Automaton responsável por criar um AFD e verificar as palavras enviadas
        handleTypeAutomaton(strings);
        // Fechar a interface de leitura
        rl.close();
      } catch (error) {
        // Tratamento de erros

        clearTerminal();
        // Caso o arquivo possua a extensão .json, mas ainda ocorra um erro, essa será a mensagem exibida
        console.log(`\nArquivo "${txtFileName}" inválido!`);
        // Chamada da função tryAgain para o usuário decidir se deseja enviar um novo nome
        tryAgain(stringsFile);
      }
    });
  });
}

// Insere a palavra enviada via terminal ao array
const stringText = () => {
  clearTerminal();
  rl.question("\nInsira a palavra para verificação:\n", (palavra) => {
    // Aloca a palavra recebida como primeiro elemento do array
    // Deve ser enviada como array pois o método da classe Automaton realiza todo o procedimento através do array recebido
    let string = [palavra];

    // Chamando função para definir o tipo de autômato enviado
    handleTypeAutomaton(string);

    // Verificação se o usuário deseja enviar outra palavra
    tryAgain(stringText);
  });
}

// Solicitar ao usuário como as palavras serão enviadas para verificação
const handleOptionString = () => {
  console.log('\n\nComo deseja enviar a(s) palavra(s) para verificação?');
  console.log('1- Arquivo txt');
  console.log('2- Terminal');

  rl.question("\nDigite o número referente a resposta:\n", (option) => {
    // Chama a função responsável por cada método de envio de palavras
    switch (option) {
      case '1':
        // Envio das palavras através de um arquivo txt
        stringsFile();
        break;
      case '2':
        // Envio das palavras a partir do terminal
        stringText();
        break;
      default:
        console.log("\nOpção inválida!");
        // Chamada da função tryAgain para o usuário decidir se deseja enviar um novo valor
        tryAgain(handleOptionString);
        break;
    }
  });
}

// Criar o autômato e verifica se ele está definido corretamente
const createAndCheckAutomaton = (automaton) => {
  // Definindo as constantes com os valores do automato
  const alphabet = automaton.alfabeto;
  const states = automaton.estados;
  const initialState = automaton.estado_inicial;
  const endStates = automaton.estados_finais;
  const transitions = automaton.transicoes;

  // Criando autômato pela classe Automaton
  automatonObj = new Automaton(alphabet, states, initialState, endStates, transitions);
  // Verificando se o automato esta definido corretamente
  return automatonObj.checkFormat(optionType);
}

// Solicitar ao usuário que insira o nome do arquivo JSON
const handleJsonFile = () => {
  // Definindo o texto a ser exibido a partir do valor de optionType
  const typeAutomaton = optionType === '1' ? 'AFD' : 'AFN-&';

  rl.question(`\nInsira o nome do arquivo JSON contendo o ${typeAutomaton} em definição formal:\n`, (jsonFileName) => {
    // Ler o conteúdo do arquivo JSON
    fs.readFile(jsonFileName, 'utf8', (err, jsonString) => {
      try {
        if (!jsonFileName.endsWith('.json')) {
          clearTerminal();
          // Verifica se o arquivo possui a extensão json
          console.log(`\nArquivo "${jsonFileName}" inválido! O arquivo deve ter a extensão .json.`);
          // Chamada da função tryAgain para o usuário decidir se deseja enviar um novo nome
          tryAgain(handleJsonFile);
          return;
        }
        // Converter o JSON em objeto JavaScript
        const automaton = JSON.parse(jsonString);

        // Limpar o terminal e exibir o objeto do autômato
        clearTerminal();
        console.log("\nConteúdo do arquivo JSON recebido:\n");
        console.log(automaton);

        // Chamada para a função de criação e verificação do autômato
        const checkAutomaton = createAndCheckAutomaton(automaton);

        // Se a função de checagem do autômato retornar verdadeiro, a próxima função é chamada
        checkAutomaton
          // Chamada para a função relacionada a entrada das palavras 
          ? handleOptionString()
          // Caso contrario, chama a função tryAgain para o usuário decidir se deseja enviar um novo nome
          : tryAgain(handleJsonFile)

      } catch (error) {
        // Tratamento de erros
        clearTerminal();
        // Caso o arquivo possua a extensão .json, mas ainda ocorra um erro, essa será a mensagem exibida
        console.log(`\nArquivo "${jsonFileName}" inválido!`);
        // Chamada da função tryAgain para o usuário decidir se deseja enviar um novo nome
        tryAgain(handleJsonFile);

      }
    });
  });
}

// Função para definir qual o tipo de autômato será enviado a partir do arquivo json
const handleType = () => {
  console.log("\n\nQual tipo de autômato será enviado?");
  console.log('1- AFD');
  console.log('2- AFN-&');
  rl.question("\nDigite o número referente a resposta:\n", (option) => {
    // Verifica se o valor de option é aceito
    if (option === '1' || option === '2') {
      // Se sim, passa o valor para a variável OptionType que é utilizada posteriormente na criação do tipo de autômato
      optionType = option;
      // Limpa o terminal e chama função responsável pelo arquivo json
      clearTerminal();
      handleJsonFile();
    } else {
      // Senão, limpa o terminal e chama a função tryAgain para o usuário decidir se deseja enviar um novo valor
      console.log("\nOpção inválida!");
      clearTerminal();
      tryAgain(handleType);
    }
  });
}

// Iniciando programa
const startProgram = () => {
  // Exibir mensagens no console
  console.log("\nTrabalho Prático de Linguagens Formais e Autômatos\n");
  console.log("Rhuan Lucas Barbosa Fernandes");
  console.log("CEFET-MG/Leopoldina");

  // Chamada para a função responsável por definir o tipo de autômato
  handleType();
}
startProgram();