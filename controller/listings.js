const List = require("../models/listing.js");

module.exports.homePage = async (req,res)=>{
    let listings = await List.find();
    res.render("listings/home.ejs",{listings});
};

module.exports.renderNewpage = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.renderEditpage = async (req,res)=>{
    let id = req.params.id;
    // console.log(id);
    let list = await List.findById(id);
    if(!list){
        req.flash("error","Listing does not exist");
        res.redirect("/listing");
    }

    let originalImage = list.image.url;
    originalImage = originalImage.replace("/upload","/upload/w_250");
    console.log(originalImage)
    // console.log(list);
    res.render("listings/edit.ejs",{list,originalImage});
};

module.exports.renderShowpage = async (req,res)=>{
    let id = req.params.id;
    // console.log(id);
    let list = await List.findById(id).populate({path:"review",populate:{path : "author"}}).populate("owner");
    if(!list){
        req.flash("error","Listing does not exist");
        res.redirect("/listing");
    }
    // console.log(list);
    res.render("listings/show.ejs",{list});
};

module.exports.updateListing = async (req,res)=>{
    let id = req.params.id;
    // console.log(id);
    let {title: newtitle,description: newdescription,price: newprice,loaction: newlocation,country: newcountry} = req.body;
    // console.log(req.body);
    
    
    let list = await List.findByIdAndUpdate(id,{title: newtitle,description: newdescription,price: newprice,location: newlocation,country: newcountry},{new:true});
    
    // console.log(list);
    
    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        console.log(req.file);
        list.image = {url , filename};
        await list.save();
    }
    
    req.flash("success","Listing updated");
    res.redirect(`/listing/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
    let id = req.params.id;
   
    await List.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    res.redirect("/listing");
};

module.exports.createNew = async (req,res,next)=>{
    
    let {title,description,price,location,country} = req.body;
    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(req.body);
    let newlist = await new List({title: title,description: description,price: price,location : location,country : country});
    newlist.image = {url ,filename};
    newlist.owner = req.user._id;
    await newlist.save();
    req.flash("success","New listing created");
    res.redirect("/listing");
    
};