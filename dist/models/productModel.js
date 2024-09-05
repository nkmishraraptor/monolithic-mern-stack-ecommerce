"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const reviewSchema = new _mongoose.default.Schema({
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  comment: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});
const prodctSchema = new _mongoose.default.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    default: 0,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  countInStock: {
    type: Number,
    default: 0,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    required: true
  },
  numReviews: {
    type: Number,
    default: 0,
    required: true
  },
  reviews: [reviewSchema]
});
const productModel = _mongoose.default.model('Product', prodctSchema);
var _default = exports.default = productModel;