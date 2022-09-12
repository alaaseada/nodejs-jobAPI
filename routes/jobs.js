const express = require('express');
const router = express.Router();

const { getAllJobs } = require('../controllers/jobs');

router.route('/').get(getAllJobs);

module.exports = router;
