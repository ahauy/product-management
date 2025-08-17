const express = require('express')
const route = require('./routes/client/index.router')
require('dotenv').config();

const app = express()
const port = process.env.PORT;


// config static file
app.use(express.static('public'))

// config template engines
app.set('views', "./views")
app.set('view engine', 'pug')

// call route
route(app)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})