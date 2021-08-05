<template>
  <button></button>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    type: {
      type: String,
      required: false,
      default: 'neutral',
    },
    active: {
      type: Boolean,
      required: false,
      default: false,
    },
    icon: {
      type: String,
      required: false,
    },
  },
  setup(props) {},
});
</script>

<style lang="scss" scoped></style>
