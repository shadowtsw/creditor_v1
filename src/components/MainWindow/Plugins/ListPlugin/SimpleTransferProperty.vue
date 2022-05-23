<template>
  <div class="simple-container-wrapper">
    <p class="property-name">{{ property }}</p>

    <input
      v-if="isInputField"
      class="property-value"
      type="text"
      v-model="boundValue"
    />
    <input
      v-else-if="isCheckbox"
      class="property-value"
      type="checkbox"
      v-model="boundValue"
    />
    <p v-else-if="isDate" class="property-value">
      {{ new Date(value._value).toLocaleString().split(",")[0] }}
    </p>
    <p v-else class="property-value">{{ value._value }}</p>

    <div
      v-if="!value._readonly"
      :class="['property-save_icon', { '--modified': isDirty }]"
      @click="commitChanges(property)"
    >
      <i :class="['property-save_icon', 'fa-solid', 'fa-floppy-disk']"></i>
    </div>

    <div v-else class="property-save_icon">
      <i :class="['property-save_icon', 'fa-solid', 'fa-lock']"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, PropType, ref } from "vue";
import {
  BasicDataField,
  DataFieldType,
} from "@/interfaces/data-field/data-field-interface";

export default defineComponent({
  props: {
    property: {
      type: String,
      required: true,
    },
    value: {
      type: Object as PropType<BasicDataField & { _value: any }>,
      required: true,
    },
    entryID: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const boundValue = ref<null | any>(null);

    onMounted(() => {
      boundValue.value = props.value._value;
    });

    const isDirty = computed(() => {
      return boundValue.value !== props.value._value;
    });

    const isInputField = computed(() => {
      return (
        (props.value._type === DataFieldType.STRING ||
          props.value._type === DataFieldType.NUMBER) &&
        !props.value._readonly
      );
    });

    const isCheckbox = computed(() => {
      return props.value._type === DataFieldType.CHECKBOX;
    });

    const isDate = computed(() => {
      return props.value._type === DataFieldType.DATE;
    });

    const commitChanges = (property: string) => {
      console.log("Property", property);
      console.log("Value", boundValue.value);
    };

    return {
      boundValue,
      isInputField,
      isCheckbox,
      commitChanges,
      isDirty,
      isDate,
    };
  },
});
</script>

<style lang="scss">
@use "@/styles/placeholders.scss";
.simple-container-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .property-name {
    @extend %clean-padding-margin;
    width: 35%;
    padding: 0 0.6rem;
  }
  .property-value {
    @extend %clean-padding-margin;
    width: 45%;
    margin: 0 0.6rem;
    text-align: right;
  }
  .property-save_icon {
    width: 20%;
    text-align: center;
    &.--modified {
      color: red;
    }
  }
}
</style>
