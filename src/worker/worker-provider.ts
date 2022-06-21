import { IndexedDBAppStateManager } from "@/indexedDB/app-state-database";
import { LogMe } from "@/logging/logger-function";
import { ExampleWorker } from "@/store/account-transfer/demo-worker-types";
import { ApplicationEnvironmentStore } from "@/store/application/application-store";
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
      LogMe.success("Account-Assist-Worker created");
    }
  }

  public static get WorkerProvider(): AccountAssistantWorker {
    console.log("Get Worker", AccountAssistantWorker.singleton);
    if (!AccountAssistantWorker.singleton) {
      console.log("Create nwe Worker");
      AccountAssistantWorker.singleton = new AccountAssistantWorker();
    }
    LogMe.worker("Worker-Provider");
    return AccountAssistantWorker.singleton;
  }

  public postMessage(message: IncomingMessages) {
    console.log("PostMessage", message);
    this.worker.postMessage(message);
  }

  public init(): Promise<boolean> {
    if (this.worker) {
      this.worker.addEventListener("message", this.publishWorkerResponse);

      const mode = ApplicationEnvironmentStore.Demo
        ? InitMessageTargets.INIT_MODE_DEMO
        : InitMessageTargets.INIT_MODE_APP;

      const initModeMessage: AAWInit = {
        type: AAW_MessageTypes.INIT,
        messageData: {
          target: mode,
        },
      };

      this.postMessage(initModeMessage);

      const initDBMessage: AAWInit = {
        type: AAW_MessageTypes.INIT,
        messageData: {
          target: InitMessageTargets.INIT_DB,
        },
      };

      this.postMessage(initDBMessage);

      return Promise.resolve(true);
    }
    throw new Error("AccountAssistantWorker not initialized");
  }

  private publishWorkerResponse = (event: MessageEvent) => {
    console.log("Message from Worker Provider", event.data);
    if (event.data && event.data.type) {
      const message = event.data as OutgoingMessages;

      switch (message.type) {
        case AAW_MessageTypes.RESPONSE_INIT_READY:
          ApplicationEnvironmentStore.setWorkerReady();
          break;
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
    console.log("Worker terminates");
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

export class DemoWorker {
  private static singleton: DemoWorker | null;
  private _originalWorkerThread: Worker | null;
  private _worker: (ExampleWorker & { terminate: () => void }) | null;

  private constructor() {
    console.log("CREATE: DemoWorker");
    this._originalWorkerThread = new Worker(
      new URL("../store/account-transfer/demo-worker.ts", import.meta.url),
      {
        type: "module",
      }
    );

    this._worker = Comlink.wrap(this._originalWorkerThread);

    if (this._worker) {
      // this.init();
      LogMe.info("Demo-Worker ready");
    } else {
      LogMe.error("NO WORKER FOUND");
    }
  }

  public async init(): Promise<boolean> {
    console.log("INIT: DemoWorker");
    if (this._worker) {
      const savedValues =
        await IndexedDBAppStateManager.AppStateManager.getDemoState();
      if (!savedValues) {
        await this._worker.generateExampleData(3, 2);
        await IndexedDBAppStateManager.AppStateManager.setDemoInitialState();
      }
      return Promise.resolve(true);
    } else {
      throw new Error("DemoWorker not running");
    }
  }

  public static get WorkerProvider(): DemoWorker {
    if (!DemoWorker.singleton) {
      DemoWorker.singleton = new DemoWorker();
    }
    return DemoWorker.singleton;
  }
  public get demoWorker(): ExampleWorker | null {
    return this._worker;
  }
  public closeWorker() {
    if (this._originalWorkerThread) {
      this._originalWorkerThread.terminate();
      this._originalWorkerThread = null;
    }
  }
}
