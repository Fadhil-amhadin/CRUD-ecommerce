const dbConnection = require('../connection/db');
const router = require('express').Router();
const multer = require('multer');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/product');
    },
    filename: (req, file, cb) =>{
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

router.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('photo'))

router.post('/add/', (req, res) => {
    const photo = req.file.filename;
    const {name, description, price, stock, brand_id, category_id} = req.body;
    const query = 'INSERT INTO tb_product (name, description, price, photo, stock, brand_id, category_id) VALUES (?,?,?,?,?,?,?)';

    dbConnection.getConnection((err, conn) =>{
        if(err) throw err;

        conn.query(query, [name, description, price, photo, stock, brand_id, category_id], (err, result) =>{
            if(err) throw err;
        })
        res.redirect('/admin');
        conn.release();
    })
})

router.post('/edit/:id', (req, res) => {
    const {name, description, price, stock} = req.body;
    const query = 'UPDATE tb_product SET name=?, description=?, price=?, stock=? WHERE id=?';

    dbConnection.getConnection((err, conn) =>{
        if(err) throw err;

        conn.query(query, [name, description, price, stock, req.params.id], (err, result) =>{
            if(err) throw err;
        })
        res.redirect('/admin');
        conn.release();
    })
})

router.get('/admin/:id', (req, res) =>{
    const query = 'DELETE FROM tb_product WHERE id=?';

    dbConnection.getConnection((err, conn) =>{
        if(err) throw err;

        conn.query(query, [req.params.id], (err, result) =>{
            if(err) throw err;
        })
        res.redirect('/admin');
        conn.release();
    })
})

router.get('/add', (req,res) =>{
    res.render('add', {title: 'Add page', isLogin: req.session.isLogin})
})

router.get('/edit/:id', (req, res) => {
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
                res.render('edit', {title: 'Edit Page', isLogin: req.session.isLogin, id, name, description, price, photo, stock})
        });
        conn.release();
    });
})

module.exports = router;