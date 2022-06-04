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
import { SubDataStore } from "@/store/sub-data/sub-data-store";
import { defineComponent, computed, PropType } from "vue";

export default defineComponent({
  props: {
    closeSubMenu: {
      type: Function as PropType<(event: Event) => void>,
      required: true,
    },
  },
  setup() {
    const defaultTags = computed(() => {
      return SubDataStore.defaultGroup?.tags;
    });

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
