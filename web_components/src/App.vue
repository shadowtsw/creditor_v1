<template>
  <div>
    <dev-tools v-if="isDev" class="dev-tools"></dev-tools>
    <router-view></router-view>
    <button type="button" @click="setReady">SET READY</button>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  watch,
  ref,
  defineAsyncComponent,
} from 'vue';
import { translate } from './multilanguage';
import authHandler from './store/state-manager/env_statehandler';
import { useRouter } from 'vue-router';
import { LogMe } from './helpers/logger-function';
import { creditor } from './main';

export default defineComponent({
  setup(props, context) {
    const { t, locale } = translate();
    const { isReady, setReady } = authHandler();
    const router = useRouter();
    const isDev = ref<boolean>(true);

    onMounted(() => {
      LogMe.mount('App.vue mounted');
      isDev.value = creditor.environment === 'development';
    });

    watch(isReady, (isReady, prevVal) => {
      if (isReady) {
        router.push({ name: 'app' });
      } else {
        router.push({ name: 'config' });
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
          /* webpackChunkName: "DevTools" */ /* webpackPrefetch: true */ './DevTools.vue'
        )
    ),
  },
});
</script>

<style lang="scss">
@import './styles/import-libs.scss';
</style>
