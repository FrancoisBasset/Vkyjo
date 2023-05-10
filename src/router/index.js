import { createRouter, createWebHistory } from 'vue-router';
import VkyjoView from '../views/VkyjoView.vue';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'home',
			component: VkyjoView
		}
	]
});

export default router;
