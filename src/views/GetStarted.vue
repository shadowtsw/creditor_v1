<template>
  <h2>Get Started</h2>
  <p @click="activateCreateAccount">Create first account</p>
  <p @click="activateImportCSV">Import CSV</p>
  <p>Create Map</p>
  <p>Start Demo</p>
</template>

<script lang="ts">
import { usePageNavigator } from "@/components/navigator";
import { defineComponent, onMounted } from "vue";
import { AccountTransferStore } from "../store/data/data-store";

export default defineComponent({
  setup() {
    onMounted(async () => {
      // await AccountTransferStore.initializeSampleStore();
      // AccountTransferStore.createPagination();
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
