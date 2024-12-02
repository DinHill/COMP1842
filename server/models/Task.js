const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  deadline: { type: Date, required: true },
  status: { type: String, default: 'pending' },
});

module.exports = mongoose.model('Task', TaskSchema);