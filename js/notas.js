//Pega o elemento HTML com o id "lista" e armazena na constante lista
const lista = document.getElementById("lista");
//Pega o elemento HTML com o id "lista" e armazena na constante painelDetalhes
const painelDetalhes = document.getElementById("painelDetalhes");

//Tenta obter a lista de especialidades do localStorage, se não existir, inicializa como um array vazio
let especialidades = JSON.parse(localStorage.getItem("especialidades")) || [];

//Função para mostrar um placeholder quando não houver especialidades salvas
function mostraPlaceholder() {
    //Limpa o painel e mostra uma mensagem falando que o usuário deve clicar em uma especialidade para ver os detalhes
    painelDetalhes.innerHTML = `
        <div class="placeholder">
            Clique em uma especialidade para ver os detalhes aqui.
        </div>
    `;
}

//Função para renderizar os detalhes de uma especialidade selecionada
function renderizarDetalhes(item, index) {
    //Adiciona os elementos html para mostrar os detalhes da especialidade
    painelDetalhes.innerHTML = `
        <h2>${item.nome}</h2>
        <img src="${item.imagem || "../img/especialidade.png"}" alt="Imagem da especialidade">
        <p><span class="titulo">Modalidade:</span> ${item.modalidade || "Não informado"}</p>
        <p><span class="titulo">Ramo:</span> ${item.ramo || "Não informado"}</p>
        <p><span class="titulo">Quantidade:</span> ${item.quantidade || "Não informado"}</p>
        <div class="itens-feitos">
            <p><span class="titulo">Itens feitos:</span></p>
            <div class="itens-view">${item.itensMarcados?.join(', ') || 'Nenhum'}</div>
            <button class="editar">Editar itens</button>
            <div class="itens-edit" style="display:none;">
                <div class="itens-checklist"></div>
                <div class="itens-add">
                    <input class="add-text" placeholder="Adicionar item extra">
                    <button class="add-btn">Adicionar</button>
                </div>
                <div class="acoes-itens">
                    <button class="marcar-todos">Marcar todos</button>
                    <button class="desmarcar-todos">Desmarcar todos</button>
                    <button class="salvar-itens">Salvar alterações</button>
                    <button class="cancelar-itens">Cancelar</button>
                </div>
            </div>
        </div>
        <p><span class="titulo">Comentário:</span> ${item.comentario || "Nenhum comentário"}</p>
        <button class="deletar">Deletar Especialidade</button>
    `;

    //Pega os elementos com class deletar e armazena na const botaoDeletar
    const botaoDeletar = painelDetalhes.querySelector(".deletar");
    //Adiciona um ouvinte de evento com função
    botaoDeletar.addEventListener("click", function() {
        especialidades.splice(index, 1);//Remove a especialidade do array
        localStorage.setItem("especialidades", JSON.stringify(especialidades));//Atualiza o localStorage com a nova lista de especialidades
        renderizarLista();//Renderiza a lista
        //Se não tem nenhuma especialidade no array, chama o mostraPlaceholder 
        if (especialidades.length === 0){
            mostraPlaceholder();
        }
    });

    //Pega os elementos com as classes e armazena nas constantes correspondentes
    const view = painelDetalhes.querySelector('.itens-view');
    const editBox = painelDetalhes.querySelector('.itens-edit');
    const checklist = painelDetalhes.querySelector('.itens-checklist');
    const btnSalvar = painelDetalhes.querySelector('.salvar-itens');
    const btnCancelar = painelDetalhes.querySelector('.cancelar-itens');
    const btnMarcarTodos = painelDetalhes.querySelector('.marcar-todos');
    const btnDesmarcarTodos = painelDetalhes.querySelector('.desmarcar-todos');
    const btnEditar = painelDetalhes.querySelector('.editar');
    const addText = painelDetalhes.querySelector('.add-text');
    const addBtn = painelDetalhes.querySelector('.add-btn');

    //Adiciona um ouvinte de evento para o botão de editar
    btnEditar.addEventListener('click', function() {
        //Verifica se a caixa de edição está oculta ou não, e alterna a visibilidade
        const isHidden = editBox.style.display === 'none';
        //Se isHidden for true, mostra a caixa(block), senão esconde(none)
        editBox.style.display = isHidden ? 'block' : 'none';
        //Altera o texto do botão de editar dependendo do estado da caixa de edição
        btnEditar.textContent = isHidden ? 'Fechar edição' : 'Editar itens';
        //Se a caixa de edição foi aberta, atualiza o checklist para mostrar os itens atuais
        if (isHidden){
            atualizarChecklist();
        }
    });

    //Tenta converter a quantidade para número, se não for possível, usa 0 como valor padrão
    const quantidade = Number(item.quantidade) || 0;
    //Cria um array de labels padrão com base na quantidade informada, ou vazio se quantidade for inválida
    const defaultLabels = Array.from({ length: quantidade }, (_, i) => `Item ${i + 1}`);

    //Função para criar uma linha do checklist, recebe o texto do item, se deve estar marcado e se é um item personalizado
    function criarLinha(text, checked = false, isCustom = false) {
        const row = document.createElement('div');//Cria um elemento div para a linha do checklist
        row.classList.add('item-row');//Adiciona a classe item-row para estilização
        //Define o conteúdo HTML da linha, incluindo um checkbox e um botão de remover se for um item personalizado
        row.innerHTML = `
            <label class="row-label">
                <input type="checkbox" class="item-checkbox" data-label="${text.replace(/"/g, '&quot;')}" ${checked ? 'checked' : ''}>
                <span class="item-label-text">${text}</span>
            </label>
            //Se isCustom for true, adiciona um botão de remover, senão deixa vazio
            ${isCustom ? '<button class="row-delete">Remover</button>' : ''}
        `;
        //Se for um item personalizado, adiciona um ouvinte de evento para o botão de remover, que remove a linha do checklist quando clicado
        const del = row.querySelector('.row-delete');
        if (del) {
            del.addEventListener('click', function() {
                row.remove();
            });
        }
        return row;//Retorna a linha criada para ser adicionada ao checklist
    }

    //Função para atualizar o checklist, limpa o conteúdo atual e recria as linhas com base nos itens marcados e nos labels padrão
    function atualizarChecklist() {
        checklist.innerHTML = '';
        //Pega os itens marcados atuais do item, ou um array vazio se não existir, e cria um Set para facilitar a verificação de quais itens estão marcados
        const currentItems = item.itensMarcados || [];
        //Cria um Set com os itens marcados atuais para facilitar a verificação de quais itens estão marcados
        const currentSet = new Set(currentItems);
        //Cria um array de labels personalizados filtrando os itens marcados que não estão nos labels padrão
        const customItems = currentItems.filter(label => !defaultLabels.includes(label));

        //Se não houver labels padrão nem itens personalizados, mostra uma mensagem de que não há itens disponíveis e retorna
        if (defaultLabels.length === 0 && customItems.length === 0) {
            checklist.innerHTML = '<div class="itens-empty">Nenhum item disponível.</div>';
            return;
        }

        //Para cada label padrão, cria uma linha do checklist e marca se o label estiver presente no Set de itens marcados
        defaultLabels.forEach(label => {
            checklist.appendChild(criarLinha(label, currentSet.has(label), false));
        });

        //Para cada label personalizado, cria uma linha do checklist e marca se o label estiver no Set de itens marcados, e indica que é um item personalizado
        customItems.forEach(label => {
            checklist.appendChild(criarLinha(label, currentSet.has(label), true));
        });
    }

    //Função para obter os itens marcados atualmente no checklist, percorre os checkboxes e coleta os labels dos que estão marcados 
    function obterItensMarcados() {
        const partes = [];
        //Percorre todos os checkboxes do checklist e verifica quais estão marcados, se estiverem, adiciona o label correspondente ao array de partes
        checklist.querySelectorAll('.item-checkbox').forEach(cb => {
            if (cb.checked) {
                partes.push(cb.dataset.label);
            }
        });
        return partes;
    }

    //Adiciona ouvintes de eventos para os botões de marcar todos, etc, com as funções correspondentes para cada ação
    btnMarcarTodos.addEventListener('click', function() {
        checklist.querySelectorAll('.item-checkbox').forEach(cb => cb.checked = true);
    });

    //Adiciona um ouvinte de evento para o botão de desmarcar todos, que percorre todos os checkboxes do checklist e desmarca todos
    btnDesmarcarTodos.addEventListener('click', function() {
        checklist.querySelectorAll('.item-checkbox').forEach(cb => cb.checked = false);
    });

    //Adiciona um ouvinte de evento para o botão de adicionar item
    addBtn.addEventListener('click', function() {
        //Pega o valor do input de texto para adicionar um item, remove espaços extras e verifica se não está vazio
        const valor = (addText.value || '').trim();
        if (!valor) return;
        //Adiciona a nova linha do checklist com o valor informado, marcando como um item personalizado
        checklist.appendChild(criarLinha(valor, true, true));
        addText.value = '';//Limpa o input de texto
    });

    //Adiciona um ouvinte de evento para o botão de cancelar, que simplesmente atualiza o checklist para voltar ao estado original sem salvar as alterações
    btnCancelar.addEventListener('click', function() {
        atualizarChecklist();
    });

    //Adiciona um ouvinte de evento para o botão de salvar
    btnSalvar.addEventListener('click', function() {
        //Obtém os itens marcados atualmente no checklist e atualiza a propriedade itensMarcados do item com essa lista
        item.itensMarcados = obterItensMarcados();
        //Atualiza o item na lista de especialidades
        especialidades[index] = item;
        //Salva a lista atualizada de especialidades no localStorage
        localStorage.setItem('especialidades', JSON.stringify(especialidades));
        atualizarChecklist();//Chama o atualizarChecklist 
        renderizarLista();//Chama o renderizarLista 
    });

    //Chama o atualizarChecklist
    atualizarChecklist();
}

