import IndexedDBAppStateStoreManager from "@/indexedDB/app-state-database";
import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import store from "..";

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
    await IndexedDBAppStateStoreManager.setState({
      property: "useDemo",
      value: true,
    });
    this.setDemoMode(true);
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
  private _test: string = "test";

  public get test() {
    return this._test;
  }

  @Mutation
  mutateTest(payload: string) {
    this._test = payload;
  }

  @Action
  commitTestChange(payload: string) {
    if (payload !== "") {
      this.mutateTest(payload);
    }
  }
}

export const ApplicationEnvironmentStore = getModule(ApplicationEnvironment);
