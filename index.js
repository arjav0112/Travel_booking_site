if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

// console.log(process.env);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require('method-override');
const ejsmate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/signup.js");
const User = require("./models/user.js");


app.use(methodOverride('_method'))
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.engine("ejs",ejsmate);

const port =8080;
const dbUrl = process.env.ATLAS_URL;
main().then(()=>{console.log("connection spotted")}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: 'Mysecreatcode',
  },
  touchAfter: 24*3600,
})

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE",err);
})

const sessionOptions = {
  store:store,
  secret : "Mysecreatcode",
  resave : false,
  saveUninitialized : true,
  cookie: {
    expires : Date.now() + 7*24*60*60*1000,
    maxAge : 7*24*60*60*1000,
    httpOnly : true,
  },
}



app.get("/",(req,res)=>{
  res.send("app is working");
})

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.users = req.user;   //to store if user is logged in or not.
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})

app.use("/listing",listingRouter);
app.use("/listing/:id/review",reviewRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found!"));
})

//adding error handing-
app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went wrong"} = err;
  err.statusCode = statusCode;
  res.status(statusCode).render("error.ejs",{err});
});

app.listen(port,()=>{
    console.log(`Server is listening at http://localhost:${port}/listing`);
});