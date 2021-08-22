import { ref, reactive } from 'vue';

export enum ValidRoutes {
  CONFIG_PAGE = 'config',
  APP = 'app',
}

export type ValidRoutesStrings = keyof typeof ValidRoutes;

export type ValidRouteNames = Array<ValidRoutes>;

export const validRoutes = ref<ValidRouteNames>([
  ValidRoutes.CONFIG_PAGE,
  ValidRoutes.APP,
]);

const useRouteValidator = () => {
  const validateRouteName = (name: ValidRoutes) => {
    console.log(validRoutes.value);
    return validRoutes.value.includes(name);
  };

  return {
    validateRouteName,
  };
};

export default useRouteValidator;
