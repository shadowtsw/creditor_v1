<template>
  <dev-tools v-if="isDev" class="dev-tools"></dev-tools>
  <loading-backdrop v-show="isLoading"
    ><span>Prepare App</span></loading-backdrop
  >
  <router-view></router-view>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  watch,
  ref,
  defineAsyncComponent,
  computed,
} from "vue";
import { translate } from "./multilanguage";
//TODO
// import authHandler from "./store/state-manager/env_statehandler";
import { useRouter } from "vue-router";
import { LogMe } from "./helpers/logger-function";
// import { creditor } from "./main";
import devToolsHandler from "./dev-tools";
import { ApplicationEnvironment } from "@/store/appliaction/application-environment";

export default defineComponent({
  setup() {
    //Application initialization
    ApplicationEnvironment.initializeApp();
    LogMe.info(ApplicationEnvironment.instanceIsLoadingState);
    LogMe.info(ApplicationEnvironment.versionState);
    LogMe.info(ApplicationEnvironment.environmentState);

    //Translator
    const { t, locale } = translate();
    // const { isReady, setReady, unsetIsAuth } = authHandler();

    //Router
    const router = useRouter();

    //NOTE:DEV ONLY
    const devTools = devToolsHandler();
    const isDev = ref<boolean>(true);
    devTools.addFunction({
      name: " SetAuthEnvReady ",
      action: () => {
        ApplicationEnvironment.setInstanceIsLoading(true);
        endLoading();
        ApplicationEnvironment.devReady();
        router.push({ name: "app" });
      },
    });
    devTools.addFunction({
      name: " DisableAuthEnv ",
      action: () => {
        ApplicationEnvironment.devReset();
        router.push({ name: "config" });
      },
    });
    const envReady = computed(() => {
      console.log(ApplicationEnvironment.envReadyState);
      return ApplicationEnvironment.envReadyState;
    });
    const isLoading = computed(() => {
      console.log(ApplicationEnvironment.instanceIsLoadingState);
      return ApplicationEnvironment.instanceIsLoadingState;
    });
    function endLoading() {
      setTimeout(() => {
        console.log("Loading end");
        ApplicationEnvironment.setInstanceIsLoading(false);
      }, 2000);
    }
    devTools.addFunction({
      name: " SimulateLoading ",
      action: () => {
        ApplicationEnvironment.setInstanceIsLoading(true);
        endLoading();
      },
    });
    watch(envReady, (isReady) => {
      if (isReady) {
        router.push({ name: "app" });
      } else {
        router.push({ name: "config" });
      }
    });
    //NOTE:END

    onMounted(() => {
      LogMe.mount("App.vue mounted");
    });

    return {
      t,
      locale,
      isDev,
      isLoading,
    };
  },
  components: {
    DevTools: defineAsyncComponent(() => {
      return import(
        /* webpackChunkName: "DevTools" */ /* webpackPrefetch: true */ "./DevTools.vue"
      );
    }),
  },
});
</script>

<style lang="scss">
@import "./styles/import-libs.scss";
</style>
