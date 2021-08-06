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
    <creditor-button text="Neutral" />
    <creditor-button text="Neutral" textColor="white" />
    <creditor-button text="Success" type="success" />
    <creditor-button text="Success" type="success" textColor="white" />
    <creditor-button text="Warning" type="warning" />
    <creditor-button text="Warning" type="warning" textColor="white" />
    <creditor-button text="Danger" type="danger" />
    <creditor-button text="Danger" type="danger" textColor="white" />
    <creditor-button text="Link" type="link" />
    <creditor-button
      text="Link-Active"
      type="link"
      textColor="white"
      :active="true"
    />
    <creditor-button text="Link" type="link" textColor="white" />
    <creditor-button
      text="Link-Active"
      type="link"
      textColor="white"
      :active="true"
    />
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
    <p>{{ t('message.language') }}</p>
    <p>{{ locale }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CreditorButton from './components/creditor-buttons/CreditorButton.vue';
import { translate } from './multilanguage';

export default defineComponent({
  components: { CreditorButton },
  setup(props, context) {
    const { t, locale } = translate();
    return {
      t,
      locale,
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