//Função para limpar a seleção de especialidades na lista
function limparSelecao() {
    //Percorre todos os elementos com a classe "item" e remove a classe "selected" para limpar a seleção visual
    document.querySelectorAll(".item").forEach(function(element) {
        element.classList.remove("selected");
    });
}

//Função para renderizar a lista de especialidades
function renderizarLista() {
    lista.innerHTML = "";//Limpa o conteúdo atual da lista

    //Se a lista estiver vazia, mostra uma mensagem indicando que não há especialidades salvas e retorna para evitar tentar renderizar itens inexistentes
    if (especialidades.length === 0) {
        lista.innerHTML = `
            <div class="vazio">
                Nenhuma especialidade salva.
            </div>
        `;
        return;
    }

    //Percorre o array de especialidades
    especialidades.forEach(function(item, index) {
        //Cria um elemento div para cada item da lista
        const itemCard = document.createElement("div");
        //Adiciona a classe "item" para estilização
        itemCard.classList.add("item");
        //Define o conteúdo HTML do item, mostrando o nome e a imagem (ou uma imagem padrão se não houver)
        itemCard.innerHTML = `
            <span>${item.nome}</span>
            <img src="${item.imagem || "../img/especialidade.png"}" alt="${item.nome}">
        `;

        //Adiciona um ouvinte de evento para cada item da lista
        itemCard.addEventListener("click", function() {
            limparSelecao();//Limpa a seleção visual de outros itens
            itemCard.classList.add("selected");//Adiciona a classe "selected" para destacar o item clicado
            renderizarDetalhes(item, index);//Chama a função renderizarDetalhes para mostrar os detalhes da especialidade selecionada
        });

        //Adiciona o item criado à lista no HTML
        lista.appendChild(itemCard);
    });
}

renderizarLista();//Chama a função renderizarLista
mostraPlaceholder();//Chama a função mostraPlaceholder 