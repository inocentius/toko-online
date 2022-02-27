const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/database');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');

mongoose.connect(config.database);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use(expressValidator({
    errorFormatter: function (param, mag, value) {
        const namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;
        
        while(namespace.length) {
        formParam += '[' +namespace.shift() + ']';
        }
        
        return {
        param : formParam,
        mag : mag,
        value : value
        };
    }
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.get('*', function (req, res, next) {
    res.locals.cart = req.session.cart;
    next();
});


const adminCategories = require('./routes/admin_categories.js')
const adminProducts = require('./routes/admin_products.js')
const Products = require('./routes/products.js')
const cart = require('./routes/cart.js')

app.use('/admin/categories', adminCategories);
app.use('/admin/products', adminProducts);
app.use('/products', Products);
app.use('/cart', cart);

app.get('/', function(req, res) {
    res.send('working')
});

const port = 4000;
app.listen(port, function () {
    console.log('listening on port ' + port);
});