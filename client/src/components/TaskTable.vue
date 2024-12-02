<template>
  <div>
    <h1 class="text-3xl font-bold mb-8 text-center text-primary">Welcome to Your Task Manager</h1>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead class="bg-primary text-white">
          <tr>
            <th class="py-2 px-4 border">No.</th>
            <th class="py-2 px-4 border">Task Title</th>
            <th class="py-2 px-4 border">Task Description</th>
            <th class="py-2 px-4 border">Status</th>
            <th class="py-2 px-4 border">Deadline</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(task, index) in tasks" :key="task._id" class="border-b hover:bg-secondary cursor-pointer" @click="editTask(task)">
            <td class="py-2 px-4 border text-center">{{ index + 1 }}</td>
            <td class="py-2 px-4 border">{{ task.title }}</td>
            <td class="py-2 px-4 border">{{ task.description }}</td>
            <td class="py-2 px-4 border text-center" @click.stop>
              <button @click="updateStatus(task, 'pending')" :class="getStatusClass(task.status, 'pending')" class="mx-1">Pending</button>
              <button @click="updateStatus(task, 'in-progress')" :class="getStatusClass(task.status, 'in-progress')" class="mx-1">In Progress</button>
              <button @click="updateStatus(task, 'completed')" :class="getStatusClass(task.status, 'completed')" class="mx-1">Completed</button>
            </td>
            <td class="py-2 px-4 border text-center">{{ formatDeadline(task.deadline) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { updateTask } from '../services/taskService';

export default {
  computed: {
    ...mapState(['tasks', 'currentDate']),
    formattedDate() {
      return new Date(this.currentDate).toLocaleDateString();
    },
  },
  methods: {
    async updateStatus(task, status) {
      task.status = status;
      await updateTask(task._id, task);
      this.$store.dispatch('fetchTasksByDate', this.currentDate);
    },
    getStatusClass(currentStatus, status) {
      return currentStatus === status ? 'bg-primary text-white' : 'bg-gray-300 text-gray-700';
    },
    formatDeadline(deadline) {
      const options = { timeZone: 'Asia/Ho_Chi_Minh', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      const date = new Date(deadline);
      return new Intl.DateTimeFormat('vi-VN', options).format(date);
    },
    editTask(task) {
      this.$emit('edit-task', task);
    }
  },
  watch: {
    currentDate(newDate) {
      this.$store.dispatch('fetchTasksByDate', newDate);
    }
  },
  created() {
    this.$store.dispatch('fetchTasksByDate', this.currentDate);
  },
};
</script>

<style scoped>
.bg-primary {
  background-color: #4335A7;
}
.bg-gray-300 {
  background-color: #e2e8f0;
}
.text-gray-700 {
  color: #4a5568;
}
button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
}
button.mx-1 {
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}
</style>