// services/taskService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/tasks';

export const getTasks = () => {
  console.log('Fetching all tasks'); // Add this line
  return axios.get(API_URL);
};
export const createTask = (task) => {
  console.log('Creating task:', task); // Add this line
  return axios.post(API_URL, task);
};
export const getTaskById = (id) => {
  console.log('Fetching task by ID:', id); // Add this line
  return axios.get(`${API_URL}/${id}`);
};
export const updateTask = (id, task) => {
  console.log('Updating task:', id, task); // Add this line
  return axios.put(`${API_URL}/${id}`, task);
};
export const deleteTask = (id) => {
  console.log('Deleting task:', id); // Add this line
  return axios.delete(`${API_URL}/${id}`);
};
export const getTasksByDate = (date) => {
  console.log('Fetching tasks by date:', date); // Add this line
  return axios.get(`${API_URL}/date/${date}`);
};