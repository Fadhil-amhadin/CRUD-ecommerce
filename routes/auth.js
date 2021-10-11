const dbConnection = require("../connection/db");
const router = require("express").Router();
const fs = require('fs');

//get method
router.get('/login', (req, res) => (res.render('login', {title: 'Login Page', isLogin: req.session.isLogin})));
router.get('/register', (req, res) => (res.render('register', {title: 'Register page', isLogin: req.session.isLogin})));
router.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect("/");
});

//post method
//login
router.post('/login', (req, res) => {
    const {email, password} = req.body;
    const query = 'SELECT id, email, password, address, status FROM tb_user WHERE email= ? AND password = ?';

    if (email == '' || password == ''){
        req.session.message = {
            type: 'danger',
            message: 'Please fill the input!'
        }
        res.redirect('/login');
        return;
    }
    dbConnection.getConnection((err, conn) =>{
        if(err) throw err;

        conn.query(query, [email, password], (err, result) =>{
            if(err) throw err;

            if(result.length === 0){
                req.session.message = {
                    type: 'danger',
                    message: 'email or password is incorrect!'
                }
                return res.redirect('/login');
            }else{
                req.session.message = {
                    type: 'success',
                    message: 'You are login'
                }
                fs.writeFile('userId.txt', result[0].id.toString(), err => {
                  if(err) throw err;
                })
                req.session.isLogin = true;
                req.session.user = {
                    id: result[0].id,
                    email: result[0].email,
                    address: result[0].address,
                    status: result[0].status
                };

                if(result[0].status[0] === 1) return res.redirect('/admin'); //--> your user must be 1 or true in status column inside database in order to access admin privilage (add, update, delete) for more information see README.md.
                return res.redirect('/');
            }
        })
        conn.release();
    })
})

//registration
router.post('/register', function (req, res) {
    const { email, address, password, passwordConfirm } = req.body;
  
    const query = "INSERT INTO tb_user(email, address, password, status) VALUES (?,?,?,?)";
  
    if (email == "" || address == "" || password == "" || passwordConfirm == "") {
      req.session.message = {
        type: "danger",
        message: "Please fulfill input",
      };
      res.redirect('/register');
      return;
    }
    if (password !== passwordConfirm){
      req.session.message = {
        type: "danger",
        message: "Please confirm your password!",
      };
      res.redirect('/register')
      return
    }
  
    dbConnection.getConnection((err, conn) => {
      if (err) throw err;
  
      conn.query(query, [email, address, password, 0], (err, results) => {
        if (err) throw err;
  
        req.session.message = {
          type: "success",
          message: "register successfull",
        };
        res.redirect("/login");
      });
      conn.release();
    });
  });

module.exports = router;