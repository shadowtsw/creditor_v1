enum ConsoleTypes {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
  SUCCESS = "success",
  DEBUG = "* debug *",
  MOUNT = "mount",
  STORE = "store",
  INDEXEDDB = "indexeddb",
  WORKER = "worker",
}

enum ConsoleColors {
  LIGHTBLUE = "lightblue",
  YELLOW = "yellow",
  RED = "red",
  LIGHTGREEN = "lightgreen",
  GREEN = "green",
  BLUE = "blue",
  ORANGE = "orange",
  PURPLE = "purple",
}

export class LogMe {
  private static _logTitle = "";
  private static _versionString = "";
  private static _basicColor = "white";

  private static _types: Array<ConsoleTypes> = [
    ConsoleTypes.INFO,
    ConsoleTypes.WARNING,
    ConsoleTypes.ERROR,
    ConsoleTypes.SUCCESS,
    ConsoleTypes.DEBUG,
    ConsoleTypes.MOUNT,
    ConsoleTypes.INDEXEDDB,
    ConsoleTypes.STORE,
    ConsoleTypes.WORKER,
  ];

  private static _colors: Array<ConsoleColors> = [
    ConsoleColors.LIGHTBLUE,
    ConsoleColors.YELLOW,
    ConsoleColors.RED,
    ConsoleColors.LIGHTGREEN,
    ConsoleColors.BLUE,
    ConsoleColors.GREEN,
    ConsoleColors.ORANGE,
    ConsoleColors.PURPLE,
  ];

  private static consoleLog(
    color: ConsoleColors,
    type: ConsoleTypes,
    ...arg: any[]
  ) {
    const logTitle = this._logTitle;
    const determineColor =
      (this._colors.includes(color) && color) || this._basicColor;

    const versionString =
      (this._versionString !== "" && `[ ${this._versionString} ] - `) || "";
    const determineType =
      ((this._types.includes(type) && type) as string).toUpperCase() || null;

    console.log(
      `%c${this._logTitle} ${versionString} ${determineType}: `,
      `color: ${determineColor}; font-weight: bold; font-family: arial`,
      ...arg
    );
    // console.log(...arg);
  }

  private static logTable(...arg: any[]) {
    if (arg.length === 0) {
      return;
    }

    const justPrimitives = arg.every((value: any) => {
      return !(typeof value === "object" || Array.isArray(value));
    });

    if (!justPrimitives) {
      console.log("DEBUG ELEMENTS: ");
      for (const argument of arg) {
        const isArray = Array.isArray(argument);
        if (isArray || typeof argument === "object") {
          console.log(isArray ? "TYPE ARRAY: " : "TYPE OBJECT: ");
          console.table(argument);
        }
      }
      console.log("+++");
    }
  }

  static store(...arg: any[]): void {
    this.consoleLog(ConsoleColors.GREEN, ConsoleTypes.STORE, ...arg);
  }

  static indexedDB(...arg: any[]): void {
    this.consoleLog(ConsoleColors.GREEN, ConsoleTypes.INDEXEDDB, ...arg);
  }

  static worker(...arg: any[]): void {
    this.consoleLog(ConsoleColors.GREEN, ConsoleTypes.WORKER, ...arg);
  }

  static debug(...arg: any[]): void {
    this.consoleLog(ConsoleColors.ORANGE, ConsoleTypes.DEBUG, ...arg);
    this.logTable(...arg);
  }

  static info(...arg: any[]): void {
    this.consoleLog(ConsoleColors.LIGHTBLUE, ConsoleTypes.INFO, ...arg);
  }

  static warning(...arg: any[]): void {
    this.consoleLog(ConsoleColors.YELLOW, ConsoleTypes.WARNING, ...arg);
  }

  static success(...arg: any[]): void {
    this.consoleLog(ConsoleColors.LIGHTGREEN, ConsoleTypes.SUCCESS, ...arg);
  }

  static error(...arg: any[]): void {
    this.consoleLog(ConsoleColors.RED, ConsoleTypes.ERROR, ...arg);
  }

  static mount(...arg: any[]): void {
    this.consoleLog(ConsoleColors.PURPLE, ConsoleTypes.MOUNT, ...arg);
  }

  static setVersion(arg: string) {
    this._versionString = arg;
  }

  static setTitle(arg: string) {
    this._logTitle = arg;
  }
}
