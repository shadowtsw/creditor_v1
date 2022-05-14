<template>
  <div class="app_menue_wrapper">
    <i :class="['close_icon', 'fa-solid', 'fa-xmark']"></i>
    <i
      :class="[
        'save_icon',
        'fa-solid',
        'fa-floppy-disk',
        { 'disabled': !changeAvailable },
      ]"
    ></i>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const changeAvailable = ref<boolean>(false);

    return { changeAvailable };
  },
});
</script>

<style lang="scss">
.app_menue_wrapper {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.save_icon {
  flex: 1;
}
.close_icon {
  flex: 1;
}
</style>
