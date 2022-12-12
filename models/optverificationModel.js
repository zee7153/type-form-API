const mongoose = require('mongoose')

const userOPTverificationSchema = new mongoose.Schema({
    userId : String,
    otp :String,
    createdAt: Date,
    expiredAt: Date,
});


const userOPTverification = mongoose.model(
       "userOPTverification",
       userOPTverificationSchema
);

module.exports = userOPTverification;