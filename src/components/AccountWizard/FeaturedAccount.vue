<template>
  <h2>Create DigitalAccount</h2>
  <div></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue";

export default defineComponent({
  setup() {
    onMounted(async () => {});
    const setupWizard = reactive([
      {
        step: 0,
      },
    ]);
  },
});
</script>

<style lang="scss"></style>
