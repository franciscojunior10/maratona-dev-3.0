const express = require('express');
const nunjucks = require('nunjucks');
const Pool = require('pg').Pool

const server = express()

server.use(express.static('public'))
server.use(express.urlencoded({ extended: true }))

const db = new Pool({
    user: 'maratonadev',
    password: 'maratonadev123',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

nunjucks.configure('./', {
    express: server,
    noCache: true,
})

// const donors = [
//     {
//         name: "Francisco Júnior",
//         blood: "AB+"
//     },
//     {
//         name: "Marcos Paulo",
//         blood: "B+"
//     },
//     {
//         name: "Paradinha",
//         blood: "A+"
//     },
//     {
//         name: "Nonato de Sales",
//         blood: "O+"
//     },
// ]

server.get('/', function(req, res){
    
    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("erro no banco de dados!!")

        const donors = result.rows
        return res.render('index.html', { donors });

    })

});

server.post('/', function(req, res){
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    // donors.push({
    //     name,
    //     blood,
    // })

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios!!")
    }

    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err){
        if (err) return res.send("erro no banco de dados!!")
        
        return res.redirect("/");
    })

})

server.listen(8080);