const express = require('express')
const app = express()

const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const db = require('./models')
const Todo = db.Todo
const User = db.User

const port = 3000

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const session = require('express-session')
const passport = require('passport')

app.use(session({
  secret: 'your secret key',
  resave: 'false',
  saveUninitialized: 'false',
}))
// 使用 Passport - 要在「使用路由器」前面
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  next()
})

app.use('/', require('./routes/home'))
app.use('/users', require('./routes/user'))
app.use('/todos', require('./routes/todo'))

// 設定 express port 3000
app.listen(port, () => {
  console.log(`App is running on port ${port}!`)
})