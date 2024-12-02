<template>
  <div v-if="formVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-6 rounded shadow-lg w-96">
      <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'Edit Task' : 'Add New Task' }}</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label class="block font-semibold">Title</label>
          <input v-model="task.title" class="border p-2 w-full rounded" />
          <span v-if="errors.title" class="text-red-500 text-sm">{{ errors.title }}</span>
        </div>
        <div class="mb-4">
          <label class="block font-semibold">Description</label>
          <textarea v-model="task.description" class="border p-2 w-full rounded"></textarea>
          <span v-if="errors.description" class="text-red-500 text-sm">{{ errors.description }}</span>
        </div>
        <div class="mb-4" v-if="isEditing">
          <label class="block font-semibold">Status</label>
          <select v-model="task.status" class="border p-2 w-full rounded">
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block font-semibold">Date</label>
          <input type="date" v-model="task.date" class="border p-2 w-full rounded" />
        </div>
        <div class="mb-4">
          <label class="block font-semibold">Deadline</label>
          <input type="datetime-local" v-model="task.deadline" class="border p-2 w-full rounded" />
          <span v-if="errors.deadline" class="text-red-500 text-sm">{{ errors.deadline }}</span>
        </div>
        <div class="flex justify-between">
          <button type="submit" class="bg-primary hover:bg-accent text-white px-4 py-2 rounded">{{ isEditing ? 'Update Task' : 'Add Task' }}</button>
          <button type="button" @click="hideForm" class="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded">Cancel</button>
          <button v-if="isEditing" type="button" @click="confirmDeleteTask" class="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded">Delete</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { createTask, updateTask, deleteTask } from '../services/taskService';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      formVisible: false,
      isEditing: false,
      task: {
        title: '',
        description: '',
        date: '',
        deadline: '',
        status: 'pending',
      },
      errors: {
        title: '',
        description: '',
        deadline: '',
      },
    };
  },
  methods: {
    show(task = null) {
      if (task) {
        this.isEditing = true;
        this.task = { ...task };
        this.task.date = new Date(task.date).toISOString().substr(0, 10); // Format date for input
        const deadline = new Date(task.deadline);
        this.task.deadline = new Date(deadline.getTime() - deadline.getTimezoneOffset() * 60000).toISOString().slice(0, 16); // Format datetime-local for input
      } else {
        this.isEditing = false;
        this.task = {
          title: '',
          description: '',
          date: '',
          deadline: '',
          status: 'pending',
        };
      }
      this.formVisible = true;
    },
    hideForm() {
      this.formVisible = false;
      this.clearErrors();
    },
    clearErrors() {
      this.errors = {
        title: '',
        description: '',
        deadline: '',
      };
    },
    validateForm() {
      this.clearErrors();
      let isValid = true;
      if (!this.task.title) {
        this.errors.title = 'Title is required';
        isValid = false;
      }
      if (!this.task.description) {
        this.errors.description = 'Description is required';
        isValid = false;
      }
      if (!this.task.deadline) {
        this.errors.deadline = 'Deadline is required';
        isValid = false;
      }
      return isValid;
    },
    async submitForm() {
      if (!this.validateForm()) {
        return;
      }
      if (!this.task.date) {
        this.task.date = new Date().toISOString().split('T')[0]; // Set date to today if not provided
      }
      if (this.isEditing) {
        const result = await Swal.fire({
          title: 'Are you sure?',
          text: 'Do you want to update this task?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes, update it!',
          cancelButtonText: 'No, cancel!',
        });
        if (result.isConfirmed) {
          await updateTask(this.task._id, this.task);
          Swal.fire('Updated!', 'Your task has been updated.', 'success');
        }
      } else {
        await createTask(this.task);
        Swal.fire('Created!', 'Your task has been created.', 'success');
      }
      this.hideForm();
      this.$emit('task-updated'); // Emit event after task is updated or created
    },
    async confirmDeleteTask() {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this task?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
      });
      if (result.isConfirmed) {
        await this.deleteTask();
        Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
      }
    },
    async deleteTask() {
      await deleteTask(this.task._id);
      this.hideForm();
      this.$emit('task-updated'); // Emit event after task is deleted
    },
  },
};
</script>

<style scoped>
.text-red-500 {
  color: red;
}
.text-sm {
  font-size: 0.875em;
}
</style>