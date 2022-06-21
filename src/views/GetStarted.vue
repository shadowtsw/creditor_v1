<template>
  <h2>Get Started</h2>
  <p @click="activateCreateAccount">Create first account</p>
  <p @click="activateImportCSV">Import CSV</p>
  <p>Create Map</p>
</template>

<script lang="ts">
import { usePageNavigator } from "@/components/navigator";
import { defineComponent, onMounted } from "vue";

//Logger
import { LogMe } from "@/logging/logger-function";

export default defineComponent({
  setup() {
    onMounted(async () => {
      LogMe.mount("Get Started");
    });

    const { activateImportCSV, activateCreateAccount } = usePageNavigator();

    return {
      activateImportCSV,
      activateCreateAccount,
    };
  },
});
</script>

<style lang="scss"></style>
