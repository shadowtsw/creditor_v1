import IndexedDBAppStateStoreManager from "@/indexedDB/app-state-database";
import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import store from "../";

@Module({
  dynamic: true,
  namespaced: true,
  store,
  name: "UserDataStore",
})
class UserData extends VuexModule {
  private _firstStart: boolean = true;
  private _isTutorial: boolean = true;

  public get firstStart() {
    return this._firstStart;
  }

  @Mutation
  private setFirstStart(payload: boolean) {
    this._firstStart = payload;
  }

  @Action
  showAppStartWelcome(payload: boolean) {
    this.setFirstStart(payload);
  }

  //INIT
  @Action
  async initAppStateData(): Promise<boolean> {
    try {
      const requestState = await IndexedDBAppStateStoreManager.getState(
        "showAppStartWelcome"
      );
      if (
        requestState &&
        "value" in requestState &&
        typeof requestState.value === "boolean"
      ) {
        this.showAppStartWelcome(requestState.value);
      }
      return Promise.resolve(true);
    } catch (err) {
      return Promise.reject(err);
    }
  }
}
//TODO: rename store ?
export const UserDataStore = getModule(UserData);
