const mongoose = require("mongoose");

const survaySchema = new mongoose.Schema({
  name:String,
  survayDate: {
    type: Date,
    default: Date.now,
  },
  Questions: [ {type: mongoose.Types.ObjectId,ref: "Question"} ],
});
const Survay = mongoose.model("Survay", survaySchema);

module.exports = Survay;
