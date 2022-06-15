import IndexedDBAppStateStoreManager from "@/indexedDB/app-state-database";
import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import store from "..";
import { DemoWorker } from "@/worker/worker-provider";

@Module({
  dynamic: true,
  namespaced: true,
  store,
  name: "ApplicationEnvironmentStore",
})
class ApplicationEnvironment extends VuexModule {
  /**
   * DEMO
   */
  private _useDemo = true;

  public get Demo() {
    return this._useDemo;
  }

  @Mutation
  setDemoMode(payload: boolean) {
    this._useDemo = payload;
  }
  @Action
  async commitUseDemo() {
    try {
      await IndexedDBAppStateStoreManager.setState({
        property: "useDemo",
        value: true,
      });
      this.setDemoMode(true);
      const demoWorker = DemoWorker.WorkerProvider.demoWorker; //Initialize Demo DB
    } catch (err) {
      throw new Error("Failed to start Demo");
    }
  }
  @Action
  async commitDeactivateDemo() {
    await IndexedDBAppStateStoreManager.setState({
      property: "useDemo",
      value: false,
    });
    this.setDemoMode(false);
  }
  /**
   * DEMO END
   */
}

export const ApplicationEnvironmentStore = getModule(ApplicationEnvironment);
