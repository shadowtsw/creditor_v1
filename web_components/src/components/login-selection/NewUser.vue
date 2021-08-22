<template>
  <p>NewUser</p>
  <p>Und der Text</p>
  <p>{{ oldParams }}</p>
  <button type="button" @click="pushQuery">TEST</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  props: {
    oldParams: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    const pushQuery = () => {
      router.push({
        name: 'config',
        query: { ...props.oldParams, testit: 'true' },
      });
    };

    return {
      pushQuery,
    };
  },
});
</script>

<style lang="scss"></style>
