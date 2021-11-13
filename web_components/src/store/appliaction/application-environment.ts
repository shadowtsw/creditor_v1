import { DataType } from "../../interfaces/environment/data-enums";
import { Themes } from "../../interfaces/themes/theme-enums";
import { DataBaseTypes } from "../../interfaces/database/database-interface";
import { LogMe } from "@/helpers/logger-function";
import store from "../";
// import authHandler from "@/store/state-manager/env_statehandler";

import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";

enum ApplicationValues {
  VERSION_FALLBACK = "error",
  ENV_FALLBACK = "production",
  TITLE = "creditor_v1",
}

// enum ApplicationInstance {
//   NAME = "ApplicationEnvironment",
// }

enum ApplicationInstanceMutations {
  INITIALIZE_APP = "initializeApp",
  SET_ENV_READY = "setEnvReady",
  AUTO_SAVE = "autoSave",
  SET_INSTANCE_IS_LOADING = "setInstanceIsLoading",
  SET_IS_RUNNING = "setIsRunning",
  SET_CONFIG = "setConfig",
  SET_TUTORIAL = "setTutorial",
  SET_DATA_MODE = "setDataMode",
  SET_AUTO_SAVE = "setAutoSave",
}

// enum ApplicationInstanceGetters {
//   ENV_READY_STATE = "envReadyState",
//   VERSION_STATE = "versionState",
//   ENVIRONMENT_STATE = "environmentState",
//   DATA_MODE_SET_STATE = "dataModeSetState",
//   DATA_MODE_STATE = "dataModeState",
//   DATA_BASE_STATE = "dataBaseState",
//   THEME_STATE = "themeState",
//   TUTORIAL = "tutorial",
//   AUTO_SAVE_STATE = "autoSaveState",
//   INSTANCE_IS_LOADING = "instanceIsLoading",
//   IS_NATIVE_STATE = "isNativeState",
// }

@Module({
  dynamic: true,
  namespaced: true,
  store,
  name: "ApplicationEnvironmentStore",
})
class ApplicationEnvironmentStore extends VuexModule {
  //App related
  readonly _version: string =
    process.env.VUE_APP_VERSION || ApplicationValues.VERSION_FALLBACK;
  readonly _environment: string =
    process.env.NODE_ENV || ApplicationValues.ENV_FALLBACK;
  private _running = false;

  //Setting data mode & defaults
  private _dataModeSet = false;
  private _dataMode: DataType = DataType.UNSET;
  private _dataBase: DataBaseTypes = DataBaseTypes.NULL;
  private _environmentReady = false;

  //User specific
  private _theme: Themes = Themes.DEFAULT;
  private _tutorial = true;
  private _config: boolean | null = null;
  private _autoSave = false;
  private _isNative = false;

  //Loading behaviour
  private _instanceIsLoading = false;

  @Mutation
  setEnvReady(value: boolean) {
    this._environmentReady = value;
  }
  @Mutation
  autoSave() {
    try {
      window.localStorage.setItem("version", JSON.stringify(this._version));
      window.localStorage.setItem("auto-save", JSON.stringify(this._autoSave));
      window.localStorage.setItem("theme", this._theme);
      window.localStorage.setItem("data-mode", this._dataMode);
      window.localStorage.setItem("tutorial", JSON.stringify(this._tutorial));
      LogMe.success("Basic Settings saved");
    } catch (error) {
      LogMe.error("Failed to save settings");
    }
  }
  @Mutation
  setIsRunning(value: boolean) {
    this._running = value;
  }
  @Mutation
  setConfig(value: boolean) {
    this._config = value;
  }
  @Mutation
  setInstanceIsLoading(value: boolean) {
    this._instanceIsLoading = value;
  }
  @Mutation
  setTutorial(value: boolean) {
    this._tutorial = value;
  }
  @Mutation
  setDataMode(dataMode: DataType) {
    this._dataMode = dataMode;
  }
  @Mutation
  setAutoSave(autoSave: boolean) {
    this._autoSave = autoSave;
  }
  @Mutation
  setTheme(theme: Themes) {
    this._theme = theme;
  }
  @Action
  initializeApp() {
    if (!this._running) {
      //Start Loading
      this.setInstanceIsLoading(true);

      //Log app info
      LogMe.setTitle(ApplicationValues.TITLE);
      LogMe.setVersion(this._version);

      //Set values to default

      //Load localStorage settings
      const autoSave = window.localStorage.getItem("auto-save");
      if (autoSave && JSON.parse(autoSave)) {
        this.setAutoSave(JSON.parse(autoSave));
        LogMe.success("Autosave enabled");
      } else {
        LogMe.warning("Autosave disabled or not found");
      }
      //User-Theme
      const theme = window.localStorage.getItem("theme");
      if (theme) {
        if ((Object.values(Themes) as Array<string>).includes(theme)) {
          this.setTheme(theme as Themes);
          LogMe.success("Theme loaded");
        }
      } else {
        LogMe.warning("No theme was found, using default");
      }
      //Data mode
      const dataMode = window.localStorage.getItem("data-mode");
      if (dataMode) {
        if ((Object.values(DataType) as Array<string>).includes(dataMode)) {
          this.setDataMode(dataMode as DataType);
          LogMe.success("Datamode was set");
        }
      } else {
        LogMe.warning("No data mode was found");
      }
      //Use tutorial ?
      const tutorial = window.localStorage.getItem("tutorial");
      if (tutorial && JSON.parse(tutorial)) {
        this.setTutorial(JSON.parse(tutorial));
        LogMe.success("Tutorial state loaded");
      } else {
        LogMe.info("Tutorial default start");
      }

      this.setConfig(true);
      this.setIsRunning(true);
      this.setEnvReady(true);
      if (this.isRunning) {
        LogMe.success("This app: runs");
      } else {
        LogMe.error("This app: paused");
      }
      this.setInstanceIsLoading(false);
    } else {
      //Do nothing
      LogMe.setTitle(ApplicationValues.TITLE);
      LogMe.setVersion(this._version);
      if (this.isRunning) {
        LogMe.success("This app: runs");
      } else {
        LogMe.error("This app: paused");
      }
      this.setInstanceIsLoading(false);
    }
  }
  //DEV-ONLY
  @Action
  devReady() {
    console.log("DevReady");
    console.log(this.envReadyState);
    this.setEnvReady(true);
  }
  @Action
  devReset() {
    console.log("DevReset");
    console.log(this.envReadyState);
    this.setEnvReady(false);
  }
  //DEV-END
  get envReadyState(): boolean {
    return this._environmentReady;
  }
  get versionState(): string {
    return this._version;
  }
  get environmentState(): string {
    return this._environment;
  }
  get dataModeSetState(): boolean {
    return this._dataModeSet;
  }
  get dataModeState(): DataType {
    return this._dataMode;
  }
  get dataBaseState(): DataBaseTypes {
    return this._dataBase;
  }
  get themeState(): string {
    return this._theme;
  }
  get tutorial(): boolean {
    return this._tutorial;
  }
  get autoSaveState(): boolean {
    return this._autoSave;
  }
  get instanceIsLoadingState(): boolean {
    return this._instanceIsLoading;
  }
  get isNativeState(): boolean {
    return this._isNative;
  }
  get isRunning(): boolean {
    return this._running;
  }
}

export const ApplicationEnvironment = getModule(ApplicationEnvironmentStore);
