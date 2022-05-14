import { defineAsyncComponent } from "vue";
import { DictionaryEntry } from "../interfaces/component-dictionary/component-dictionary";

// Register pages here
const Pages: DictionaryEntry = {
  GET_STARTED: {
    component: "GetStarted",
    displayText: "Get Started",
    type: "Page",
    index: 0,
    active: true,
    version: "1.0.0",
    path: "./src/views/GetStarted.vue",
  },
  SETTINGS: {
    component: "Settings",
    displayText: "Settings",
    type: "Page",
    index: 5,
    active: false,
    version: "1.0.0",
    path: "./src/views/Settings.vue",
  },
  TRANSFERS: {
    component: "Transfers",
    displayText: "Transfers",
    type: "Page",
    index: 1,
    active: false,
    version: "1.0.0",
    path: "./src/views/Transfers.vue",
  },
  CREATE_ACCOUNT: {
    component: "CreateAccount",
    displayText: "Create Account",
    type: "Page",
    index: 3,
    active: false,
    version: "1.0.0",
    path: "./src/views/CreateAccount.vue",
  },
  CREATE_TRANSFERS: {
    component: "CreateTransfer",
    displayText: "Add Transfer",
    type: "Page",
    index: 4,
    active: false,
    version: "1.0.0",
    path: "./src/views/CreateTransfer.vue",
  },
  IMPORT_CSV: {
    component: "ImportCSV",
    displayText: "Import CSV",
    type: "Page",
    index: 2,
    active: false,
    version: "1.0.0",
    path: "./src/views/ImportCSV.vue",
  },
};
// export const defaultStartPage: string = "Get Started";

//Register plugins here
const Plugins: DictionaryEntry = {
  LIST_PLUGIN: {
    component: "ListPlugin",
    displayText: "List",
    type: "Plugin",
    index: 0,
    active: true,
    version: "1.0.0",
    path: "./src/components/MainWindow/Plugins/ListPlugin.vue",
  },
  PLUGIN_SETTINGS: {
    component: "PluginSettings",
    displayText: "Settings",
    type: "Plugin",
    index: 0,
    active: true,
    version: "1.0.0",
    path: "./src/components/MainWindow/Plugins/PluginSettings.vue",
  },
};
// export const defaultStartPlugin: string = "List";

//Used for dynamic registration
export const importPages = () => {
  const importer = {} as { [index: string]: any };

  for (const page in Pages) {
    const { component, path } = Pages[page];
    console.log("Component", component);
    importer[component] = defineAsyncComponent(
      () => import(`../views/${component}.vue`)
    );
  }

  return importer;
};
export const importPlugins = () => {
  const importer = {} as { [index: string]: any };

  for (const plugin in Plugins) {
    const { component, path } = Plugins[plugin];
    importer[component] = defineAsyncComponent(
      () => import(`../components/MainWindow/Plugins/${component}.vue`)
    );
  }

  return importer;
};

//Merge dictionaries
const componentDictionary: DictionaryEntry = { ...Pages, ...Plugins };

export default componentDictionary;
