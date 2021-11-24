// Vamos construir um servidor usando o modulo do express.
// este modulo possue funções para executar e manipular um servidor node.
// iniciaremos criando uma referencia do express comn a importaçao de modulo 
const express = require("express");


// vamos Importar o modulo mangoose que fara a interface entre o 
//nodejs eo banco de dados mongodb 
const mongoose = require("mongoose");



//importacao do modulo bcrypt para criptografia
const bcrypt = require("bcrypt");

// jsonwebtoken é um hash que garante a seçao segura em uma pagina oou grupos de paginas
//permitindo ou nao o acesso aos conteudos destas paginas ele é gerado a partir de alguns 
//elementos,tais como:dados que importam tokens(payload),chave secreta,tempo de expiração
//e metodo de criptografia.
const jwt = require("jsonwebtoken");


const cfn = require ("./config");

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

// aplicacao de criptografia do bcrypt a tabela de cadastro de clientes sera feita um apasso antes do salvamento dos dados do cliente, vamos usar o comando PRE




tabela.pre("save",function(next){
    let cliente =this;
    if(!cliente.isModified('senha')) return next()
    bcrypt.hash(cliente.senha,10,(erro,rs)=>{
        if (erro )return console.log (`erro ao gerar senha ->${erro}`);
        cliente.senha=rs;
        return next();
    })

})


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


app.get("/api/cliente/:id", (req, res) => {
    Cliente.findById(req.params.id,
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
        const gerado =criatoken(req.body.usuario,req.body,nome);
        res.status(201).send({ output: `Cliente cadastrado` })
    })
        .catch((erro) => res.status(400).send({ output: `erro ao tentar cadastrar o cliente -> ${erro}` }))
});



app.post("/api/cliente/login", (req,res)=>{
 const us =req.body.usuario;
 const sh = req.body.senha;
 Cliente.findOne({usuario:us},(erro,dados)=> {
     if(erro){
         return res.status(400).send({output:`Usuario não localizado ->${erro}`})
     } 
    bcrypt.compare(sh,dados.senha,(erro,igual=>{
        if(erro)return res.status(400).send({output:`erro ao tentar logar ->${erro}`})
        
        const gerado= criatoken(dados.usuario,dados.nome);
        res.status(200).send({output:`logado`,payload:dados,token:gerado});
    }))
     
 })
})




app.put("/api/cliente/atualizar/:id", verifica, (req, res) => {
    Cliente.findByIdAndUpdate(req.params.id,req.body,(erro,dados) => { 
        if(erro){
            return res.status(400).send({output:`Erro ao tentar atualizar -> ${erro}`});
        }
        res.status(200.).send({output:`dados atualizados`});

    })
})

app.delete("/api/cliente/apagar/:id", verifica, (req, res) => {
    Cliente.findByIdAndDelete(req.params.id,(erro,dados)=>{
        if(erro){
            return res.status(204).send({});
        };
    })
})

//teste do jwt 
//==================================gerar token=======================//
const criatoken=(usuario,nome )=>{

   return jwt.sign({nome:"francisco",id:'email@gmail.com'},cfn.jwt_key,{expiresIn:cfn.jwt_expires});
};

//=============================teste de validacao do token ========
function verifica(req,res,next){
    const token_gerado =req.headers.token;
    if(!token_gerado){
        return res.status(401).send({output:"Não há token"})
    } 
    jwt.verify(token_gerado,cfn.jwt_key,(erro,dados)=>{
        if(erro){
            return res.status(401).send({output:"Token invalido"});
        } 
        res.status(200).send({output:'Autorizado',payload:`Olá ${dados.nome}`})
        next();
    });
}

app.listen(3000, () => console.log("Servidor online em http://localhost:3000"));