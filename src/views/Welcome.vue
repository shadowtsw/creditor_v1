<template>
  <p>WELCOME</p>
  <p>BlaBlub</p>
  <div class="app-state__container">
    <input
      type="radio"
      name="app_state"
      id="app_state"
      value="app"
      v-model="appType"
    />
    <label for="app_state">Start App</label>

    <input
      type="radio"
      name="demo_state"
      id="demo_state"
      value="demo"
      v-model="appType"
    />
    <label for="demo_state">Use Demo</label>

    <div v-if="appType === 'app'">
      <input
        type="checkbox"
        name="saveCloseState"
        id="saveCloseState"
        v-model="saveCloseState"
      />
      <label for="saveCloseState">Always start App</label>
    </div>
    <button type="button" @click="start">Start</button>
  </div>
</template>

<script lang="ts">
import { ApplicationEnvironmentStore } from "@/store/application/application-store";
import { defineComponent, onMounted, ref } from "vue";

//Logger
import { LogMe } from "@/logging/logger-function";

export default defineComponent({
  setup() {
    onMounted(async () => {
      LogMe.mount("Welcome");
    });
    const appType = ref<"app" | "demo">("app");
    const saveCloseState = ref<boolean>(false);

    const start = async () => {
      if (appType.value === "app") {
        ApplicationEnvironmentStore.commitShowWelcomeScreen({
          value: false,
          saveState: saveCloseState.value,
        });
        ApplicationEnvironmentStore.commitUseDemo({
          value: false,
          saveState: saveCloseState.value,
        });
      } else {
        ApplicationEnvironmentStore.commitShowWelcomeScreen({
          value: false,
          saveState: false,
        });
        ApplicationEnvironmentStore.commitUseDemo({
          value: true,
          saveState: false,
        });
      }
    };

    return {
      start,
      appType,
      saveCloseState,
    };
  },
});
</script>

<style lang="scss">
.app-state__container {
  border: 2px solid red;
}
</style>
