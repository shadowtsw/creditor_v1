import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import store from "..";

import {
  BasicAccount,
  IBasicAccountClass,
} from "@/interfaces/accounts/accounts";
import {
  BasicTransfer,
  IBasicTransferClass,
} from "@/interfaces/transfers/transfers";
import * as Comlink from "comlink";
import { RequestEventDataType } from "./demo-worker-types";
import { SubDataStore } from "../sub-data/sub-data-store";
import { ExampleWorker } from "./demo-worker-types";
import { IndexedDBAccountManager } from "@/indexedDB/account-database";
import { IndexedDBTransferManager } from "@/indexedDB/transfer-database";
import { DataFieldType } from "@/interfaces/data-field/data-field-interface";
import {
  AAWResBalance,
  AAWUpdatePagination,
  AAW_MessageTypes,
  RequestBalanceMessage,
} from "@/worker/message-interfaces/account-assist-interface";
import { AccountAssistantWorker } from "@/worker/worker-provider";
import { IndexedDBAppStateManager } from "@/indexedDB/app-state-database";
import { ApplicationEnvironmentStore } from "../application/application-store";
import { Pagination } from "@/interfaces/transfers/page-types";
import { LogMe } from "@/logging/logger-function";
import { AccountBalanceObject } from "@/interfaces/accounts/saldo-balance-types";

@Module({
  dynamic: true,
  namespaced: true,
  store,
  name: "AccountTransferStore",
})
// class AccountsTransfers extends VuexModule {

//   private _transfers: { [index: string]: IBasicTransferClass } = {};
// public get transfersAsObject() {
//   return this._transfers;
// }
//   public get allTransfers() {
//     const transfers: Array<IBasicTransferClass> = [];
//     const allTransfers = this._transfers;
//     for (const transfer in allTransfers) {
//       transfers.push(allTransfers[transfer]);
//     }
//     return transfers;
//   }
// public get pageTransfers() {
//   if (this._currentPage === null) {
//     return [];
//   }

//   const transfersFromPath =
//     this._pagination[this._currentPage.year][this._currentPage.month];

//   if (transfersFromPath && transfersFromPath.length > 0) {
//     const mappedTransfers = this._pagination[this._currentPage.year][
//       this._currentPage.month
//     ]
//       .map((entry) => {
//         return this._transfers[entry];
//       })
//       .filter((entry) => {
//         return this._accounts[entry._accountID._value].isSelected._value;
//       });

//     return mappedTransfers;
//   }
//   return [];
// }

//   private _openedTransfers: Array<string> = [];
//   public get isOpened() {
//     return this._openedTransfers;
//   }
//   @Mutation
//   private setTransferSelected(payload: {
//     transferId: string;
//     selected: boolean;
//   }) {
//     this._transfers[payload.transferId].isSelected._value = payload.selected;
//   }
//   @Mutation
//   private setTransferOpened(payload: string) {
//     this._openedTransfers.push(payload);
//   }
//   @Mutation
//   private removeTransferOpened(payload: string) {
//     this._openedTransfers = this._openedTransfers.filter((entry) => {
//       return entry !== payload;
//     });
//   }
//   @Mutation
//   private closeAllOpenTransfers() {
//     this._openedTransfers = [];
//   }
//   @Action
//   commitTransferOpenState(payload: string) {
//     if (this.isOpened.includes(payload)) {
//       this.removeTransferOpened(payload);
//     } else {
//       this.setTransferOpened(payload);
//     }
//   }
//   @Action
//   commitCloseAllOpenTransfers() {
//     this.closeAllOpenTransfers();
//   }
//   @Action
//   commitTransferSelected(payload: { transferId: string; selected: boolean }) {
//     if (this._transfers.hasOwnProperty(payload.transferId)) {
//       this.setTransferSelected(payload);
//     }
//   }
//   /*
//  * Transfers End
//  */

//   private _pagination: Pagination = {};
//   private _currentPage: { year: number; month: number } | null = null;
//   public get currentPage() {
//     return this._currentPage;
//   }

//   //TODO get fix calculation
//   public get transfersFromActiveAccounts(): Array<IBasicTransferClass | never> {
//     const targetTransfers = [] as Array<IBasicTransferClass | never>;

