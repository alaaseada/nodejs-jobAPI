const express = require('express');
const router = express.Router();

const {
  getAllJobs,
  addJob,
  deleteJob,
  updateJob,
  getOneJob,
} = require('../controllers/jobs');

router.route('/').get(getAllJobs).post(addJob);
router.route('/:id').get(getOneJob).patch(updateJob).delete(deleteJob);

module.exports = router;
