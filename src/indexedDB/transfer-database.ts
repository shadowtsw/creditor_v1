import { IBasicTransferClass } from "@/interfaces/transfers/transfers";
import { openDB, IDBPDatabase, DBSchema } from "idb";
import { IndexedDBAccountManager } from "./account-database";

import { ApplicationEnvironmentStore } from "@/store/application/application-store";
import { PageCache, Page } from "@/interfaces/transfers/page-types";
import { LogMe } from "@/logging/logger-function";
import { upgradeTransferDB } from "./upgrade-functions/transfer-db";

export interface IDBTransfers extends DBSchema {
  transfers: {
    value: IBasicTransferClass;
    key: string;
    indexes: {
      isSelected: number;
      accountID: string;
      "valuta-yearMonth": number;
    };
  };
  pages: {
    value: Page;
    key: number;
    indexes: {
      year: number;
      month: number;
    };
  };
  Cache: {
    value: PageCache;
    key: string;
  };
}

enum DataBases {
  TRANSFERS = "transfers-database",
  DEMO_TRANSFERS = "transfers-demo",
}

export const DBProvider = {
  transferDB: {
    dbname: DataBases.TRANSFERS,
    dbDemoName: DataBases.DEMO_TRANSFERS,
    currentVersion: 1,
  },
};

export class IndexedDBTransferManager {
  private static _storeManager: null | IndexedDBTransferManager = null;

  private _transfer_data: null | IDBPDatabase<IDBTransfers> = null;

  private constructor() {
    LogMe.indexedDB("IndexedDBTransferManager | transfer-database created");
    this._transfer_data;
  }

  //Get singleton instance
  public static get AppStateManager() {
    if (!IndexedDBTransferManager._storeManager) {
      IndexedDBTransferManager._storeManager = new IndexedDBTransferManager();
    }
    LogMe.info("IndexedDBTransferManager used");
    return IndexedDBTransferManager._storeManager;
  }

  public async initDB(useRegularDB: boolean = true): Promise<boolean> {
    const appDatabase = DBProvider.transferDB;
    let relatedDB = appDatabase.dbname;
    if (!useRegularDB || ApplicationEnvironmentStore.Demo) {
      relatedDB = appDatabase.dbDemoName;
    }
    const db = await openDB<IDBTransfers>(
      relatedDB,
      appDatabase.currentVersion,
      {
        upgrade(db) {
          upgradeTransferDB(db);
        },
      }
    );
    if (db) {
      this._transfer_data = db;
      return Promise.resolve(true);
    } else {
      return Promise.reject(false);
    }
  }
  //Later used when switch between demo and app
  public async switchToDemoTransfers(): Promise<boolean> {
    try {
      this._transfer_data?.close();
      this._transfer_data = null;
      await this.initDB(false);
      return Promise.resolve(true);
    } catch (err) {
      throw new Error(`Failed to init demo transfers: ${err}`);
    }
  }

  public get DB(): null | IDBPDatabase<IDBTransfers> {
    if (!this._transfer_data) {
      return null;
    } else {
      return this._transfer_data;
    }
  }

  //Returns to store
  public async getTransfersFromPage(yearMonth: number) {
    if (!this._transfer_data) {
      try {
        await this.initDB();
      } catch (err) {
        throw new Error(`Failed to init DB:${err}`);
      }
    }

    if (this._transfer_data) {
      const appState = this._transfer_data;
      try {
        return appState.getAllFromIndex(
          "transfers",
          "valuta-yearMonth",
          yearMonth
        );
      } catch (err) {
        throw new Error(`Failed to get all transfers ${err}`);
      }
    } else {
      throw new Error("Database not found");
    }
  }
  //Managed by AccountDBManager
  public async addTransfer(payload: IBasicTransferClass): Promise<boolean> {
    if (!this._transfer_data) {
      try {
        await this.initDB();
      } catch (err) {
        throw new Error(`Failed to init DB:${err}`);
      }
    }

    if (this._transfer_data) {
      const appState = this._transfer_data;
      try {
        const originalResult = await appState.get(
          "transfers",
          payload._internalID._value
        );
        if (originalResult) {
          throw new Error("Transfer already exists");
        } else {
          const test = await appState.add(
            "transfers",
            JSON.parse(JSON.stringify(payload))
          );
          return Promise.resolve(true);
        }
      } catch (err) {
        throw new Error(`Failed to add transfer: ${err}`);
      }
    } else {
      throw new Error("Database not found");
    }
  }
  public async deleteTransfer(transferID: string): Promise<boolean> {
    if (!this._transfer_data) {
      try {
        await this.initDB();
      } catch (err) {
        throw new Error(`Failed to init DB:${err}`);
      }
    }

    if (this._transfer_data) {
      const appState = this._transfer_data;
      try {
        const getTransfer = await appState.get("transfers", transferID);
        if (getTransfer) {
          await appState.delete("transfers", transferID);
          return Promise.resolve(true);
        } else {
          throw new Error(`Failed to get transfer: ${transferID}`);
        }
      } catch (err) {
        throw new Error(`Failed to delete transfer ${err}`);
      }
    } else {
      throw new Error("Failed to init DB");
    }
  }
  public async deleteAllTransfersFromAccountID(
    transferList: Array<string>
  ): Promise<boolean> {
    if (!this._transfer_data) {
      try {
        await this.initDB();
      } catch (err) {
        throw new Error(`Failed to init DB:${err}`);
      }
    }

    if (this._transfer_data) {
      const appState = this._transfer_data;
      try {
        const tx = appState.transaction("transfers", "readwrite");
        const promiseAll = [];
        for (const transferID of transferList) {
          promiseAll.push(tx.store.delete(transferID));
        }
        await Promise.all(promiseAll);
        return Promise.resolve(true);
      } catch (err) {
        throw new Error("Failed to delete all transfers");
      }
    } else {
      throw new Error("Failed to init DB");
    }
  }
}
