const http = require('http');
const express = require('express');
const flash = require("express-flash");
const session = require('express-session');
const dbConnection = require('./connection/db');

const port = 3000;
const app = express();

const CUD = require('./routes/CUD');
const cart = require('./routes/cart');
const authRoute = require('./routes/auth');
const detailRoute = require('./routes/detail');

//set view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

//session
app.use(
    session({
      cookie: {
        maxAge: 1 * 60 * 60 * 1000,
        secure: false,
        httpOnly: true,
      },
      store: new session.MemoryStore(),
      saveUninitialized: true,
      resave: false,
      secret: 'secretValue',
    })
  );

// use flash for sending message
app.use(flash());
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.get('/', (req, res) => {
  dbConnection.getConnection((err, conn) => {
    const query = 'SELECT * FROM tb_product ORDER BY created_at DESC';
    let items = [];
  
    conn.query(query, (err, results) =>{
        if (err) throw err;
  
        for (let result of results) {
            items.push({
              ...result,
              photo: 'images/product/' + result.photo,
            });
        }
        res.render('index', {title: 'Homepage', isLogin: req.session.isLogin, items})});
        conn.release();
    })
  })

app.use('/', CUD);
app.use('/', cart);
app.use('/', authRoute);
app.use('/', detailRoute);

app.get('/admin', (req, res) => {
  dbConnection.getConnection((err, conn) => {
    const query = 'SELECT * FROM tb_product ORDER BY created_at DESC';
    let items = [];
  
    conn.query(query, (err, results) =>{
        if (err) throw err;
  
        for (let result of results) {
            items.push({
              ...result,
              photo: 'images/product/' + result.photo,
            });
        }
      res.render('admin', {title: 'Homepage Admin', isLogin: req.session.isLogin, items})});
      conn.release();
  })
})

const server = http.createServer(app);
server.listen(port, () =>{
    console.log(`server running on port: ${port}`);
})