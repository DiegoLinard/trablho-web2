const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Conectar ao MongoDB (substitua 'meu-banco-de-dados' pelo nome do seu banco de dados)
mongoose.connect('mongodb://localhost:27017/meu-banco-de-dados', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Definir o modelo do cliente
const Cliente = mongoose.model('Cliente', {
  nome: String,
  email: String,
});

// Rota para registrar um novo cliente usando o método POST
app.post('/registrarCliente', async (req, res) => {
  const { nome, email } = req.body;

  try {
    // Verificar se o cliente já existe no banco de dados
    const clienteExistente = await Cliente.findOne({ email });

    if (clienteExistente) {
      return res.json({ success: false, message: 'Cliente já registrado' });
    }

    // Criar um novo cliente
    const novoCliente = new Cliente({
      nome,
      email,
    });

    await novoCliente.save();

    res.json({ success: true, message: 'Cliente registrado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});