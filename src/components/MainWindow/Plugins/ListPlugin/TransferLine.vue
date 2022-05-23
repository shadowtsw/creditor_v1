<template>
  <li class="list-entry" :class="[{ '--active': showDetails }]">
    <div class="list-entry__line" :class="[{ '--active': showDetails }]">
      <div
        class="line__show-details"
        @click="toggleDetails"
        :class="[{ '--active': showDetails }]"
      >
        <i
          class="fa-solid fa-arrow-down-wide-short"
          :class="[{ '--active': showDetails }]"
        ></i>
      </div>
      <input type="checkbox" class="line__selected" v-model="selectTransfer" />
      <p class="line__short-name" ref="">{{ entry.shortName._value }}</p>
      <p class="line__purpose" ref="">line__purpose</p>
      <p class="line__value" ref="">line__value</p>
      <p class="line__search-filter" ref="">line__search-filter</p>
    </div>
    <TransferLineDetails
      v-if="showDetails"
      :entry="entry"
      :loadSubMenu="loadSubMenu"
    />
    <!-- <div v-show="showDetails" class="list-entry__details">
      <p class="">Something</p>
      <p class="">Something</p>
      <p class="">Something</p>
      <p class="">Something</p>
      <p class="">Something</p>
      <p class="">Something</p>
      <p class="">Something</p>
    </div> -->
  </li>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from "vue";
import TransferLineDetails from "./TransferLineDetails.vue";
import { IBasicTransferClass } from "@/interfaces/transfers/transfers";
import { AccountTransferStore } from "@/store/data/data-store";

export default defineComponent({
  components: {
    TransferLineDetails,
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
    const selectTransfer = computed({
      get() {
        return props.entry.isSelected._value;
      },
      set() {
        AccountTransferStore.commitTransferSelected({
          transferId: props.entry._internalID._value,
          selected: !props.entry.isSelected._value,
        });
      },
    });
    const showDetails = computed(() => {
      return AccountTransferStore.isOpened.includes(
        props.entry._internalID._value
      );
    });

    const toggleDetails = () => {
      AccountTransferStore.commitTransferOpenState(
        props.entry._internalID._value
      );
    };

    return {
      showDetails,
      toggleDetails,
      selectTransfer,
    };
  },
});
</script>
<style lang="scss">
.list-entry__line {
  padding: 0 0.3rem;
}
</style>
