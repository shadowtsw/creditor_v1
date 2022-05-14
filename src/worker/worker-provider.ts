class WorkerProvider {
  private static singleton: WorkerProvider | null;
  private static basicWorker: Worker | null = null;
  private static appWorker: Worker | null = null;
  private static accountDataWorker: Worker | null = null;
  private static processWorker: Worker | null = null;

  private constructor() {}

  public static get WorkerProvider(): WorkerProvider {
    if (!WorkerProvider.singleton) {
      WorkerProvider.singleton = new WorkerProvider();
    }
    return WorkerProvider.singleton;
  }

  public get ExampleWorker() {
    if (!WorkerProvider.basicWorker) {
      WorkerProvider.basicWorker = new Worker(
        new URL("./worker.ts", import.meta.url)
      );
    }
    return WorkerProvider.basicWorker;
  }

  public get AppWorker() {
    if (!WorkerProvider.appWorker) {
      WorkerProvider.appWorker = new Worker(
        new URL("./app-worker.ts", import.meta.url)
      );
    }
    return WorkerProvider.appWorker;
  }

  public get AccountDataWorker() {
    if (!WorkerProvider.accountDataWorker) {
      WorkerProvider.accountDataWorker = new Worker(
        new URL("./account-data-worker.ts", import.meta.url)
      );
    }
    return WorkerProvider.accountDataWorker;
  }

  public get ProcessingWorker() {
    if (!WorkerProvider.processWorker) {
      WorkerProvider.processWorker = new Worker(
        new URL("./process-data-worker.ts", import.meta.url)
      );
    }
    return WorkerProvider.processWorker;
  }
}

export const workerProvider = WorkerProvider.WorkerProvider;
