<template>
  <p>WELCOME</p>
  <p>BlaBlub</p>
  <button type="button" @click="closeWelcome">Get started !</button>
</template>

<script lang="ts">
import IndexedDBAppStateStoreManager from "@/indexedDB/app-state-database";
import { UserDataStore } from "@/store/user-data/user-data-store";
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
      })
        .then((_) => {
          UserDataStore.showAppStartWelcome(false);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    return {
      closeWelcome,
    };
  },
});
</script>

<style lang="scss"></style>
