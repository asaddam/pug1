var express = require('express');
var mysql = require('mysql');
var app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));

function getMySQLConnection() {
    return mysql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'password',
        database : 'tokoistar'
    });
}

//connect ke db
var connection = getMySQLConnection();
connection.connect();

renderProducts = (rows) => {
    var products = [];
    for (let index = 0; index < rows.length; index++) {
        var product = {
            'id':rows[index]._id,
            'name':rows[index].name,
            'description':rows[index].description,
            'image':rows[index].image,
            'price':rows[index].price,
            'category':rows[index].category,
            'rating':rows[index].rating,
            'numReviews':rows[index].numReviews,
            'countInStock':rows[index].countInStock,
        };
        
        products.push(product);
    }

    return products;
}

app.get('/', function (req, res) {

    connection.query('SELECT * FROM products' , function (error, rows, fields) {
       
        if (error) res.status(500).json({"status_code":500,"error_message" : "internal server error"});
                
        let products = renderProducts(rows);
        res.render('home',{'products' : products});
    });   
});

app.get('/product/:id', function (req, res) {
    let id = req.params.id;
    let query = "SELECT * FROM products;"

    connection.query(query , function (error, rows, fields) {
       
        if (error) res.status(500).json({"status_code":500,"error_message" : "internal server error"});
        
        let products = renderProducts(rows);
        let product = products[id-1];
        console.log(product);
        console.log(id);
        res.render('productScreen',{'product' : product });
    });
       
});

app.listen(3000);