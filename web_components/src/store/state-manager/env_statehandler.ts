import { ref, reactive, computed } from 'vue';
import { DataType } from '@/interfaces/enviroment/data-enums';
import { DataBaseTypes } from '@/interfaces/database/database-interface';

interface AuthState {
  isAuth: boolean;
  envReady: boolean;
  dataMode: DataType;
  dataBaseType?: DataBaseTypes;
}

const authState = reactive<AuthState>({
  isAuth: false,
  envReady: false,
  dataMode: DataType.UNSET,
  dataBaseType: DataBaseTypes.NULL,
});

const authHandler = () => {
  const isReady = computed(() => {
    return (
      authState.envReady &&
      authState.isAuth &&
      (authState.dataMode !== DataType.UNSET ||
        authState.dataBaseType !== DataBaseTypes.NULL)
    );
  });

  const setReady = () => {
    authState.envReady = true;
    authState.dataMode = DataType.JSON;
  };

  return {
    isReady,
    setReady,
  };
};

export default authHandler;
