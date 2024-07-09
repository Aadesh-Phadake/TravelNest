const User = require("../models/user");

module.exports.getSignup = async(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.postSignup = async(req,res)=>{
    try {
    let {username,email,password} = req.body;
    let registeredUser = await User.register(new User({username,email}),password);
    console.log(registeredUser);
    req.login(registeredUser,async(err)=>{
        if(err) return next(err);
        console.log("logged in");
        req.flash("success","Welcome to TravelNest");
    res.redirect("/listings");
    });
    
    } catch(err){
        req.flash("failure",err.message);
        res.redirect("/signup");
    }
}

module.exports.getLogin =(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.postLogin = async(req,res)=>{
    req.flash("success","Welcome back to TravelNest");
    res.redirect((res.locals.redirectUrl)  || "/listings");
}

module.exports.getLogout =async(req,res)=>{
    req.logout((err)=>{
        if(err) return next(err);
        req.flash("success","You are logged out");
    res.redirect("/listings");
    });
    
}