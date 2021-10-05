<template>
  <div>MAIN WINDOW</div>
</template>

<script lang="ts">
import { LogMe } from '@/helpers/logger-function';
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  setup() {
    onMounted(() => {
      LogMe.mount('MAIN WINDOW.vue mounted');
    });
  },
});
</script>
