const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/client/checkoutController')

// 1. Các route chức năng cụ thể (ĐẶT LÊN ĐẦU)
routes.post('/order', controller.orderPost)
routes.get('/momo/callback', controller.momoCallback) // Callback phải nằm trước :orderId
routes.get('/failure', controller.failure) // <-- Thêm route này để hứng lỗi

// 2. Route dynamic (ĐẶT CUỐI CÙNG)
// Vì nó sẽ "hứng" tất cả các link còn lại
routes.get("/:orderId", controller.getCheckout)

module.exports = routes;