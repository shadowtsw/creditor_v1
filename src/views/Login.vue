<template>
  <button type="button" @click="login(true)">Login</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

//Logger
import { LogMe } from "@/logging/logger-function";

export default defineComponent({
  props: {
    login: {
      type: Function,
      required: true,
    },
  },
  mounted() {
    LogMe.mount("Login");
  },
});
</script>

<style></style>
