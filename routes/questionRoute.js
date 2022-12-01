const express = require('express')
const router = express.Router()

const {
    getQuestion,
    createQuestion,
    getQuestionById,
    updateQuestion,
    deleteQuestion
} = require('../controllers/questionController')

router.route('/').get(getQuestion).post(createQuestion)


router
    .route('/:id')
    .get(getQuestionById)
    .put(updateQuestion)
    .delete(deleteQuestion)

module.exports = router

