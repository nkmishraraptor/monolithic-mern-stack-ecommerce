"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _express = _interopRequireDefault(require("express"));
var _multer = _interopRequireDefault(require("multer"));
var _multerS = _interopRequireDefault(require("multer-s3"));
var _awsSdk = _interopRequireDefault(require("aws-sdk"));
var _config = _interopRequireDefault(require("../config"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const storage = _multer.default.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  }
});
const upload = (0, _multer.default)({
  storage
});
const router = _express.default.Router();
router.post('/', upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});
_awsSdk.default.config.update({
  accessKeyId: _config.default.accessKeyId,
  secretAccessKey: _config.default.secretAccessKey
});
const s3 = new _awsSdk.default.S3();
const storageS3 = (0, _multerS.default)({
  s3,
  bucket: 'amazona-bucket',
  acl: 'public-read',
  contentType: _multerS.default.AUTO_CONTENT_TYPE,
  key(req, file, cb) {
    cb(null, file.originalname);
  }
});
const uploadS3 = (0, _multer.default)({
  storage: storageS3
});
router.post('/s3', uploadS3.single('image'), (req, res) => {
  res.send(req.file.location);
});
var _default = exports.default = router;