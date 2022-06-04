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
import { AppDataStore } from "../appData/app-data";
import { ExampleWorker } from "./demo-worker-types";
import IndexedDBAccountStoreManager from "@/indexedDB/account-database";
import IndexedDBTransferStoreManager from "@/indexedDB/transfer-database";
import { DataFieldType } from "@/interfaces/data-field/data-field-interface";
import {
  AccountAssistMessageTypes,
  RequestBalanceMessage,
} from "@/worker/message-interfaces/account-assist-interface";
import { accountAssistantWorker } from "@/worker/worker-provider";
import IndexedDBAppStateStoreManager from "@/indexedDB/app-state-database";
import { ApplicationEnvironment } from "../application/application-store";

@Module({
  dynamic: true,
  namespaced: true,
  store,
  name: "AccountTransferStore",
})
class AccountsTransfers extends VuexModule {
  /*
   * Accounts
   */

  //STATE & GETTER
  private _accounts: { [index: string]: IBasicAccountClass } = {};
  public get allAccounts(): Array<IBasicAccountClass | never> {
    const accounts: Array<IBasicAccountClass> = [];
    const allAccounts = this._accounts;
    for (const account in allAccounts) {
      accounts.push(allAccounts[account]);
    }
    return accounts;
  }
  //TODO: necessary ?
  public get selectedAccounts() {
    const selectedAccounts = [];
    const allAccounts = this._accounts;
    for (const account in allAccounts) {
      if (allAccounts[account].isSelected._value) {
        selectedAccounts.push(allAccounts[account]);
      }
    }
    return selectedAccounts;
  }
  //STATE & GETTER

