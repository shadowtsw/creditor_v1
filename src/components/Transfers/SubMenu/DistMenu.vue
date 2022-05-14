<template>
  <div class="distmenu_tags">
    <p>DISTMENU</p>
    <button @click="closeSubMenu">close</button>
  </div>
</template>

<script lang="ts">
import { AppDataStore } from "@/store/appData/app-data";
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {
    closeSubMenu: {
      type: Function,
      required: true,
    },
  },
  setup() {
    const availableKeys = computed(() => {
      return AppDataStore.availableKeys;
    });

    return {
      availableKeys,
    };
  },
});
</script>

<style lang="scss">
.distmenu_tags {
  width: 100%;
  background-color: red;
}
</style>
