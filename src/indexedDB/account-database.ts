import { IBasicAccountClass, DataBases } from "@/interfaces/accounts/accounts";
import {
  MonthBalanceObject,
  SaldoObject,
} from "@/interfaces/accounts/saldo-balance-types";
import { openDB, IDBPDatabase, DBSchema } from "idb";
import { upgradeAccountDB } from "./upgrade-functions/account-db";

import { ApplicationEnvironmentStore } from "@/store/application/application-store";
import { LogMe } from "@/logging/logger-function";
import {
  AAWAddTransfer,
  AAW_MessageTypes,
  RequestBalanceMessage,
} from "@/worker/message-interfaces/account-assist-interface";
import { AccountAssistantWorker } from "@/worker/worker-provider";
import { IndexedDBTransferManager } from "./transfer-database";
import { IBasicTransferClass } from "@/interfaces/transfers/transfers";

export interface IDBAccounts extends DBSchema {
  accounts: {
    value: IBasicAccountClass;
    key: string;
    indexes: { isSelected: number };
  };
  // accountMetaData: {
  //   value: any;
  //   key: string;
  //   indexes: {};
  // };
  Cache: {
    value: {
      accountID: string;
      lastModified: number;
      balanceData: MonthBalanceObject;
      saldoData: SaldoObject;
    };
    key: string;
    indexes: {};
  };
}

export const DBProvider = {
  accountsDB: {
    dbname: DataBases.ACCOUNTS,
    dbDemoName: DataBases.DEMO_ACCOUNTS,
    currentVersion: 1,
  },
};

export class IndexedDBAccountManager {
  private static _storeManager: null | IndexedDBAccountManager = null;
  private _account_data: null | IDBPDatabase<IDBAccounts> = null;

  private constructor() {
    LogMe.indexedDB("IndexedDBAccountManager | account-database created");
    this._account_data;
  }

  //Get singleton instance
  public static get AppStateManager() {
    if (!IndexedDBAccountManager._storeManager) {
      IndexedDBAccountManager._storeManager = new IndexedDBAccountManager();
    }
    LogMe.info("IndexedDBAccountManager used");
    return IndexedDBAccountManager._storeManager;
  }

  public async initDB(useRegularDB: boolean = true): Promise<boolean> {
    const appDatabase = DBProvider.accountsDB;
    let relatedDB = appDatabase.dbname;
    if (!useRegularDB || ApplicationEnvironmentStore.Demo) {
      relatedDB = appDatabase.dbDemoName;
    }
    const db = await openDB<IDBAccounts>(
      relatedDB,
      appDatabase.currentVersion,
      {
        upgrade(db) {
          upgradeAccountDB(db);
        },
      }
    );
    if (db) {
      this._account_data = db;
      return Promise.resolve(true);
    } else {
      return Promise.reject(false);
    }
  }
  //Later used when switch between demo and app
  // public async switchToDemoAccounts() {
  //   try {
  //     this._account_data?.close();
  //     this._account_data = null;
  //     await this.initDB(false);
  //     return Promise.resolve(true);
  //   } catch (err) {
  //     throw new Error(`Failed to init demo accounts: ${err}`);
  //   }
  // }

