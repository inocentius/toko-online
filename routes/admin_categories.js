const express = require('express');
const app = express.Router();

const Category = require('../models/category.dto.js');

app.get('/', function (req, res) {
    Category.find(function (err, categories) {
      if (err) return console.log(err);
      res.json(categories);
    });
});


app.post('/add-category', function (req, res, next) {

  req.checkBody('title', 'Title must have a value').notEmpty();

  const title = req.body.title;
  const slug = title.replace(/\s+/g, '-').toLowerCase();

  const errors = req.validationErrors();

  if (errors) {
    res.send('Error, please review your code');

  } else {
    Category.findOne({ slug: slug }, function (err, category) {
      if (category) {
        res.send("category already exist")
      } else {
        const category = new Category({
          title: title,
          slug: slug
        });

        category.save(function (err) {
          if (err) {
            return console.log(err);
          }
          
          res.send('success, Category added');
        });
      }
    });
  }

});

app.put('/edit-category/:id', function (req, res, next) {

  req.checkBody('title', 'Title must have a value').notEmpty();

  const title = req.body.title;
  const slug = title.replace(/\s+/g, '-').toLowerCase();
  const id = req.params.id;

  const errors = req.validationErrors();

  if (errors) {
    res.send(errors);
  } else {
    Category.findOne({ slug: slug, _id: { '$ne': id } }, function (err, category) {
      if (category) {
        res.send("category already exist");
      } else {

        Category.findById(id, function (err, category) {
          if (err)
            return console.log(err);

          category.title = title;
          category.slug = slug;

          category.save(function (err) {
            if (err)
              return console.log(err);

            res.send('Success, Category edited!');
          });
        });

      }
    });
  }

});

app.delete('/delete-category/:id', function (req, res, next) {
  Category.findByIdAndRemove(req.params.id, function (err) {
    if (err) return
    console.log(err);
    Category.find({}, function (err, categories) {
      if (err) {
        console.log(err);
      } else {
        req.app.locals.categories = categories;
      }
    });

    res.send('success Category deleted!');

  });
});


module.exports = app;