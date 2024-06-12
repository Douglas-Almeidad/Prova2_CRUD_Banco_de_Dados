//simula um banco de dados em memória
var clientes = []

//guarda o objeto que está sendo alterado
var clienteAlterado = null

function adicionar() {
    //libera para digitar o CPF
    document.getElementById("cpf").disabled = false
    clienteAlterado = null
    mostrarModal()
    limparForm()
}
function alterar(cpf) {

    //procurar o cliente que tem o CPF clicado no alterar
    for (let i = 0; i < clientes.length; i++) {
        let cliente = clientes[i]
        if (cliente.cpf == cpf) {
            //achou o cliente, entao preenche o form
            document.getElementById("nome").value = cliente.nome
            document.getElementById("cpf").value = cliente.cpf
            document.getElementById("telefone").value = cliente.telefone

            // CAMPO ADICIONAL
            document.getElementById("estadodenascimento").value = cliente.estadodenascimento
            document.getElementById("whatsapp").value = cliente.whatsapp

            clienteAlterado = cliente
        }
    }
    //bloquear o cpf para nao permitir alterá-lo
    document.getElementById("cpf").disabled = true
    mostrarModal()
}
function excluir(cpf) {
    if (confirm("Você deseja realmente excluir?")) {
        fetch("http://localhost:3000/excluir/" + cpf ,{
            headers: {
                "Content-type": "application/json"
            },
            method: "DELETE"
        }).then((response) =>{
            //após terminar de excluir, recarrega a lista de clientes
            recarregarClientes();
            alert("Cliente excluído com sucesso")
        }).catch((error) => {
            console.log(error)
            alert("Não foi possível excluir o cliente")
        })

        exibirDados()
    }
}
function mostrarModal() {
    let containerModal = document.getElementById("container-modal")
    containerModal.style.display = "flex"
}
function ocultarModal() {
    let containerModal = document.getElementById("container-modal")
    containerModal.style.display = "none"
}
function cancelar() {
    ocultarModal()
    limparForm()
}
function salvar() {
    let nome = document.getElementById("nome").value
    let cpf = document.getElementById("cpf").value
    let telefone = document.getElementById("telefone").value
     // CAMPO ADICIONAL
    let estadodenascimento = document.getElementById("estadodenascimento").value 
    let whatsapp = document.getElementById("whatsapp").value 


    //se não estiver alterando ninguém, adiciona no vetor
    if (clienteAlterado == null) {
        let cliente = {
            "nome": nome,
            "cpf": cpf,
            "telefone": telefone,
            "estadodenascimento": estadodenascimento,
            "whatsapp" : whatsapp
        }

        //salva o cliente no back-end
        fetch("http://localhost:3000/cadastrar", {
            headers: {
                "Content-type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(cliente)
        }).then(() => {
            clienteAlterado = null
            //limpa o form
            limparForm()
            ocultarModal()
            
            recarregarClientes();
            alert("Cliente cadastrado com sucesso!")
        }).catch(() => {
            alert("Ops... algo deu errado!")
        })

       
    } else {
        clienteAlterado.nome = nome
        clienteAlterado.cpf = cpf
        clienteAlterado.telefone = telefone

        //CAMPO ADICIONAL
        clienteAlterado.estadodenascimento = estadodenascimento
        clienteAlterado.whatsapp = whatsapp

        fetch("http://localhost:3000/alterar/",{
            headers: {
                "Content-type": "application/json"
            },
            method: "PUT",
            body:  JSON.stringify(clienteAlterado)
        }).then((response) => {
            
            clienteAlterado = null
            //limpa o form
            limparForm()
            ocultarModal()

            recarregarClientes();
            alert("Cliente Alterado com sucesso!")
        }).catch((error) => {
            alert("Não foi possível alterar o cliente")
        })
    }

}

function exibirDados() {

    let tbody = document.querySelector("#table-customers tbody")

    //antes de listar os clientes, limpa todas as linhas
    tbody.innerHTML = ""

    for (let i = 0; i < clientes.length; i++) {
        let linha = `
        <tr>
            <td>${clientes[i].nome}</td>
            <td>${clientes[i].cpf}</td>
            <td>${clientes[i].telefone}</td>

            <td>${clientes[i].estadodenascimento}</td>
            <td>${clientes[i].whatsapp}</td>
            <td>
                <button onclick="alterar('${clientes[i].cpf}')">Alterar</button>
                <button onclick="excluir('${clientes[i].cpf}')" class="botao-excluir">Excluir</button>
            </td>
        </tr>`
//  CAMPO ADICIONAL ACIMA  NA LINHA 151 E 152
        let tr = document.createElement("tr")
        tr.innerHTML = linha

        tbody.appendChild(tr)
    }

}
function limparForm() {
    document.getElementById("nome").value = ""
    document.getElementById("cpf").value = ""
    document.getElementById("telefone").value = ""
    //CAMPO ADICIONAL
    document.getElementById("estadodenascimento").value = ""
    document.getElementById("whatsapp").value = ""

}

function recarregarClientes() {
    fetch("http://localhost:3000/listar", {
        headers: {
            "Content-type": "application/json"
        },
        method: "GET"
    }).then((response) => response.json()) //converte a resposta para JSON
        .then((response) => {
            clientes = response;
            ordenarPorNome(); // Ordena os clientes pelo nome
            exibirDados();
        }).catch((error) => {
            alert("Erro ao listar os clientes");
        });
}

function buscar() {
    // Obtém o valor da caixa de busca
    let termoBusca = document.getElementById("search-input").value.trim();

    // Verifica se o termo de busca não está vazio
    if (termoBusca !== "") {
        // Realiza a busca no backend
        fetch("http://localhost:3000/buscar?termo=" + termoBusca, {
            headers: {
                "Content-type": "application/json"
            },
            method: "GET"
        }).then((response) => response.json()) // Converte a resposta para JSON
            .then((response) => {
                // Atualiza a lista de clientes com os resultados da busca
                clientes = response;
                exibirDados();
            }).catch((error) => {
                alert("Erro ao buscar os clientes");
            });
    } else {
        // Se a caixa de busca estiver vazia, recarrega todos os clientes
        recarregarClientes();
    }
}
function ordenarPorNome() {
    clientes.sort((a, b) => {
        return a.nome.localeCompare(b.nome);
    });
}
app.get('/buscar', (req, res) => {
    const termo = req.query.termo; // Obtém o termo de busca da query string

    // Aqui você realiza a lógica para buscar no banco de dados
    // e retorna os resultados

    // Exemplo simples de resposta para teste:
    res.json({ resultados: [] }); // Responde com um array vazio para fins de teste
});
