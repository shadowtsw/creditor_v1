<template>
  <div>
    <router-view></router-view>
    <button type="button" @click="setReady">SET READY</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from 'vue';
import { translate } from './multilanguage';
import authHandler from './store/state-manager/env_statehandler';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  setup(props, context) {
    const { t, locale } = translate();
    const { isReady, setReady } = authHandler();
    const router = useRouter();
    // onMounted(() => {
    //   if (isReady.value) {
    //     router.push({ name: 'app' });
    //   } else {
    //     router.push({ name: 'config' });
    //   }
    // });
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
    };
  },
});
</script>

<style lang="scss">
@import './styles/import-libs.scss';
</style>
