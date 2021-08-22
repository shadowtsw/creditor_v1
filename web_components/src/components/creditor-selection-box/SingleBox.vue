<template>
  <div
    class="select-box__container"
    :class="[{ isChecked: checked !== null ? checked : defaultChecked }]"
    @click="log"
  >
    <input
      v-show="!hideBox"
      class="single-box__checkbox"
      type="checkbox"
      @change="log($event)"
      :checked="checked !== null ? checked : defaultChecked"
    />
    <p class="single-box__text" :class="[{ fullSize: hideBox }]">
      <slot></slot>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    checked: {
      type: Boolean,
      required: false,
      default: null,
    },
    hideBox: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ['checked-event'],
  setup(props, context) {
    const log = (event?: any) => {
      if (event && event.target && event.target.checked !== undefined) {
        context.emit('checked-event', event.target.checked);
        defaultChecked.value = event.target.checked;
      } else {
        context.emit(
          'checked-event',
          props.checked !== null ? !props.checked : !defaultChecked.value
        );
        defaultChecked.value = !defaultChecked.value;
      }
    };

    const defaultChecked = ref(false);

    return {
      log,
      defaultChecked,
    };
  },
});
</script>

<style lang="scss" scoped>
.select-box__container {
  display: flex;
  flex-flow: row;
  justify-content: space-around;
  align-items: center;
  border: 1px solid black;
  border-radius: 5px;
  &:hover,
  &.isChecked {
    font-weight: 500;
    // h-shadow v-shadow blur-radius color
    text-shadow: 0px 0px 3px rgba(0, 0, 0, 0.452);
  }

  .single-box__checkbox {
    margin: 0;
    padding: 0.4rem;
    width: 20%;
    outline: none;
  }
  .single-box__text {
    margin: 0;
    padding: 0.4rem;
    width: 70%;
    &.fullSize {
      //   width: 100%;
    }
    // text-shadow: inherit;
  }
}
</style>