//     const selectedAccounts = this.selectedAccounts;

//     for (const account in selectedAccounts) {
//       selectedAccounts[account].transfers._value.forEach((transferID) => {
//         if (typeof transferID === "string") {
//           targetTransfers.push(this._transfers[transferID]);
//         }
//       });
//     }
//     console.timeEnd("StartSelecting Transfers");

//     return targetTransfers;
//     // return [];
//   }

//   //Add

//   @Mutation
//   private setCurrentPage(payload: { month: number; year: number }) {
//     this._currentPage = { year: payload.year, month: payload.month };
//   }
//   @Action
//   commitCurrentPage(payload: { month: number; year: number }) {
//     if (this._pagination.hasOwnProperty(payload.year)) {
//       if (this._pagination[payload.year].hasOwnProperty(payload.month)) {
//         this.setCurrentPage(payload);
//       }
//     }
//   }

//   @Action({ rawError: true })
//   async initTransfers(): Promise<boolean> {
//     try {
//       const transfers =
//         await IndexedDBTransferManager.AppStateManager.getAllTransfers();

//       // transfers.forEach((transfer) => {
//       //   const existingTransfer = new BasicTransfer(transfer);
//       //   this.commitAddTransferFromDB(existingTransfer);
//       // });

//       return Promise.resolve(true);
//     } catch (err) {
//       return Promise.reject(err);
//     }
//   }
//   @Action
//   async initMetaState(): Promise<boolean> {
//     try {
//       const requestState =
//         await IndexedDBAppStateManager.AppStateManager.getState("useDemo");
//       if (
//         requestState &&
//         "value" in requestState &&
//         typeof requestState.value === "boolean"
//       ) {
//         ApplicationEnvironmentStore.setDemoMode(requestState.value);
//       }
//       return Promise.resolve(true);
//     } catch (err) {
//       return Promise.reject(err);
//     }
//   }
// }
class AccountsTransfers extends VuexModule {
  /*
   * ACCOUNTS
   */
  private _accounts: Array<IBasicAccountClass> = [];
  public get allAccounts(): Array<IBasicAccountClass | never> {
    return this._accounts;
  }
  //-----
  @Mutation
  private addAccount(payload: IBasicAccountClass) {
    this._accounts.push(payload);
  }
  @Action({ rawError: true })
  async commitAddAccount(payload: IBasicAccountClass): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const findExistingAccount = this._accounts.find((entry) => {
        return payload._internalID._value === entry._internalID._value;
      });

      if (findExistingAccount) {
        throw new Error("Account already exists");
      }

