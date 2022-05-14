<template>
  <div class="submenu_tags">
    <p>TAGS</p>
    <span v-for="tag in defaultTags" :key="tag">
      {{ tag }}
    </span>
    <button @click="closeSubMenu">close</button>
  </div>
</template>

<script lang="ts">
import { AppDataStore } from "@/store/appData/app-data";
import { defineComponent, computed } from "vue";

export default defineComponent({
  props: {
    closeSubMenu: {
      type: Function,
      required: true,
    },
  },
  setup() {
    const defaultTags = computed(() => {
      console.log(
        "AppDataStore.defaultGroup?.tags;",
        AppDataStore.defaultGroup?.tags
      );
      return AppDataStore.defaultGroup?.tags;
    });

    console.log("defaultTags", defaultTags);

    return {
      defaultTags,
    };
  },
});
</script>

<style lang="scss">
.submenu_tags {
  width: 100%;
  background-color: blue;
}
</style>
