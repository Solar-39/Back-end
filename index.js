/* 
Instale as bibliotecas e o cliente de API:
npm init
npm i express
Procure pela extensão RapidAPI Client no VSCode.
*/
// Para executar a API no terminal: node index.js
// Link para testar a API: http://localhost:3000/times
const express = require("express")
const app = express()
const port = 3000
app.use(express.json()) // configura API para usar JSON.
const fs = require('fs') // importa leitura e escrita de arquivos.

// musica> time
// musicas> times
// tbd.json> times.json
// cliente

// 1) get times CERTO!!!!
app.get("/times", (req, res)=>{
    try{
    const times = JSON.parse(fs.readFileSync('tbd.json', 'utf8'))
    res.status(200).json(times)
    }catch(error){
        res.status(500).json({})
    }
})

//2) get times nome
//certo!!!!
app.get("/times/:nome", (req , res)=>{
    const nome = req.params.nome
    try{
        const times = JSON.parse(fs.readFileSync("tbd.json", "utf8"))
        const times_encontrados = times.filter((times) => times.nome == nome)
        if(times_encontrados.length == 0){
            return res.status(404).json({erro: "Time não encontrado"})
        }
        res.status(200).json(times_encontrados)
    } catch(error){
        res.status(500).json({resposta: error.message})
    }  
})

// 3) post times
// post erro CERTO!!!
// post certo CERTO!!!!
app.post("/times", (req,res) => {
    const time = req.body
    if (!time || Object.keys(time).length === 0) {
        res.status(400).json({resposta: "Body não preenchido"})
    } else {
        try {
            const tbd = JSON.parse(fs.readFileSync('tbd.json', 'utf8'))
            tbd.push(time)
            fs.writeFileSync('tbd.json', JSON.stringify(tbd), 'utf8')
            res.status(201).json({resposta: "time cadastrado com sucesso!"})
        } catch(error) {
            res.status(500).json({resposta: error.message})
        }
    }    
})

// 4) delete times id
// CERTO!!!!!
app.delete("/times/:id", (req , res)=>{
    const id = req.params.id
    try{
        const times = JSON.parse(fs.readFileSync("tbd.json", "utf8"))
        const indice_time = times.findIndex((time) => time.id == id)
        if (indice_time == -1) {
            return res.status(404).json({resposta: "Time não encontrado"})
        }
        times.splice(indice_time, 1)
        fs.writeFileSync("tbd.json", JSON.stringify(times), "utf8")
        res.status(200).json({resposta: "Time removido com sucesso!"})
    } catch(error){
        res.status(500).json({resposta: error.message})
    }  
})

// 5) get times/regiao :regiao
// utiliza a função filter
// CERTO!!!!!
app.get("/times/regiao/:regiao", (req , res)=>{
    const regiao = req.params.regiao
    try{
        const times = JSON.parse(fs.readFileSync("tbd.json", "utf8"))
        const times_encontrados = times.filter((time) => time.regiao == regiao)
        if(times_encontrados.length == 0){
            return res.status(404).json({erro: "Não existem times nessa região"})
        }
        res.status(200).json(times_encontrados)
    } catch(error){
        res.status(500).json({resposta: error.message})
    }  
})



// Execução da API:
app.listen(port, ()=>{
    console.log("API rodando na porta " + port)
})