// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`)
// })
const path = require('path');
const express = require('express');
const ejs = require('ejs');
const app = express();
const bodyParser = require('body-parser');

//connect to db
const mysql = require('mysql');
 
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'mapdb'
});

connection.connect(function(error){
    if(!!error) console.log(error);
    else console.log('Database Connected!');
});



app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('views','views');

app.get('/',(req, res) => {
    // res.send('CRUD Operation using NodeJS / ExpressJS / MySQL');
    // let sql = "SELECT * FROM etudiant";
    // let query = connection.query(sql, (err, rows) => {
    //     if(err) throw err;
    //     res.render('index', {
    //         title : 'gestion etudiants',
    //         etudiant : rows
    //     });
    // });
    let sql = "SELECT * FROM monument";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('index', {
            title : 'Home',
            monuments : rows
        });
    });
    // res.render('index');
});

app.get('/visite',(req, res) => {
    let visitesvariable;
    let sql = "SELECT * FROM monument";
    let query = connection.query(sql,[1,2], (err, rows) => {
        if(err) throw err;
        let query2 = connection.query('select visite.id as id , visite.longitude as longitude, visite.latitude as latitude, visite.Date as date , visite.visited as visited, monument.nom as nom, monument.id as idm from visite inner join monument on monument.id = visite.id_monument', (err, rowss) => {
            if(err) throw err;
            // visitesvariable = rowss
            // console.log(visitesvariable)
            res.render('visite', {
                title : 'Visite',
                monuments : rows,
                visites : rowss
            });
        });
            
    });

    
});
app.get('/monument',(req, res) => {
    let sql = "SELECT * FROM monument";
    let query = connection.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('monument', {
            title : 'Monuments',
            monuments : rows
        });
    });
});
// monument page editing

app.post('/monument/save',(req, res) => { 
    console.log(req.body);
    let data = {
        nom: req.body.nom,
        latitude: req.body.latitude,
        longitude : req.body.longitude,
        ville: req.body.ville
        };
    let sql = "INSERT INTO monument SET ?";
    let query = connection.query(sql, data,(err, results) => {
      if(err) throw err;
      res.redirect('/monument');
    });
});

app.get('/monument/edit/:Id',(req, res) => {
    const Id = req.params.Id;
    let sql = `Select * from monument where id = ${Id}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('medit', {
            title : 'gestion monument',
            e : result[0]
        });
    });
});


app.post('/monument/update',(req, res) => {
    const Id = req.body.id;
    let sql = "update monument SET nom='"+req.body.nom+"',  longitude='"+req.body.longitude+"',  latitude='"+req.body.latitude+"',  ville='"+req.body.ville+"' where id ="+Id;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/monument');
    });
});


app.get('/monument/delete/:Id',(req, res) => {
    const Id = req.params.Id;
    let sql = `DELETE from monument where id = ${Id}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/monument');
    });
});


app.get('/visite/add',(req, res) => {
    let data = {
        latitude: req.query.latitude,
        longitude: req.query.longitude,
        id_monument : req.query.id_monument,
        visited: req.query.visited
        };
    let sql = "INSERT INTO visite SET ?";
    let query = connection.query(sql, data,(err, results) => {
        if(err) throw err;
        res.redirect('/visite');
    });
    
});







// Server Listening
app.listen(3000, () => {
    console.log('Server is running at port 3000');
});