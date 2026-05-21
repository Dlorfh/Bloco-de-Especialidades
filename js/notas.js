
        const lista =
            document.getElementById("lista");

        // PEGA OS DADOS

        const especialidades =
            JSON.parse(
                localStorage.getItem("especialidades")
            ) || [];

        // MOSTRA CADA UMA

        especialidades.forEach(function(item){

            lista.innerHTML += `

                <div class="card">

                    <img src="${item.imagem}">

                    <h2>${item.nome}</h2>

                    <p>
                        Modalidade:
                        ${item.modalidade}
                    </p>

                    <p>
                        Ramo:
                        ${item.ramo}
                    </p>

                    <p>
                        Quantidade:
                        ${item.quantidade}
                    </p>

                    <p>
                        Itens feitos:
                        ${item.itensMarcados.join(", ")}
                    </p>

                    <p>
                        Comentário:
                        ${item.comentario}
                    </p>

                </div>

            `;

        });