const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
//const { types } = require("hardhat/config");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"Please tell us your name"],
    },
    email: {
        type: String,
        required: [true,"Please provide your email"],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true,"PLease provide a password"]
    },

    passwordConfirm: {
        type: String,
        required: [true,"PLease confirm your password"],
        validate: {
            validator: function(el){
                return el === this.password;

            },
            message: "Password are not the same!",
        },

    
    },
    infos: [{ type: String }] , 
    activities: [{
        receiver: { type: String, required: true }, // First attribute
        amount: { type: String, required: true }   // Second attribute
    }] ,// Define an array of strings
    address: String,
    private_key: String,
    mnemonic: String, 
});

userSchema.pre("save",async function (next) {
    //Only run this function if password was actually modified
    if(!this.isModified("password")) return next();

    //Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password,12);

    //Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre("save", function (next) {
   
    if(!this.isModified("password") || this.isNew) return next();

    
    this.passwordChangedAt = Date.now() - 1000;

    
    next();
});


userSchema.pre(/^find/, function (next){
    //this points to the current query
    this.find({active: {$ne: false}});
    next();
});


userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
){
    return await bcrypt.compare(candidatePassword,userPassword);

};

userSchema.methods.changePasswordAfter =  function(JWTTimestamp)
{
    if(this.PasswordChangeAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        return JWTTimestamp < changedTimestamp;
    }
    
    //False means not changed
    return false;

};
const User = mongoose.model("User",userSchema);
module.exports = User;

