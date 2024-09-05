"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _productModel = _interopRequireDefault(require("../models/productModel"));
var _util = require("../util");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();
router.get('/', async (req, res) => {
  const category = req.query.category ? {
    category: req.query.category
  } : {};
  const searchKeyword = req.query.searchKeyword ? {
    name: {
      $regex: req.query.searchKeyword,
      $options: 'i'
    }
  } : {};
  const sortOrder = req.query.sortOrder ? req.query.sortOrder === 'lowest' ? {
    price: 1
  } : {
    price: -1
  } : {
    _id: -1
  };
  const products = await _productModel.default.find({
    ...category,
    ...searchKeyword
  }).sort(sortOrder);
  res.send(products);
});
router.get('/:id', async (req, res) => {
  const product = await _productModel.default.findOne({
    _id: req.params.id
  });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({
      message: 'Product Not Found.'
    });
  }
});
router.post('/:id/reviews', _util.isAuth, async (req, res) => {
  const product = await _productModel.default.findById(req.params.id);
  if (product) {
    const review = {
      name: req.body.name,
      rating: Number(req.body.rating),
      comment: req.body.comment
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((a, c) => c.rating + a, 0) / product.reviews.length;
    const updatedProduct = await product.save();
    res.status(201).send({
      data: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      message: 'Review saved successfully.'
    });
  } else {
    res.status(404).send({
      message: 'Product Not Found'
    });
  }
});
router.put('/:id', _util.isAuth, _util.isAdmin, async (req, res) => {
  const productId = req.params.id;
  const product = await _productModel.default.findById(productId);
  if (product) {
    product.name = req.body.name;
    product.price = req.body.price;
    product.image = req.body.image;
    product.brand = req.body.brand;
    product.category = req.body.category;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    const updatedProduct = await product.save();
    if (updatedProduct) {
      return res.status(200).send({
        message: 'Product Updated',
        data: updatedProduct
      });
    }
  }
  return res.status(500).send({
    message: ' Error in Updating Product.'
  });
});
router.delete('/:id', _util.isAuth, _util.isAdmin, async (req, res) => {
  const deletedProduct = await _productModel.default.findById(req.params.id);
  if (deletedProduct) {
    await deletedProduct.remove();
    res.send({
      message: 'Product Deleted'
    });
  } else {
    res.send('Error in Deletion.');
  }
});
router.post('/', _util.isAuth, _util.isAdmin, async (req, res) => {
  const product = new _productModel.default({
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    brand: req.body.brand,
    category: req.body.category,
    countInStock: req.body.countInStock,
    description: req.body.description,
    rating: req.body.rating,
    numReviews: req.body.numReviews
  });
  const newProduct = await product.save();
  if (newProduct) {
    return res.status(201).send({
      message: 'New Product Created',
      data: newProduct
    });
  }
  return res.status(500).send({
    message: ' Error in Creating Product.'
  });
});
var _default = exports.default = router;