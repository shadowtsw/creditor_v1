<template>
  <dev-tools v-if="isDev" class="dev-tools"></dev-tools>
  <router-view></router-view>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  watch,
  ref,
  defineAsyncComponent,
} from "vue";
import { translate } from "./multilanguage";
//TODO
import authHandler from "./store/state-manager/env_statehandler";
import { useRouter } from "vue-router";
import { LogMe } from "./helpers/logger-function";
import { creditor } from "./main";
import devToolsHandler from "@/dev-tools";

export default defineComponent({
  setup() {
    const { t, locale } = translate();
    const { isReady, setReady, unsetIsAuth } = authHandler();
    const router = useRouter();
    const isDev = ref<boolean>(true);
    const devTools = devToolsHandler();

    //NOTE:DEV ONLY
    devTools.addFunction({
      name: "SetAuthEnvReady",
      action: () => {
        setReady();
      },
    });
    devTools.addFunction({
      name: "DisableAuthEnv",
      action: () => {
        unsetIsAuth();
      },
    });
    //NOTE:END

    onMounted(() => {
      LogMe.mount("App.vue mounted");
      isDev.value = creditor.environment === "development";
    });

    watch(isReady, (isReady) => {
      if (isReady) {
        router.push({ name: "app" });
      } else {
        router.push({ name: "config" });
      }
    });
    return {
      t,
      locale,
      isReady,
      setReady,
      isDev,
    };
  },
  components: {
    DevTools: defineAsyncComponent(
      () =>
        import(
          /* webpackChunkName: "DevTools" */ /* webpackPrefetch: true */ "./DevTools.vue"
        )
    ),
  },
});
</script>

<style lang="scss">
@import "./styles/import-libs.scss";
</style>
