import { ref, reactive } from 'vue';

export enum ValidComponents {
  NEW_USER = 'NewUser',
  EXISTING_USER = 'ExistingUser',
}

export type ValidComponentsStrings = keyof typeof ValidComponents;

export type ValidComponentsNames = Array<ValidComponents>;

export const validComponents = ref<ValidComponentsNames>([
  ValidComponents.NEW_USER,
  ValidComponents.EXISTING_USER,
]);

const useComponentValidator = () => {
  const validateComponentName = (name: ValidComponents) => {
    console.log(validComponents.value);
    return validComponents.value.includes(name);
  };

  return {
    validateComponentName,
  };
};

export default useComponentValidator;
