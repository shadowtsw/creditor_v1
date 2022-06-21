import { openDB, deleteDB, wrap, unwrap, IDBPDatabase, DBSchema } from "idb";
import { ApplicationEnvironmentStore } from "@/store/application/application-store";
import { LogMe } from "@/logging/logger-function";

import { DBProvider as AccountDBProvider } from "@/indexedDB/account-database";
import { DBProvider as TransferDBProvider } from "@/indexedDB/transfer-database";

export interface IDBAppStateData extends DBSchema {
  appState: {
    value: {
      property: string;
      value: string | boolean;
    };
    key: string;
    indexes: { property: string };
  };
  visiblePages: {
    value: {
      pageName: string;
      value: boolean;
    };
    key: string;
    indexes: { pageName: string };
  };
  visiblePlugins: {
    value: {
      pluginName: string;
      value: boolean;
    };
    key: string;
    indexes: { pluginName: string };
  };
}

enum DataBases {
  APP_STATE_DATA = "app-state-data",
}

const DBProvider = {
  appStateDB: {
    dbname: DataBases.APP_STATE_DATA,
    currentVersion: 1,
  },
};

export class IndexedDBAppStateManager {
  private static _storeManager: null | IndexedDBAppStateManager = null;

  private _app_state_data: null | IDBPDatabase<IDBAppStateData> = null;

  private constructor() {
    LogMe.indexedDB("IndexedDBAppStateManager | app-state-database created");
    this._app_state_data;
  }

  //Get singleton instance
  public static get AppStateManager() {
    if (!IndexedDBAppStateManager._storeManager) {
      IndexedDBAppStateManager._storeManager = new IndexedDBAppStateManager();
    }
    LogMe.info("IndexedDBAppStateManager used");
    return IndexedDBAppStateManager._storeManager;
  }

  public async initDB(): Promise<boolean> {
    const appDatabase = DBProvider.appStateDB;
    const db = await openDB<IDBAppStateData>(
      appDatabase.dbname,
      appDatabase.currentVersion,
      {
        upgrade(db) {
          if (!db.objectStoreNames.contains("appState")) {
            const store = db.createObjectStore("appState", {
              keyPath: "property",
            });
            store.createIndex("property", "property", { unique: true });
          }

          if (!db.objectStoreNames.contains("visiblePages")) {
            const store = db.createObjectStore("visiblePages", {
              keyPath: "pageName",
            });
            store.createIndex("pageName", "pageName", {
              unique: true,
            });
          }

          if (!db.objectStoreNames.contains("visiblePlugins")) {
            const store = db.createObjectStore("visiblePlugins", {
              keyPath: "pluginName",
            });
            store.createIndex("pluginName", "pluginName", {
              unique: true,
            });
          }
        },
      }
    );
    if (db) {
      this._app_state_data = db;
      return Promise.resolve(true);
    } else {
      return Promise.reject(false);
    }
  }

  private allowOperation(): boolean {
    //TODO
    return (
      !ApplicationEnvironmentStore.Demo && ApplicationEnvironmentStore.appReady
    );
  }

  public async setState(payload: {
    property: string;
    value: string | boolean;
  }): Promise<boolean> {
    if (this.allowOperation()) {
      if (!this._app_state_data) {
        try {
          await this.initDB();
        } catch (err) {
          throw new Error(`Failed to init DB:${err}`);
        }
      }

      if (this._app_state_data) {
        const appState = this._app_state_data;
        try {
          const originalResult = await appState.get(
            "appState",
            payload.property
          );
          if (originalResult) {
            await appState.put("appState", payload);
          } else {
            await appState.add("appState", payload);
          }
          return Promise.resolve(true);
        } catch (err) {
          throw new Error(`Failed to add state: ${err}`);
        }
      } else {
        throw new Error("Database not found");
      }
    } else {
      return Promise.resolve(true);
    }
  }

  //Specials used before app ready
  public async setDemoState(payload: boolean): Promise<boolean> {
    if (!this._app_state_data) {
      try {
        await this.initDB();
      } catch (err) {
        throw new Error(`Failed to init DB:${err}`);
      }
    }

    if (this._app_state_data) {
      const appState = this._app_state_data;
      try {
        const originalResult = await appState.get("appState", "useDemo");
        if (originalResult) {
          originalResult.value = payload;
          await appState.put("appState", originalResult);
        } else {
          const newState = {
            property: "useDemo",
            value: payload,
          };
          await appState.add("appState", newState);
        }
        return Promise.resolve(true);
      } catch (err) {
        throw new Error(`Failed to add state: ${err}`);
      }
    } else {
      throw new Error("Database not found");
    }
  }
  public async setWelcomeState(payload: boolean): Promise<boolean> {
    if (!this._app_state_data) {
      try {
        await this.initDB();
      } catch (err) {
        throw new Error(`Failed to init DB:${err}`);
      }
    }

    if (this._app_state_data) {
      const appState = this._app_state_data;
      try {
        const originalResult = await appState.get(
          "appState",
          "showWelcomeScreen"
        );
        if (originalResult) {
          originalResult.value = payload;
          await appState.put("appState", originalResult);
        } else {
          const newState = {
            property: "showWelcomeScreen",
            value: payload,
          };
          await appState.add("appState", newState);
        }
        return Promise.resolve(true);
      } catch (err) {
        throw new Error(`Failed to add state: ${err}`);
      }
    } else {
      throw new Error("Database not found");
    }
  }
  //Specials used before app ready

