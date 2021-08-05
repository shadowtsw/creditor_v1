import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

import { ApplicationEnviroment } from './application-enviroment';

const creditor = ApplicationEnviroment.instance;
creditor.initialiseStart();

createApp(App).use(store).use(router).mount('#app');
