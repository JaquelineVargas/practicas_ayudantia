const mongoose = require("./connect");
var USERSCHEMA = {
name: String,
email: String,
foto:String,
password : String,
}

const USERS = mongoose.model("users", USERSCHEMA);
module.exports = USERS;
