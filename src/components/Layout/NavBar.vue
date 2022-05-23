<template>
  <div class="navbar_wrapper">
    <div class="navbar-pages__container">
      <div
        v-for="menu in pages"
        :key="menu.displayText"
        :class="[
          'menue-point',
          { '--is-active': menu.displayText === currentPage },
        ]"
        @click="setActivePage(menu.displayText)"
      >
        <span>{{ menu.displayText }}</span>
      </div>
    </div>
    <div
      class="navbar-settings__container"
      :class="[
        'menue-point',
        { '--is-active': settings && settings.displayText === currentPage },
      ]"
      @click="setActivePage(settings ? settings.displayText : 'GetStarted')"
    >
      <i class="fa-solid fa-gear" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, watch } from "vue";
import { usePageNavigator } from "../navigator";

export default defineComponent({
  setup() {
    const { pages, settings, setTabVisibility, setActivePage, currentPage } =
      usePageNavigator();

    return { pages, settings, setTabVisibility, setActivePage, currentPage };
  },
});
</script>

<style lang="scss">
// @use "@/styles/mixins";
@use "@/styles/placeholders" as *;

.navbar_wrapper {
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;

  .navbar-pages__container {
    min-height: 1.6rem;
    flex: 8;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    .menue-point {
      flex: 1;
      padding: 2px;
      margin: {
        left: 0.6rem;
        right: 0.6rem;
      }
      text-align: center;
      border: 1px solid transparent;
      @extend %small-border-radius;
      @extend %creditor-link;
    }
  }
  .navbar-settings__container {
    min-height: 1.6rem;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    border: 1px solid transparent;
    @extend %small-border-radius;
    &.active {
      border: 1px solid white;
    }
  }
}
</style>
