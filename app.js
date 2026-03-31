const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const moment = require('moment');
require('dotenv').config();

// Import Routes & Config
const route = require('./routes/client/index.router');
const routeAdmin = require('./routes/admin/index.router');
const database = require('./config/database');
const systemAdmin = require('./config/system');

const app = express();

// Kết nối DB
database.connect();

// Middleware xử lý form & JSON
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cấu hình Static file (Bắt buộc dùng path.join cho Vercel)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// Cấu hình Template Engine (Pug)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Cấu hình Flash & Session
// Lưu ý: nên đưa chuỗi 'hello world' vào biến môi trường (VD: process.env.SESSION_SECRET)
app.use(cookieParser('hello world'));
app.use(session({ 
    secret: 'hello world', 
    resave: false, 
    saveUninitialized: false, 
    cookie: { maxAge: 60000 } 
}));
app.use(flash());

// Biến toàn cục (Local variables) sử dụng trong file Pug
app.locals.moment = moment;
app.locals.prefixAdmin = systemAdmin.prefixAdmin;
app.locals.apiTinymce = process.env.API_KEY_TINYMCE;

// Khởi tạo Routes
// Tùy thuộc vào cách bạn viết router. Nếu file router export hàm thì dùng: route(app);
// Nếu export express.Router() thì dùng app.use('/', route);
route(app);
routeAdmin(app);

// ❗ QUAN TRỌNG: export trực tiếp app
module.exports = app;