import { ref, reactive, computed } from 'vue';

interface LoadingState {
  appIsLoading: boolean;
  showBackdrop: boolean;
  loadingElementName: string;
}

const loadingState = reactive<LoadingState>({
  appIsLoading: false,
  showBackdrop: false,
  loadingElementName: '',
});

const loadingHandler = () => {
  const setLoading = (argument: string) => {
    loadingState.appIsLoading = true;
    loadingState.loadingElementName = argument;
  };

  const stopLoading = () => {
    loadingState.appIsLoading = false;
    loadingState.loadingElementName = '';
  };

  return {
    setLoading,
    stopLoading,
    isLoading: computed(() => loadingState.appIsLoading),
    showBackdrop: computed(() => loadingState.showBackdrop),
    elementName: computed(() => loadingState.loadingElementName),
  };
};
