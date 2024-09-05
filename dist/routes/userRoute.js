"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _userModel = _interopRequireDefault(require("../models/userModel"));
var _util = require("../util");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const router = _express.default.Router();
router.put('/:id', _util.isAuth, async (req, res) => {
  const userId = req.params.id;
  const user = await _userModel.default.findById(userId);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;
    const updatedUser = await user.save();
    res.send({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: (0, _util.getToken)(updatedUser)
    });
  } else {
    res.status(404).send({
      message: 'User Not Found'
    });
  }
});
router.post('/signin', async (req, res) => {
  const signinUser = await _userModel.default.findOne({
    email: req.body.email,
    password: req.body.password
  });
  if (signinUser) {
    res.send({
      _id: signinUser.id,
      name: signinUser.name,
      email: signinUser.email,
      isAdmin: signinUser.isAdmin,
      token: (0, _util.getToken)(signinUser)
    });
  } else {
    res.status(401).send({
      message: 'Invalid Email or Password.'
    });
  }
});
router.post('/register', async (req, res) => {
  const user = new _userModel.default({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  const newUser = await user.save();
  if (newUser) {
    res.send({
      _id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token: (0, _util.getToken)(newUser)
    });
  } else {
    res.status(401).send({
      message: 'Invalid User Data.'
    });
  }
});
router.get('/createadmin', async (req, res) => {
  try {
    const user = new _userModel.default({
      name: 'Basir',
      email: 'admin@example.com',
      password: '1234',
      isAdmin: true
    });
    const newUser = await user.save();
    res.send(newUser);
  } catch (error) {
    res.send({
      message: error.message
    });
  }
});
var _default = exports.default = router;