  //ADD & DELETE
  public async addAccount(payload: IBasicAccountClass): Promise<boolean> {
    if (!this._account_data) {
      try {
        await this.initDB();
      } catch (err) {
        throw new Error(`Failed to init DB:${err}`);
      }
    }

    if (this._account_data) {
      const appState = this._account_data;
      try {
        const originalResult = await appState.get(
          "accounts",
          payload._internalID._value
        );
        if (originalResult) {
          throw new Error("Account already exists");
        } else {
          await appState.add("accounts", payload);
        }
        return Promise.resolve(true);
      } catch (err) {
        throw new Error(`Failed to add account: ${err}`);
      }
    } else {
      throw new Error("Database not found");
    }
  }
  private updateBalance(
    payload: IBasicTransferClass | Array<IBasicTransferClass>
  ) {
    const addTransferMessage: AAWAddTransfer = {
      type: AAW_MessageTypes.ADD_TRANSFER,
      messageData: JSON.parse(JSON.stringify(payload)),
    };
    AccountAssistantWorker.WorkerProvider.postMessage(addTransferMessage);
  }
  public async deleteAccount(accountID: string): Promise<boolean> {
    if (!this._account_data) {
      try {
        await this.initDB();
      } catch (err) {
        throw new Error(`Failed to init DB:${err}`);
      }
    }

    if (this._account_data) {
      const appState = this._account_data;
      try {
        const originalResult = await appState.get("accounts", accountID);
        if (originalResult) {
          await IndexedDBTransferManager.AppStateManager.deleteAllTransfersFromAccountID(
            originalResult.transfers._value
          );
          appState.delete("accounts", accountID);
          return Promise.resolve(true);
        } else {
          throw new Error("Account not found");
        }
      } catch (err) {
        throw new Error(`Failed to delete account: ${err}`);
      }
    } else {
      throw new Error("Database not found");
    }
  }
  public async removeTransferFromAccount(payload: {
    accountID: string;
    transferID: string;
  }): Promise<boolean> {
    if (!this._account_data) {
      try {
        await this.initDB();
      } catch (err) {
        throw new Error(`Failed to init DB:${err}`);
      }
    }

    if (this._account_data) {
      const appState = this._account_data;
      try {
        const originalResult = await appState.get(
          "accounts",
          payload.accountID
        );
        if (originalResult) {
          await IndexedDBTransferManager.AppStateManager.deleteTransfer(
            payload.transferID
          );
          const newTransferArray = originalResult.transfers._value.filter(
            (entry) => {
              return payload.transferID !== entry;
            }
          );
          originalResult.transfers._value = newTransferArray;
          appState.put("accounts", originalResult);
          return Promise.resolve(true);
        } else {
          throw new Error("Account not found");
        }
      } catch (err) {
        throw new Error(`Failed to delete transfer: ${err}`);
      }
    } else {
      throw new Error("Database not found");
    }
  }
  public async addTransferToAccount(
    payload: IBasicTransferClass
  ): Promise<boolean> {
    if (!this._account_data) {
      try {
        await this.initDB();
      } catch (err) {
        throw new Error(`Failed to init DB:${err}`);
      }
    }

    if (this._account_data) {
      const appState = this._account_data;
      try {
        const originalResult = await appState.get(
          "accounts",
          payload._accountID._value
        );
        if (originalResult) {
          await IndexedDBTransferManager.AppStateManager.addTransfer(payload);
          originalResult.transfers._value.push(payload._internalID._value);
          appState.put("accounts", originalResult);
          this.updateBalance(payload);
          return Promise.resolve(true);
        } else {
          throw new Error("Account not found");
        }
      } catch (err) {
        throw new Error(`Failed to delete transfer: ${err}`);
      }
    } else {
      throw new Error("Database not found");
    }
  }
  //ADD & DELETE
  //CHANGE
  public async updateSimpleProperty(payload: {
    accountID: string;
    property: string;
    value: number | string | boolean;
  }): Promise<boolean> {
    //TODO
    return Promise.resolve(true);
  }
  //CHANGE

  public async getAllAccounts(): Promise<Array<IBasicAccountClass | never>> {
    if (!this._account_data) {
      try {
        await this.initDB();
      } catch (err) {
        throw new Error(`Failed to init DB:${err}`);
      }
    }

    if (this._account_data) {
      const appState = this._account_data;
      try {
        return appState.getAll("accounts");
      } catch (err) {
        throw new Error(`Failed to get all accounts: ${err}`);
      }
    } else {
      throw new Error("Database not found");
    }
  }

  // public async addTransferToAccount(payload: {
  //   accountID: string;
  //   transferID: string;
  // }) {
  //   if (!this._account_data) {
  //     try {
  //       await this.initDB();
  //     } catch (err) {
  //       throw new Error(`Failed to init DB:${err}`);
  //     }
  //   }

  //   if (this._account_data) {
  //     const appState = this._account_data;
  //     try {
  //       const targetAccount = await appState.get("accounts", payload.accountID);
  //       if (targetAccount) {
  //         targetAccount.transfers._value.push(payload.transferID);
  //         appState.put("accounts", targetAccount);
  //       } else {
  //         throw new Error("Account not found");
  //       }
  //     } catch (err) {
  //       throw new Error(`Failed to add account: ${err}`);
  //     }
  //   } else {
  //     throw new Error("Database not found");
  //   }
  // }

  // public async removeTransferFromAccount(payload: {
  //   accountID: string;
  //   transferID: string;
  // }): Promise<boolean> {
  //   if (!this._account_data) {
  //     try {
  //       await this.initDB();
  //     } catch (err) {
  //       throw new Error(`Failed to init DB:${err}`);
  //     }
  //   }

  //   if (this._account_data) {
  //     const appState = this._account_data;
  //     try {
  //       const targetAccount = await appState.get("accounts", payload.accountID);
  //       if (targetAccount) {
  //         const newTransferList = targetAccount.transfers._value.filter(
  //           (tag) => tag !== payload.transferID
  //         );
  //         targetAccount.transfers._value = newTransferList;
  //         appState.put("accounts", targetAccount);
  //         return Promise.resolve(true);
  //       } else {
  //         throw new Error("Account not found");
  //       }
  //     } catch (err) {
  //       throw new Error(`Failed to add account: ${err}`);
  //     }
  //   } else {
  //     throw new Error("Database not found");
  //   }
  // }
}