  //ADD-ACCOUNT
  @Mutation
  private addAccount(payload: IBasicAccountClass) {
    this._accounts[payload._internalID._value] = payload;
  }
  @Action({ rawError: true })
  async commitAddAccount(payload: IBasicAccountClass): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!this._accounts.hasOwnProperty(payload._internalID._value)) {
        try {
          if (!ApplicationEnvironment.Demo) {
            await IndexedDBAccountStoreManager.addAccount(payload);
          }
          this.addAccount(payload);
          resolve(true);
        } catch (err) {
          throw new Error(`Failed to add account to DB: ${err}`);
        }
      } else {
        throw new Error("Account already exists");
      }
    });
  }
  @Action({ rawError: true })
  async commitAddAccountFromDB(payload: IBasicAccountClass): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!this._accounts.hasOwnProperty(payload._internalID._value)) {
        try {
          // await IndexedDBAccountStoreManager.addAccount(payload);
          this.addAccount(payload);
          resolve(true);
        } catch (err) {
          throw new Error("Failed to add transfer to DB");
        }
      } else {
        throw new Error("Account already exists");
      }
    });
  }
  //ADD-ACCOUNT

  //!Interact with transfer
  @Action
  private async addTransferToAccount(payload: {
    accountID: string;
    transferID: string;
  }): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      if (this._accounts.hasOwnProperty(payload.accountID)) {
        if (
          !this._accounts[payload.accountID].transfers._value.includes(
            payload.transferID
          )
        ) {
          try {
            if (!ApplicationEnvironment.Demo) {
              await IndexedDBAccountStoreManager.addTransferToAccount({
                accountID: payload.accountID,
                transferID: payload.transferID,
              });
            }
            this.connectTransfer(payload);
            resolve(true);
          } catch (err) {
            throw new Error(`Failed to add transfer to account: ${err}`);
          }
        } else {
          throw new Error("Transfer already added to account!");
        }
      } else {
        throw new Error("Account not found!");
      }
    });
  }
  //!Interact with transfer

  //*-----------------------------------FINISHED

  //DELETE-ACCOUNT
  @Mutation
  private deleteAccount(accountID: string) {
    delete this._accounts[accountID];
  }
  @Action({ rawError: true })
  async commitDeleteAccount(accountID: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (this._accounts.hasOwnProperty(accountID)) {
        try {
          //TODO
          //DELETE TRANSFERS FROM PAGINATION

          //DELETE ALL TRANSFERS
          if (!ApplicationEnvironment.Demo) {
            await IndexedDBTransferStoreManager.deleteManyTransfers(
              this._accounts[accountID].transfers._value
            );
            //DELETE ACCOUNT FROM DB
            await IndexedDBAccountStoreManager.deleteAccount(accountID);
          }
          //DELETE ACCOUNT FROM STORE
          this.deleteAccount(accountID);
          resolve(true);
        } catch (err) {
          throw new Error("Failed to delete account from DB");
        }
      } else {
        throw new Error("Account not found");
      }
    });
  }
  //DELETE-ACCOUNT

  @Mutation
  private setAccountSelected(payload: {
    accountID: string;
    selected: boolean;
  }) {
    this._accounts[payload.accountID].isSelected._value = payload.selected;
  }
  @Action
  commitAccountSelected(payload: { accountID: string; selected: boolean }) {
    if (this._accounts.hasOwnProperty(payload.accountID)) {
      this.setAccountSelected(payload);
    }
  }

  //!Interact with transfer
  //
  @Mutation
  private connectTransfer(payload: { accountID: string; transferID: string }) {
    this._accounts[payload.accountID].transfers._value.push(payload.transferID);
  }
  @Mutation
  private disconnectTransfer(payload: {
    accountID: string;
    transferID: string;
  }) {
    const newTransfers = this._accounts[
      payload.accountID
    ].transfers._value.filter((entry) => {
      return entry !== payload.transferID;
    });

    this._accounts[payload.accountID].transfers._value = newTransfers;
  }
  //Ad or delete
  @Action
  private async deleteTransferFromAccount(payload: {
    accountID: string;
    transferID: string;
  }): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      if (this._accounts.hasOwnProperty(payload.accountID)) {
        try {
          if (!ApplicationEnvironment.Demo) {
            await IndexedDBAccountStoreManager.removeTransferFromAccount({
              accountID: payload.accountID,
              transferID: payload.transferID,
            });
          }
          this.disconnectTransfer(payload);
          resolve(true);
        } catch (err) {
          throw new Error();
        }
      }
    });
  }
  /*
   * Accounts END
   */

  /*
   * Transfers
   */

  //STATE & GETTER

  //STATE & GETTER

  //ADD-TRANSFERS
  @Mutation
  private addTransfer(payload: IBasicTransferClass) {
    this._transfers[payload._internalID._value] = payload;
  }
  @Action({ rawError: true })
  async commitAddTransfer(payload: IBasicTransferClass): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (!this._transfers.hasOwnProperty(payload._internalID._value)) {
        try {
          if (!ApplicationEnvironment.Demo) {
            await IndexedDBTransferStoreManager.addTransfer(payload);
          }
          this.addTransferToPage(payload);
          await this.addTransferToAccount({
            accountID: payload._accountID._value,
            transferID: payload._internalID._value,
          });
          this.addTransfer(payload);
          if (!ApplicationEnvironment.Demo) {
            const requestMessage: RequestBalanceMessage = {
              topic: {
                type: AccountAssistMessageTypes.REQUEST_CALC,
                accountID: payload._accountID._value,
              },
            };
            accountAssistantWorker.postMessage(requestMessage);
          }
          resolve(true);
        } catch (err) {
          throw new Error(`Failed to add transfer to DB: ${err}`);
        }
      } else {
        throw new Error("Transfer already exists");
      }
    });
  }
  @Action({ rawError: true })
  async commitAddTransferFromDB(
    payload: IBasicTransferClass
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!this._transfers.hasOwnProperty(payload._internalID._value)) {
        this.addTransferToPage(payload);
        // this.addTransferToAccount({
        //   accountID: payload._accountID._value,
        //   transferID: payload._internalID._value,
        // });
        this.addTransfer(payload);
        resolve(true);
      } else {
        reject(new Error("Transfer already exists"));
      }
    });
  }
  //ADD-TRANSFERS

  //*-----------------------------------FINISHED

  private _transfers: { [index: string]: IBasicTransferClass } = {};
  // public get transfersAsObject() {
  //   return this._transfers;
  // }
  public get allTransfers() {
    const transfers: Array<IBasicTransferClass> = [];
    const allTransfers = this._transfers;
    for (const transfer in allTransfers) {
      transfers.push(allTransfers[transfer]);
    }
    return transfers;
  }
  public get pageTransfers() {
    if (this._currentPage === null) {
      return [];
    }

    const transfersFromPath =
      this._pagination[this._currentPage.year][this._currentPage.month];

    if (transfersFromPath && transfersFromPath.length > 0) {
      const mappedTransfers = this._pagination[this._currentPage.year][
        this._currentPage.month
      ]
        .map((entry) => {
          return this._transfers[entry];
        })
        .filter((entry) => {
          return this._accounts[entry._accountID._value].isSelected._value;
        });

      return mappedTransfers;
    }
    return [];
  }

  private _openedTransfers: Array<string> = [];
  public get isOpened() {
    return this._openedTransfers;
  }
  @Mutation
  private setTransferSelected(payload: {
    transferId: string;
    selected: boolean;
  }) {
    this._transfers[payload.transferId].isSelected._value = payload.selected;
  }
  @Mutation
  private setTransferOpened(payload: string) {
    this._openedTransfers.push(payload);
  }
  @Mutation
  private removeTransferOpened(payload: string) {
    this._openedTransfers = this._openedTransfers.filter((entry) => {
      return entry !== payload;
    });
  }
  @Mutation
  private closeAllOpenTransfers() {
    this._openedTransfers = [];
  }
  @Action
  commitTransferOpenState(payload: string) {
    if (this.isOpened.includes(payload)) {
      this.removeTransferOpened(payload);
    } else {
      this.setTransferOpened(payload);
    }
  }
  @Action
  commitCloseAllOpenTransfers() {
    this.closeAllOpenTransfers();
  }
  @Action
  commitTransferSelected(payload: { transferId: string; selected: boolean }) {
    if (this._transfers.hasOwnProperty(payload.transferId)) {
      this.setTransferSelected(payload);
    }
  }
  /*
   * Transfers End
   */

  private _pagination: { [index: number]: { [index: number]: Array<string> } } =
    {};
  private _currentPage: { year: number; month: number } | null = null;
  public get currentPage() {
    return this._currentPage;
  }
  public get pagination() {
    return this._pagination;
  }

  //TODO get fix calculation
  public get transfersFromActiveAccounts(): Array<IBasicTransferClass | never> {
    const targetTransfers = [] as Array<IBasicTransferClass | never>;

    const selectedAccounts = this.selectedAccounts;

    for (const account in selectedAccounts) {
      selectedAccounts[account].transfers._value.forEach((transferID) => {
        if (typeof transferID === "string") {
          targetTransfers.push(this._transfers[transferID]);
        }
      });
    }
    console.timeEnd("StartSelecting Transfers");

    return targetTransfers;
    // return [];
  }

  //Add
  @Mutation
  private setPagination(payload: {
    [index: number]: { [index: number]: Array<string> };
  }) {
    this._pagination = payload;
  }
  @Mutation
  private addTransferToPage(payload: IBasicTransferClass) {
    const valutaDateYear = payload.valutaDate._dateMetaInformation.year;
    const valutaDateMonth = payload.valutaDate._dateMetaInformation.month;

    if (!this._pagination.hasOwnProperty(valutaDateYear)) {
      this._pagination[valutaDateYear] = {};
    }
    if (!this._pagination[valutaDateYear].hasOwnProperty(valutaDateMonth)) {
      this._pagination[valutaDateYear][valutaDateMonth] = [];
    }
    if (this._currentPage === null) {
      this._currentPage = {
        month: valutaDateMonth,
        year: valutaDateYear,
      };
    }
    this._pagination[valutaDateYear][valutaDateMonth].push(
      payload._internalID._value
    );
  }
  @Mutation
  private deleteTransferFromPage(payload: IBasicTransferClass) {
    const valutaDateYear = payload.valutaDate._dateMetaInformation.year;
    const valutaDateMonth = payload.valutaDate._dateMetaInformation.month;
    const path = this._pagination[valutaDateYear][valutaDateMonth];

    if (path && path.includes(payload._internalID._value)) {
      const newArray = path.filter((entry) => {
        return entry !== payload._internalID._value;
      });
      if (newArray.length > 0) {
        this._pagination[valutaDateYear][valutaDateMonth] = newArray;
      } else {
        delete this._pagination[valutaDateYear][valutaDateMonth];
        let countProps = 0;
        for (const prop in this._pagination[valutaDateYear]) {
          if (this._pagination[valutaDateYear].hasOwnProperty(prop)) {
            countProps++;
          }
        }
        if (countProps === 0) {
          delete this._pagination[valutaDateYear];
        }
      }
    }
  }
  @Mutation
  private setCurrentPage(payload: { month: number; year: number }) {
    this._currentPage = { year: payload.year, month: payload.month };
  }
  @Action
  commitCurrentPage(payload: { month: number; year: number }) {
    if (this._pagination.hasOwnProperty(payload.year)) {
      if (this._pagination[payload.year].hasOwnProperty(payload.month)) {
        this.setCurrentPage(payload);
      }
    }
  }

  //Multithread ?
  @Action
  createPagination() {
    const newPagination: {
      [index: number]: { [index: number]: Array<string> };
    } = {};

    const transfers = this.allTransfers;

    for (const transfer in transfers) {
      const year = transfers[transfer].valutaDate._dateMetaInformation.year;
      const month = transfers[transfer].valutaDate._dateMetaInformation.month;
      const id = transfers[transfer]._internalID._value;

      if (!newPagination.hasOwnProperty(year)) {
        newPagination[year] = {};
      }

      if (!newPagination[year].hasOwnProperty(month)) {
        newPagination[year][month] = [];
      }

      const hasTransfer = newPagination[year][month].includes(id);

      if (!hasTransfer) {
        newPagination[year][month].push(id);
      }
    }

    this.setPagination(newPagination);
  }

  // @Action
  // async initializeSampleStore() {
  //   const newWorker: Worker = new Worker(
  //     new URL("./demo-worker.ts", import.meta.url),
  //     {
  //       type: "module",
  //     }
  //   );

  //   const get: ExampleWorker = Comlink.wrap(newWorker);

  //   const accountStore: Array<IBasicAccountClass> = await get.examples(3, 50);

  //   accountStore.forEach((account) => {
  //     account.transfers._value.forEach((transfer) => {
  //       if (typeof transfer !== "string") {
  //         this._transfers[transfer._internalID._value] = transfer;
  //       }
  //     });

  //     account.transfers._value = account.transfers._value.map((transfer) => {
  //       if (typeof transfer !== "string") {
  //         return transfer._internalID._value;
  //       } else {
  //         return transfer;
  //       }
  //     });

  //     this._accounts[account._internalID._value] = account;
  //   });

  //   const tags = await get.getTags;

  //   tags.forEach((tag) => {
  //     AppDataStore.addDefaultTag(tag);
  //   });

  //   newWorker.terminate();

  //   return true;
  // }

  //!INIT
  @Action({ rawError: true })
  async initAccounts(): Promise<boolean> {
    try {
      if (!ApplicationEnvironment.Demo) {
        const accounts = await IndexedDBAccountStoreManager.getAllAccounts();

        accounts.forEach((account) => {
          const existingAccount = new BasicAccount(account);
          this.commitAddAccountFromDB(existingAccount);
        });
      }
      return Promise.resolve(true);
    } catch (err) {
      return Promise.reject(err);
    }
  }
  @Action({ rawError: true })
  async initTransfers(): Promise<boolean> {
    try {
      if (!ApplicationEnvironment.Demo) {
        const transfers = await IndexedDBTransferStoreManager.getAllTransfers();
        transfers.forEach((transfer) => {
          const existingTransfer = new BasicTransfer(transfer);
          this.commitAddTransferFromDB(existingTransfer);
        });
      }
      return Promise.resolve(true);
    } catch (err) {
      return Promise.reject(err);
    }
  }
  @Action
  async initMetaState(): Promise<boolean> {
    try {
      const requestState = await IndexedDBAppStateStoreManager.getState(
        "useDemo"
      );
      if (
        requestState &&
        "value" in requestState &&
        typeof requestState.value === "boolean"
      ) {
        ApplicationEnvironment.setDemoMode(requestState.value);
      }
      return Promise.resolve(true);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export const AccountTransferStore = getModule(AccountsTransfers);
