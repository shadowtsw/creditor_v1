<template>
  <div>
    <h1>h1: {{ myTitle }} - Chakra</h1>
    <h2>h2: Test - Chakra</h2>
    <h3>h3: Test - Baloo Da 2</h3>
    <h4>h4: Test - Baloo Da 2</h4>
    <p variant="mukta">p: Test -'Mukta'</p>
    <span variant="mukta">span: test 'Mukta'</span>
    <div class="text">
      <p variant="bai">p: Test -'Bai'</p>
      <span variant="bai">span: test 'Bai'</span>
    </div>
    <p></p>
    <button variant="neutral">Neutral</button>
    <button variant="success">Success</button>
    <button variant="warning">Warning</button>
    <button variant="danger">Danger</button>
    <button variant="link">LINK</button>
    <button variant="link" class="active-link">LINK ACTIVE</button>
    <p></p>
    <div class="border-class">Border</div>
    <p></p>
    <div class="loading-box--large">
      <div class="loading-box__text-container">
        <p>LoadingBox</p>
        <p>LoadingType</p>
      </div>
    </div>
    <p>Test</p>
    <div class="test-button-container">
      <div class="loading-box--small"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup(props, context) {
    return {
      myTitle: 'My biggest tile',
    };
  },
});
</script>

<style lang="scss">
@import './styles/import-libs.scss';
</style>

<style scoped lang="scss">
* {
  // font-size: 2rem;
}
.border-class {
  border: 2px solid rgb(68, 68, 68);
  border-radius: 1px;
}
.test-button-container {
  border: 1px solid black;
  min-height: 2rem;
}
</style>