      try {
        await IndexedDBAccountManager.AppStateManager.addAccount(payload);
        this.addAccount(payload);
        resolve(true);
      } catch (err) {
        throw new Error(`Failed to add account to DB: ${err}`);
      }
    });
  }
  //-----
  @Action({ rawError: true })
  async commitDeleteAccount(accountID: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        await IndexedDBAccountManager.AppStateManager.deleteAccount(accountID);
        const newAccountArray = this._accounts.filter((entry) => {
          return accountID !== entry._internalID._value;
        });
        this.initAccounts(newAccountArray);
        resolve(true);
      } catch (err) {
        throw new Error("Failed to delete account from DB");
      }
    });
  }
  //-----
  @Mutation //INIT ONLY OR AFTER DELETE !!
  private initAccounts(payload: Array<IBasicAccountClass>) {
    this._accounts = payload;
  }
  @Action({ rawError: true }) //INIT ONLY !!
  async initAccountsFromDB(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const getAccountsObject =
          await IndexedDBAccountManager.AppStateManager.getAllAccounts();
        if (getAccountsObject && getAccountsObject.length > 0) {
          let accountArray: Array<IBasicAccountClass> = [];
          getAccountsObject.forEach((account) => {
            const newAccount = new BasicAccount(account);
            accountArray.push(newAccount);
          });
          this.initAccounts(accountArray);
        }
        // this.postBalanceCalculation(payload._internalID._value);
        resolve(true);
      } catch (err) {
        throw new Error("Failed to add transfer to DB");
      }
    });
  }
  //-----
  @Mutation
  private setAccountSelected(payload: { index: number; selected: boolean }) {
    this._accounts[payload.index].isSelected._value = payload.selected;
  }
  @Action
  async commitAccountSelected(payload: {
    accountID: string;
    selected: boolean;
  }) {
    const targetAccountIndex = this._accounts.findIndex((account) => {
      return account._internalID._value === payload.accountID;
    });
    if (targetAccountIndex !== -1) {
      await IndexedDBAccountManager.AppStateManager.updateSimpleProperty({
        accountID: payload.accountID,
        property: "isSelected",
        value: payload.selected,
      });
      this.setAccountSelected({
        index: targetAccountIndex,
        selected: payload.selected,
      });
    } else {
      throw new Error("Account not found");
    }
  }
  //-----
  /**
   * BALANCE DATA
   */
  private _accountBalanceSummary: {
    [index: string]: AccountBalanceObject & { isLoading: boolean };
  } = {};
  public get accountBalanceSummary() {
    return this._accounts.map((entry) => {
      if (this._accountBalanceSummary[entry._internalID._value]) {
        return this._accountBalanceSummary[entry._internalID._value];
      } else {
        return {
          isLoading: false,
          lastMonth: {
            startBalance: 0,
            endBalance: 0,
            income: 0,
            outgoing: 0,
            sum: 0,
          },
          currentMonth: {
            startBalance: 0,
            endBalance: 0,
            income: 0,
            outgoing: 0,
            sum: 0,
          },
        };
      }
    });
  }
  @Mutation
  private setAccountBalanceDataUpdate(payload: {
    accountID: string;
    data: AccountBalanceObject & { isLoading: boolean };
  }) {
    this._accountBalanceSummary[payload.accountID] = payload.data;
  }
  @Mutation
  public setAccountLoadingState(payload: {
    accountID: string;
    loadingState: boolean;
  }) {
    this._accountBalanceSummary[payload.accountID].isLoading =
      payload.loadingState;
  }
  @Action
  commitAccountBalanceDataUpdate(data: AAWResBalance) {
    const accountBalanceObject: AccountBalanceObject & { isLoading: boolean } =
      {
        ...data.messageData.data,
        ...{ isLoading: false },
      };

    console.log("accountBalanceObject", accountBalanceObject);
    this.setAccountBalanceDataUpdate({
      accountID: data.messageData.accountID,
      data: accountBalanceObject,
    });
  }
  /*
   * TRANSFERS
   */
  //-----
  @Mutation
  private addTransferToAccount(payload: {
    accountIndex: number;
    transferArray: Array<string>;
  }) {
    this._accounts[payload.accountIndex].transfers._value =
      payload.transferArray;
  }
  @Action
  public async commitAddTransferToAccount(
    transfer: IBasicTransferClass
  ): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      const findTargetIndex = this._accounts.findIndex((account) => {
        return account._internalID._value === transfer._accountID._value;
      });

      if (findTargetIndex === -1) {
        throw new Error("Account not found");
      }

      if (
        this._accounts[findTargetIndex].transfers._value.includes(
          transfer._internalID._value
        )
      ) {
        throw new Error("Transfer already added to account!");
      }

      try {
        await IndexedDBAccountManager.AppStateManager.addTransferToAccount(
          transfer
        );

        const newTransferArray = [
          ...this._accounts[findTargetIndex].transfers._value,
          transfer._internalID._value,
        ];

        this.addTransferToAccount({
          accountIndex: findTargetIndex,
          transferArray: newTransferArray,
        });

        resolve(true);
      } catch (err) {
        throw new Error(`Failed to add transfer to account: ${err}`);
      }
    });
  }
  //-----
  /*
   * PAGINATION
   */
  private _pagination: Pagination = {};
  public get pagination() {
    return this._pagination;
  }
  @Mutation
  private setPagination(payload: Pagination) {
    this._pagination = payload;
  }
  @Action
  commitPagination(payload: Pagination) {
    this.setPagination(payload);
  }
}

LogMe.store("Account-Transfer-Store");
export const AccountTransferStore = getModule(AccountsTransfers);
