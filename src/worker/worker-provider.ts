import IndexedDBAppStateStoreManager from "@/indexedDB/app-state-database";
import { ExampleWorker } from "@/store/account-transfer/demo-worker-types";
import {
  InitMessageTargets,
  AAW_MessageTypes,
  Subscriptions,
  SubscriptionObject,
  AAWInit,
  OutgoingMessages,
  IncomingMessages,
} from "@/worker/message-interfaces/account-assist-interface";
import * as Comlink from "comlink";

export class AccountAssistantWorker {
  private static singleton: AccountAssistantWorker | null;
  private worker: Worker;

  //PubSup
  private subscribers: Subscriptions = {
    RESPONSE_CALC: [],
    RESPONSE_PAGINATION: [],
  };
  //PubSup END

  private constructor() {
    this.worker = new Worker(
      new URL("./worker-files/account-assist-worker.ts", import.meta.url),
      {
        type: "module",
      }
    );
    if (this.worker) {
      this.init();
    }
  }

  public static get WorkerProvider(): AccountAssistantWorker {
    if (!AccountAssistantWorker.singleton) {
      AccountAssistantWorker.singleton = new AccountAssistantWorker();
    }
    return AccountAssistantWorker.singleton;
  }

  public postMessage(message: IncomingMessages) {
    console.log("PostMessage", message);
    this.worker.postMessage(message);
  }

  private init() {
    const initAccountDBMessage: AAWInit = {
      type: AAW_MessageTypes.INIT,
      messageData: {
        target: InitMessageTargets.ACCOUNT_DB,
      },
    };

    this.postMessage(initAccountDBMessage);

    const initTransferDBMessage: AAWInit = {
      type: AAW_MessageTypes.INIT,
      messageData: {
        target: InitMessageTargets.TRANSFER_DB,
      },
    };

    this.postMessage(initTransferDBMessage);

    this.worker.addEventListener("message", this.publishWorkerResponse);
  }

  private publishWorkerResponse = (event: MessageEvent) => {
    if (event.data && event.data.type) {
      const message = event.data as OutgoingMessages;
      console.log("Message from Worker Provider", message);

      switch (message.type) {
        case AAW_MessageTypes.RESPONSE_CALC:
          const calcSubs = this.subscribers.RESPONSE_CALC;

          for (const entry of calcSubs) {
            entry.callback(message);
          }
          break;
        case AAW_MessageTypes.RESPONSE_PAGINATION:
          const paginationSubs = this.subscribers.RESPONSE_PAGINATION;

          for (const entry of paginationSubs) {
            entry.callback(message);
          }
          break;

        default:
          break;
      }
    } else {
      throw new Error("Unknown Message Response");
    }
  };

  public removeListener() {
    this.worker.removeEventListener("message", this.publishWorkerResponse);
  }

  public terminateWorker() {
    this.worker.removeEventListener("message", this.publishWorkerResponse);
    this.worker.terminate();
  }

  public subscribeBalanceMessage(payload: SubscriptionObject): Function {
    const findSub = this.subscribers.RESPONSE_CALC.find((entry) => {
      return entry.id === payload.id;
    });
    if (!findSub) {
      this.subscribers.RESPONSE_CALC.push(payload);
      const index = this.subscribers.RESPONSE_CALC.length - 1;
      const unsubscribe = () => {
        this.subscribers.RESPONSE_CALC.splice(index, 1);
      };
      return unsubscribe;
    } else {
      throw new Error("Subscription already exists");
    }
  }
  public subscribePaginationMessage(payload: SubscriptionObject): Function {
    const findSub = this.subscribers.RESPONSE_PAGINATION.find((entry) => {
      return entry.id === payload.id;
    });
    if (!findSub) {
      this.subscribers.RESPONSE_PAGINATION.push(payload);
      const index = this.subscribers.RESPONSE_PAGINATION.length - 1;
      const unsubscribe = () => {
        this.subscribers.RESPONSE_PAGINATION.splice(index, 1);
      };
      return unsubscribe;
    } else {
      throw new Error("Subscription already exists");
    }
  }
}
export const accountAssistantWorker = AccountAssistantWorker.WorkerProvider;

export class DemoWorker {
  private static singleton: DemoWorker | null;
  private _worker: ExampleWorker;

  private constructor() {
    const comlinkWorker = new Worker(
      new URL("../store/account-transfer/demo-worker.ts", import.meta.url),
      {
        type: "module",
      }
    );

    this._worker = Comlink.wrap(comlinkWorker);

    if (this._worker) {
      this.init();
    } else {
      console.log("NO WORKER FOUND");
    }
  }

  private async init() {
    if (this._worker) {
      const savedValues = await IndexedDBAppStateStoreManager.getDemoState();
      if (!savedValues) {
        await this._worker.generateExampleData(5, 1500);
        await IndexedDBAppStateStoreManager.setDemoInitialState();
      }
    } else {
      throw new Error("DemoWOrker not running");
    }
  }

  public static get WorkerProvider(): DemoWorker {
    if (!DemoWorker.singleton) {
      DemoWorker.singleton = new DemoWorker();
    }
    return DemoWorker.singleton;
  }
  public get demoWorker(): ExampleWorker {
    return this._worker;
  }
}

// export const DemoWorkerWorker = DemoWorker.WorkerProvider;
