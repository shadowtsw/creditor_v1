<template>
  <div class="account_toolbar">
    <div class="searchbar">
      <input type="text" class="search-field" />
      <i class="search-icon fa-solid fa-magnifying-glass-dollar"></i>
    </div>
    <!-- <div class="period-list">
      <input type="radio" id="one" value="One" v-model="picked" />
      <label for="one">One</label>
      <input type="radio" id="two" value="Two" v-model="picked" />
      <label for="two">Two</label>
      <input type="radio" id="two" value="Two" v-model="picked" />
      <label for="two">Two</label>
      <input type="radio" id="two" value="Two" v-model="picked" />
      <label for="two">Two</label>
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {},
});
</script>
<style lang="scss">
@use "@/styles/placeholders.scss" as *;
@use "@/styles/variables.scss" as *;

.account_toolbar {
  height: 4.8rem;
  border-bottom: $default-border-style;
  display: flex;
  flex-direction: column;
  .searchbar {
    height: 1.8rem;
    border-bottom: $default-border-style;
    @extend %flex-default-center;
    .search-field {
      flex: 7;
      margin: 0.3rem 0;
    }
    .search-icon {
      flex: 2;
      margin-right: 15%;
    }
  }
  .period-list {
    height: calc(3rem - 2px);
    display: flex;
    flex-wrap: wrap;
    margin: 0.3rem;
    > * {
    }
  }
}
</style>
