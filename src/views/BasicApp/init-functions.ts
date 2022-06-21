import { IndexedDBAccountManager } from "@/indexedDB/account-database";
import { IndexedDBAppStateManager } from "@/indexedDB/app-state-database";
import { IndexedDBTransferManager } from "@/indexedDB/transfer-database";
import { AccountTransferStore } from "@/store/account-transfer/account-transfer-store";
import { ApplicationEnvironmentStore } from "@/store/application/application-store";
import { AccountAssistantWorker, DemoWorker } from "@/worker/worker-provider";

//Functions & States used before
//If demo skips -> currentDemoState, currentWelcomeState
//If Welcome or initial start -> commitShowWelcomeScreen, commitUseDemo

//TODO
export const initAppState = async (): Promise<boolean> => {
  console.info("Start without Demo");
  await IndexedDBAppStateManager.AppStateManager.deleteDemo();
  //Init Databases
  await IndexedDBAccountManager.AppStateManager.initDB();
  await IndexedDBTransferManager.AppStateManager.initDB();
  //Init Workers
  await AccountAssistantWorker.WorkerProvider.init();
  //Init Accounts
  await AccountTransferStore.initAccountsFromDB();
  //Conclude procedure
  ApplicationEnvironmentStore.commitAppReadyStatus(true);
  return Promise.resolve(true);
};

export const initDemoState = async (): Promise<boolean> => {
  console.info("Start with DEMO");
  await DemoWorker.WorkerProvider.init(); //-> sets demoValuesState, otherwise creates examples
  DemoWorker.WorkerProvider.closeWorker();
  //Init Databases
  await IndexedDBAccountManager.AppStateManager.initDB();
  await IndexedDBTransferManager.AppStateManager.initDB();
  //Init Workers
  await AccountAssistantWorker.WorkerProvider.init();
  //Init Accounts
  await AccountTransferStore.initAccountsFromDB();
  //Conclude procedure
  ApplicationEnvironmentStore.commitAppReadyStatus(true);
  return Promise.resolve(true);
};
