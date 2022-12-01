const Question = require("../models/questionModel");


// Create Questions
const createQuestion = async (req, res) => {
  const newquestion = req.body; // const {petname, pet_type } = req.body
  const question = new Question({
    Question: newquestion.Question,
    questionType: newquestion.questionType,
    options:newquestion.options,
    SurvayID:newquestion.SurvayID
  });
  question.save()
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



// GET Questions
const getQuestion = async (req, res) => {
  const question = await Question.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred .",
      });
    });
};


// GET question By ID
const getQuestionById = async (req, res) => {
    const { id } = req.params;
    try {
      const question = await Question.findById(id);
      if (!question) {
        return res.status(404).send("The Question with given ID not found");
      }
      res.send(question);
    } catch (err) {
      console.log("Error: ", err.message);
      res.status(404).send(err.message);
    }
  };




// Update Question
  const updateQuestion = async (req, res) => {
    const { id } = req.params;
    const question = await Question.findById(id);
    try{
      if (!question) {
          return;
        }
      
        await Question.findByIdAndUpdate(
          { _id: id },
          {
            Question: req.body.Question,
            questionType: req.body.questionType,
            options: req.body.options
          },
          { new: true }
        )
        res.send(question);
      
    } catch (err) {
      console.log("Error: ", err.message);
      res.status(404).send(err.message);
    }
  };


 
// Delete Question
  const deleteQuestion = async (req, res) => {
    const { id } = req.params;
    const question = await Question.deleteOne({ _id: id })
      .then()
      .catch((err) => {
        res.status(500).send({
          message: "Error in Deleting Question",
        });
      });
    res.send("deleted");
  };




module.exports = {
    getQuestion,
    createQuestion,
    getQuestionById,
    updateQuestion,
    deleteQuestion
    
  };