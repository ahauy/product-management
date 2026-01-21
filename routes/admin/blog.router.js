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

routes.get("/edit/:id", controller.getEdit)

routes.patch("/edit/:id", upload.single("thumbnail") ,controller.patchEdit)

routes.patch("/edit/:id/:status", upload.single("thumbnail"), controller.patchEditStatus)

module.exports = routes;