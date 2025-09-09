const express = require('express')
const route = require('./routes/client/index.router')
const routeAdmin = require("./routes/admin/index.router")
const database = require('./config/database')
const systemAdmin = require("./config/system")
const methodOverride = require('method-override')


require('dotenv').config();

const app = express()
const port = process.env.PORT;

app.use(methodOverride('_method'))

database.connect()

// config static file
app.use(express.static('public'))

// config template engines
app.set('views', "./views")
app.set('view engine', 'pug')

// call route
route(app) // client
routeAdmin(app) // admin

// Local varliables
app.locals.prefixAdmin = systemAdmin.prefixAdmin

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})