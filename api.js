// index.js
const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

// IMPORTANTE: Aqui puxamos a conexão que está no outro arquivo!
const db = require('./conexao')
const pool = db.pool // Pegamos o pool de dentro do objeto congelado


//  ╭─--───-·-ˋˏ-༻;༊༺-ˎˊ·-─--───╮
// CRUD DE CLIENTES (Conectado ao Banco)
//  ╰─--───-·-ˋˏ-༻;༊༺-ˎˊ·-──--──╯


// 1. CADASTRAR CLIENTE (POST)
app.post("/clientes", async (req, res) => {
    const cliente = req.body
    
    if (!cliente || Object.keys(cliente).length === 0) {
        return res.status(400).json({ resposta: "Body não preenchido" })
    }

    // Validação básica dos campos obrigatórios do seu banco
    const { nome, cpf, email, celular, senha } = cliente
    if (!nome || !cpf || !email || !celular || !senha) {
        return res.status(400).json({ resposta: "Todos os campos (nome, cpf, email, celular, senha) são obrigatórios" })
    }

    try {
        const query = 'INSERT INTO Cliente (nome, cpf, email, celular, senha) VALUES (?, ?, ?, ?, ?)'
        await pool.query(query, [nome, cpf, email, celular, senha])
        
        res.status(201).json({ resposta: "Cliente cadastrado com sucesso!" })
    } catch (error) {
        // Trata erro de CPF ou Email duplicado (UNIQUE no banco)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ resposta: "CPF ou Email já cadastrado!" })
        }
        res.status(500).json({ resposta: error.message })
    }    
})

// 2. LISTAR CLIENTES (GET)
app.get("/clientes", async (req, res) => {
    try {
        // Busca todos os clientes do banco
        const [linhas] = await pool.query('SELECT id, nome, cpf, email, celular FROM Cliente')
        res.status(200).json(linhas)
    } catch (error) {
        res.status(500).json({ resposta: error.message })
    }
})

// 3. DELETAR CLIENTE POR CPF (DELETE)
// Nota: O CPF enviado na URL deve ser apenas números para bater com a limpa de caracteres
app.delete("/clientes/:cpf", async (req, res) => {
    // Remove qualquer coisa que não seja número do CPF enviado na URL
    const cpfLimpo = req.params.cpf.replace(/[^\d]/g, '') 

    try {
        // No banco o CPF está salvo como '123.456.789-12'. 
        // Usamos REPLACE na query para comparar apenas os números cadastrados com o CPF da URL.
        const queryDeletar = "DELETE FROM Cliente WHERE REPLACE(REPLACE(cpf, '.', ''), '-', '') = ?"
        const [resultado] = await pool.query(queryDeletar, [cpfLimpo])

        // Se nenhuma linha foi afetada, o cliente não existia
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ resposta: "Cliente não existe no banco de dados" })
        }

        res.status(200).json({ resposta: "Cliente deletado no banco de dados" })
    } catch (error) {
        res.status(500).json({ resposta: error.message })   
    }
})

// 4. ATUALIZAR CLIENTE POR CPF (PUT)
app.put("/clientes/:cpf", async (req, res) => {
    const cpfLimpo = req.params.cpf.replace(/[^\d]/g, '')
    const { nome, email, celular, senha } = req.body

    try {
        // 🌟 CORRIGIDO: Agora busca * (todos os campos) para poder reaproveitar no objeto abaixo
        const queryBuscar = "SELECT * FROM Cliente WHERE REPLACE(REPLACE(cpf, '.', ''), '-', '') = ?"
        const [clientes] = await pool.query(queryBuscar, [cpfLimpo])

        if (clientes.length === 0) {
            return res.status(404).json({ resposta: "Cliente não existe no banco de dados" })
        }

        // Monta os novos dados mantendo os antigos caso o usuário não envie todos no body
        const dadosNovos = {
            nome: nome || clientes[0].nome,
            email: email || clientes[0].email,
            celular: celular || clientes[0].celular,
            senha: senha || clientes[0].senha
        }

        // Atualiza os dados no banco
        const queryAtualizar = "UPDATE Cliente SET nome = ?, email = ?, celular = ?, senha = ? WHERE REPLACE(REPLACE(cpf, '.', ''), '-', '') = ?"
        await pool.query(queryAtualizar, [dadosNovos.nome, dadosNovos.email, dadosNovos.celular, dadosNovos.senha, cpfLimpo])

        res.status(200).json({ resposta: "Cliente atualizado no banco de dados" })
    } catch (error) {
        res.status(500).json({ resposta: error.message })   
    }
})


//   ╭────-·-ˋˏ-༻;༊༺-ˎˊ·-────╮
// ROTA ADICIONAL: VER PRODUTOS (Poneis)
//   ╰────-·-ˋˏ-༻;༊༺-ˎˊ·-────╯ 

