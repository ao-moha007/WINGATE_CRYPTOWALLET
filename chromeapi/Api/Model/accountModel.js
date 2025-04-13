const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    privateKey: String,
    address: String,
    infos: [{ type: String }],
    activities: [[{
        receiver: { type: String, required: true }, // First attribute
        amount: { type: String, required: true }   // Second attribute
    }] ,] ,
});

const Account = mongoose.model("Account",accountSchema);
module.exports = Account;

