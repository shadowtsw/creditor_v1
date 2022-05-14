import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from "vuex-module-decorators";
import store from "..";

import { ref, reactive, computed } from "vue";

type ProcessStates = "Loading" | "Idle" | "Finished";

@Module({
  dynamic: true,
  namespaced: true,
  store,
  name: "LoadingManager",
})
class Loader extends VuexModule {
  private _percentage: number = 100;
  private _message: ProcessStates = "Idle";
  private _timer: null | ReturnType<typeof setInterval> = null;

  private _mutationsBlocked: boolean = false;

  public get percentage() {
    return this._percentage;
  }

  public get message() {
    return this._message;
  }

  public get timer() {
    return this._timer;
  }

  public get mutationsBlocked() {
    return this._mutationsBlocked;
  }

  @Mutation
  blockMutations() {
    this._mutationsBlocked = true;
  }

  @Mutation
  freeMutations() {
    this._mutationsBlocked = false;
  }

  @Mutation
  setPercentage(payload: number) {
    this._percentage = payload;
  }

  @Mutation
  private setMessage(payload: ProcessStates) {
    this._message = payload;
  }

  @Action
  commitPercentage(payload: number) {
    if (payload > 100) {
      return;
    } else if (payload === 0) {
      if (this.message !== "Loading") {
        this.setMessage("Loading");
        this.blockMutations();
      }
      this.setPercentage(payload);
    } else if (payload > 0 && payload < 100) {
      if (this.message !== "Loading") {
        this.setMessage("Loading");
      }
      this.setPercentage(payload);
    } else if (payload === 100) {
      if (this.message !== "Finished") {
        this.setMessage("Finished");
      }
      this.setPercentage(payload);
    }
  }

  @Action
  commitMessageOnly(payload: "Loading" | "Idle" | "Finished") {
    this.setMessage(payload);
  }

  @Action
  async commitIdle() {
    setTimeout(() => {
      this.setMessage("Idle");
      this.freeMutations();
    }, 1500);
  }
}

export const LoadingManager = getModule(Loader);

export const useDummyLoader = () => {
  const timer = ref<null | ReturnType<typeof setInterval>>(null);
  const lastStep = ref(0);
  const defaultLoadingSpeed = 25;

  const startLoading = () => {
    LoadingManager.setPercentage(0);
    LoadingManager.commitMessageOnly("Loading");
    timer.value = setInterval(() => {
      if (LoadingManager.percentage === 100) {
        lastStep.value = 100;
        LoadingManager.setPercentage(99);
      } else if (LoadingManager.percentage === 0) {
        lastStep.value = 0;
        LoadingManager.setPercentage(1);
      } else if (
        lastStep.value < LoadingManager.percentage &&
        LoadingManager.percentage !== 100
      ) {
        lastStep.value = LoadingManager.percentage;
        const nextStep = LoadingManager.percentage + 1;
        LoadingManager.setPercentage(nextStep);
      } else if (
        lastStep.value > LoadingManager.percentage &&
        LoadingManager.percentage !== 100
      ) {
        lastStep.value = LoadingManager.percentage;
        const nextStep = LoadingManager.percentage - 1;
        LoadingManager.setPercentage(nextStep);
      }
    }, defaultLoadingSpeed);
  };

  const endLoading = () => {
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }
    LoadingManager.setPercentage(0);
    LoadingManager.commitMessageOnly("Finished");
    setTimeout(() => {
      LoadingManager.commitIdle();
    }, 1200);
  };

  return {
    startLoading,
    endLoading,
    isLoading: computed(() => timer.value !== null),
  };
};
