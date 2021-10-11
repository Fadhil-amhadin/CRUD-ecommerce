const dbConnection = require("../connection/db");
const router = require('express').Router();
const fs = require('fs');
const { resolve } = require("path");

router.post('/detail/:id', (req, res) =>{
    const query = 'SELECT * FROM tb_product WHERE id=?';
    const queryTwo = 'INSERT INTO tb_cart (id, name, price, photo, stock, brand_id, category_id, user_id) VALUES (?,?,?,?,?,?,?,?)';

    dbConnection.getConnection((err, conn) =>{
        if(err) throw err;

        conn.query(query, [req.params.id], (err, result) =>{
            if(err){ throw err;}

            let rs = result[0];
            fs.readFile('userId.txt', 'utf-8', (err, data) =>{
                conn.query(queryTwo, [rs.id, rs.name, rs.price, rs.photo, rs.stock, rs.brand_id, rs.category_id, data], (errTwo, resultTwo)=>{
                    if(errTwo) {
                        return;
                    };
                })
            })
        })

        res.redirect(`/detail/${req.params.id}`);
        conn.release();
    })
})

router.get('/payments', (req, res) => {
    const query = 'SELECT * FROM tb_cart';
    const queryTwo = 'INSERT INTO tb_transactions (sub_total, product_id, user_id) VALUES (?,?,?)';
    const queryThree = 'SELECT * FROM tb_transactions';
    const queryFour = 'INSERT INTO tb_payment (qty, sub_total, transaction_id) SELECT * FROM (SELECT ?, ?, ?) AS tmp WHERE NOT EXISTS (SELECT transaction_id FROM tb_payment WHERE transaction_id = ?) LIMIT 1';
    const queryFive = 'DELETE FROM tb_cart';

    dbConnection.getConnection((err, conn) => {
        if(err) throw err;

        let qty = 1;
        let items = [];
        let listName = '';
        let itemsPrice = 0;
        let transactionItems = [];

        const cartGet = () => {
            return new Promise((resolve, reject) => {
                conn.query(query, (err, results) => {
                    if(err) reject (err);

                    resolve(items = results)
                })
            })
        }
        const transactionInsert = () => {
            return new Promise((resolve, reject) => {
                for(let i = 0; i < items.length; i++){
                    conn.query(queryTwo, [items[i].price, items[i].id, items[i].user_id], (err, results) => {
                        if(err) reject (err);
                        resolve();
                    })
                }
            })
        }
        const transactionGet = () => {
            return new Promise((resolve, reject) => {
                conn.query(queryThree, (err, results) => {
                    if(err) reject(err);

                    resolve(transactionItems = results);
                })
            })
        }
        const paymentsInsert = () => {
            return new Promise((resolve, reject) => {
                for(let i = 0; i < transactionItems.length; i++){
                    conn.query(queryFour, [qty, transactionItems[i].sub_total, transactionItems[i].id, transactionItems[i].id], (err, results) => {
                        if(err) reject(err);
                        resolve();
                    })
                }
            })
        }
        const cartDelete = () => {
            return new Promise((resolve, reject) => {
                conn.query(queryFive, (err, results) => {
                    if(err) reject(err);
                    resolve();
                })
            })
        }
        const totalPrice = () => {
            for (item of items){
                itemsPrice += item.price;
            }
        }
        const itemsName = () => {
            for(let i = 0; i < items.length; i++){
                if (i < items.length - 1){
                    listName += `${items[i].name}, `;
                }else{
                    listName += `${items[i].name}.`
                }
            }
        }
        async function execute(){
            await cartGet();
            await transactionInsert();
            await transactionGet();
            await paymentsInsert();
            await cartDelete();
            await totalPrice();
            await itemsName();
            await res.render('detail/pay-success', {title: 'payments page', itemsPrice, listName})
            await conn.release();
        }
        execute();
    })
})

router.get('/transactions/:id', (req, res) => {
    const query = 'DELETE FROM tb_cart WHERE id=?;'

    dbConnection.getConnection((err, conn) => {
        if(err) throw err;

        conn.query(query, [req.params.id], (err, result) => {
            if(err) throw err;
        })
        res.redirect('/transactions');
        conn.release();
    })
})

router.get('/transactions', (req, res) => {
    const query = 'SELECT tb_cart.id, tb_cart.name, tb_cart.price, tb_cart.photo, tb_cart.stock, tb_brand.name AS brand, tb_category.name AS category FROM ((tb_cart INNER JOIN tb_brand ON tb_brand.id = tb_cart.brand_id) INNER JOIN tb_category ON tb_category.id = tb_cart.category_id) ORDER BY tb_cart.created_at DESC;';
    let items = [];

    dbConnection.getConnection((err, conn) =>{
        if(err) throw err;

        conn.query(query, (err, results) => {
            if(err) throw err;

            for(let result of results){
                items.push({
                    ...result,
                    photo: 'images/product/' + result.photo,
                  });
            }
            res.render('detail/transactions', {title: 'Trasactions page', isLogin: req.session.isLogin, items});
        })
        conn.release();
    })
})

module.exports = router;