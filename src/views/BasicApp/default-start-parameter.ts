import { IndexedDBAppStateManager } from "@/indexedDB/app-state-database";

const currentPage = await IndexedDBAppStateManager.AppStateManager.getState(
  "currentPage"
);

export const defaultStartPage: string =
  typeof currentPage?.value === "string"
    ? currentPage.value
    : null || "Get Started";

const currentPlugin = await IndexedDBAppStateManager.AppStateManager.getState(
  "currentPlugin"
);

export const defaultStartPlugin: string =
  typeof currentPlugin?.value === "string"
    ? currentPlugin.value
    : null || "List";
