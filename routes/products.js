const express = require('express');
const app = express.Router();
const fs = require('fs-extra');

const Product = require('../models/product.dto');

const Category = require('../models/category.dto');

app.get('/', function (req, res) {

  Category.find({}, function (err, categories) {
    Product.find({}, function (err, products) {
      if (err)
        console.log(err);

      res.json(products);
    });
  })
});


app.get('/:category', function (req, res) {
  console.log(req.params)
  const categorySlug = req.params.category;

  Category.findOne({ slug: categorySlug }, function (err, c) {
      Product.find({ category: categorySlug }, function (err,product) {
          console.log(product)
          if (err)
              console.log(err);

          res.json(product)
      })
  });
});

app.get('/:category/:product', function (req, res) {

  Product.findOne({ slug: req.params.product }, function (err, product) {
    if (err) {
      console.log(err);
    } else {
          res.json(product)
    }
  });
});


module.exports = app;
