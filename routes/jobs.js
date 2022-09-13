const express = require('express');
const router = express.Router();

const { getAllJobs, addJob } = require('../controllers/jobs');

router.route('/').get(getAllJobs);
router.post('/', addJob);

module.exports = router;
