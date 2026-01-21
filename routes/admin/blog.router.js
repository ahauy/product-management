const express = require("express");
const routes = express.Router();  
const controller = require("../../controllers/admin/blogController");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' });

routes.get("/", controller.index);

routes.get("/create", controller.getCreate)

routes.post("/create/:status", upload.single("thumbnail"), controller.postCreate)

routes.patch("/change-featured/:featured/:id", controller.changeFeatured)

routes.delete("/delete-blog/:id", controller.deleteBlog)

routes.get("/read/:id", controller.getRead)

module.exports = routes;