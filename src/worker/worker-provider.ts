import {
  InitMessage,
  InitMessageTargets,
  AccountAssistMessageTypes,
  MessageGroups,
  Subscriptions,
  SubscriptionObject,
  ResponseBalanceMessage,
} from "@/worker/message-interfaces/account-assist-interface";

// class WorkerProvider {
//   private static singleton: WorkerProvider | null;
//   private static basicWorker: Worker | null = null;
//   private static appWorker: Worker | null = null;
//   private static accountDataWorker: Worker | null = null;
//   private static processWorker: Worker | null = null;

//   private constructor() {}

//   public static get WorkerProvider(): WorkerProvider {
//     if (!WorkerProvider.singleton) {
//       WorkerProvider.singleton = new WorkerProvider();
//     }
//     return WorkerProvider.singleton;
//   }

//   public get ExampleWorker() {
//     if (!WorkerProvider.basicWorker) {
//       WorkerProvider.basicWorker = new Worker(
//         new URL("./worker.ts", import.meta.url)
//       );
//     }
//     return WorkerProvider.basicWorker;
//   }

//   public get AppWorker() {
//     if (!WorkerProvider.appWorker) {
//       WorkerProvider.appWorker = new Worker(
//         new URL("./app-worker.ts", import.meta.url)
//       );
//     }
//     return WorkerProvider.appWorker;
//   }

//   public get AccountDataWorker() {
//     if (!WorkerProvider.accountDataWorker) {
//       WorkerProvider.accountDataWorker = new Worker(
//         new URL("./account-data-worker.ts", import.meta.url)
//       );
//     }
//     return WorkerProvider.accountDataWorker;
//   }

//   public get ProcessingWorker() {
//     if (!WorkerProvider.processWorker) {
//       WorkerProvider.processWorker = new Worker(
//         new URL("./process-data-worker.ts", import.meta.url)
//       );
//     }
//     return WorkerProvider.processWorker;
//   }
// }

// export const workerProvider = WorkerProvider.WorkerProvider;

export class AccountAssistantWorker {
  private static singleton: AccountAssistantWorker | null;
  private worker: Worker;

  //PubSup
  private subscribers: Subscriptions = {
    REQUEST_CALC: [],
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

  public postMessage(message: MessageGroups) {
    this.worker.postMessage(message);
  }

  private init() {
    const initAccountDBMessage: InitMessage = {
      topic: {
        type: AccountAssistMessageTypes.INIT,
        target: InitMessageTargets.ACCOUNT_DB,
      },
    };

    this.postMessage(initAccountDBMessage);

    const initTransferDBMessage: InitMessage = {
      topic: {
        type: AccountAssistMessageTypes.INIT,
        target: InitMessageTargets.TRANSFER_DB,
      },
    };

    this.postMessage(initTransferDBMessage);

    const that = this;

    this.worker.addEventListener("message", this.publishResponseCalc);
  }

  private publishResponseCalc = (event: MessageEvent) => {
    if (
      event.data.topic.type &&
      event.data.data &&
      event.data.topic.type === AccountAssistMessageTypes.REQUEST_CALC
    ) {
      const message = event.data as ResponseBalanceMessage;
      const calcSubs = this.subscribers["REQUEST_CALC"];

      for (const entry of calcSubs) {
        entry.callback(message);
      }
    } else {
      throw new Error("Unknown Message Response");
    }
  };

  public removeListener() {
    this.worker.removeEventListener("message", this.publishResponseCalc);
  }

  public terminateWorker() {
    this.worker.removeEventListener("message", this.publishResponseCalc);
    this.worker.terminate();
  }

  public subscribeBalanceMessage(payload: SubscriptionObject): Function {
    const findSub = this.subscribers["REQUEST_CALC"].find((entry) => {
      return entry.id === payload.id;
    });
    if (!findSub) {
      this.subscribers["REQUEST_CALC"].push(payload);
      const index = this.subscribers["REQUEST_CALC"].length - 1;
      const unsubscribe = () => {
        this.subscribers["REQUEST_CALC"].splice(index, 1);
      };
      return unsubscribe;
    } else {
      throw new Error("Subscription already exists");
    }
  }
}

export const accountAssistantWorker = AccountAssistantWorker.WorkerProvider;
