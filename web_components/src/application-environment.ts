import { DataType } from './interfaces/environment/data-enums';
import { Themes } from './interfaces/themes/theme-enums';
import { DataBaseTypes } from './interfaces/database/database-interface';
import { LogMe } from '@/helpers/logger-function';

enum ApplicationValues {
  VERSION_FALLBACK = 'error',
  ENV_FALLBACK = 'production',
  TITLE = 'Creditor',
}

export class ApplicationEnvironment {
  readonly _version: string;
  readonly _environment: string;

  private _dataModeSet: boolean;
  private _dataMode: DataType;
  private _dataBase: DataBaseTypes;
  private _environmentReady: boolean;

  private _theme: Themes;
  private _tutorial: boolean;
  private _config: boolean | null;
  private _autoSave: boolean;
  private _isNative: boolean;

  private _instanceIsLoading: boolean;

  private static runningInstance: ApplicationEnvironment | null;

  private constructor() {
    this._tutorial = true;
    this._version =
      process.env.VUE_APP_VERSION || ApplicationValues.VERSION_FALLBACK;
    this._environment = process.env.NODE_ENV || ApplicationValues.ENV_FALLBACK;

    if (this._version !== ApplicationValues.VERSION_FALLBACK) {
      LogMe.setVersion(this._version);
    }

    LogMe.setTitle(ApplicationValues.TITLE);

    this._dataMode = DataType.UNSET;
    this._dataModeSet = false;
    this._dataBase = DataBaseTypes.NULL;
    this._environmentReady = false;

    this._theme = Themes.DEFAULT;
    this._config = null;
    this._autoSave = false;
    this._isNative = false;

    this._instanceIsLoading = true;

    this.setup();
  }

  get envReady(): boolean {
    return !!this._environmentReady;
  }

  set envReady(value: boolean) {
    this._environmentReady = value;
  }

  static get instance(): ApplicationEnvironment {
    if (!this.runningInstance) {
      this.runningInstance = new ApplicationEnvironment();
    }
    return this.runningInstance;
  }

  get version(): string {
    return this._version;
  }
  get environment(): string {
    return this._environment;
  }
  get dataModeSet(): boolean {
    return this._dataModeSet;
  }
  get dataMode(): DataType {
    return this._dataMode;
  }
  get dataBase(): DataBaseTypes {
    return this._dataBase;
  }
  get theme(): string {
    return this._theme;
  }
  get tutorial(): boolean {
    return this._tutorial;
  }
  get autoSave(): boolean {
    return this._autoSave;
  }
  get instanceIsLoading(): boolean {
    return this._instanceIsLoading;
  }

  private save(): void {
    //save settings to localStorage
    try {
      window.localStorage.setItem('version', JSON.stringify(this._version));
      window.localStorage.setItem('auto-save', JSON.stringify(this._autoSave));
      window.localStorage.setItem('theme', this._theme);
      window.localStorage.setItem('data-mode', this._dataMode);
      window.localStorage.setItem('tutorial', JSON.stringify(this._tutorial));
      LogMe.success('Basic Settings saved');
    } catch (error) {
      LogMe.error('Failed to save settings');
    }
  }

  private setup(): void {
    //Load localStorage settings
    this._instanceIsLoading = true;
    const versionNumber = window.localStorage.getItem('version');
    if (versionNumber && JSON.parse(versionNumber)) {
      LogMe.success('Version found');
    } else {
      LogMe.error('Version not found');
    }
    const autoSave = window.localStorage.getItem('auto-save');
    if (autoSave && JSON.parse(autoSave)) {
      this._autoSave = JSON.parse(autoSave);
      LogMe.success('Autosave enabled');
    } else {
      LogMe.warning('Autosave disabled or not found');
    }
    const theme = window.localStorage.getItem('theme');
    if (theme) {
      if ((Object.values(Themes) as Array<string>).includes(theme)) {
        this._theme = theme as Themes;
        LogMe.success('Theme loaded');
      }
    } else {
      LogMe.warning('No theme was found, using default');
    }
    const dataMode = window.localStorage.getItem('data-mode');
    if (dataMode) {
      if ((Object.values(DataType) as Array<string>).includes(dataMode)) {
        this._dataMode = dataMode as DataType;
        LogMe.success('Datamode was set');
      }
    } else {
      LogMe.warning('No data mode was found');
    }
    const tutorial = window.localStorage.getItem('tutorial');
    if (tutorial && JSON.parse(tutorial)) {
      this._tutorial = JSON.parse(tutorial);
      LogMe.success('Tutorial state loaded');
    } else {
      LogMe.info('Tutorial default start');
    }
    if (!autoSave && !theme && !dataMode && !tutorial) {
      this._config = false;
    } else {
      this._config = true;
    }
  }

  initializeStart(): void {
    if (!this._config) {
      if (this._autoSave || this._isNative) {
        this.save();
        this._config = true;
        this.initializeStart();
      } else {
        LogMe.warning(`Stealth mode: no data will be saved`);
        LogMe.info(
          `App is configured, but reset to basic configuration. Is running v${this.version}`
        );
        LogMe.info('Current stage:', this._environment);
        this._instanceIsLoading = false;
      }
    } else {
      LogMe.success(`App is configured and running v${this.version}`);
      LogMe.info('Current stage:', this._environment);
      this._instanceIsLoading = false;
    }
  }

  saveEnvironment(): void {
    this.save();
  }
}
