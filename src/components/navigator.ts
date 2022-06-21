import { VNode, ref, reactive, computed, Ref } from "vue";
import { DictionaryEntryObject } from "../interfaces/component-dictionary/component-dictionary";
import componentDictionary from "./component-registration";
import {
  defaultStartPage,
  defaultStartPlugin,
} from "@/views/BasicApp/default-start-parameter";
import { IndexedDBAppStateManager } from "@/indexedDB/app-state-database";

//Converts dictionary for use in vue components
const pluginMap = ref<Array<DictionaryEntryObject>>([]);
const pageMap = ref<Array<DictionaryEntryObject>>([]);

//converts dictionary
async function convertComponentsRegistration() {
  for (const entry in componentDictionary) {
    const dbVisibleState =
      (await IndexedDBAppStateManager.AppStateManager.getPage(
        componentDictionary[entry].component
      )) || null;

    const obj: DictionaryEntryObject = {
      displayText: componentDictionary[entry].displayText,
      component: componentDictionary[entry].component,
      type: componentDictionary[entry].type,
      active: dbVisibleState
        ? dbVisibleState.value
        : componentDictionary[entry].active !== undefined
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
    IndexedDBAppStateManager.AppStateManager.setState({
      property: "currentPage",
      value: pageName,
    })
      .then((_) => {
        currentPage.value = pageName;
      })
      .catch((err) => {
        console.error(err);
      });
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
      IndexedDBAppStateManager.AppStateManager.setPage({
        pageName: "ImportCSV",
        value: true,
      })
        .then((_) => {
          target.active = true;
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const activateCreateAccount = () => {
    const target = pageMap.value.find((entry) => {
      return entry.component === "CreateAccount";
    });
    if (target) {
      IndexedDBAppStateManager.AppStateManager.setPage({
        pageName: "CreateAccount",
        value: true,
      })
        .then((_) => {
          target.active = true;
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const activateCreateTransfers = () => {
    const target = pageMap.value.find((entry) => {
      return entry.component === "CreateTransfer";
    });
    if (target) {
      IndexedDBAppStateManager.AppStateManager.setPage({
        pageName: "CreateTransfer",
        value: true,
      })
        .then((_) => {
          target.active = true;
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const activateTransferList = () => {
    const target = pageMap.value.find((entry) => {
      return entry.component === "Transfers";
    });
    if (target) {
      IndexedDBAppStateManager.AppStateManager.setPage({
        pageName: "Transfers",
        value: true,
      })
        .then((_) => {
          target.active = true;
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const hideTransferList = () => {
    const target = pageMap.value.find((entry) => {
      return entry.component === "Transfers";
    });
    if (target) {
      IndexedDBAppStateManager.AppStateManager.setPage({
        pageName: "Transfers",
        value: false,
      })
        .then((_) => {
          target.active = false;
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const hideCreateTransfers = () => {
    const target = pageMap.value.find((entry) => {
      return entry.component === "CreateTransfer";
    });
    if (target) {
      IndexedDBAppStateManager.AppStateManager.setPage({
        pageName: "CreateTransfer",
        value: false,
      })
        .then((_) => {
          target.active = false;
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  /**
   * DEMO ONLY
   */
  const activateDemoTabs = () => {
    activateCreateAccount();
    activateCreateTransfers();
    activateTransferList();
  };

  return {
    activateDemoTabs,
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
    IndexedDBAppStateManager.AppStateManager.setState({
      property: "currentPlugin",
      value: pageName,
    })
      .then((_) => {
        currentPlugin.value = pageName;
      })
      .catch((err) => {
        console.error(err);
      });
  };
  //User configuration, hide unnecessary tabs
  const setTabVisibility = (entryDisplayName: string, value: boolean) => {
    const target = pluginMap.value.find((entry) => {
      return entry.displayText === entryDisplayName;
    });
    if (target) {
      IndexedDBAppStateManager.AppStateManager.setPlugin({
        pluginName: target.component,
        value: value,
      })
        .then((_) => {
          target.active = value;
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const activateDemoPlugins = () => {
    console.log("Demo Plugins enabled");
  };

  return {
    activateDemoPlugins,
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
