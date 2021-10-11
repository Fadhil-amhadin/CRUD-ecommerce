const dbConnection = require("../connection/db");
const router = require("express").Router();

router.get('/detail/:id', (req, res) => {
    const query = 'SELECT * FROM tb_product WHERE id=?';

    dbConnection.getConnection((err, conn) => {
        if (err) throw err;
        
        let id, name, description, price, photo, stock;
        conn.query(query, [req.params.id], (err, result) => {
            if (err) throw err;
    
                for (let i=0; i < result.length; i++){
                    id = result[i].id;
                    name = result[i].name;
                    description = result[i].description;
                    price = result[i].price
                    photo = result[i].photo;
                    stock = result[i].stock;
                }
                res.render('detail/detail-page', {title: 'Detail Page', isLogin: req.session.isLogin, id, name, description, price, photo, stock})
        });
        conn.release();
    });
})

router.get('/transactions', (req, res) =>{
    res.render('detail/transactions', {title: 'Transactions page', isLogin: req.session.isLogin})
})

router.get('/transactions_admin', (req, res) => {
    const query = 'SELECT tb_transactions.sub_total, tb_transactions.update_at, tb_product.name AS item, tb_product.photo, tb_user.email AS user FROM ((tb_transactions INNER JOIN tb_product ON tb_product.id = tb_transactions.product_id) INNER JOIN tb_user ON tb_user.id = tb_transactions.user_id) ORDER BY tb_transactions.update_at DESC';

    dbConnection.getConnection((err, conn) => {
        if (err) throw err;

        let items = [];
        conn.query(query, (err, results) => {
            if (err) throw err;

            for(let result of results){
                items.push({
                    ...result,
                    photo: 'images/product/' + result.photo,
                  });
            }
            res.render('detail/transactions_admin', {title: 'Transaction admin', isLogin: req.session.isLogin, items});
        })
        conn.release();
    })
    
})

module.exports = router;
