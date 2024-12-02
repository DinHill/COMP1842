<template>
  <div id="app" class="bg-background min-h-screen">
    <nav class="bg-primary p-4 text-white flex justify-between items-center shadow-lg">
      <div class="flex items-center space-x-4">
        <button @click="prevDay" class="bg-secondary hover:bg-accent text-white font-bold py-2 px-4 rounded">Previous Day</button>
        <span class="mx-4">{{ formattedDate }}</span>
        <button @click="nextDay" class="bg-secondary hover:bg-accent text-white font-bold py-2 px-4 rounded">Next Day</button>
      </div>
      <div class="text-lg font-bold">Task Manager</div>
    </nav>
    <div class="p-4">
      <router-view @edit-task="editTask"></router-view>
    </div>
    <button @click="showForm" class="fixed bottom-4 right-4 bg-primary hover:bg-accent text-white p-4 rounded-full shadow-lg">+</button>
    <TaskForm ref="taskForm" @task-updated="reloadTasks" />
  </div>
</template>

<script>
import TaskForm from './components/TaskForm.vue';
import { mapState } from 'vuex';

export default {
  name: 'App',
  components: {
    TaskForm
  },
  computed: {
    ...mapState(['currentDate']),
    formattedDate() {
      return new Date(this.currentDate).toLocaleDateString();
    }
  },
  methods: {
    prevDay() {
      this.$store.commit('prevDay');
      this.$store.dispatch('fetchTasksByDate', this.currentDate);
    },
    nextDay() {
      this.$store.commit('nextDay');
      this.$store.dispatch('fetchTasksByDate', this.currentDate);
    },
    showForm() {
      this.$refs.taskForm.show();
    },
    editTask(task) {
      this.$refs.taskForm.show(task);
    },
    reloadTasks() {
      this.$store.dispatch('fetchTasksByDate', this.currentDate);
    }
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>