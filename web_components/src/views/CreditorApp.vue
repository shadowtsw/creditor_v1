<template>
  <div class="app--container">
    <router-view class="app__navigation-menu"></router-view>
    <router-view class="app__account-bar" name="accounts"></router-view>
    <router-view class="app__main-window" name="main"></router-view>
    <router-view class="app__footer" name="footer"></router-view>
  </div>
</template>

<script lang="ts">
import { LogMe } from "../helpers/logger-function";
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  setup() {
    onMounted(() => {
      LogMe.mount("CreditorApp.vue mounted !");
    });
  },
});
</script>

<style lang="scss">
// @import './styles/import-libs.scss';
.app--container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr minmax(2rem, 3.2rem);
  gap: 0px 0px;
  grid-template-areas:
    "app__navigation-menu app__navigation-menu app__navigation-menu app__navigation-menu"
    "app__account-bar app__main-window app__main-window app__main-window"
    "app__account-bar app__main-window app__main-window app__main-window"
    "app__account-bar app__main-window app__main-window app__main-window"
    "app__footer app__footer app__footer app__footer";

  .app__navigation-menu {
    grid-area: app__navigation-menu;
    background-color: red;
    border: 1px solid black;
  }
  .app__account-bar {
    grid-area: app__account-bar;
    background-color: red;
    border: 1px solid black;
  }
  .app__main-window {
    grid-area: app__main-window;
    background-color: red;
    border: 1px solid black;
  }
  .app__footer {
    grid-area: app__footer;
    background-color: red;
    border: 1px solid black;
  }
}
</style>
