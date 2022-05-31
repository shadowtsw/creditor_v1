<template>
  <div class="transfers_view">
    <TransfersToolbar />
    <div class="transfers_content">
      <div class="time_pagination">
        <div
          v-if="currentPage"
          class="pagination-year"
          v-for="(yearvalue, year) in pages"
          :key="year"
        >
          <p
            v-if="currentPage"
            :class="[
              'pagination-year__value',
              { '--is-active': Number(year) === currentPage.year },
            ]"
          >
            {{ year }}
          </p>
          <ul class="pagination-month__container">
            <li
              v-if="currentPage"
              :class="[
                'pagination-month__value',
                {
                  '--is-active':
                    Number(month) === currentPage?.month &&
                    Number(year) === currentPage?.year,
                },
              ]"
              v-for="(monthvalue, month) in yearvalue"
              :key="yearvalue.toString() + month"
              @click="changePage($event, year, month)"
            >
              {{ Number(month) + 1 }}
            </li>
          </ul>
        </div>
        <div v-else>Empty Transfers !</div>
      </div>
      <component
        v-if="loadedComponent"
        class="transfers_mainwindow"
        :is="loadedComponent.component"
        :key="loadedComponent.displayText"
        :loadSubMenu="loadSubMenu"
      />
      <div v-else>No Component loaded !</div>
    </div>
    <div v-if="showBackdrop" class="submenu__backdrop"></div>
    <div v-if="showBackdrop" class="submenu__window">
      <component
        :is="currentSubMenu"
        :key="currentSubMenu"
        :closeSubMenu="closeSubMenu"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  watch,
  onBeforeUnmount,
} from "vue";
import { importPlugins } from "../components/component-registration";
import { usePluginNavigator } from "../components/navigator";
import TransfersToolbar from "../components/Transfers/TransfersToolbar.vue";
import { AccountTransferStore } from "../store/data/data-store";

//Submenu
import DistMenu from "@/components/Transfers/SubMenu/DistMenu.vue";
import TagMenu from "@/components/Transfers/SubMenu/TagMenu.vue";

export default defineComponent({
  components: {
    TransfersToolbar,
    DistMenu,
    TagMenu,
    ...importPlugins(),
  },
  setup() {
    //PluginLoader
    const { currentPlugin, plugins, settings } = usePluginNavigator();
    const loadedComponent = computed(() => {
      let target;
      if (currentPlugin.value === "Settings") {
        target = settings.value;
      } else {
        target = plugins.value.find(
          (entry) => entry.displayText === currentPlugin.value
        );
      }
      if (target) {
        return target;
      } else {
        //Error Fallback
      }
    });

    //Pagination for transfers
    const pages = computed(() => {
      return AccountTransferStore.pagination;
    });
    const currentPage = computed(() => {
      return AccountTransferStore.currentPage;
    });
    const changePage = (
      event: Event,
      year: number | string,
      month: number | string
    ) => {
      AccountTransferStore.commitCurrentPage({
        year: Number(year),
        month: Number(month),
      });
    };

    //Submenu handler
    //TODO
    const currentSubMenu = ref<string | null>(null);
    const showBackdrop = ref<boolean>(false);
    watch(currentSubMenu, (newValue) => {
      if (newValue !== null) {
        showBackdrop.value = true;
      } else {
        showBackdrop.value = false;
      }
    });
    const loadSubMenu = (value: {
      menu: "TagMenu" | "DistMenu";
      context?: string;
    }) => {
      if (value) {
        currentSubMenu.value = value.menu;
      }
    };
    const closeSubMenu = () => {
      currentSubMenu.value = null;
    };

    return {
      loadedComponent,
      pages,
      currentPage,
      changePage,
      loadSubMenu,
      currentSubMenu,
      showBackdrop,
      closeSubMenu,
    };
  },
});
</script>
<style lang="scss">
.transfers_view {
  position: relative;
  height: 100%;
  // .transfers_toolbar {
  // }
  .transfers_content {
    height: calc(100% - 4.8rem - 2px);
    display: flex;

    .time_pagination {
      width: 10%;
      padding: 0 0.3rem;
      border-right: 2px solid white;
      height: 100%;
      overflow-y: auto;

      .pagination-year {
        .pagination-year__value {
          &.--is-active {
            color: green;
          }
        }

        .pagination-month__container {
          list-style: none;

          .pagination-month__value {
            &.--is-active {
              color: green;
            }
          }
        }
      }
    }

    .transfers_mainwindow {
      min-width: 80%;
      flex: 1;
      height: 100%;
    }
  }

  .submenu__backdrop {
    position: absolute;
    top: calc(4.8rem + 2px);
    left: 0;
    min-width: 100%;
    min-height: calc(100% - 4.8rem - 2px);
    background-color: rgba(214, 33, 33, 0.171);
  }

  .submenu__window {
    position: absolute;
    top: calc(4.8rem + 2px);
    right: 0;
    min-width: 25%;
    min-height: calc(100% - 4.8rem - 2px);
    border-left: 2px solid white;
    // background-color: blue;
  }
}
</style>
