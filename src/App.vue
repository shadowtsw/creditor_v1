<template>
  <transition name="fade-classic" mode="out-in">
    <Login v-if="!isLoggedIn" :login="login" />
    <MainApp theme="light" v-else />
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import { ApplicationEnvironment } from "./store/application/application";
import Login from "./views/Login.vue";
import MainApp from "./views/BasicApp/MainApp.vue";

//TODO
import { DBManager } from "./indexedDB/indexed-db-manager";
import { AccountTransferStore } from "./store/data/data-store";
import { usePageNavigator } from "./components/navigator";

console.log("DBManager", DBManager);

export default defineComponent({
  components: {
    Login,
    MainApp,
  },
  setup() {
    onMounted(async () => {
      //TODO
      console.info("App mounted");
      // await DBManager.initAppData();
    });
    const {
      activateCreateTransfers,
      hideCreateTransfers,
      activateTransferList,
      hideTransferList,
    } = usePageNavigator();

    //Watch accounts
    const accountsLength = computed(() => {
      return AccountTransferStore.allAccounts.length;
    });
    //Watch transfers
    const transfersLength = computed(() => {
      return AccountTransferStore.allTransfers.length;
    });
    watch(accountsLength, (newVal, oldVal) => {
      console.log("accountsLength", newVal, oldVal);
      if (newVal > 0) {
        activateCreateTransfers();
      } else {
        hideCreateTransfers();
      }
    });
    watch(transfersLength, (newVal, oldVal) => {
      console.log("transfersLength", newVal, oldVal);
      if (newVal > 0) {
        activateTransferList();
      } else {
        hideTransferList();
      }
    });
    //

    const isLoggedIn = ref<boolean>(false);

    const login = (arg: boolean) => {
      isLoggedIn.value = arg;
    };

    return { isLoggedIn, login };
  },
});
</script>

<style lang="scss">
/*
*Global transition classes
 */
.fade-classic-enter-active,
.fade-classic-leave-active {
  transition: opacity 0.2s ease;
}

.fade-classic-enter-from,
.fade-classic-leave-to {
  opacity: 0;
}
</style>
