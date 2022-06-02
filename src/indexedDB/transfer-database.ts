import { IBasicTransferClass } from "@/interfaces/transfers/transfers";
import { openDB, deleteDB, wrap, unwrap, IDBPDatabase, DBSchema } from "idb";
import IndexedDBAccountStoreManager from "./account-database";

export interface IDBTransfers extends DBSchema {
  transfers: {
    value: IBasicTransferClass;
    key: string;
    indexes: { isSelected: number; accountID: string };
  };
}

enum DataBases {
  TRANSFERS = "transfers-database",
}

export const DBProvider = {
  transferDB: {
    dbname: DataBases.TRANSFERS,
    currentVersion: 1,
  },
};

class IndexedDBTransferManager {
  private static _storeManager: null | IndexedDBTransferManager = null;

  private _transfer_data: null | IDBPDatabase<IDBTransfers> = null;

  private constructor() {
    this._transfer_data;
  }

  //Get singleton instance
  public static get AppStateManager() {
    if (!IndexedDBTransferManager._storeManager) {
      IndexedDBTransferManager._storeManager = new IndexedDBTransferManager();
    }
    return IndexedDBTransferManager._storeManager;
  }

  public async initDB(): Promise<boolean> {
    const appDatabase = DBProvider.transferDB;
    const db = await openDB<IDBTransfers>(
      appDatabase.dbname,
      appDatabase.currentVersion,
      {
        upgrade(db) {
          if (!db.objectStoreNames.contains("transfers")) {
            const store = db.createObjectStore("transfers", {
              keyPath: "_internalID._value",
            });
            store.createIndex("isSelected", "isSelected._valueMeta");
            store.createIndex("accountID", "_accountID._value");
          }
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

  public get DB(): null | IDBPDatabase<IDBTransfers> {
    if (!this._transfer_data) {
      return null;
    } else {
      return this._transfer_data;
    }
  }
  //TODO
  public async getAllTransfers() {
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
        return appState.getAll("transfers");
      } catch (err) {
        throw new Error(`Failed to get all transfers ${err}`);
      }
    } else {
      throw new Error("Database not found");
    }
  }
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
          console.log("INDEX promise", test);
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
          return IndexedDBAccountStoreManager.removeTransferFromAccount({
            accountID: getTransfer._accountID._value,
            transferID: transferID,
          })
            .then(async (_) => {
              await appState.delete("transfers", transferID);
              return Promise.resolve(true);
            })
            .catch((err) => {
              throw new Error(`Failed to delete transfer: ${transferID}`);
            });
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

  public async deleteManyTransfers(
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
      //TODO
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

const IndexedDBTransferStoreManager = IndexedDBTransferManager.AppStateManager;
export default IndexedDBTransferStoreManager;
