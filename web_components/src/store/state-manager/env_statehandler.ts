import { reactive, computed, ComputedRef } from 'vue';
import { DataType } from '@/interfaces/environment/data-enums';
import { DataBaseTypes } from '@/interfaces/database/database-interface';
interface AuthState {
  isAuth: boolean;
  envReady: boolean;
  dataMode: DataType;
  dataBaseType?: DataBaseTypes;
}
interface AuthHandlerReturn {
  isReady: ComputedRef<boolean>;
  setReady: () => void;
}
const authState = reactive<AuthState>({
  isAuth: false,
  envReady: false,
  dataMode: DataType.UNSET,
  dataBaseType: DataBaseTypes.NULL,
});
const authHandler = (): AuthHandlerReturn => {
  const isReady = computed(() => {
    return (
      authState.envReady &&
      authState.isAuth &&
      (authState.dataMode !== DataType.UNSET ||
        authState.dataBaseType !== DataBaseTypes.NULL)
    );
  });

  const setReady = () => {
    console.log('Set Ready pressed');
    authState.isAuth = true;
    authState.envReady = true;
    authState.dataMode = DataType.JSON;
  };

  return {
    isReady,
    setReady,
  };
};

export default authHandler;
