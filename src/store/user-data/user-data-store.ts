import { IndexedDBAppStateManager } from "@/indexedDB/app-state-database";
import { LogMe } from "@/logging/logger-function";
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

  // private _showWelcomeScreen: boolean = true;

  // public get showWelcomeScreen() {
  //   return this._showWelcomeScreen;
  // }

  // @Mutation
  // private setFirstStart(payload: boolean) {
  //   this._showWelcomeScreen = payload;
  // }

  // @Action
  // commitShowWelcomeScreen(payload: boolean) {
  //   this.setFirstStart(payload);
  // }
}
//TODO: rename store ?
LogMe.store("User-Data-Store");
export const UserDataStore = getModule(UserData);
