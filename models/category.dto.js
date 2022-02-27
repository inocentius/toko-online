const mongoose = require('mongoose');

// category schema
const CategorySchema = mongoose.Schema({

  title: {
    type: String,
    require: true
  },
  slug: {
    type: String
  },
  image: {
    type: String
  }

});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;
