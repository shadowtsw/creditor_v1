<template>
  <h2>Get Started</h2>
  <p @click="activateCreateAccount">Create first account</p>
  <p @click="activateImportCSV">Import CSV</p>
  <p>Create Map</p>
  <p @click="activateDemoMode">Start Demo</p>
</template>

<script lang="ts">
import { usePageNavigator } from "@/components/navigator";
import { ApplicationEnvironmentStore } from "@/store/application/application-store";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  setup() {
    onMounted(async () => {
      // await AccountTransferStore.initializeSampleStore();
      // AccountTransferStore.createPagination();
    });
    const { activateImportCSV, activateCreateAccount } = usePageNavigator();

    const activateDemoMode = async () => {
      ApplicationEnvironmentStore.commitUseDemo();
    };

    return {
      activateImportCSV,
      activateCreateAccount,
      activateDemoMode,
    };
  },
});
</script>

<style lang="scss"></style>
