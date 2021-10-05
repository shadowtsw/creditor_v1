<template>
  <div v-if="functionObjects.length > 0" class="dev__container">
    <button
      v-for="el in functionObjects"
      type="button"
      :key="el.name"
      @click="el.action"
    >
      {{ el.name }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import devToolsHandler from "@/dev-tools";
import { LogMe } from "@/helpers/logger-function";

export default defineComponent({
  setup(props, context) {
    onMounted(() => {
      LogMe.mount("DevTools.vue mounted");
      if (devtools.getFunctions.value.length === 0) {
        devtools.addFunction({
          name: "Dummy",
          action: () => {
            LogMe.debug("Dummy clicked");
          },
        });
      }
    });
    const devtools = devToolsHandler();

    return {
      functionObjects: devtools.getFunctions,
    };
  },
});
</script>

<style lang="scss" scoped>
.dev__container {
  background-color: black;
  color: white;
  display: flex;
  flex-flow: row wrap;
  padding: 0.3rem;
  > button {
    margin: 0.2rem;
    padding: 0;
    min-width: fit-content;
    background-color: black;
    color: white;
  }
}
</style>
