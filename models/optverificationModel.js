const mongoose = require('mongoose')

const userOPTverificationSchema = new mongoose.Schema({
    userId : String,
    opt :String,
    createdAt: Date,
    expiered:Date
});


const userOPTverification = mongoose.model(
       "userOPTverification",
       userOPTverificationSchema
);

module.exports = userOPTverification;