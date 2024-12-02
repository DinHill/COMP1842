
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const cron = require('node-cron');
const Task = require('./models/Task');

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/taskmanager');

app.use(cors());
app.use(bodyParser.json());
app.use('/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Set up reminders
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const tasks = await Task.find({ reminders: { $elemMatch: { $lte: now } } });
  tasks.forEach(task => {
    console.log(`Reminder: ${task.title} is due!`);
    // Send email or notification
  });
});