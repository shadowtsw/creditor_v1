export enum DataBaseTypes {
  NULL = '',
  MONGODB = 'mongodb',
  LOCAL = 'local',
}

export interface DataBaseType {
  description: DataBaseTypes;
  dataBase: DataBaseTypes;
}
