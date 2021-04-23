const urlBase = "https://opentdb.com";

const elementos = {
  telaInicial: document.getElementById("inicial"),
  telaJogo: document.getElementById("jogo"),
  divQuiz: document.querySelector(".quiz"),
  divRespostas: document.querySelector(".respostas"),
  divCat: document.querySelector(".cat"),
  divPontuacao: document.querySelector(".pontos"),
  divFim: document.querySelector(".div-fim"),
  categorias: document.querySelector("#categorias"),
  dificuldade: document.querySelector(".form-dificuldade"),
  botaoIniciarJogo: document.querySelector(".iniciar-jogo"),
  palavra: document.querySelector(".palavra"),
  botaoResponder: document.querySelector(".responder"),
  botaoAvancar: document.querySelector(".avancar"),
  btOpcao1: document.querySelector(".btOpcao1"),
  btOpcao2: document.querySelector(".btOpcao2"),
  btOpcao3: document.querySelector(".btOpcao3"),
  btOpcao4: document.querySelector(".btOpcao4"),
  btReiniciar: document.querySelector(".reiniciar"),
};

let categorias = [];
let idCategoria = "";
let categoria = "";

let jogo = {
  pergunta: undefined,
  respostas: [],
  respostaCerta: undefined,
  tipo: undefined,
};

let dificuldade = "";
let vezesJogadas = 0;
let acertos = 0;
let erros = 0;
let pontuacao = 0;

const resetar = () => {
  categorias = [];
  idCategoria = "";
  categoria = "";
  dificuldade = "";
  vezesJogadas = 0;
  acertos = 0;
  erros = 0;
  pontuacao = 0;
};

const telaInicial = () => {
  resetar();
  elementos.telaInicial.style.display = "flex";
  elementos.telaJogo.style.display = "none";
  elementos.divFim.style.display = "none";
  elementos.divPontuacao.textContent = pontuacao = 0;

  axios.get(`${urlBase}/api_category.php`).then((response) => {
    categorias = response.data.trivia_categories;
    elementos.categorias.innerHTML = `<option value="" selected>Categoria Aleatória</option>`;
    for (const categoria of categorias) {
      elementos.categorias.innerHTML += `<option>${categoria.name}</option>`;
    }
  });
};

const salvarDados = (funcao) => {
  if (elementos.categorias.textContent != "") {
    selectCat = document.querySelector("#form-categoria");
    for (let i = 0; i < categorias.length; i++) {
      if (categorias[i].name == selectCat.value) {
        categoria = categorias[i].name;
        idCategoria = `${categorias[i].id}`;
      }
    }
  }

  dificuldade = elementos.dificuldade.value;
  
  axios
    .get(
      `${urlBase}/api.php?amount=1&category=${idCategoria}&difficulty=${dificuldade}`
    )
    .then((response) => {
      funcao(response.data);
    });
};

const novoJogo = () => {
  elementos.telaInicial.style.display = "none";
  elementos.telaJogo.style.display = "flex";
  elementos.divFim.style.display = "none";

  proximaPergunta();
};

const proximaPergunta = () => {
  salvarDados((questao) => {
    mostrarPergunta(questao.results);
  });
};

elementos.botaoIniciarJogo.addEventListener("click", () => {
  novoJogo();
});

elementos.botaoResponder.addEventListener("click", () => {
  if (elementos.btOpcao1.classList.contains("isSelected") ||
    elementos.btOpcao2.classList.contains("isSelected") ||
    elementos.btOpcao3.classList.contains("isSelected") ||
    elementos.btOpcao4.classList.contains("isSelected")) {
    
    elementos.botaoResponder.style.display = "none";
    elementos.botaoAvancar.style.display = "flex";
    
    mostrarFeedBack();
    verificarRespostas();
    vezesJogadas++;
  }
});

elementos.botaoAvancar.addEventListener("click", () => {
  elementos.btOpcao1.classList.remove("isSelected");
  elementos.btOpcao2.classList.remove("isSelected");
  elementos.btOpcao3.classList.remove("isSelected");
  elementos.btOpcao4.classList.remove("isSelected");
  
  elementos.botaoAvancar.style.display = "none";
  elementos.botaoResponder.style.display = 'flex';
  
  proximaPergunta();
});

const mostrarFeedBack = () => {
  for (let i = 0; i < jogo.respostas.length; i++) {
    if(jogo.respostas[i] == jogo.respostaCerta){
      if(i == 0){
        elementos.btOpcao1.classList.add('certo');
      }
      else if(i == 1){
        elementos.btOpcao2.classList.add('certo');
      }
      else if(i == 2){
        elementos.btOpcao3.classList.add('certo');
      }
      else if(i == 3){
        elementos.btOpcao4.classList.add('certo');
      }
    }
    else {
      if(i == 0){
        elementos.btOpcao1.classList.add('errado');
      }
      else if(i == 1){
        elementos.btOpcao2.classList.add('errado');
      }
      else if(i == 2){
        elementos.btOpcao3.classList.add('errado');    
      }
      else if(i == 3){
        elementos.btOpcao4.classList.add('errado');
      }
    }
  }
};

