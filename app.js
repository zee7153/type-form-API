const express = require('express');
require("dotenv").config()
const connectDB = require("./config/Db")
const cookieParser  = require('cookie-parser')
const bodyparser = require('body-parser')
const cors = require('cors')
const questionRoute = require('./routes/questionRoute')
const survayRoute = require('./routes/survayRoute')
const userRoute = require('./routes/userRoute')
const auth = require('./routes/authRoute')
const session = require('express-session');
const cookieSession = require("cookie-session");

const passport = require('passport');
const errorHandler = require('./middleWare/errorMiddleware')

const app = express()

app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());
app.use(bodyparser.json())
app.use(cors({origin: "http://localhost:3000",
methods: "GET,POST,PUT,DELETE",
credentials: true,}))

// set view engine
app.set('view engine', 'ejs');

// set up session cookies
app.use(session({
    secret: 'QWERT',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
 }));


// initialize passport
app.use(passport.initialize());
app.use(passport.session());


app.use('/api/question', questionRoute)
app.use('/api/survay', survayRoute)
app.use('/api/user',userRoute)
app.use('/',auth)


app.use(errorHandler);

connectDB()
const port = process.env.PORT
app.listen(port, () => console.log(`Server running......`))