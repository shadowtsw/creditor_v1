<template>
  <div class="account-card">
    <div class="account-card__short-name">
      <p v-if="account.shortName._value">{{ account.shortName._value }}</p>
      <p v-else>{{ account._internalID._value }}</p>
    </div>
    <div class="account-card__util">
      <div class="account-card__details">
        <p class="details__hint">details</p>
        <i class="details-icon fa-solid fa-circle-info"></i>
      </div>
      <div class="account-card__select">
        <label class="select__hint" for="transfers-selected"
          >show transfers</label
        >
        <input
          type="checkbox"
          class="select-box"
          name="transfers-selected"
          v-model="isSelected"
        />
      </div>
    </div>

    <transition name="fade-classic" mode="out-in">
      <div v-if="!showLastMonth" class="in-out__wrapper">
        <div class="account-card__income">
          <i class="funds-change-icon fa-solid fa-arrow-down"></i>
          <p class="funds-change">
            {{ incomeCurrent }}{{ account.currency._value }}
          </p>
        </div>
        <div class="account-card__outgoing">
          <i class="funds-change-icon fa-solid fa-arrow-up"></i>
          <p class="funds-change">
            {{ outgoingCurrent }}{{ account.currency._value }}
          </p>
        </div>
      </div>

      <div v-else class="in-out__wrapper">
        <div class="account-card__income">
          <i class="funds-change-icon fa-solid fa-arrow-down"></i>
          <p class="funds-change">
            {{ incomeLast }}{{ account.currency._value }}
          </p>
        </div>
        <div class="account-card__outgoing">
          <i class="funds-change-icon fa-solid fa-arrow-up"></i>
          <p class="funds-change">
            {{ outgoingLast }}{{ account.currency._value }}
          </p>
        </div>
      </div>
    </transition>

    <transition name="fade-classic" mode="out-in">
      <div
        v-if="!showLastMonth"
        class="account-card__funds"
        @click="toggleSaldoView"
        title="Click to switch to last month"
      >
        <p class="saldo-title">Saldo</p>
        <p class="saldo-value">
          {{ currentBalance }}{{ account.currency._value }}
        </p>
      </div>
      <div
        title="Click to switch to last month"
        v-else
        class="account-card__funds"
        @click="toggleSaldoView"
      >
        <p class="saldo-title --small">Last Month</p>
        <p class="saldo-value">9.000.000.000</p>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, PropType, ref } from "vue";
import { IBasicAccountClass } from "@/interfaces/accounts/accounts";
import { AccountTransferStore } from "@/store/data/data-store";
import { IBasicTransferClass } from "@/interfaces/transfers/transfers";

export default defineComponent({
  props: {
    account: {
      type: Object as PropType<IBasicAccountClass>,
      required: true,
    },
  },
  setup(props) {
    const isSelected = computed({
      get: () => props.account.isSelected._value,
      set: (value) => {
        AccountTransferStore.commitAccountSelected({
          accountID: props.account._internalID._value,
          selected: value,
        });
      },
    });

    const showLastMonth = ref<boolean>(false);

    const toggleSaldoView = () => {
      showLastMonth.value = !showLastMonth.value;
    };

    const accountTransfers = computed(
      (): Array<IBasicTransferClass | never> => {
        const ownTransfers: Array<IBasicTransferClass | never> = [];
        props.account.transfers._value.forEach((entry) => {
          if (typeof entry === "string") {
            ownTransfers.push(AccountTransferStore.transfersAsObject[entry]);
          }
        });
        return ownTransfers;
      }
    );

    const currentMonthTransfers = computed(() => {
      const date = new Date();
      const currentMonth = date.getMonth();
      const relatedYear = date.getFullYear();

      const filteredTransfers: Array<IBasicTransferClass | never> = [];
      accountTransfers.value.forEach((entry) => {
        if (
          entry.valutaDate._dateMetaInformation.month === currentMonth &&
          entry.valutaDate._dateMetaInformation.year === relatedYear
        ) {
          filteredTransfers.push(entry);
        }
      });
      return filteredTransfers;
    });

    const lastMonthTransfers = computed(() => {
      const date = new Date();
      const currentMonth = date.getMonth();
      date.setMonth(currentMonth - 1);
      const lastMonth = date.getMonth();
      const relatedYear = date.getFullYear();

      const filteredTransfers: Array<IBasicTransferClass | never> = [];
      accountTransfers.value.forEach((entry) => {
        if (
          entry.valutaDate._dateMetaInformation.month === lastMonth &&
          entry.valutaDate._dateMetaInformation.year === relatedYear
        ) {
          filteredTransfers.push(entry);
        }
      });
      return filteredTransfers;
    });

    const incomeCurrent = computed(() => {
      return currentMonthTransfers.value.reduce((acc, curr) => {
        if (curr.value._value >= 0) {
          return acc + curr.value._value;
        } else {
          return acc;
        }
      }, 0);
    });

    const incomeLast = computed(() => {
      return lastMonthTransfers.value.reduce((acc, curr) => {
        if (curr.value._value >= 0) {
          return acc + curr.value._value;
        } else {
          return acc;
        }
      }, 0);
    });

    const outgoingCurrent = computed(() => {
      return currentMonthTransfers.value.reduce((acc, curr) => {
        if (curr.value._value < 0) {
          return acc + curr.value._value;
        } else {
          return acc;
        }
      }, 0);
    });

    const outgoingLast = computed(() => {
      return lastMonthTransfers.value.reduce((acc, curr) => {
        if (curr.value._value < 0) {
          return acc + curr.value._value;
        } else {
          return acc;
        }
      }, 0);
    });

    const currentBalance = computed(() => {
      //Get current date
      const date = new Date();
      // const currentMonth = date.getMonth();
      // date.setMonth(currentMonth - 1);
      // date.setDate(1);
      const relatedTime = date.getTime();

      return accountTransfers.value.reduce((acc, curr) => {
        if (curr.valutaDate._value < relatedTime) {
          return acc + curr.value._value;
        } else {
          return acc;
        }
      }, props.account.openingBalance._value);
    });

    return {
      isSelected: isSelected,
      showLastMonth,
      toggleSaldoView,
      accountTransfers,
      incomeCurrent,
      incomeLast,
      outgoingLast,
      outgoingCurrent,
      currentBalance,
    };
  },
});
</script>

