const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Company name is required'],
  },
  position: {
    type: String,
    required: [true, 'Position is required'],
  },
  status: {
    type: String,
    enum: ['PENDING', 'INTERVIEW', 'REJECTED'],
    default: 'PENDING',
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
