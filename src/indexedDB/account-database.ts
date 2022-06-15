import { IBasicAccountClass, DataBases } from "@/interfaces/accounts/accounts";
import {
  MonthBalanceObject,
  SaldoObject,
} from "@/interfaces/accounts/saldo-balance-types";
import { openDB, deleteDB, wrap, unwrap, IDBPDatabase, DBSchema } from "idb";
import { upgradeAccountDB } from "./upgrade-functions/account-db";

import { ApplicationEnvironmentStore } from "@/store/application/application-store";

export interface IDBAccounts extends DBSchema {
  accounts: {
    value: IBasicAccountClass;
    key: string;
    indexes: { isSelected: number };
  };
  //TODO
  accountMetaData: {
    value: any;
    key: string;
    indexes: {};
  };
  Cache: {
    // value: MonthlyBalanceCache | SaldoCache;
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

class IndexedDBAccountManager {
  private static _storeManager: null | IndexedDBAccountManager = null;

  private _account_data: null | IDBPDatabase<IDBAccounts> = null;

  private constructor() {
    this._account_data;
  }

  //Get singleton instance
  public static get AppStateManager() {
    if (!IndexedDBAccountManager._storeManager) {
      IndexedDBAccountManager._storeManager = new IndexedDBAccountManager();
    }
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
  //ADD & DELETE

  public async getAllAccounts() {
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

  public async addTransferToAccount(payload: {
    accountID: string;
    transferID: string;
  }) {
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
        const targetAccount = await appState.get("accounts", payload.accountID);
        if (targetAccount) {
          targetAccount.transfers._value.push(payload.transferID);
          appState.put("accounts", targetAccount);
        } else {
          throw new Error("Account not found");
        }
      } catch (err) {
        throw new Error(`Failed to add account: ${err}`);
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
        const targetAccount = await appState.get("accounts", payload.accountID);
        if (targetAccount) {
          const newTransferList = targetAccount.transfers._value.filter(
            (tag) => tag !== payload.transferID
          );
          targetAccount.transfers._value = newTransferList;
          appState.put("accounts", targetAccount);
          return Promise.resolve(true);
        } else {
          throw new Error("Account not found");
        }
      } catch (err) {
        throw new Error(`Failed to add account: ${err}`);
      }
    } else {
      throw new Error("Database not found");
    }
  }

  public async useDemoAccounts() {
    try {
      this._account_data?.close();
      await this.initDB(false);
      return Promise.resolve(true);
    } catch (err) {
      throw new Error(`Failed to init demo accounts: ${err}`);
    }
  }
}

const IndexedDBAccountStoreManager = IndexedDBAccountManager.AppStateManager;
export default IndexedDBAccountStoreManager;
