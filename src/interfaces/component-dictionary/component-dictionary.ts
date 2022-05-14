export interface DictionaryEntryObject {
  component: string;
  displayText: string;
  type: "Page" | "Plugin";
  active?: boolean;
  index?: number;
  version?: string;
  path: string;
}
export interface DictionaryEntry {
  [index: string]: DictionaryEntryObject;
}