  public async getState(property: string) {
    if (!this._app_state_data) {
      try {
        await this.initDB();
      } catch (err) {
        throw new Error(`Failed to init DB:${err}`);
      }
    }

    if (this._app_state_data) {
      const appState = this._app_state_data;
      try {
        const stateResult = await appState.get("appState", property);
        if (stateResult) {
          return stateResult;
        } else {
          return null;
        }
      } catch (err) {
        throw new Error(`Failed to get property: ${property} ${err}`);
      }
    } else {
      throw new Error("Database not found");
    }
  }

  public async setPage(payload: {
    pageName: string;
    value: boolean;
  }): Promise<boolean> {
    if (this.allowOperation()) {
      if (!this._app_state_data) {
        try {
          await this.initDB();
        } catch (err) {
          throw new Error(`Failed to init DB:${err}`);
        }
      }

      if (this._app_state_data) {
        const appState = this._app_state_data;
        try {
          const originalResult = await appState.get(
            "visiblePages",
            payload.pageName
          );
          if (originalResult) {
            await appState.put("visiblePages", payload);
          } else {
            await appState.add("visiblePages", payload);
          }
          return Promise.resolve(true);
        } catch (err) {
          throw new Error(`Failed to add visibility to page: ${err}`);
        }
      } else {
        throw new Error("Database not found");
      }
    } else {
      return Promise.resolve(true);
    }
  }

  public async getPage(pageName: string) {
    if (!this._app_state_data) {
      try {
        await this.initDB();
      } catch (err) {
        throw new Error(`Failed to init DB:${err}`);
      }
    }

    if (this._app_state_data) {
      const appState = this._app_state_data;
      try {
        const stateResult = await appState.get("visiblePages", pageName);
        if (stateResult) {
          return stateResult;
        } else {
          return null;
        }
      } catch (err) {
        throw new Error(`Failed to get property: ${pageName} ${err}`);
      }
    } else {
      throw new Error("Database not found");
    }
  }

  public async setPlugin(payload: {
    pluginName: string;
    value: boolean;
  }): Promise<boolean> {
    if (this.allowOperation()) {
      if (!this._app_state_data) {
        try {
          await this.initDB();
        } catch (err) {
          throw new Error(`Failed to init DB:${err}`);
        }
      }

      if (this._app_state_data) {
        const appState = this._app_state_data;
        try {
          const originalResult = await appState.get(
            "visiblePlugins",
            payload.pluginName
          );
          if (originalResult) {
            await appState.put("visiblePlugins", payload);
          } else {
            await appState.add("visiblePlugins", payload);
          }
        } catch (err) {
          throw new Error(`Failed to add visibility to plugin: ${err}`);
        }
        return Promise.resolve(true);
      } else {
        throw new Error("Database not found");
      }
    } else {
      return Promise.resolve(true);
    }
  }

  public async getPlugin(pluginName: string) {
    if (!this._app_state_data) {
      try {
        await this.initDB();
      } catch (err) {
        throw new Error(`Failed to init DB:${err}`);
      }
    }

    if (this._app_state_data) {
      const appState = this._app_state_data;
      try {
        const stateResult = await appState.get("visiblePlugins", pluginName);
        if (stateResult) {
          return stateResult;
        } else {
          return null;
        }
      } catch (err) {
        throw new Error(`Failed to get property: ${pluginName} ${err}`);
      }
    } else {
      throw new Error("Database not found");
    }
  }

  //prevents duplicated example generation
  public async setDemoInitialState() {
    if (!this._app_state_data) {
      try {
        await this.initDB();
      } catch (err) {
        throw new Error(`Failed to init DB:${err}`);
      }
    }

    if (this._app_state_data) {
      const appState = this._app_state_data;
      try {
        const originalResult = await appState.get("appState", "demoInUse");
        if (originalResult) {
          await appState.put("appState", {
            property: "demoInUse",
            value: true,
          });
        } else {
          await appState.add("appState", {
            property: "demoInUse",
            value: true,
          });
        }
      } catch (err) {
        throw new Error(`Failed to add visibility to plugin: ${err}`);
      }
      return Promise.resolve(true);
    } else {
      throw new Error("Database not found");
    }
  }
  public async getDemoState() {
    if (!this._app_state_data) {
      try {
        await this.initDB();
      } catch (err) {
        throw new Error(`Failed to init DB:${err}`);
      }
    }

    if (this._app_state_data) {
      const appState = this._app_state_data;
      try {
        const stateResult = await appState.get("appState", "demoInUse");
        if (stateResult) {
          return stateResult;
        } else {
          return null;
        }
      } catch (err) {
        throw new Error(`Failed to get property: demoInUse ${err}`);
      }
    } else {
      throw new Error("Database not found");
    }
  }
  public async deleteDemo(): Promise<boolean> {
    if (!this._app_state_data) {
      try {
        await this.initDB();
      } catch (err) {
        throw new Error(`Failed to init DB:${err}`);
      }
    }

    if (this._app_state_data) {
      const appState = this._app_state_data;
      try {
        await appState.delete("appState", "demoInUse");
        await window.indexedDB.deleteDatabase(
          AccountDBProvider.accountsDB.dbDemoName
        );
        await window.indexedDB.deleteDatabase(
          TransferDBProvider.transferDB.dbDemoName
        );
        return Promise.resolve(true);
      } catch (err) {
        throw new Error(`Failed to get property: demoInUse ${err}`);
      }
    } else {
      throw new Error("Database not found");
    }
  }
}
