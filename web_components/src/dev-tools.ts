import { reactive, ref, computed, ComputedRef } from 'vue';

interface FunctionObject {
  name: string;
  action: () => void;
}

interface DevToolsState {
  functions: FunctionObject[];
}

interface DevToolsReturn {
  addFunction: (userFunction: FunctionObject) => void;
  deleteFunction: (name: string) => void;
  getFunctions: ComputedRef<FunctionObject[]>;
}

const devToolsState = reactive<DevToolsState>({
  functions: [],
});

const devToolsHandler = (): DevToolsReturn => {
  const addFunction = (userFunction: FunctionObject) => {
    const duplicatedName = devToolsState.functions.some(
      (element: FunctionObject) => element.name === userFunction.name
    );
    if (duplicatedName) {
      return;
    }
    devToolsState.functions.push(userFunction);
  };
  const deleteFunction = (name: string) => {
    const filteredArray = devToolsState.functions.filter(
      (element: FunctionObject) => {
        return element.name !== name;
      }
    );
    devToolsState.functions = filteredArray;
  };
  const getFunctions = computed(() => {
    return devToolsState.functions;
  });

  return {
    addFunction,
    deleteFunction,
    getFunctions,
  };
};

export default devToolsHandler;
