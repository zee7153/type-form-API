const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionSchema = new mongoose.Schema({
      Question:{type:String, required:true},
      questionType:{
            type: String,
            enum: ['text', 'number', 'radio','checkbox','image','file','email'],
            required: true,
        },
      options:{type:[String], require:true}
});


const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
