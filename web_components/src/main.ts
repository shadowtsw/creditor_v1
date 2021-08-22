import { createApp } from 'vue';
import App from './App.vue';
import ComponentsTemplate from './ComponentsTemplate.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import i18n from './multilanguage';

//Global Components
import CreditorButton from './components/creditor-buttons/CreditorButton.vue';
import SingleBox from './components/creditor-selection-box/SingleBox.vue';
import LoadingBackdrop from './components/loading-components/LoadingBackdrop.vue';
import LoadingBox from './components/loading-components/LoadingBox.vue';

//Initialise Application Instance
import { ApplicationEnviroment } from './application-enviroment';
export const creditor = ApplicationEnviroment.instance;
creditor.initialiseStart();

//Vue app
createApp(App)
  .use(store)
  .use(router)
  .use(i18n)
  .component('creditor-button', CreditorButton)
  .component('single-box', SingleBox)
  //TO-DO optional ?
  .component('loading-backdrop', LoadingBackdrop)
  .component('loading-box', LoadingBox)
  .mount('#app');
