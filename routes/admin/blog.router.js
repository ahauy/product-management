const express = require("express");
const routes = express.Router();  
const controller = require("../../controllers/admin/blogController");
const validate = require('../../validate/admin/product.validate')
const storageMulter = require('../../helpers/admin/storageMulter')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });

routes.get("/", controller.index);

routes.get("/create", controller.getCreate)

module.exports = routes;