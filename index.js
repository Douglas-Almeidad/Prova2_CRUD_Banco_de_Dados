const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Banco de dados em memória
let clientes = [];

// Rota para listar todos os clientes
app.get('/listar', (request, response) => {
  response.json(clientes);
});

// Rota para buscar clientes por nome
app.get('/buscar', (request, response) => {
  const termo = request.query.termo.toLowerCase();
  const resultados = clientes.filter(cliente => cliente.nome.toLowerCase().includes(termo));
  response.json(resultados);
});

// Rota para cadastrar um novo cliente
app.post("/cadastrar", (request, response) => {
    const cliente = request.body;
    clientes.push(cliente); // Adiciona o cliente no banco de dados
    response.json({ success: true });
});

// Rota para excluir um cliente pelo CPF
app.delete("/excluir/:cpf", (request, response) => {
  const cpf = request.params.cpf;
  clientes = clientes.filter(cliente => cliente.cpf !== cpf);
  response.json({ success: true });
});

// Rota para alterar os dados de um cliente
app.put("/alterar", (request, response) => {
  const cliente = request.body;
  clientes = clientes.map(c => (c.cpf === cliente.cpf ? cliente : c));
  response.json({ success: true });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
