import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

//Global Components
import CreditorButton from './components/creditor-buttons/CreditorButton.vue';

import { ApplicationEnviroment } from './application-enviroment';

const creditor = ApplicationEnviroment.instance;
creditor.initialiseStart();

createApp(App)
  .use(store)
  .use(router)
  .component('creditor-button', CreditorButton)
  .mount('#app');
