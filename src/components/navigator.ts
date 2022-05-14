import { VNode, ref, reactive, computed, Ref } from "vue";
import { DictionaryEntryObject } from "../interfaces/component-dictionary/component-dictionary";
import componentDictionary from "./component-registration";
import {
  defaultStartPage,
  defaultStartPlugin,
} from "@/views/BasicApp/default-start-parameter";

//Converts dictionary for use in vue components
const pluginMap = ref<Array<DictionaryEntryObject>>([]);
const pageMap = ref<Array<DictionaryEntryObject>>([]);

//converts dictionary
function convertComponentsRegistration() {
  for (const entry in componentDictionary) {
    const obj: DictionaryEntryObject = {
      displayText: componentDictionary[entry].displayText,
      component: componentDictionary[entry].component,
      type: componentDictionary[entry].type,
      active:
        componentDictionary[entry].active !== undefined
          ? componentDictionary[entry].active
          : true,
      index: componentDictionary[entry].index,
      path: componentDictionary[entry].path,
    };
    const index = componentDictionary[entry].index;

    if (componentDictionary[entry].type === "Plugin") {
      if (
        index !== undefined &&
        typeof index === "number" &&
        pluginMap.value[index] === undefined
      ) {
        obj.index = index;
        pluginMap.value[index] = obj;
      } else {
        obj.index = pluginMap.value.length;
        pluginMap.value.push(obj);
      }
    } else {
      if (
        index !== undefined &&
        typeof index === "number" &&
        pageMap.value[index] === undefined &&
        index <= pageMap.value.length
      ) {
        obj.index = index;
        pageMap.value[index] = obj;
      } else {
        obj.index = pageMap.value.length;
        pageMap.value.push(obj);
      }
    }
  }
}
convertComponentsRegistration();

//Current page state
const currentPage = ref<string>(defaultStartPage);
const currentPlugin = ref<string>(defaultStartPlugin);

//Provide tabs in navbar, sets current page, toggle visibility
export const usePageNavigator = () => {
  //Load view
  const setActivePage = (pageName: string) => {
    currentPage.value = pageName;
  };

  //User configuration, hide unnecessary tabs
  const setTabVisibility = (entryDisplayName: string, value: boolean) => {
    const target = pageMap.value.find((entry) => {
      return entry.displayText === entryDisplayName;
    });
    if (target) {
      target.active = value;
    }
  };

  /**
   * Tutorial functions
   */
  const activateImportCSV = () => {
    const target = pageMap.value.find((entry) => {
      return entry.component === "ImportCSV";
    });
    if (target) {
      target.active = true;
    }
  };

  const activateCreateAccount = () => {
    const target = pageMap.value.find((entry) => {
      return entry.component === "CreateAccount";
    });
    if (target) {
      target.active = true;
    }
  };

  const activateTransfers = () => {
    const target = pageMap.value.find((entry) => {
      return entry.component === "Transfers";
    });
    if (target) {
      target.active = true;
    }
  };

  const activateCreateTransfers = () => {
    const target = pageMap.value.find((entry) => {
      return entry.component === "CreateTransfer";
    });
    if (target) {
      target.active = true;
    }
  };

  const activateTransferList = () => {
    const target = pageMap.value.find((entry) => {
      return entry.component === "Transfers";
    });
    if (target) {
      target.active = true;
    }
  };

  const hideTransferList = () => {
    const target = pageMap.value.find((entry) => {
      return entry.component === "Transfers";
    });
    if (target) {
      target.active = false;
    }
  };

  const hideCreateTransfers = () => {
    const target = pageMap.value.find((entry) => {
      return entry.component === "CreateTransfer";
    });
    if (target) {
      target.active = false;
    }
  };

  return {
    setActivePage,
    setTabVisibility,
    pages: computed(() => {
      const filtered = pageMap.value.filter((entry) => {
        return entry.active && entry.component !== "Settings";
      });
      return filtered;
    }),
    settings: computed(() =>
      pageMap.value.find((entry) => {
        return entry.component === "Settings";
      })
    ),
    currentPage: computed(() => currentPage.value),
    //Tutorials
    activateImportCSV,
    activateCreateAccount,
    activateTransfers,
    activateCreateTransfers,
    hideCreateTransfers,
    activateTransferList,
    hideTransferList,
  };
};
//Same for plugins
export const usePluginNavigator = () => {
  //Load view
  const setActivePlugin = (pageName: string) => {
    currentPlugin.value = pageName;
  };
  //User configuration, hide unnecessary tabs
  const setTabVisibility = (entryDisplayName: string, value: boolean) => {
    const target = pluginMap.value.find((entry) => {
      return entry.displayText === entryDisplayName;
    });
    if (target) {
      target.active = value;
    }
  };

  return {
    setActivePlugin,
    setTabVisibility,
    plugins: computed(() => {
      const filtered = pluginMap.value.filter((entry) => {
        return entry.active && entry.component !== "PluginSettings";
      });
      return filtered;
    }),
    settings: computed(() =>
      pluginMap.value.find((entry) => entry.component === "PluginSettings")
    ),
    currentPlugin: computed(() => currentPlugin.value),
  };
};
