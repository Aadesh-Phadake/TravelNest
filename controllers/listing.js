const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    let data = await Listing.find({});
    res.render("listings/index.ejs", { data: data });
}

module.exports.new =async (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.create =async (req, res) => {
    if (!req.body) {
        throw new expressError(400, "invalid data");
    }
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(filename , url);
    let newListing = new Listing(req.body);
    newListing.owner = req.user._id;
    newListing.image = {url:url,filename:filename};
    await newListing.save();
    req.flash("success", "New listing created");
    res.redirect("/listings");
    console.log(req.body);
}

module.exports.show =async (req, res) => {
    let id = req.params.id;
    let data = await Listing.findById(id).populate({path :"reviews" ,populate:{path:"author"}}).populate("owner");
    if (data == null) {
        req.flash("failure", "Listing you are looking for does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { data: data });
}

module.exports.edit =async (req, res) => {
    let id = req.params.id;
    let data = await Listing.findById(id);
    if (data == null) {
        req.flash("failure", "Listing you are looking for does not exist");
        return res.redirect("/listings");
    }
    let url = data.image.url;
    url = url.replace("/upload","/upload/w_250");
    console.log(url);
    res.render("listings/edit.ejs", { data: data,url:url });
}

module.exports.update = async (req, res) => {
    if (!req.body) {
        throw new expressError(400, "invalid data");
    }
    console.log(req.body);
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body);
    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url:url,filename:filename};
    await listing.save();
    }
    req.flash("success", "listing updated");
    res.redirect(`/listings/${id}`);
}

module.exports.delete = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted");
    res.redirect("/listings");
}