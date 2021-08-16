import { ref, reactive, computed } from 'vue';

interface UserState {
  username: string;
  password: string;
  userPin: number | null;
  isValid: boolean;
}

const pinValidator = (arg: number) => {
  return arg.toString().length < 4;
};

const userState = reactive<UserState>({
  username: '',
  password: '',
  userPin: null,
  isValid: false,
});

const userStateHandler = () => {
  const compareUsername = (arg: string) => {
    return arg === userState.username;
  };

  const comparePassword = (arg: string) => {
    return arg === userState.password;
  };

  const comparePin = (arg: number) => {
    return arg.toString() === userState.userPin?.toString();
  };

  const validate = (username: string, password: string, pin: number) => {
    if (
      compareUsername(username) &&
      comparePassword(password) &&
      comparePin(pin)
    ) {
      userState.isValid = true;
      return true;
    } else {
      userState.isValid = false;
      return false;
    }
  };

  return {
    validate,
  };
};
