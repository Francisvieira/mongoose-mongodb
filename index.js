// Vamos construir um servidor usando o modulo do express.
// este modulo possue funções para executar e manipular um servidor node.
// iniciaremos criando uma referencia do express comn a importaçao de modulo 
const express = require("express"); 

// criar uma referencia do servidor express para utiliza-lo

const app =express(); 

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


app.get("/api/cliente/",(req,res)=>
{res.send("vc esta na rota do GET")}); 

app.post("/api/cliente/cadastro",(req,res)=>{
    res.send(`Os dados enviados foram enviados ${req.body.nome}`);
}); 

app.put("/api/cliente/atualizar/:id",(req,res)=>{
    res.send(`o id passado foi ${req.params.id} e os dados para atualizar sao ${req.body}`); 
}) 

app.delete("/api/cliente/apagar/:id",(req,res) =>{
    res.send(`O id pasado foi ${req.params.id}`);
}) 

app.listen(3000,()=>console.log("Servidor online em http://localhost:3000"));