import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import i18n from './multilanguage';

//Global Components
import CreditorButton from './components/creditor-buttons/CreditorButton.vue';

//Initialise Application Instance
import { ApplicationEnviroment } from './application-enviroment';
const creditor = ApplicationEnviroment.instance;
creditor.initialiseStart();

//Vue app
createApp(App)
  .use(store)
  .use(router)
  .use(i18n)
  .component('creditor-button', CreditorButton)
  .mount('#app');
