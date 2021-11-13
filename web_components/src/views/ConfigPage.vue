<template>
  <div class="welcome-main__container">
    <!-- Topic part of welcome -->
    <h1 class="welcome-topic">creditor v1</h1>
    <h3 class="welcome-text" variant="chakra">
      {{ t("welcome.text_row1") }}
    </h3>
    <h4 class="welcome-text" variant="chakra">
      {{ t("welcome.text_row2") }}
    </h4>
    <!-- Left selection part -->
    <div class="login-selection__container">
      <div
        :class="[
          'login-selection',
          { 'selection--active': selectionChoice === newUserComponent },
        ]"
      >
        <input
          id="new-user"
          type="radio"
          class="login-selection__choice"
          name="login-choice"
          :value="newUserComponent"
          v-model="selectionChoice"
        />
        <label variant="chakra" class="login-selection__label" for="new-user">{{
          t("welcome.selection_choice1.label")
        }}</label>
        <p variant="mukta" class="selection-info-text">
          {{ t("welcome.selection_choice1.info_text") }}
        </p>
      </div>
      <div
        :class="[
          'login-selection',
          { 'selection--active': selectionChoice === existingUserComponent },
        ]"
      >
        <input
          id="existing-user"
          type="radio"
          class="login-selection__choice"
          name="login-choice"
          :value="existingUserComponent"
          v-model="selectionChoice"
        />
        <label
          variant="chakra"
          class="login-selection__label"
          for="existing-user"
          >{{ t("welcome.selection_choice2.label") }}</label
        >
        <p variant="mukta" class="selection-info-text">
          {{ t("welcome.selection_choice2.info_text") }}
        </p>
      </div>
    </div>
    <!-- Result of selection shown on rigth side -->
    <div class="login-credentials__container">
      <component
        :is="currentComponent"
        :oldParams="{ loadedModule: $route.query.loadedModule }"
      ></component>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  defineAsyncComponent,
  watch,
  ref,
  onMounted,
  computed,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import useComponentValidator, {
  ValidComponents,
} from "../helpers/components-validator";
import { ValidRoutes } from "../helpers/route-validator";
import { translate } from "../multilanguage";

export default defineComponent({
  setup() {
    const { t, locale } = translate();
    const selectionChoice = ref("");
    const route = useRoute();
    const router = useRouter();
    const { validateComponentName } = useComponentValidator();

    onMounted(() => {
      if (route.query.loadedModule && selectionChoice.value === "") {
        selectionChoice.value = route.query.loadedModule as string;
      }
    });

    watch(selectionChoice, (newVal) => {
      if (validateComponentName(newVal as ValidComponents)) {
        router.push({
          name: ValidRoutes.CONFIG_PAGE,
          query: { loadedModule: newVal },
        });
      } else {
        router.push({
          name: ValidRoutes.CONFIG_PAGE,
        });
      }
    });

    const currentComponent = computed(() => {
      if (
        route.query.loadedModule &&
        validateComponentName(route.query.loadedModule as ValidComponents)
      ) {
        return defineAsyncComponent(
          () =>
            import(
              `@/components/login-selection/${route.query.loadedModule}.vue`
            )
        );
      } else {
        return defineAsyncComponent(
          () => import(`../components/welcome-box/WelcomeBox.vue`)
        );
      }
    });

    const newUserComponent = computed(() => {
      return ValidComponents.NEW_USER;
    });

    const existingUserComponent = computed(() => {
      return ValidComponents.EXISTING_USER;
    });

    return {
      t,
      selectionChoice,
      currentComponent,
      newUserComponent,
      existingUserComponent,
    };
  },
});
</script>

<style lang="scss">
// @import './styles/import-libs.scss';

.welcome-main__container {
  margin: 20vh auto;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  width: 70vh;
  min-width: 15rem;
  height: 50vh;
  min-height: 15rem;

  .welcome-text,
  .welcome-topic {
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .welcome-topic {
    margin-bottom: 1rem;
  }

  .login-selection__container,
  .login-credentials__container {
    width: 42%;
    padding: 1rem;
    margin-top: 2rem;
  }

  .login-selection__container {
    border-right: 1px solid black;
    display: flex;
    flex-flow: column;
    justify-content: space-around;
    align-items: flex-start;

    .login-selection {
      width: 100%;

      .login-selection__choice {
        margin: 0;
        padding: 0;
        width: 10%;
      }

      .login-selection__label {
        margin: 0;
        padding: 0;
        width: 90%;
        margin-left: 0.8rem;
      }

      .selection-info-text {
        margin: 0;
        padding: 0.8rem;
        padding-left: 3rem;
        font-size: 0.8rem;
      }
    }
  }

  .login-credentials__container {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: flex-end;
  }
}
</style>
