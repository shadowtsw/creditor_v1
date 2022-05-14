<template>
  <button type="button" @click="login(true)">Login</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    login: {
      type: Function,
      required: true,
    },
  },
});
</script>

<style></style>
