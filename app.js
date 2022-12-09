const express = require('express');
require("dotenv").config()
const connectDB = require("./config/Db")
const cookieParser  = require('cookie-parser')
const bodyparser = require('body-parser')
const cloudinary = require("cloudinary");
const cors = require('cors')
const questionRoute = require('./routes/questionRoute')
const survayRoute = require('./routes/survayRoute')
const userRoute = require('./routes/userRoute')
const auth = require('./routes/authRoute')
const session = require('express-session');
const cookieSession = require("cookie-session");
const fileUpload = require("express-fileupload");
const passport = require('passport');
const errorHandler = require('./middleWare/errorMiddleware')

const app = express()

app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());
app.use(bodyparser.json());
app.use(fileUpload());
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
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  

app.use('/api/question', questionRoute)
app.use('/api/survay', survayRoute)
app.use('/api/user',userRoute)
app.use('/',auth)


app.use(errorHandler);

connectDB()
const port = process.env.PORT
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
  });
  process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  
    server.close(() => {
      process.exit(1);
    });
  });