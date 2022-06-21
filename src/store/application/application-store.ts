import { IndexedDBAppStateManager } from "@/indexedDB/app-state-database";
import { LogMe } from "@/logging/logger-function";
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
   * App ready state
   */
  private _appReady = false;
  public get appReady() {
    return this._appReady;
  }
  @Mutation
  setAppReady(payload: boolean) {
    this._appReady = payload;
  }
  @Action
  commitAppReadyStatus(payload: boolean) {
    console.log("SET APP READY", payload);
    this.setAppReady(payload);
  }
  /**
   * Welcome-Page
   */
  private _showWelcomeScreen: boolean = true;
  public get showWelcomeScreen() {
    return this._showWelcomeScreen;
  }
  @Mutation
  private setWelcomeScreenState(payload: boolean) {
    this._showWelcomeScreen = payload;
  }
  @Action({ rawError: true })
  async commitShowWelcomeScreen(payload: {
    value: boolean;
    saveState?: boolean;
  }): Promise<boolean> {
    if (payload.saveState) {
      try {
        await IndexedDBAppStateManager.AppStateManager.setWelcomeState(
          payload.value
        );
      } catch (err) {
        throw new Error(`Failed to save state: ${err}`);
      }
    }
    this.setWelcomeScreenState(payload.value);
    return Promise.resolve(true);
  }
  /**
   * DEMO
   */
  private _useDemo: boolean | null = null;
  public get Demo() {
    return this._useDemo;
  }
  @Mutation
  setDemoMode(payload: boolean) {
    this._useDemo = payload;
  }
  @Action
  async commitUseDemo(payload: { value: boolean; saveState?: boolean }) {
    if (payload.saveState) {
      try {
        await IndexedDBAppStateManager.AppStateManager.setDemoState(
          payload.value
        );
      } catch (err) {
        throw new Error("Failed to start Demo");
      }
    }
    this.setDemoMode(payload.value);
  }

  /**
   * INIT
   */
  private _workerIsReady = false;
  public get workerIsReady() {
    return this._workerIsReady;
  }
  @Mutation
  setWorkerReady() {
    this._workerIsReady = true;
  }
  @Action({ rawError: true })
  async initApplicationStore(): Promise<boolean> {
    LogMe.info("Init Application State");
    try {
      const currentDemoState =
        await IndexedDBAppStateManager.AppStateManager.getState("useDemo");
      if (
        currentDemoState &&
        currentDemoState.value !== undefined &&
        typeof currentDemoState.value === "boolean"
      ) {
        this.setDemoMode(currentDemoState.value);
      }
      const currentWelcomeState =
        await IndexedDBAppStateManager.AppStateManager.getState(
          "showWelcomeScreen"
        );
      if (
        currentWelcomeState &&
        currentWelcomeState.value !== undefined &&
        typeof currentWelcomeState.value === "boolean"
      ) {
        this.setWelcomeScreenState(currentWelcomeState.value);
      }
      return Promise.resolve(true);
    } catch (err) {
      throw new Error(
        `Failed to initialize ApplicationEnvironmentStore: ${err}`
      );
    }
  }
}

LogMe.store("Application-Store");
export const ApplicationEnvironmentStore = getModule(ApplicationEnvironment);
