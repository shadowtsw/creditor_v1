<template>
  <div class="transfers_toolbar">
    <div class="toolbox">
      <div class="searchbar">
        <div @click="closeAllTransfers">Close all</div>
        <input type="text" class="search-field" />
        <i class="search-icon fa-solid fa-magnifying-glass-dollar"></i>
      </div>
      <div class="transfers_plugins__container">
        <div
          v-for="plugin in plugins"
          :key="plugin.displayText"
          :class="[
            'plugin-point',
            { 'active': plugin.displayText === currentPlugin },
          ]"
          @click="setActivePlugin(plugin.displayText)"
        >
          <span>{{ plugin.displayText }}</span>
        </div>
      </div>
    </div>
    <div
      v-if="settings"
      class="transfers_settings__container"
      :class="[
        'plugin-point',
        { 'active': settings && settings.displayText === currentPlugin },
      ]"
      @click="setActivePlugin(settings ? settings.displayText : 'GetStarted')"
    >
      <i class="fa-solid fa-gear" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { usePluginNavigator } from "../navigator";
import { AccountTransferStore } from "@/store/account-transfer/account-transfer-store";

export default defineComponent({
  setup() {
    const {
      plugins,
      settings,
      setTabVisibility,
      setActivePlugin,
      currentPlugin,
    } = usePluginNavigator();

    const closeAllTransfers = () => {
      AccountTransferStore.commitCloseAllOpenTransfers();
    };

    return {
      plugins,
      settings,
      setTabVisibility,
      setActivePlugin,
      currentPlugin,
      closeAllTransfers,
    };
  },
});
</script>

<style lang="scss">
@use "@/styles/placeholders";

.transfers_toolbar {
  height: 4.8rem;
  border-bottom: 2px solid white;
  background-color: grey;
  display: flex;
  justify-content: center;
  align-items: center;
  .toolbox {
    border-right: 2px solid white;
    height: calc(100% - 2px);
    flex: 9;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .searchbar {
      height: 1.8rem;
      border-bottom: 2px solid white;
      display: flex;
      align-items: center;
    }
    .transfers_plugins__container {
      height: calc(3rem - 2px);
      flex: 9;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      overflow-x: auto;
      .plugin-point {
        flex: 1;
        padding: 2px;
        margin: {
          left: 0.6rem;
          right: 0.6rem;
        }
        text-align: center;
        border: 1px solid transparent;
        @extend %small-border-radius;
        &.active {
          border: 1px solid white;
        }
      }
    }
  }
  .transfers_settings__container {
    flex: 1;
    padding: 2px;
    margin: {
      left: 0.6rem;
      right: 0.6rem;
    }
    text-align: center;
    border: 1px solid transparent;
    @extend %small-border-radius;
    &.active {
      border: 1px solid white;
    }
  }
}
</style>
