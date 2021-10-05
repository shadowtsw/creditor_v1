<template>
  <div>FOOTER</div>
</template>

<script lang="ts">
import { LogMe } from '@/helpers/logger-function';
import { defineComponent, onMounted } from 'vue';

export default defineComponent({
  setup() {
    onMounted(() => {
      LogMe.mount('FOOTER.vue mounted');
    });
  },
});
</script>
