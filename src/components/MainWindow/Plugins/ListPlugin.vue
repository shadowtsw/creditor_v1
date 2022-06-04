<template>
  <div class="list-plugin-container">
    <ul v-if="transfers.length > 0" class="list-container">
      <TransferLine
        v-for="entry in transfers"
        :entry="entry"
        :key="entry._internalID._value"
        :loadSubMenu="loadSubMenu"
      />
    </ul>
    <div v-else>EMPTY</div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  watch,
  computed,
  onMounted,
  PropType,
} from "vue";
import TransferLine from "./ListPlugin/TransferLine.vue";
import { AccountTransferStore } from "@/store/account-transfer/account-transfer-store";

export default defineComponent({
  components: {
    TransferLine,
  },
  props: {
    loadSubMenu: {
      type: Function as PropType<
        (menu: "TagMenu" | "DistMenu", context?: string) => void
      >,
      required: false,
    },
  },
  setup(props) {
    onMounted(async () => {
      //TODO
      console.info("List-Plugin mounted");
    });
    const transfers = computed(
      () => AccountTransferStore.transfersFromActiveAccounts
    );

    return {
      transfers,
    };
  },
});
</script>

<style lang="scss">
@use "@/styles/placeholders.scss" as *;
@use "@/styles/variables.scss" as *;

.list-plugin-container {
  list-style: none;
  color: var(--text-color);

  .list-container {
    height: 100%;
    overflow-y: auto;
    padding: 0;
    margin: 0;
    .list-entry {
      list-style: none;
      width: 96%;
      margin: 0.3rem auto;
      // &:first-child {
      //   margin-top: 0.3rem;
      // }
      @extend %box-shadow-top-bottom;
      @extend %box-shadow-left-right;
      @extend %small-border-radius;

      &:hover {
        @extend %box-shadow-top-bottom-blue;
        @extend %box-shadow-left-right-blue;
        @extend %highlight-background;
      }

      &.--active {
        @extend %small-border;
      }

      .list-entry__line {
        @extend %flex-default-center;
        justify-content: flex-start;
        height: 3rem;
        &.--active {
          @extend %default-border-bottom;
        }
        .line__show-details {
          width: 1.5rem;
          color: var(--text-color);
          &.--active {
            > * {
              color: var(--info-color);
            }
          }
        }
        .line__selected {
          width: 1.5rem;
        }
        .line__short-name {
          flex: 3;
          @extend %clip-text;
        }
        .line__purpose {
          flex: 5;
          @extend %clip-text;
        }
        .line__value {
          flex: 4;
        }
        .line__search-filter {
          flex: 2;
          @extend %clip-text;
        }
      }
      .list-entry__details {
        @extend %highlight-background;
      }
    }
  }
}
</style>
