const express = require('express');
const app = express.Router();

const Product = require('../models/product.dto.js');

app.get('/', function (req, res) {
  let count;

  Product.countDocuments(function (err, c) {
    count = c;
  });
  Product.find(function (err, products) {
    res.send({products: products, count: count});
  });

});


app.post('/add-product', function (req, res) {

  req.checkBody('title', 'Title must have a value').notEmpty();
  req.checkBody('desc', 'Descrtiption must have a value').notEmpty();
  req.checkBody('price', 'Price must have a value').isDecimal();

  const title = req.body.title;
  const slug = title.replace(/\s+/g, '-').toLowerCase();
  const desc = req.body.desc;
  const price = req.body.price;
  const discount = req.body.discount;
  const category = req.body.category;


  const errors = req.validationErrors();

  if (errors) {
    Category.find(function (err, categories) {
      res.render('admin/add-product', {
        errors: errors,
        title: title,
        desc: desc,
        price: price,
        discount: discount,
        categories: categories
      });
    });
  } else {
    Product.findOne({ slug: slug }, function (err, product) {
      if (product) {
        req.flash('danger', 'Product title exists, choose another');
        res.render('admin/add-product', {
          title: title,
          desc: desc,
          price: price,
          discount: discount,
          categories: categories
        });
      } else {
        const price2 = parseFloat(price).toFixed(2);
        const discount2 = parseFloat(discount).toFixed(2);
        const product = new Product({
          title: title,
          slug: slug,
          desc: desc,
          price: price2,
          category: category,
        });
        console.log(product)

        product.save(function (err) {
          if (err) {
            return console.log(err);
          }

          res.send('success Product added');

        });
      }
    });
  }

});

app.put('/edit-product/:id', function (req, res) {
  
  req.checkBody('title', 'Title must have a value').notEmpty();
  req.checkBody('desc', 'Descrtiption must have a value').notEmpty();
  req.checkBody('price', 'Price must have a value').isDecimal();


  const title = req.body.title;
  const slug = title.replace(/\s+/g, '-').toLowerCase();
  const desc = req.body.desc;
  const price = req.body.price;
  const category = req.body.category;
  const id = req.params.id;

  const errors = req.validationErrors();

  if (errors) {
    req.session.errors = errors;
  } else {
    Product.findOne({ slug: slug, _id: { '$ne': id } }, function (err, prod) {
      if (err)
        console.log(err);
      if (prod) {
        res.send('danger, Product title already exists, please choose another');
      } else {
        Product.findById(id, function (err, prod) {
          if (err)
            console.log(err);

          prod.title = title;
          prod.slug = slug;
          prod.desc = desc;
          prod.price = parseFloat(price).toFixed(2);
          prod.category = category;
          console.log(prod)

          prod.save(function (err) {
            if (err)
              console.log(err);

            res.send('Success, Product edited')
          });
        });
      }

    });
  }
});

app.delete('/delete-product/:id', function (req, res) {
  Product.findByIdAndRemove(req.params.id, function (err) {
    if (err) return
    console.log(err);
    Product.find({}, function (err, product) {
      if (err) {
        console.log(err);
      } else {
        req.app.locals.product = product;
      }
    });

    res.send('success Product deleted!');

  });
});


module.exports = app;