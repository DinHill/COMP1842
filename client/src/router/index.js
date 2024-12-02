import { createRouter, createWebHistory } from 'vue-router';
import TaskTable from '../components/TaskTable.vue';

const routes = [
  {
    path: '/',
    name: 'TaskTable',
    component: TaskTable,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;