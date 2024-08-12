const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportlocalmongosse = require("passport-local-mongoose");

const userSchema  = new Schema({
    email : {
        type: String,
        required: true,
    }
});

userSchema.plugin(passportlocalmongosse);

module.exports = mongoose.model("User",userSchema);
