//Faz aparecer a quantidade de itens selecionada no select de quantidade de itens
const select = document.getElementById("quantidade");
const radios = document.getElementById("radios");

//Adiciona um ouvinte de evento para o select de quantidade de itens
select.addEventListener("change", function(){
    radios.innerHTML = "";//Limpa os checkbox anteriores
    const quantidade = Number(select.value);//Pega o valor do select e converte para número

    //Se a quantidade for 0 ele não mostra nenhum checkbox
    if(!quantidade){
        return;
    }

    //Cria os checkbox para a quantidade de itens selecionada
    for(let i = 1; i <= quantidade; i++){
        radios.innerHTML += `
        <label>
        <input type="checkbox" name="item">
        Item ${i}
        </label>`;
    }
});

import {especialidades} from "./const.js";

const input = document.getElementById("nome");
const sugestoes = document.getElementById("sugestoes");
const imagem = document.getElementById("imgEspecialidade");

//Adiciona ouvinte de evento para o campo de input que o usuario digita o nome das especialidade
input.addEventListener("input", function(){
    const valor = input.value.toLowerCase();//Pega o valor do input e converte para minusculo
    sugestoes.innerHTML = "";

    if(valor === ""){//Se o valor do input for vazio ele limpa 
        return;
    }

    //Filtra o texto e ve quais especialidades tem o texto digitado pelo usuario
    const resultados = especialidades.filter(item =>
        item.toLowerCase().includes(valor)
    );

    //Para cada especialidade encontrada ele cria uma div e adiciona um evento de click para preencher o input com o nome da especialidade e trocar a imagem
    resultados.forEach(item => {
        const div = document.createElement("div");//Cria a div para a especialidade encontrada
        div.textContent = item;//Adiciona o nome da especialidade na div

        //Adiciona a especialidade clicada no input e troca a imagem para a correspondente
        div.addEventListener("click", function(){
            input.value = item.replaceAll("-", " ");//Preenche o input com o nome da especialidade clicada sem o "-"
            sugestoes.innerHTML = "";
            //Procura a imagem correspondente a especialidade clicada e troca a imagem
            imagem.src = `../img/${item}.png`;
        });
        sugestoes.appendChild(div);//Adiciona a div da especialidade encontrada na div de sugestões
    });
});

//Adiciona um ouvinte de evento para o formulário que salva a especialidade digitada no localStorage
form.addEventListener("submit", function(event){
    //Impede que o navegador execute a ação padrão de um evento, como recarregar a página ao enviar um formulário.
    event.preventDefault();
    //Pega o valor do input do nome da especialidade
    const nome = document.getElementById("nome").value;
    //Cria um objeto novo
    const especialidade = {
        nome
    };
    //Pega os dados salvos no localStorage ou cria um array vazio se não houver dados salvos
    const dadosSalvos =
        JSON.parse(
            localStorage.getItem("especialidades")
        ) || [];

    //Adicinas novas especialidades ao array de dados salvos
    dadosSalvos.push(especialidade);
    //Salva de novo o array de dados salvos no localStorage, convertendo-o para uma string JSON
    localStorage.setItem(
        "especialidades",
        JSON.stringify(dadosSalvos)
    );
});

//Pega a div onde as especialidades salvas serão mostradas
dados.forEach(function(item){
    //Adiciona uma div para cada especialidade salva, mostrando o nome da especialidade
    lista.innerHTML += `
        <div class="card">
            <h2>${item.nome}</h2>
        </div>`;
});