<template>
  <div class="list-entry__details">
    <div
      v-for="[property, value] in simpleTransferProperties"
      :key="value._value"
      class="list-entry__property-container"
    >
      <SimpleTransferProperty
        :property="property"
        :value="value"
        :entryID="entry._internalID._value"
      />
    </div>
    <div
      v-for="[property, value] in complexTransferProperties"
      :key="value._value"
      class="list-entry__complex-property-container"
    >
      <ComplexTransferProperty
        :property="property"
        :value="value"
        :entryValue="entryValue"
        :loadSubMenu="loadSubMenu"
        :entryID="entry._internalID._value"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType } from "vue";
import { IBasicTransferClass } from "@/interfaces/transfers/transfers";
import SimpleTransferProperty from "./SimpleTransferProperty.vue";
import ComplexTransferProperty from "./ComplexTransferProperty.vue";
import { DataFieldType } from "@/interfaces/data-field/data-field-interface";

export default defineComponent({
  components: {
    SimpleTransferProperty,
    ComplexTransferProperty,
  },
  props: {
    entry: {
      type: Object as PropType<IBasicTransferClass>,
      required: true,
    },
    loadSubMenu: {
      type: Function as PropType<
        (menu: "TagMenu" | "DistMenu", context?: string) => void
      >,
      required: false,
    },
  },
  setup(props) {
    const filteredProperties = computed(() => {
      const array = Object.entries(props.entry);
      return array.filter((entries) => {
        return entries[1]._visible === true;
      });
    });

    const simpleTransferProperties = computed(() => {
      return filteredProperties.value.filter((entry) => {
        return (
          entry[1]._type !== DataFieldType.TAGLIST &&
          entry[1]._type !== DataFieldType.KEYOBJECT &&
          entry[1]._type !== DataFieldType.TEXTFIELD
        );
      });
    });

    const complexTransferProperties = computed(() => {
      return filteredProperties.value.filter((entry) => {
        return (
          entry[1]._type === DataFieldType.TAGLIST ||
          entry[1]._type === DataFieldType.KEYOBJECT ||
          entry[1]._type === DataFieldType.TEXTFIELD
        );
      });
    });

    const entryValue = computed(() => {
      return props.entry.value._value;
    });

    return {
      simpleTransferProperties,
      complexTransferProperties,
      entryValue,
    };
  },
});
</script>

<style lang="scss">
@use "@/styles/placeholders.scss";

.list-entry__details {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  font-size: 0.8rem;
  .list-entry__property-container {
    box-sizing: border-box;
    width: calc(50% - 1px - 0.6rem);
    margin: 0.3rem;
    @extend %small-border;
    border-color: var(--outer-background);
    @extend %small-border-radius;
    height: 29px;
    > * {
      height: 100%;
    }
    // .container-wrapper {
    //   display: flex;
    //   justify-content: flex-start;
    //   align-items: center;
    //   .property-name {
    //     @extend %clean-padding-margin;
    //     width: 35%;
    //     padding: 0 0.6rem;
    //   }
    //   .property-value {
    //     @extend %clean-padding-margin;
    //     width: 45%;
    //     margin: 0 0.6rem;
    //     text-align: right;
    //   }
    //   .property-save_icon {
    //     width: 20%;
    //     text-align: center;
    //   }
    // }
  }
  .list-entry__complex-property-container {
    width: calc(100% - 1px - 0.6rem);
    box-sizing: border-box;
    margin: 0.3rem;
    @extend %small-border;
    border-color: var(--outer-background);
    @extend %small-border-radius;
    > * {
      height: 100%;
    }
    // .container-wrapper {
    //   display: flex;
    //   justify-content: flex-start;
    //   align-items: center;
    //   .property-name {
    //     @extend %clean-padding-margin;
    //     width: 35%;
    //     padding: 0 0.6rem;
    //   }
    //   .property-value {
    //     @extend %clean-padding-margin;
    //     width: 45%;
    //     margin: 0 0.6rem;
    //     text-align: right;
    //   }
    //   .property-save_icon {
    //     width: 20%;
    //     text-align: center;
    //   }
    // }
  }
  input,
  input:active,
  input:focus {
    border: none;
    outline: none;
    border: 1px solid transparent;
  }
  input:focus {
    border: 1px solid var(--info-color);
  }
}
</style>
