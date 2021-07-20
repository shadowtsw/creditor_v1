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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup(props, context) {
    return {
      myTitle: 'My biggest Title',
    };
  },
});
</script>

<style lang="scss">
@import './styles/import-libs.scss';
</style>

<style scoped lang="scss">
* {
  font-size: 2rem;
}
</style>
