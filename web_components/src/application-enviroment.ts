import { DataType } from './interfaces/enviroment/data-enums';
import { Themes } from './interfaces/themes/theme-enums';
import { DataBaseType } from './interfaces/database/database-interface';

export class ApplicationEnviroment {
  private _version: string;
  private _enviroment: string;
  private _dataModeSet: boolean;
  private _dataMode: DataType;
  private _dataBase: DataBaseType;
  private _theme: Themes;
  private _tutorial: boolean;
  private _config: boolean | null;
  private _autoSave: boolean;
  private _isNative: boolean;

  private static runningInstance: ApplicationEnviroment | null;

  private constructor() {
    this._tutorial = true;
    this._version = process.env.VERSION || '1.0.0';
    this._enviroment = process.env.NODE_ENV || 'production';
    this._dataMode = DataType.UNSET;
    this._dataModeSet = false;
    this._dataBase = null;
    this._theme = Themes.DEFAULT;
    this._config = null;
    this._autoSave = false;
    this._isNative = false;

    this.setup();
  }

  static get instance() {
    if (!this.runningInstance) {
      this.runningInstance = new ApplicationEnviroment();
    }
    return this.runningInstance;
  }

  get version() {
    return this._version;
  }
  get enviroment() {
    return this._enviroment;
  }
  get dataModeSet() {
    return this._dataModeSet;
  }
  get dataMode() {
    return this._dataMode;
  }
  get dataBase() {
    return this._dataBase;
  }
  get theme() {
    return this._theme;
  }
  get tutorial() {
    return this._tutorial;
  }
  get autoSave() {
    return this._autoSave;
  }

  private save() {
    //save settings to localstorage
    console.log('Saving settings');
    window.localStorage.setItem('auto-save', JSON.stringify(this._autoSave));
    window.localStorage.setItem('theme', this._theme);
    window.localStorage.setItem('data-mode', this._dataMode);
    window.localStorage.setItem('tutorial', JSON.stringify(this._tutorial));
  }
  private setup() {
    //Load localstorage settings
    const autoSave = window.localStorage.getItem('auto-save');
    if (autoSave && JSON.parse(autoSave)) {
      this._autoSave = JSON.parse(autoSave);
    } else {
      console.log('Autosave disabled or not found');
    }
    const theme = window.localStorage.getItem('theme');
    if (theme) {
      if ((Object.values(Themes) as Array<string>).includes(theme)) {
        this._theme = theme as Themes;
      }
    } else {
      console.log('No theme was found, using default');
    }
    const dataMode = window.localStorage.getItem('data-mode');
    if (dataMode) {
      if ((Object.values(DataType) as Array<string>).includes(dataMode)) {
        this._dataMode = dataMode as DataType;
      }
    } else {
      console.log('No data mode was found');
    }
    const tutorial = window.localStorage.getItem('tutorial');
    if (tutorial && JSON.parse(tutorial)) {
      this._tutorial = JSON.parse(tutorial);
    } else {
      console.log('Tutorial default start');
    }
    if (!autoSave && !theme && !dataMode && !tutorial) {
      this._config = false;
    } else {
      this._config = true;
    }
  }

  initialiseStart() {
    if (!this._config) {
      if (this._autoSave || this._isNative) {
        this.save();
        this._config = true;
        this.initialiseStart();
      } else {
        console.log(`Stealth mode: no data will be saved`);
        console.log(`App is configured and running v${this.version}`);
        console.log('Current stage:', this._enviroment);
      }
    } else {
      console.log(`App is configured and running v${this.version}`);
      console.log('Current stage:', this._enviroment);
    }
  }

  saveEnviroment() {
    this.save();
  }
}