const verificarRespostas = () => {
  if (elementos.btOpcao1.classList.contains("isSelected") && elementos.btOpcao1.textContent == jogo.respostaCerta) {
    definirPontos();
  } 
  else if (elementos.btOpcao2.classList.contains("isSelected") && elementos.btOpcao2.textContent == jogo.respostaCerta) {
    definirPontos();
  } 
  else if (elementos.btOpcao3.classList.contains("isSelected") && elementos.btOpcao3.textContent == jogo.respostaCerta) {
    definirPontos();
  } 
  else if (elementos.btOpcao4.classList.contains("isSelected") && elementos.btOpcao4.textContent == jogo.respostaCerta) {
    definirPontos();
  }
  else {
    erros++;
    if (dificuldade === "easy") {
      pontuacao -= 5;
      elementos.divPontuacao.textContent = pontuacao;
    }
    else if (dificuldade === "medium") {
      pontuacao -= 8;
      elementos.divPontuacao.textContent = pontuacao;
    }
    else if (dificuldade === "hard") {
      pontuacao -= 10;
      elementos.divPontuacao.textContent = pontuacao;
    }

  }
};

const definirPontos = () => {
  if (dificuldade === "easy") {
    pontuacao += 5;
  }
  else if (dificuldade === "medium") {
    pontuacao += 8;
  }
  else if (dificuldade === "hard") {
    pontuacao += 10;
  }

  elementos.divPontuacao.textContent = pontuacao;
}

const mostrarPergunta = (questoes) => {
  if (vezesJogadas <= 10 && erros < 3) {
    for (const questao of questoes) {
      elementos.btOpcao1.disabled = false;
      elementos.btOpcao2.disabled = false;
      elementos.btOpcao3.disabled = false;
      elementos.btOpcao4.disabled = false;
      elementos.btOpcao1.classList.remove('certo');
      elementos.btOpcao1.classList.remove('errado');
      elementos.btOpcao2.classList.remove('certo');
      elementos.btOpcao2.classList.remove('errado');
      elementos.btOpcao3.classList.remove('certo');
      elementos.btOpcao3.classList.remove('errado');
      elementos.btOpcao4.classList.remove('certo');
      elementos.btOpcao4.classList.remove('errado');
      
      categoria = questao.category; 
      jogo.pergunta = questao.question;
      jogo.tipo = questao.type;
      jogo.respostas = questao.incorrect_answers.concat(questao.correct_answer);
      jogo.respostaCerta = questao.correct_answer;
      jogo.respostas.sort();

      if (jogo.tipo === "boolean") {
        elementos.btOpcao3.style.display = "none";
        elementos.btOpcao4.style.display = "none";
      } else if (jogo.tipo === "multiple") {
        elementos.btOpcao3.style.display = "flex";
        elementos.btOpcao4.style.display = "flex";
      }

      elementos.divQuiz.innerHTML = jogo.pergunta;
      elementos.btOpcao1.textContent = jogo.respostas[0];
      elementos.btOpcao2.textContent = jogo.respostas[1];
      elementos.btOpcao3.textContent = jogo.respostas[2];
      elementos.btOpcao4.textContent = jogo.respostas[3];
    }
  }
  if (vezesJogadas == 10 && erros < 3) {
    elementos.telaInicial.style.display = "none";
    elementos.telaJogo.style.display = "none";
    elementos.divFim.style.display = "flex";
    elementos.btReiniciar.style.display = "flex";

    if (idCategoria == 0) {
      categoria = 'Aleatória'
    }

    elementos.divFim.innerHTML += 
    `<h1>Parabéns Você Ganhou</h1>
     <h2>Estatísticas:<h2>
     <div>Pontuação: ${pontuacao}</div>
     <div>Perguntas Respondidas: ${vezesJogadas}</div> 
     <div>Dificuldade: ${dificuldade}</div>
     <div>Categoria: ${categoria}</div>
    `
  }

  else if (erros == 3){
    elementos.telaInicial.style.display = "none";
    elementos.telaJogo.style.display = "none";
    elementos.divFim.style.display = "flex";
    elementos.btReiniciar.style.display = "flex";

    if (idCategoria == 0) {
      categoria = 'Aleatória'
    }

    elementos.divFim.innerHTML += 
    `<h1>Game Over</h1>
     <h2>Estatísticas:<h2>
     <div>Pontuação: ${pontuacao}</div>
     <div>Perguntas Respondidas: ${vezesJogadas}</div> 
     <div>Dificuldade: ${dificuldade}</div>
     <div>Categoria: ${categoria}</div>
    `
  }  

};

elementos.btOpcao1.addEventListener('click', () => {
  elementos.btOpcao1.classList.remove('isSelected');
  elementos.btOpcao2.classList.remove('isSelected');
  elementos.btOpcao3.classList.remove('isSelected');
  elementos.btOpcao4.classList.remove('isSelected');
  
  elementos.btOpcao1.classList.add('isSelected');
});

elementos.btOpcao2.addEventListener('click', () => {
  elementos.btOpcao1.classList.remove('isSelected');
  elementos.btOpcao2.classList.remove('isSelected');
  elementos.btOpcao3.classList.remove('isSelected');
  elementos.btOpcao4.classList.remove('isSelected');
  
  elementos.btOpcao2.classList.add('isSelected');
});

elementos.btOpcao3.addEventListener('click', () => {
  elementos.btOpcao1.classList.remove('isSelected');
  elementos.btOpcao2.classList.remove('isSelected');
  elementos.btOpcao3.classList.remove('isSelected');
  elementos.btOpcao4.classList.remove('isSelected');
  
  elementos.btOpcao3.classList.add('isSelected');
});

elementos.btOpcao4.addEventListener('click', () => {
  elementos.btOpcao1.classList.remove('isSelected');
  elementos.btOpcao2.classList.remove('isSelected');
  elementos.btOpcao3.classList.remove('isSelected');
  elementos.btOpcao4.classList.remove('isSelected');
  
  elementos.btOpcao4.classList.add('isSelected');
});

elementos.btReiniciar.addEventListener('click', () => {
  telaInicial();
  elementos.btReiniciar.style.display = "none";

  elementos.divFim.innerHTML = '';
});

telaInicial();