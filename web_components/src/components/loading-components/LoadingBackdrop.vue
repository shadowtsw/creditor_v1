<template>
  <div v-if="show" :class="['loading-box--large', { error: error }]">
    <div class="loading-box__text-container">
      <p class="loading-title">creditor</p>
      <p variant="mukta" class="loading-text"><slot></slot></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      required: false,
      default: false,
    },
    error: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  // setup() {},
});
</script>

<style lang="scss" scoped>
@import "@/styles/creditor-fonts";

.loading-box--large {
  position: fixed;
  top: calc(50% - 6rem);
  left: calc(50% - 6rem);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 6rem;
  height: 6rem;
  padding: 1rem;
  border: 2px solid transparent;
  animation: loadingOverlay;
  animation-duration: 1s;
  animation-direction: normal;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  transform: rotateZ(45deg);
  z-index: 1000;
  .loading-box__text-container {
    transform: rotateZ(-45deg);
    p {
      font-size: auto;
      text-align: center;
      margin: 0;
      padding: 0;
      width: 100%;
    }
    .loading-title {
      font-size: 1.1rem;
    }
    .loading-text {
      font-size: 0.8rem;
    }
  }
  &.error {
    animation: pulsatingError;
    animation-duration: 0.4s;
    animation-direction: alternate;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    border-color: red;
    border-style: dotted;
    .loading-title {
      color: red;
    }
    .loading-text {
      color: red;
    }
  }
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
@keyframes pulsatingError {
  from {
    border-color: transparent;
  }
  to {
    border-color: red;
  }
}
</style>
