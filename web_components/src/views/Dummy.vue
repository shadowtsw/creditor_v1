<template>
  <div>DUMMY</div>
</template>

<script lang="ts">
import { LogMe } from "../helpers/logger-function";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  setup() {
    onMounted(() => {
      LogMe.mount("DUMMY.vue mounted");
    });
  },
});
</script>
