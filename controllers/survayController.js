const Question = require("../models/questionModel");
const Survay = require("../models/survayModel");

// Create Survay
const createSurvay = async (req, res) => {
  const newsurvay = req.body; // const {petname, pet_type } = req.body
  const survay = new Survay({
    name: newsurvay.name,
    survayDate: newsurvay.survayDate,
    Questions:newsurvay.Questions
  });
  survay
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error.",
      });
    });
};


//Get All Survay
const getSurvay = async (req, res) => {
  const survay = await Survay.find({})
  .populate('Questions',' Question  options')
  
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred.",
      });
    });
};





//Get Survay By ID

const getSurvayById = async (req, res) => {
  const { id } = req.params;
  try {
    const survay = await Survay.findById(id);
    if (!survay) {
      return res.status(404).send("The Survay with given ID not found");
    }
    res.send(survay);
  } catch (err) {
    console.log("Error: ", err.message);
    res.status(404).send(err.message);
  }
};









module.exports = {
    createSurvay,
    getSurvay,
    getSurvayById
  };