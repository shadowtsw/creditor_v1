<template>
  <div ref="content" class="loading-box-container">
    <div class="loading-box--backdrop"></div>
    <div
      class="loading-box--small"
      :style="{
        height: boxDiameter + 'px',
        width: boxDiameter + 'px',
        position: 'absolute',
        top: heightDiff + 'px',
      }"
    ></div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';

export default defineComponent({
  setup(props, context) {
    const content = ref<null | HTMLElement>(null);
    const loadingBoxDiameter = ref<number>(0);
    const boxHeight = ref<number>(0);
    const boxWidth = ref<number>(0);
    const heightDiff = ref<number>(0);

    const boxDiameter = computed(() => {
      return loadingBoxDiameter.value;
    });

    const heightPixel = computed(() => {
      return boxHeight.value;
    });

    const widthPixel = computed(() => {
      return boxWidth.value;
    });

    const determineLoadingBoxDiameter = () => {
      if (content.value) {
        console.log(content.value);
        const { height, width } = content.value.getBoundingClientRect();

        const side = height / Math.sqrt(2); //calc rotated side by setting height as diameter

        boxHeight.value = height - 4;
        boxWidth.value = width - 4;
        heightDiff.value = height - side - 4;
        loadingBoxDiameter.value = side - 4;
      }
    };

    onMounted(() => {
      determineLoadingBoxDiameter();
    });

    return {
      content,
      boxDiameter,
      heightPixel,
      widthPixel,
      heightDiff,
    };
  },
});
</script>

<style lang="scss" scoped>
.loading-box-container {
  position: relative;
  display: inline-block;
  background-color: inherit;
}

.loading-box--backdrop {
  z-index: 1;
  background-color: red;
  position: absolute;
  top: 0;
  left: 0;
}

.loading-box--small {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;
  animation: loadingOverlay;
  animation-duration: 1s;
  animation-direction: normal;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  transform: rotateZ(45deg);
  left: 35%;
  z-index: 2;
  background-color: inherit;
}

@keyframes loadingOverlay {
  0% {
    border-color: transparent;
  }
  25% {
    border-color: transparent;
    border-right-color: black;
  }
  50% {
    border-color: transparent;
    border-bottom-color: black;
  }
  75% {
    border-color: transparent;
    border-left-color: black;
  }
  100% {
    border-color: transparent;
    border-top-color: black;
  }
}
</style>
