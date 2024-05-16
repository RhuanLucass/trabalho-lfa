class Automaton {
  // Construtor para receber o automato
  constructor(alphabet, states, initialState, endStates, transitions) {
    this.alphabet = alphabet;
    this.states = states;
    this.initialState = initialState;
    this.endStates = endStates;
    this.transitions = transitions;
  }

  // Verifica se o automato foi enviado corretamente
  checkFormat(optionType) {
    // Se o estado inicial pertence a estados
    if (!this.states.includes(this.initialState)) {
      console.log("Estado inicial nao está na lista de estados!");
      console.log("Por favor, corrija seu autômato.");
      return false;
    }

    // Se os estados finais pertencem a estados
    for (const endState of this.endStates) {
      if (!this.states.includes(endState)) {
        console.log(`Estado final ${endState} não está na lista de estados!`);
        console.log("Por favor, corrija seu autômato.");
        return false;
      }
    }

    // Se os elementos das transições pertencem ao autômato
    for (const transition of this.transitions) {
      if (!this.states.includes(transition[0])) {
        console.log(`\nEstado "${transition[0]}" em uma transição não está na lista de estados.`);
        console.log("Por favor, corrija seu autômato.");
        return false;
      }
      if (!this.alphabet.includes(transition[1]) && transition[1] !== "&") {
        console.log(`\nSímbolo "${transition[1]}" em uma transição não está no alfabeto.`);
        console.log("Por favor, corrija seu autômato.");
        return false;
      }
      if (!this.states.includes(transition[2])) {
        console.log(`\nPróximo estado "${transition[2]}" em uma transição não está na lista de estados.`);
        console.log("Por favor, corrija seu autômato.");
        return false;
      }
    }

    // Verifica se está sendo passado um AFN enquanto foi selecionado um AFD
    if (this.transitions.some(transition => transition[1] === "&") && optionType === '1') {
      console.log("\nAutômato inválido. Este é um AFN-& e deve ser enviado um AFD!.");
      return false;
    }
    // else if(!this.transitions.some(transition => transition[1] === "&") && optionType === '2'){
    //   console.log("\nAutômato inválido. Este é um AFD e deve ser enviado um AFN-&!.");
    //   return false;
    // }
    console.log("\nAutômato definido corretamente!");
    return true;
  }

  // Método para criar a lógica de um AFD e retornar se a as palavras são aceitas ou não
  createDFA(strings) {
    // Como é passado um array de palavras, é necessário analisar uma por vez
    strings.forEach(string => {
      // Inicializa os estados atuais com o estado inicial
      let currentState = [this.initialState];
      // Estrutura de repetição para percorrer todos os caracteres da palavra
      for (const symbol of string) {
        // Filtragem realizada para selecionar apenas as transições onde o símbolo atual e o estado atual coincidem em conjunto
        const potentialTransitions = this.transitions.filter(transition => transition[0] === currentState[0] && transition[1] === symbol);

        if (potentialTransitions.length === 0) {
          // Se não existir nenhum possível transição, retorna false para sair do loop
          return false;
        }
        // Se existir uma transição, o estado atual recebe o próximo estado referente a essa transição
        currentState = [potentialTransitions[0][2]];
      }

      // Após chegar no último estado, é verificado se ele pertence ao array de estados finais
      const endState = this.#verifyEndStates(currentState);
      // Imprime no terminal se a palavra é aceita ou não pelo autômato
      console.log(`\nPalavra "${string}": ${endState ? 'ACEITA!' : 'RECUSADA!'}`);
    });
  }

  createENFA(strings) {
    // Estrutura de repetição para percorrer o array de palavras
    strings.forEach(string => {
      // Inicializa os estados atuais com o estado inicial verificando se existe alguma transição vazia e tratando-as
      let currentStates = this.#eClosure([this.initialState]);
      // Inicializa a variável de estado final como falso
      let endState = false; 

      // Loop percorrendo cada símbolo na palavra
      for (const symbol of string) {
        // Inicializa os próximos estados
        let nextStates = [];

        // Para cada estado atual e símbolo, encontra as próximas transições
        currentStates.forEach(state => {
          // Filtra as transições que correspondem ao estado atual e ao símbolo atual
          const transitions = this.transitions.filter(transition => transition[0] === state && transition[1] === symbol);
          // Adiciona os próximos estados das transições ao array de próximos estados
          transitions.forEach(transition => {
            nextStates.push(transition[2]);
          });
        });

        // Calcula os movimentos vazios para os próximos estados
        nextStates = this.#eClosure(nextStates);
        // Atualiza os estados atuais com os próximos estados
        currentStates = nextStates;

        // Se não houver mais estados atuais, a palavra é recusada
        if (currentStates.length === 0) {
          endState = false;
          break;
        }
      }

      // Verifica se algum dos estados atuais é um estado final
      endState = this.#verifyEndStates(currentStates);

      // Imprime se a palavra é aceita ou recusada
      console.log(`\nPalavra "${string}": ${endState ? 'ACEITA!' : 'RECUSADA!'}`);
    });
  }

  // Método privado que realiza os movimentos vazios do AFN
  #eClosure(states) {
    // Inicializa arrayEClosure com uma cópia dos estados
    let arrayEClosure = [...states]; 
    // Cria um conjunto para rastrear os estados visitados
    let visitedStates = new Set(arrayEClosure); 

    // Função recursiva para calcular os movimentos vazios
    const calculateEClosure = (currentState) => {
      // Filtra as transições que correspondem ao estado atual e com movimento vazio
      let eTransitions = this.transitions.filter(transition => transition[0] === currentState && transition[1] === "&");
      // Loop para percorrer todos as transições possíveis
      eTransitions.forEach(eTransition => {
        // Adiciona o próximo estado ao arrayEClosure se ainda não foi visitado
        if (!visitedStates.has(eTransition[2])) {
          arrayEClosure.push(eTransition[2]);
          visitedStates.add(eTransition[2]);
          // Chama recursivamente calculateEClosure para o próximo estado
          calculateEClosure(eTransition[2]);
        }
      });
    };

    // Chama calculateEClosure para cada estado inicial
    arrayEClosure.forEach(state => calculateEClosure(state));

    // Retorna o fecho-ε calculado
    return arrayEClosure;
  }

  // Método privado para analisar se algum dos estados enviados correspondem ao array de estados finais
  #verifyEndStates(currentStates) {
    // Verifica se existe conteúdo no array
    if (currentStates === null) {
      return false;
    }
    // Inicializa como falso a variável boolena que representa se algum estado coincide
    let foundEndState = false;

    // Loop para percorrer o array de estados recebido
    currentStates.forEach(state => {
      // Verifica se o array de estados finais inclui o estado atual
      if (this.endStates.includes(state)) {
        // Se sim, a variável recebe verdadeiro
        foundEndState = true;
      }
    })

    // Retorna o booleano indicando de há algum estado em comum ou não
    return foundEndState;
  }
}

// Exportando a classe
module.exports = { Automaton };