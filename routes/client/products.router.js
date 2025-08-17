const express = require('express')
const routes = express.Router()

routes.get('/', (req, res) => {
  res.send('Products Page')
})

routes.get('/create', (req, res) => {
  res.send('Products create page')
})

module.exports = routes;