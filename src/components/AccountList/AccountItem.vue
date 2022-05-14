<template>
  <div class="account-card">
    <div class="account-card__short-name">
      <p v-if="account.shortName._value">{{ account.shortName._value }}</p>
      <p v-else>{{ account._ID._value }}</p>
    </div>
    <div class="account-card__details">
      <i class="details-icon fa-solid fa-circle-info"></i>
    </div>
    <div class="account-card__select">
      <input type="checkbox" class="select-box" v-model="isSelected" />
    </div>
    <div class="account-card__income">
      <i class="funds-change-icon fa-solid fa-arrow-down"></i>
      <p class="funds-change">1.000.000.000</p>
    </div>
    <div class="account-card__outgoing">
      <i class="funds-change-icon fa-solid fa-arrow-up"></i>
      <p class="funds-change">1.000.000.000</p>
    </div>
    <div class="account-card__funds">
      <p class="saldo-title">Saldo</p>
      <p class="saldo-value">1.000.000.000</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, PropType } from "vue";
import { IBasicAccountClass } from "@/interfaces/accounts/accounts";
import { AccountTransferStore } from "@/store/data/data-store";

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
    return { isSelected: isSelected };
  },
});
</script>

<style lang="scss">
@use "@/styles/placeholders.scss" as *;
@use "@/styles/variables.scss" as *;

.account-card {
  width: 90%;
  border: $default-border-style;
  margin-top: 0.6rem;
  margin-bottom: 0.6rem;
  min-height: 200px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  gap: 0px 0px;
  grid-auto-flow: row;
  grid-template-areas:
    "account-card__short-name account-card__short-name account-card__short-name account-card__short-name account-card__details account-card__select"
    "account-card__income account-card__income account-card__income account-card__outgoing account-card__outgoing account-card__outgoing"
    "account-card__income account-card__income account-card__income account-card__outgoing account-card__outgoing account-card__outgoing"
    "account-card__funds account-card__funds account-card__funds account-card__funds account-card__funds account-card__funds";
}

.account-card__short-name {
  grid-area: account-card__short-name;
  p {
    padding: 0;
    margin: 0;
  }
  padding: {
    left: 0.3rem;
    right: 0.3rem;
  }
  font-size: 1.1rem;
  align-self: center;
  justify-items: center;
}

.account-card__details {
  grid-area: account-card__details;
  @extend %flex-center-center;
  .details-icon {
    width: 1.6rem;
    height: 1.6rem;
    color: green;
    padding-left: 5px;
  }
}

.account-card__select {
  grid-area: account-card__select;
  @extend %flex-center-center;
  .select-box {
    width: 1.5rem;
    height: 1.5rem;
  }
}

.account-card__income {
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
  font-size: 1.15rem;
}

.account-card__outgoing {
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
  font-size: 1.15rem;
}

.account-card__funds {
  grid-area: account-card__funds;
  @extend %flex-default-center;
  justify-content: space-between;
  .saldo-title {
    padding: 0;
    margin: 0 0.3rem;
    font-size: 1.2rem;
  }
  .saldo-value {
    padding: 0;
    margin: 0 0.3rem;
    font-size: 1.2rem;
  }
}
</style>
