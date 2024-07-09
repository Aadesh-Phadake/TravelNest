if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
app.use(express.urlencoded({extended:true}));
const methodOverride = require("method-override");
app.use(methodOverride('_method'));
const ejsMate = require("ejs-mate")
app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
const expressError = require("./utils/expressError.js");
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const userRouter = require("./routes/user");


async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);
}
main().then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
})
const store = MongoStore.create({
    mongoUrl : process.env.ATLASDB_URL,
    crypto : {
        secret : process.env.SECRET
    },
    touchAfter : 24 * 60 * 60
})

store.on("error",function(e){
    console.log("SESSION STORE ERROR",e)
})
const sessionOptions = {
    store : store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7,
        httpOnly : true
    }
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("failure");
    res.locals.currentUser = req.user  ? req.user : null;
    next();
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



app.all("*",(req,res,next)=>{
    next(new expressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>{
    let {status = 500,message = "something went wrong"} = err;
    res.status(status).render("listings/error.ejs",{err});
})

app.listen("8080",(req,res)=>{
    console.log("server is running on port 8080");
})

