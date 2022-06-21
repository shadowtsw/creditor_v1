import { createApp } from "vue";
import App from "./App.vue";
import store from "./store/index";

//Structure style sheets
import "./styles/globals.scss";
import "./styles/variables.scss";
import "./styles/placeholders.scss";
import "./styles/mixins.scss";
import "./styles/basic/app-styles.scss";
import "./styles/basic/main-container-grid.scss";
import "./styles/basic/main-container-styles.scss";

//vue-app/src/main.js
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
library.add(fas);
import { fab } from "@fortawesome/free-brands-svg-icons";
library.add(fab);
import { far } from "@fortawesome/free-regular-svg-icons";
library.add(far);
import { dom } from "@fortawesome/fontawesome-svg-core";

dom.watch();

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(store)
  .mount("#app");
