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
        </label>
        `;
    }
});

//Importa a lista de especialidades do arquivo const.js
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
            imagem.src = `./img/${item}.png`;
        });
        sugestoes.appendChild(div);//Adiciona a div da especialidade encontrada na div de sugestões
    });
});

const form = document.getElementById("main");

//Adiciona um ouvinte de evento para o formulário que salva a especialidade digitada no localStorage
form.addEventListener("submit", function(event){
    event.preventDefault();

    //Pega o elemento que tem o id "nome"
    const nome = document.getElementById("nome").value;
    
    //Muda os itens marcados para nada
    const itensMarcados = [];
    
    //Pega todos os checkbox que tem o id "radios" e verifica quais estão marcados, se estiver marcado ele adiciona o nome do item na lista de itens marcados
    const checkboxes =
        document.querySelectorAll(
            '#radios input[type="checkbox"]'
        );

    //Para cada checkbox ele verifica se está marcado, se estiver marcado ele adiciona o nome do item na lista de itens marcados
    checkboxes.forEach(function(item, index){
        if(item.checked){//Se o item.checked for true ele adiciona o nome do item na lista de itens marcados
            itensMarcados.push(
                `Item ${index + 1}`
            );
        }
    });

    //Constante que guarda a especialidade com o nome, imagem, modalidade, ramo, quantidade, comentario e itens marcados
    const especialidade = {
        nome,
        imagem: imagem.src,
        modalidade:
            document.querySelectorAll("select")[0].value,
        ramo:
            document.querySelectorAll("select")[1].value,
        quantidade:
            document.getElementById("quantidade").value,
        comentario:
            document.querySelector("textarea").value,
        itensMarcados
    };

    //Constante que guarda os dados salvos no localStorage ou uma lista vazia caso não haja nenhum dado salvo
    const dadosSalvos =
        JSON.parse(
            localStorage.getItem("especialidades")
        ) || [];

    //Adiciona a especialidade criada na lista de dados salvos e salva no localStorage
    dadosSalvos.push(especialidade);

    //Salva a lista de dados salvos no localStorage como uma string JSON
    localStorage.setItem(
        "especialidades",
        JSON.stringify(dadosSalvos)
    );

    //Alerta que a especialidade foi salva com sucesso
    alert("Especialidade salva com sucesso!");
});