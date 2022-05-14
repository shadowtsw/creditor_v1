<template>
  <div class="history_wrapper">
    <i
      :class="[
        'history_icon',
        'fa-solid',
        'fa-timeline',
        { 'disabled': !historyAvailable },
      ]"
    ></i>
    <p id="history_topic">Current change:</p>
    <div class="history_list"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const historyAvailable = ref<boolean>(false);

    return { historyAvailable };
  },
});
</script>

<style lang="scss">
.history_wrapper {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.history_icon {
  flex: 1;
  &.disabled {
    color: grey;
  }
}
#history_topic {
  flex: 1;
  margin: 0;
  padding: 0;
  text-align: center;
}
.history_list {
  flex: 10;
}
</style>
