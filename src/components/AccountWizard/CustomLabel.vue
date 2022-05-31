<template>
  <div :class="['dev', { '--try-danger': !showInfo && error }]">
    <label :for="labelName">{{ label }}</label>
    <input
      type="text"
      :value="modelValue"
      @:input="$emit('update:modelValue', $event.target.value)"
      :name="labelName"
    />
    <span v-if="showInfo || !error">{{ infoText }}</span>
    <span v-else-if="!showInfo && error">{{ error }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: String,
      default: "",
      required: true,
    },
    showInfo: {
      type: Boolean,
      required: true,
    },
    error: {
      type: String,
      required: false,
      default: null,
    },
    labelName: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    infoText: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss"></style>
