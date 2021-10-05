import { reactive, computed, ComputedRef } from "vue";
import { DataType } from "@/interfaces/environment/data-enums";
import { DataBaseTypes } from "@/interfaces/database/database-interface";
import { LogMe } from "@/helpers/logger-function";
interface AuthState {
  isAuth: boolean;
  envReady: boolean;
  dataMode: DataType;
  dataBaseType: DataBaseTypes;
}
interface AuthHandlerReturn {
  isReady: ComputedRef<boolean>;
  setReady: () => void;
  setIsAuth: () => void;
  unsetIsAuth: () => void;
  setEnvReady: () => void;
  unsetEnvReady: () => void;
  setDataMode: (dataType: DataType) => void;
  unsetDataMode: () => void;
  setDataBaseType: (dataBaseType: DataBaseTypes) => void;
  unsetDataBaseType: () => void;
}
const authState = reactive<AuthState>({
  isAuth: false,
  envReady: false,
  dataMode: DataType.UNSET,
  dataBaseType: DataBaseTypes.NULL,
});
const authHandler = (): AuthHandlerReturn => {
  const setIsAuth = (): void => {
    authState.isAuth = true;
  };
  const unsetIsAuth = (): void => {
    authState.isAuth = false;
  };
  const setEnvReady = (): void => {
    authState.envReady = true;
  };
  const unsetEnvReady = (): void => {
    authState.envReady = false;
  };
  const setDataMode = (dataType: DataType): void => {
    authState.dataMode = dataType;
  };
  const unsetDataMode = (): void => {
    authState.dataMode = DataType.UNSET;
  };
  const setDataBaseType = (dataBaseType: DataBaseTypes): void => {
    authState.dataBaseType = dataBaseType;
  };
  const unsetDataBaseType = (): void => {
    authState.dataBaseType = DataBaseTypes.NULL;
  };
  //NOTE: DEV ONLY
  const setReady = () => {
    LogMe.debug("ENV setReady pressed");
    LogMe.debug("AuthState isReady", isReady);
    setIsAuth();
    setEnvReady();
    setDataMode(DataType.JSON);
    setDataBaseType(DataBaseTypes.LOCAL);
    LogMe.debug("AuthState isReady", isReady);
  };
  //NOTE:END
  const isReady = computed(() => {
    return (
      authState.envReady &&
      authState.isAuth &&
      authState.dataMode !== DataType.UNSET &&
      authState.dataBaseType !== DataBaseTypes.NULL
    );
  });

  return {
    setIsAuth,
    unsetIsAuth,
    setEnvReady,
    unsetEnvReady,
    setDataMode,
    unsetDataMode,
    setDataBaseType,
    unsetDataBaseType,
    isReady,
    setReady,
  };
};

export default authHandler;
