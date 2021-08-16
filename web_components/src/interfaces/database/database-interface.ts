export enum DataBaseTypes {
  NULL = '',
  MONGODB = 'mongodb',
}

export interface DataBaseType {
  description: DataBaseTypes;
  dataBase: DataBaseTypes;
}
