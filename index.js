// Vamos construir um servidor usando o modulo do express.
// este modulo possue funções para executar e manipular um servidor node.
// iniciaremos criando uma referencia do express comn a importaçao de modulo 
const express = require("express");


// vamos Importar o modulo mangoose que fara a interface entre o 
//nodejs eo banco de dados mongodb 
const mongoose = require("mongoose");



const url = "mongodb+srv://francisco:franc1991@clustercliente.pxsw7.mongodb.net/primeiraapi?retryWrites=true&w=majority"
mongoose.connect(url, { useNewURLParser: true, useUnifiedTopology: true })

// Vamos criar a estrutura da tabela com o comando schema 

const tabela = mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    cpf: { type: String, required: true, unique: true },
    usuario: { type: String, required: true, unique: true },
    senha: { type: String, required: true, }
});


// execucao da tabela

const Cliente = mongoose.model("tbcliente", tabela);





// criar uma referencia do servidor express para utiliza-lo

const app = express();

// fazer o servidor express receber e tratar dados em formato json
app.use(express.json());
/*
Abaixo iremos as 4 rotas para o verbos GET,POST,PUT,DELETE:
- GET -> Esse verbo é utilizado todas as vezes  que o usuario requisita alguma informacao ao servidor e , este por sua vez 

POST-> É utilizado todas as vezes que o usuari quiser cadastrar um cliente ou enviar um dado importante ao servidor.

PUT -> é usado quando se deseja utilizar algum dado sobre o projeto .

DELETE -> é usado para apagar dados do projeto .
 Ao final das rotas iremos aplicar ao servidor um porta de comunicacao.No caso sera a porta 3000.
*/






app.get("/api/cliente/", (req, res) => {
    Cliente.find(
        (erro, dados) => {
            if (erro) {
                return res.status(400).send({ output: `erro ao tentar ler os clientes -> ${erro}` });
            }
            res.status(200).send({ output: dados });
        }
    );
});

app.post("/api/cliente/cadastro", (req, res) => {
    const cliente = new Cliente(req.body);
    cliente.save().then(() => {
        res.status(201).send({ output: `Cliente cadastrado` })
    })
        .catch((erro) => res.status(400).send({ output: `erro ao tentar cadastrar o cliente -> ${erro}` }))
});



app.put("/api/cliente/atualizar/:id", (req, res) => {
    Cliente.findByIdAndUpdate(req.params.id,req.body,(erro,dados) => { 
        if(erro){
            return res.status(400).send({output:`Erro ao tentar atualizar -> ${erro}`});
        }
        res.status(200.).send({output:`dados atualizados`});

    })
})

app.delete("/api/cliente/apagar/:id", (req, res) => {
    Cliente.findByIdAndDelete(req.params.id,(erro,dados)=>{
        if(erro){
            return res.status(204).send({});
        };
    })
})

app.listen(3000, () => console.log("Servidor online em http://localhost:3000"));