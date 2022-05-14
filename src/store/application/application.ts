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
class ApplicationEnvironmentStore extends VuexModule {
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

export const ApplicationEnvironment = getModule(ApplicationEnvironmentStore);
