const express = require("express");
const app = express();
const mongoose = require("mongoose");
const List = require("../models/listing.js");
const initdata = require("./data.js");

main().then(()=>{console.log("connection spotted")}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/travel');
}

const initDB = async () =>{
    await List.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({
      ...obj,
      owner: "66b0a8d065836b2daf3a26d7",
    }));
    await List.insertMany(initdata.data);
    console.log("data was saved");
}

initDB();