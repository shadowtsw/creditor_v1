<template>
  <p>WELCOME</p>
  <p>BlaBlub</p>
  <button type="button" @click="closeWelcome">Get started !</button>
</template>

<script lang="ts">
import IndexedDBAppStateStoreManager from "@/indexedDB/app-state-indexeddb";
import { UserDataStore } from "@/store/user/user-data";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  setup() {
    onMounted(async () => {
      console.log("Welcome mounted");
    });

    const closeWelcome = () => {
      IndexedDBAppStateStoreManager.setState({
        property: "showAppStartWelcome",
        value: false,
      });
      UserDataStore.showAppStartWelcome(false);
    };

    return {
      closeWelcome,
    };
  },
});
</script>

<style lang="scss"></style>
