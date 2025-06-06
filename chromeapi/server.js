const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env"});
const app = require("./app");

// const DB = process.env.DATABASE.replace(
//     "<PASSWORD>",
//     process.env.DATABASE_PASSWORD
// );



const uri = process.env.DB_URI;

mongoose.connect(uri,{
    userNewUrlParser: true,
    userCreateIndex: true,
    userFindAndModify: false,
    tlsAllowInvalidCertificates: true, // Temporarily bypass SSL certificate issues
  
}).then(() => console.log("DB connection successful"));



const port = 3000;

app.listen(port, () => {
    console.log(`App running on port ${port}....`);
});