<template>
  <div class="loading-status__window">
    <div @click="startLoading">
      {{ message }} {{ isLoading ? `${percentage}%` : null }}
    </div>
    <div class="loading-indicator" :style="style"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from "vue";
import { LoadingManager, useDummyLoader } from "@/store/history/loading";

export default defineComponent({
  setup() {
    const percentage = computed(() => {
      return LoadingManager.percentage;
    });

    const isLoading = computed(() => {
      return LoadingManager.message === "Loading";
    });

    watch(isLoading, (newValue, oldValue) => {
      console.log(newValue, oldValue);
    });

    const style = computed(() => {
      if (LoadingManager.message !== "Idle") {
        return `width: ${percentage.value}%`;
      } else {
        return undefined;
      }
    });

    const message = computed(() => {
      return LoadingManager.message;
    });

    const timer = ref<null | ReturnType<typeof setInterval>>(null);

    const startLoading = () => {
      LoadingManager.commitPercentage(0);
      timer.value = setInterval(() => {
        if (LoadingManager.percentage === 100) {
          LoadingManager.commitIdle();
          if (timer.value) {
            clearInterval(timer.value);
            timer.value = null;
          }
        } else {
          const nextStep = LoadingManager.percentage + 1;
          LoadingManager.commitPercentage(nextStep);
        }
      }, 50);
    };

    return {
      percentage,
      style,
      message,
      isLoading,
      startLoading,
    };
  },
});
</script>

<style lang="scss">
.loading-status__window {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  .loading-indicator {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 128, 0, 0.425);
  }
}
</style>
