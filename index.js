const express = require('express')
const route = require('./routes/client/index.router')
const routeAdmin = require("./routes/admin/index.router")
const database = require('./config/database')
const systemAdmin = require("./config/system")
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const flash = require('express-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')

require('dotenv').config();

const app = express()
const port = process.env.PORT;


app.use(methodOverride('_method'))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())

database.connect()

// config static file - chỉ dùng được cho pug
app.use(express.static('public'))

// config template engines
app.set('views', "./views")
app.set('view engine', 'pug')

// config express-flash
app.use(cookieParser('hello world'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

// call route
route(app) // client
routeAdmin(app) // admin

// Local varliables - chỉ dùng được trong file pub - cái phần render 
app.locals.prefixAdmin = systemAdmin.prefixAdmin

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})