<template>
  <div>Navigations-Menu</div>
</template>

<script lang="ts">
import { LogMe } from '@/helpers/logger-function';
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  setup() {
    onMounted(() => {
      LogMe.mount('Navigations-Menu.vue mounted');
    });
  },
});
</script>
