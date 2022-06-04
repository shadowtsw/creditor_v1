<template>
  <div class="distmenu_tags">
    <p>DISTMENU</p>
    <button @click="closeSubMenu">close</button>
  </div>
</template>

<script lang="ts">
import { SubDataStore } from "@/store/sub-data/sub-data-store";
import { computed, defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    closeSubMenu: {
      type: Function as PropType<(event: Event) => void>,
      required: true,
    },
  },
  setup() {
    const availableKeys = computed(() => {
      return SubDataStore.availableKeys;
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
