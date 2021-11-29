import {
  DefaultValues,
  GlobalMapping,
  Mapping,
} from "@/interfaces/mappings/mapping-interface";

const createNewMap = (
  mapName: string,
  mapObject: GlobalMapping,
  mapVersion: string,
  defaultValueObject?: DefaultValues
): Mapping => {
  const newMap: Mapping = {
    mapName: mapName,
    createdAt: new Date(),
    updatedAt: new Date(),
    map_version: mapVersion,
    mapping: mapObject,
    defaultValues: defaultValueObject ? { ...defaultValueObject } : null,
  };
  return newMap;
};
