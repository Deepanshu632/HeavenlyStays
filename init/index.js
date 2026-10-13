 
 const mongoose = require("mongoose");
 const initData = require("./data.js");
 const Listing = require("../models/listing.js");

 main()
.then((res)=>{
    console.log("connecion Successful");
})
.catch((err)=>{
    console.log(err);
});

 async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
 }

 const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:"673f3d9a6a02fc36269d8c25"}));
    await Listing.insertMany(initData.data) ;
    console.log("data was initialized");
};


initDB();

