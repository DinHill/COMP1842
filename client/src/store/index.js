// store/index.js
import { createStore } from 'vuex';
import { getTasks, createTask, getTasksByDate } from '../services/taskService';

export default createStore({
  state: {
    tasks: [],
    currentDate: new Date().toISOString().substr(0, 10),
  },
  mutations: {
    setTasks(state, tasks) {
      console.log('Setting tasks:', tasks); // Add this line
      state.tasks = tasks;
    },
    setCurrentDate(state, date) {
      state.currentDate = date;
    },
    prevDay(state) {
      const date = new Date(state.currentDate);
      date.setDate(date.getDate() - 1);
      state.currentDate = date.toISOString().substr(0, 10);
    },
    nextDay(state) {
      const date = new Date(state.currentDate);
      date.setDate(date.getDate() + 1);
      state.currentDate = date.toISOString().substr(0, 10);
    },
  },
  actions: {
    async fetchTasks({ commit, state }) {
      try {
        const response = await getTasks();
        const tasks = response.data.filter(task => task.date === state.currentDate);
        console.log('Fetched tasks:', tasks); // Add this line
        commit('setTasks', tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    },
    async addTask({ dispatch }, task) {
      try {
        await createTask(task);
        dispatch('fetchTasks');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    },
    async fetchTasksByDate({ commit }, date) {
      try {
        const response = await getTasksByDate(date);
        console.log('Fetched tasks by date:', response.data); // Add this line
        commit('setTasks', response.data);
      } catch (error) {
        console.error('Error fetching tasks by date:', error);
      }
    },
  },
  modules: {},
});