<style lang="scss">
@use "@/styles/placeholders.scss" as *;
@use "@/styles/variables.scss" as *;

.account-card {
  width: 90%;

  border: 3px solid var(--text-color);
  @extend %default-border-radius;

  margin-top: 0.6rem;
  margin-bottom: 0.6rem;

  min-height: 200px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "account-card__short-name account-card__short-name account-card__short-name account-card__short-name account-card__short-name account-card__short-name"
    "account-card__util account-card__util account-card__util account-card__util account-card__util account-card__util"
    "in-out__wrapper in-out__wrapper in-out__wrapper in-out__wrapper in-out__wrapper in-out__wrapper"
    "in-out__wrapper in-out__wrapper in-out__wrapper in-out__wrapper in-out__wrapper in-out__wrapper"
    "account-card__funds account-card__funds account-card__funds account-card__funds account-card__funds account-card__funds";
}

.account-card__short-name {
  grid-area: account-card__short-name;
  padding: 0 $defaultPaddingSize;
  font-size: 1.2rem;
  font-weight: bold;

  align-self: center;
  justify-items: center;
  // display: flex;

  p {
    padding: 0;
    margin: 0;
    border-bottom: 1px solid var(--text-color);
  }
}

.account-card__util {
  grid-area: account-card__util;
  @extend %flex-center-center;
  justify-content: space-around;
  margin: 0 $defaultPaddingSize;
  border-bottom: 1px solid var(--text-color);
  .account-card__details {
    grid-area: account-card__details;
    display: flex;
    flex-direction: column;
    align-items: center;
    .details__hint {
      font-size: 0.8rem;
      font-weight: bold;
      @extend %clean-padding-margin;
    }
    .details-icon {
      // height: 60%;
      height: 1.7rem;
      width: 1rem;
      @extend %creditor-action;
    }
  }

  .account-card__select {
    grid-area: account-card__select;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    .select__hint {
      font-size: 0.8rem;
      font-weight: bold;
      @extend %clean-padding-margin;
    }
    .select-box {
      height: 1.7rem;
      width: 1rem;
      cursor: pointer;
      @extend %clean-padding-margin;
    }
  }
}

.in-out__wrapper {
  grid-area: in-out__wrapper;
  display: flex;
  // padding: $defaultPaddingSize 0;
  align-items: center;
  justify-content: space-around;

  .account-card__income {
    box-shadow: 0 0 15px 10px var(--success-background) inset;
    color: var(--success-text);
    @extend %default-border-radius;
    padding: $defaultPaddingSize;
    // flex: 1;
    width: 45%;
    grid-area: account-card__income;
    @extend %flex-center-center;
    flex-direction: column;
    .funds-change-icon {
      font-size: 1.9rem;
    }
    .funds-change {
      padding: 0;
      margin: 0;
    }
    font-size: 0.85rem;
  }
  .account-card__outgoing {
    box-shadow: 0 0 15px 10px var(--danger-background) inset;
    color: var(--danger-text);
    @extend %default-border-radius;
    padding: $defaultPaddingSize;
    width: 45%;
    // flex: 1;
    grid-area: account-card__outgoing;
    @extend %flex-center-center;
    flex-direction: column;
    .funds-change-icon {
      font-size: 1.9rem;
    }
    .funds-change {
      padding: 0;
      margin: 0;
    }
    font-size: 0.85rem;
  }
}

.account-card__funds {
  grid-area: account-card__funds;
  @extend %flex-default-center;
  justify-content: space-between;
  border-top: 1px solid var(--text-color);
  margin: 0 $defaultMarginSize;
  .saldo-title {
    padding: 0;
    margin: 0 0.3rem;
    font-size: 1.2rem;
    &.--small {
      font-size: 1rem;
    }
    &:hover {
      cursor: pointer;
    }
  }
  .saldo-value {
    padding: 0;
    margin: 0 0.3rem;
    font-size: 1.2rem;
    &:hover {
      cursor: pointer;
    }
  }
}
</style>
