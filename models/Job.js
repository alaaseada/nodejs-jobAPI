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
    enum: ['Pending', 'Interview', 'Rejected'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  lastModified: {
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
