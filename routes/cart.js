const express = require('express');
const app = express.Router();

const Product = require('../models/product.dto');


app.get('/add/:product', function (req, res) {

  const slug = req.params.product;

  Product.findOne({ slug: slug }, function (err, p) {
    if (err)
      console.log(err);

    if (typeof req.session.cart == "undefined") {
      req.session.cart = [];
      req.session.cart.push({
        title: slug,
        qty: 1,
        price: parseFloat(p.price).toFixed(2),
      });
    } else {
      let cart = req.session.cart;
      let newItem = true;

      for (let i = 0; i < cart.length; i++) {
        if (cart[i].title == slug) {
          cart[i].qty++;
          newItem = false;
          break;
        }
      }

      if (newItem) {
        cart.push({
          title: slug,
          qty: 1,
          price: parseFloat(p.price).toFixed(2),
        });
      }
    }
    console.log(req.session.cart)
    res.send('success, product added to cart successfully')
  });
});


app.get('/calculate', function (req, res) {
  let total = 0;
  req.session.cart.forEach(item => {
    total = total + item.price * item.qty;
  });
  res.send('your total is price is Rp ' + total);
});


app.get('/checkout', function (req, res) {

  if (req.session.cart && req.session.cart.length == 0) {
    delete req.session.cart;
  } else {
    console.log(req.session.cart); 
    res.json(req.session.cart);
  }

});


module.exports = app;
