const lista = document.getElementById("lista");
const painelDetalhes = document.getElementById("painelDetalhes");

let especialidades = JSON.parse(localStorage.getItem("especialidades")) || [];

function mostraPlaceholder() {
    painelDetalhes.innerHTML = `
        <div class="placeholder">
            Clique em uma especialidade para ver os detalhes aqui.
        </div>
    `;
}

function renderizarDetalhes(item, index) {
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

    const botaoDeletar = painelDetalhes.querySelector(".deletar");
    botaoDeletar.addEventListener("click", function() {
        especialidades.splice(index, 1);
        localStorage.setItem("especialidades", JSON.stringify(especialidades));
        renderizarLista();
        if (especialidades.length === 0) {
            mostraPlaceholder();
        }
    });

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

    const quantidade = Number(item.quantidade) || 0;
    const defaultLabels = Array.from({ length: quantidade }, (_, i) => `Item ${i + 1}`);

    function criarLinha(text, checked = false, isCustom = false) {
        const row = document.createElement('div');
        row.classList.add('item-row');
        row.innerHTML = `
            <label class="row-label">
                <input type="checkbox" class="item-checkbox" data-label="${text.replace(/"/g, '&quot;')}" ${checked ? 'checked' : ''}>
                <span class="item-label-text">${text}</span>
            </label>
            ${isCustom ? '<button class="row-delete">Remover</button>' : ''}
        `;
        const del = row.querySelector('.row-delete');
        if (del) {
            del.addEventListener('click', function() {
                row.remove();
            });
        }
        return row;
    }

    function atualizarChecklist() {
        checklist.innerHTML = '';
        const currentItems = item.itensMarcados || [];
        const currentSet = new Set(currentItems);
        const customItems = currentItems.filter(label => !defaultLabels.includes(label));

        if (defaultLabels.length === 0 && customItems.length === 0) {
            checklist.innerHTML = '<div class="itens-empty">Nenhum item disponível.</div>';
            return;
        }

        defaultLabels.forEach(label => {
            checklist.appendChild(criarLinha(label, currentSet.has(label), false));
        });

        customItems.forEach(label => {
            checklist.appendChild(criarLinha(label, currentSet.has(label), true));
        });
    }

    function obterItensMarcados() {
        const partes = [];
        checklist.querySelectorAll('.item-checkbox').forEach(cb => {
            if (cb.checked) {
                partes.push(cb.dataset.label);
            }
        });
        return partes;
    }

    btnMarcarTodos.addEventListener('click', function() {
        checklist.querySelectorAll('.item-checkbox').forEach(cb => cb.checked = true);
    });

    btnDesmarcarTodos.addEventListener('click', function() {
        checklist.querySelectorAll('.item-checkbox').forEach(cb => cb.checked = false);
    });

    addBtn.addEventListener('click', function() {
        const valor = (addText.value || '').trim();
        if (!valor) return;
        checklist.appendChild(criarLinha(valor, true, true));
        addText.value = '';
    });

    btnCancelar.addEventListener('click', function() {
        atualizarChecklist();
    });

    btnSalvar.addEventListener('click', function() {
        item.itensMarcados = obterItensMarcados();
        especialidades[index] = item;
        localStorage.setItem('especialidades', JSON.stringify(especialidades));
        atualizarChecklist();
        renderizarLista();
    });

    atualizarChecklist();
}

function limparSelecao() {
    document.querySelectorAll(".item").forEach(function(element) {
        element.classList.remove("selected");
    });
}

function renderizarLista() {
    lista.innerHTML = "";

    if (especialidades.length === 0) {
        lista.innerHTML = `
            <div class="vazio">
                Nenhuma especialidade salva.
            </div>
        `;
        return;
    }

    especialidades.forEach(function(item, index) {
        const itemCard = document.createElement("div");
        itemCard.classList.add("item");
        itemCard.innerHTML = `
            <span>${item.nome}</span>
            <img src="${item.imagem || "../img/especialidade.png"}" alt="${item.nome}">
        `;

        itemCard.addEventListener("click", function() {
            limparSelecao();
            itemCard.classList.add("selected");
            renderizarDetalhes(item, index);
        });

        lista.appendChild(itemCard);
    });
}

renderizarLista();
mostraPlaceholder();