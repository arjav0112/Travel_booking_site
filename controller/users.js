const User = require("../models/user.js")

module.exports.renderSignup = async (req,res,next)=>{
    res.render("user/signup.ejs");
};

module.exports.regiterUser = async (req,res,next)=>{
    try{
        let {username , email, password} = req.body;
        let newuser = new User({username : username, email: email});
        let registereduser =await User.register(newuser,password);
        req.login(registereduser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("Success","Welcome Traveller, to travels");
            res.redirect("/listing");
        })
        // console.log(registereduser);
        
    } catch(e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    };
};

module.exports.renderLogin = async (req,res)=>{
    res.render("user/login.ejs");
};

module.exports.loginUser = async (req,res)=>{
    req.flash("success","Welcome back! to Travels , Your travel journey begins");
    if(res.locals.redirectUrl){
    res.redirect(res.locals.redirectUrl);
    }else{
        res.redirect("/listing");
    }
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You have Logged out Successfully");
        res.redirect("/listing");
    });
};