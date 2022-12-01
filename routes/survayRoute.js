const express = require('express')
const router = express.Router()

const {
    createSurvay,
    getSurvay,
    getSurvayById
   
} = require('../controllers/survayController')

router.route('/')
.post(createSurvay)
.get(getSurvay)


router
    .route('/:id')
    .get(getSurvayById)

module.exports = router