<template>
  <div class="complex-container-wrapper">
    <p class="property-name">{{ property }}</p>

    <div class="complex-property-wrapper">
      <div v-if="isList">
        <span>{{ value._value }}</span>

        <div @click="loadMenu('TagMenu')">
          <i class="fa-solid fa-pen-to-square"></i>
        </div>
      </div>
      <div v-else-if="keyObject">
        TODO
        <!-- {{ Object.keys(value._value)[0].toString() }}
        <p
          v-for="(keyvalue, name) in Object.values(value._value)[0]"
          :key="keyvalue"
        >
          {{ name }} ({{ keyvalue }}%) :
          {{ ((keyvalue / 100) * entryValue).toFixed(2) }}€
        </p>
        <div @click="loadMenu('DistMenu')">
          <i class="fa-solid fa-pen-to-square"></i>
        </div> -->
      </div>
      <textarea
        class="property-textfield"
        v-else-if="textfield"
        v-model="boundValue"
      />
    </div>
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
    entryValue: {
      type: Number,
      required: true,
    },
    loadSubMenu: {
      type: Function as PropType<
        (menu: "TagMenu" | "DistMenu", context?: string) => void
      >,
      required: false,
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
      return (
        JSON.stringify(boundValue.value) !== JSON.stringify(props.value._value)
      );
    });

    const isList = computed(() => {
      return props.value._type === DataFieldType.TAGLIST;
    });

    const keyObject = computed(() => {
      return props.value._type === DataFieldType.KEYOBJECT;
    });

    const textfield = computed(() => {
      return props.value._type === DataFieldType.TEXTFIELD;
    });

    const commitChanges = (property: string) => {
      console.log("Property", property);
      console.log("Value", boundValue.value);
    };

    //Submenu
    const loadMenu = (menu: "TagMenu" | "DistMenu") => {
      const meta = {
        menu: menu,
        context: props.entryID,
      };
      if (props.loadSubMenu) {
        props.loadSubMenu(menu, props.entryID);
      }
    };

    return {
      boundValue,
      isList,
      keyObject,
      textfield,
      isDirty,
      commitChanges,
      loadMenu,
    };
  },
});
</script>

<style lang="scss">
@use "@/styles/placeholders.scss";
.complex-container-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .property-name {
    @extend %clean-padding-margin;
    width: 16%;
    padding: 0 0.6rem;
  }

  .complex-property-wrapper {
    @extend %clean-padding-margin;
    width: 74%;
    margin: 0 0.6rem;
    min-height: calc(3 * 21px);
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;

    .property-textfield {
      width: 100%;
      min-height: 3rem;
    }
  }

  .property-save_icon {
    width: 10%;
    text-align: center;
    &.--modified {
      color: red;
    }
  }

  //   .property-value {
  //     text-align: right;
  //   }
}
</style>
