import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import store from "..";
import { AvailableKeys, AvailableTags, DistKeyObject } from "./app-data-types";

@Module({
  dynamic: true,
  namespaced: true,
  store,
  name: "AppData",
})
class AppData extends VuexModule {
  /**
   * //*App tags
   */
  private _availableTags: AvailableTags = [
    {
      id: "default_v_1",
      groupname: "default",
      tags: [],
    },
  ];
  public get availableTags() {
    return this._availableTags;
  }
  public get defaultGroup() {
    return this._availableTags.find((entry) => entry.groupname === "default");
  }
  @Mutation
  private addTagToDefault(payload: { index: number; tag: string }) {
    this._availableTags[payload.index].tags.push(payload.tag);
  }
  @Mutation
  private deleteTagFromDefault(payload: { index: number; tag: string }) {
    this._availableTags[payload.index].tags = this._availableTags[
      payload.index
    ].tags.filter((entry) => entry !== payload.tag);
  }
  @Action
  public addDefaultTag(payload: string) {
    const index = this.availableTags.findIndex(
      (entry) => entry.groupname === "default"
    );
    if (index !== -1) {
      if (!this.availableTags[index].tags.includes(payload))
        this.addTagToDefault({ index, tag: payload });
    }
  }
  @Action
  public deleteDefaultTag(payload: string) {
    const index = this.availableTags.findIndex(
      (entry) => entry.groupname === "default"
    );
    if (index !== -1) {
      this.deleteTagFromDefault({ index, tag: payload });
    }
  }
  //App tags end

  /**
   * //*App dist keys
   */
  private _availableKeys: AvailableKeys = [
    {
      distKeyName: "default",
      keys: {
        "house": 100,
      },
    },
  ];
  public get availableKeys() {
    return this._availableKeys;
  }
  @Mutation
  private addKey(payload: DistKeyObject) {
    this._availableKeys.push(payload);
  }
  @Mutation
  private deleteDistKey(distKeyName: string) {
    this._availableKeys = this._availableKeys.filter(
      (entry) => entry.distKeyName !== distKeyName
    );
  }
  @Action
  public deleteKey(payload: DistKeyObject) {
    this.deleteDistKey(payload.distKeyName);
  }
  @Action
  public commitDistKey(payload: DistKeyObject) {
    const name = payload.distKeyName;
    const findKey = this.availableKeys.find(
      (entry) => entry.distKeyName === name
    );
    if (!findKey) {
      let sum = 0;
      const keys = payload.keys;
      for (const key in keys) {
        sum += keys[key];
      }
      if (sum === 100) {
        this.addKey(payload);
      } else {
        throw new Error("DistKey result must be 100%");
      }
    }
  }
  //App dist keys
}

export const AppDataStore = getModule(AppData);
