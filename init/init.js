const mongoose = require("mongoose");
const data = require("./data");
const path = require("path");
const Listing = require("../../models/listing");
async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);
}
main().then(()=>{
    console.log("connected");
}).catch((err)=>{
    console.log(err);
})
const initDB = async() =>{
    await Listing.deleteMany({});
    data.data = data.data.map((obj)=>({
        ...obj,owner:"668bda7e6c229951c0c1a35f"
    }))
    await Listing.insertMany(data.data).then(()=>{
        console.log("inserted");
    })
    
}
initDB()