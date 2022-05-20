//TODO
<template>
  <h2>Import CSV</h2>
  <div>
    <p>Please choose related CSV-File</p>
    <input
      type="file"
      @change="fileWatcher"
      ref="dataInput"
      class="file-uploader"
    />
    <p v-if="fileReady">File ready to convert</p>
    <button v-if="fileReady" @click="sendToCSVParser">Start</button>
    <ul v-if="fieldsReady">
      <li v-for="field in fields" :key="field">
        <p>{{ field }}</p>
        <!-- <select name="cars" id="cars">
          <option value="" disabled selected>Select your option</option>
          <option
            v-for="appfield in appFields"
            :key="appfield"
            :value="appfield.key"
          >
            {{ appfield.displayName }}
          </option>
        </select> -->
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import { parseCSV } from "@/worker/parse-csv";
import { ITransferMapObject } from "@/interfaces/transfers/transfers-keys";

export default defineComponent({
  setup() {
    onMounted(async () => {
      console.log("Import CSV mounted !");
    });

    const dataInput = ref<HTMLInputElement | null>(null);
    const fileReady = ref<boolean>(false);

    const fieldsReady = ref<boolean>(false);
    const fields = ref<Array<string | never>>([]);

    // const appFields =
    //   reactive<Array<{ displayName: string; key: string }>>(BasicTransferField);

    const fileWatcher = (event: Event) => {
      const inputEvent = event.target as HTMLInputElement;
      if (inputEvent && inputEvent.files && inputEvent.files[0]) {
        fileReady.value = true;
      } else {
        fileReady.value = false;
      }
    };

    const sendToCSVParser = () => {
      if (dataInput.value !== null && dataInput.value.files) {
        if (dataInput.value.files.length !== 0) {
          parseCSV(
            dataInput.value.files[0],
            (convertedFields: Array<string>) => {
              fields.value = convertedFields;
              fieldsReady.value = true;
            }
          );
        }
      }
    };

    return {
      fileReady,
      fileWatcher,
      dataInput,
      sendToCSVParser,
      fieldsReady,
      fields,
      // appFields,
    };
  },
});
</script>

<style lang="scss"></style>
