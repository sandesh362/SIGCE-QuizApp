const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const connect = await mongoose.connect("mongodb+srv://darkangel:darkangel@sigce.xqqbh.mongodb.net/?retryWrites=true&w=majority&appName=Sigce");
        console.log("Connected to DB");
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = connectDB