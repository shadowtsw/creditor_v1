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
} from "vue";
import TransferLine from "./ListPlugin/TransferLine.vue";
import { AccountTransferStore } from "@/store/data/data-store";

import { DBManager } from "@/indexedDB/indexed-db-manager";

export default defineComponent({
  components: {
    TransferLine,
  },
  props: {
    loadSubMenu: {
      type: Function,
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

    console.log("transfers", transfers.value);

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
  //   width: 100%;
  //   height: 100%;
  list-style: none;
  .list-container {
    height: 100%;
    overflow-y: auto;
    padding: 0;
    margin: 0;
    .list-entry {
      .list-entry__line {
        @extend %flex-default-center;
        justify-content: flex-start;
        height: 3rem;
        border-bottom: 1px solid red;
        .line__show-details {
          width: 1.5rem;
          color: white;
          &.--active {
            > * {
              color: yellow;
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
        border-bottom: 1px solid red;
      }
    }
  }
}
</style>
