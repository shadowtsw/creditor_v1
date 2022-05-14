<template>
  <div class="version_wrapper">
    <p id="current_version">Vers: {{ currentVer }}</p>
    <i
      :class="[
        'update_icon',
        'fa-solid',
        'fa-angles-up',
        { 'disabled': !updateAvailable },
      ]"
    ></i>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const currentVer = ref<string>("1.0.0");
    const updateAvailable = ref<boolean>(false);

    return { currentVer, updateAvailable };
  },
});
</script>

<style lang="scss">
.version_wrapper {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
#current_version {
  flex: 3;
  margin: 0;
  padding: 0;
  text-align: center;
}
.update_icon {
  flex: 1;
  &.disabled {
    color: grey;
  }
}
</style>
