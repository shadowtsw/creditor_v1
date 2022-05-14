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
  name: "ApplicationEnvironmentStore",
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
}

export const UserDataStore = getModule(UserData);
