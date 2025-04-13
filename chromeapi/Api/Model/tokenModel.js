const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
    name: String,
    address: { type: String, required: true, unique: true },
    symbol: String,
});

const Token = mongoose.model("Token",tokenSchema);
module.exports = Token;

