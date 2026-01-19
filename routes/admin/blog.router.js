const express = require("express");
const routes = express.Router();  
const controller = require("../../controllers/admin/blogController");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });

routes.get("/", controller.index);

routes.get("/create", controller.getCreate)

routes.post("/create/:status", upload.single("thumbnail"), controller.postCreate)

module.exports = routes;