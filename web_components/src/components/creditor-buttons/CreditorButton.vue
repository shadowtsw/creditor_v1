<template>
  <button
    :class="[
      'creditor-button',
      className,
      { 'active-link': active },
      textColorClass,
    ]"
  >
    <i></i>
    <span>{{ text }}</span>
  </button>
</template>

<script>
import { computed, defineComponent } from 'vue';

export default defineComponent({
  props: {
    type: {
      type: String,
      required: false,
      default: 'neutral',
    },
    active: {
      type: Boolean,
      required: false,
      default: false,
    },
    icon: {
      type: String,
      required: false,
    },
    text: {
      type: String,
      required: false,
    },
    textColor: {
      type: String,
      required: false,
      default: 'default',
    },
  },
  setup(props) {
    const className = computed(() => {
      return 'button-' + props.type;
    });
    const textColorClass = computed(() => {
      return 'button-text-color-' + props.textColor;
    });
    return { className, textColorClass };
  },
});
</script>

<style lang="scss" scoped>
@import '../../styles/creditor-fonts';
@import '../../styles/creditor-colors';
@import '../../styles/creditor-globals';

.creditor-button {
  font-family: $font-bai-family;
  border-radius: $b-border-radius;
  background-color: $b-background-color;
  color: $b-color;
  i,
  span {
    color: $b-color;
  }
}

.button-neutral {
  border: $b-border-size solid white;
  box-shadow: 0 0 $b-shadow-blur $b-shadow-spread $neutral-color;
  &:hover {
    color: $neutral-color;
    i,
    span {
      color: $neutral-color;
    }
    border: 2px solid $neutral-hover;
  }
  &:active {
    color: black;
    i,
    span {
      color: black;
    }
    background-color: $neutral-hover;
  }
}

.button-success {
  border: $b-border-size solid white;
  box-shadow: 0 0 $b-shadow-blur $b-shadow-spread $success-color;
  &:hover {
    color: $success-color;
    i,
    span {
      color: $success-color;
    }
    border: 2px solid $success-hover;
  }
  &:active {
    color: black;
    i,
    span {
      color: black;
    }
    background-color: $success-hover;
  }
}
.button-warning {
  border: $b-border-size solid white;
  box-shadow: 0 0 $b-shadow-blur $b-shadow-spread $warning-color;
  &:hover {
    color: $warning-color;
    i,
    span {
      color: $warning-color;
    }
    border: 2px solid $warning-hover;
  }
  &:active {
    color: black;
    i,
    span {
      color: black;
    }
    background-color: $warning-hover;
  }
}
.button-danger {
  border: $b-border-size solid white;
  box-shadow: 0 0 $b-shadow-blur $b-shadow-spread $danger-color;
  &:hover {
    color: $danger-color;
    i,
    span {
      color: $danger-color;
    }
    border: 2px solid $danger-hover;
  }
  &:active {
    color: black;
    i,
    span {
      color: black;
    }
    background-color: $danger-hover;
  }
}
.button-link {
  border: $b-border-size solid black;
  box-shadow: 0 0 $b-shadow-blur $b-shadow-spread transparent;
  &.active-link {
    background-color: black;
  }
  &:hover:not(.active-link) {
    box-shadow: 0 0 $b-shadow-blur $b-shadow-spread black;
  }
  &:active:focus {
    background-color: black;
  }
}

.button-text-color {
  &-white {
    &:hover {
      color: white;
      i,
      span {
        color: white;
      }
    }
    &:active {
      color: white;
      i,
      span {
        color: white;
      }
    }
  }
  &-black {
    &:hover {
      color: black;
      i,
      span {
        color: black;
      }
    }
    &:active {
      color: black;
      i,
      span {
        color: black;
      }
    }
  }
}
</style>
