const express = require("express");
const app = express();
const mongoose = require("mongoose");
const List = require("../models/listing.js");
const initdata = require("./data.js");

const dbUrl = process.env.ATLAS_URL;
main().then(()=>{console.log("connection spotted")}).catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb+srv://Arjav:cUDoqicYgOumTLaD@cluster0.g43to.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
}

const initDB = async () =>{
    await List.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({
      ...obj,
      owner: "66bb9fb6065c946f0f1692a4",
    }));
    await List.insertMany(initdata.data);
    console.log("data was saved");
}

initDB();