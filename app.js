const express = require('express')
const routes = require('./routes')

const app = express()
const PORT = 3000



app.use(express.urlencoded({ extended: true }))

const session = require('express-session')
const SESSION_SECRET = 'secret'
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))

const passport = require('./config/passport')
app.use(passport.initialize())
app.use(passport.session())

const { getUser } = require('./helpers/auth-helpers')

const flash = require('connect-flash')
app.use(flash())
app.use((req, res, next) => {
    res.locals.success_messages = req.flash('success_messages')
    res.locals.error_messages = req.flash('error_messages')
    res.locals.user = getUser(req)
    next()
})



app.use(routes)

const handlebarsHelpers = require('./helpers/handlebars-helpers')
const handlebars = require('express-handlebars')
app.engine('hbs', handlebars.engine({ defaultLayout: 'main', extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})

module.exports = app