// Criada para interligar com a tabela de pôneis (Código 2)
app.get("/ponys", async (req, res) => {
    try {
        const query = `
            SELECT p.id, p.nome, p.cor_corpo, p.cor_crina, p.preco, p.estoque, c.nome AS categoria 
            FROM Pony p 
            INNER JOIN Categoria c ON p.id_categoria = c.id
        `
        const [ponys] = await pool.query(query)
        res.status(200).json(ponys)
    } catch (error) {
        res.status(500).json({ resposta: error.message })
    }
})

app.listen(port, () => {
    console.log("API rodando na porta " + port)
})

// ==========================================
// ROTAS REQUISITADAS PARA CLIENTES
// ==========================================

// 1. CONSULTA DE TODOS OS CLIENTES (GET)
app.get("/clientes", async (req, res) => {
    try {
        // Busca o ID e os dados cadastrais de todo mundo no banco
        const [clientes] = await pool.query('SELECT id, nome, cpf, email, celular FROM Cliente')
        res.status(200).json(clientes)
    } catch (error) {
        res.status(500).json({ resposta: error.message })
    }
})

// 2. CONSULTA DE UM CLIENTE ESPECÍFICO POR CPF (GET)
// Exemplo de URL no RapidAPI: http://localhost:3000/clientes/12345678912
app.get("/clientes/:cpf", async (req, res) => {
    // Remove pontos e traços para buscar apenas os números informados
    const cpfLimpo = req.params.cpf.replace(/[^\d]/g, '')

    try {
        const query = "SELECT id, nome, cpf, email, celular FROM Cliente WHERE REPLACE(REPLACE(cpf, '.', ''), '-', '') = ?"
        const [resultado] = await pool.query(query, [cpfLimpo])

        // Se o array voltar vazio, significa que o CPF não existe no banco
        if (resultado.length === 0) {
            return res.status(404).json({ resposta: "Cliente não encontrado no banco de dados" })
        }

        // Retorna apenas o objeto do cliente encontrado (posição 0 do array)
        res.status(200).json(resultado[0])
    } catch (error) {
        res.status(500).json({ resposta: error.message })
    }
})

// 3. EXCLUSÃO DE UM CLIENTE POR CPF (DELETE)
// Exemplo de URL no RapidAPI: http://localhost:3000/clientes/12345678912
app.delete("/clientes/:cpf", async (req, res) => {
    const cpfLimpo = req.params.cpf.replace(/[^\d]/g, '') 

    try {
        const queryDeletar = "DELETE FROM Cliente WHERE REPLACE(REPLACE(cpf, '.', ''), '-', '') = ?"
        const [resultado] = await pool.query(queryDeletar, [cpfLimpo])

        // affectedRows indica quantas linhas foram apagadas no MySQL
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ resposta: "Cliente não existe no banco de dados" })
        }

        res.status(200).json({ resposta: "Cliente deletado com sucesso do banco de dados!" })
    } catch (error) {
        res.status(500).json({ resposta: error.message })   
    }
})

// 4. ALTERAÇÃO DOS DADOS DE UM CLIENTE POR CPF (PUT)
// Exemplo de URL no RapidAPI: http://localhost:3000/clientes/12345678912
app.put("/clientes/:cpf", async (req, res) => {
    const cpfLimpo = req.params.cpf.replace(/[^\d]/g, '')
    const { nome, email, celular, senha } = req.body

    try {
        // Primeiro, busca os dados atuais do cliente para não apagar campos que não foram enviados no Body
        const queryBuscar = "SELECT nome, email, celular, senha FROM Cliente WHERE REPLACE(REPLACE(cpf, '.', ''), '-', '') = ?"
        const [clientes] = await pool.query(queryBuscar, [cpfLimpo])

        if (clientes.length === 0) {
            return res.status(404).json({ resposta: "Cliente não existe no banco de dados" })
        }

        const clienteAtual = clientes[0]

        // Se o usuário não enviou o campo no body, mantém o que já estava salvo no banco
        const dadosNovos = {
            nome: nome || clienteAtual.nome,
            email: email || clienteAtual.email,
            celular: celular || clienteAtual.celular,
            senha: senha || clienteAtual.senha
        }

        // Executa a atualização com as variáveis prontas
        const queryAtualizar = "UPDATE Cliente SET nome = ?, email = ?, celular = ?, senha = ? WHERE REPLACE(REPLACE(cpf, '.', ''), '-', '') = ?"
        await pool.query(queryAtualizar, [dadosNovos.nome, dadosNovos.email, dadosNovos.celular, dadosNovos.senha, cpfLimpo])

        res.status(200).json({ resposta: "Dados do cliente alterados com sucesso!" })
    } catch (error) {
        res.status(500).json({ resposta: error.message })   
    }
})
