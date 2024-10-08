<template>

  <div key="loadingBar" class="q-pa-md" v-if="showLoadingBar && isLoading">
    <q-linear-progress size="25px" :value="dataProgress" color="primary">
      <div class="absolute-full flex flex-center">
        <q-badge
          :color="dataProgress > 50.0 ? 'primary' : 'grey-5'"
          text-color="white"
          :label="progressLabel"
        />
      </div>
    </q-linear-progress>
  </div>

  <div class="text-negative" v-if="persistError && error">{{ error }}</div>
  <!-- </div> -->
</template>
<script setup>
import { ref, watchEffect, toRaw, onMounted, computed } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
// import { emit } from 'process';
const $q = useQuasar();
const dataProgress = ref(0.0);
const data = ref(null);
const error = ref(null);
const isLoading = ref(false);

const emit = defineEmits(["onDataFetched", "onDataError"]);

const props = defineProps({
  dataObject: { type: Object, required: false, default: null },
  // verb: { type: String, required: false, default: "GET" },
  // url: { type: String, required: false, default: null },
  // params: { type: Object, required: false, default: null },
  friendlyName: { type: String, required: false, default: "Data" },
  showLoadingBar: { type: Boolean, required: false, default: false },
  showOkMessage: { type: Boolean, required: false, default: false },
  persistError: { type: Boolean, required: false, default: true },
});

onMounted(() => {});

watchEffect(async () => {
  if (props.dataObject) {
    runDataCommand(props.dataObject);
  }
});

const progressLabel = computed(
  () => props.friendlyName + ": " + dataProgress.value.toFixed(2) + "%"
);

function runDataCommand(dataObject) {
  // reset state before fetching..
  data.value = null;
  error.value = null;
  isLoading.value = true;
  const p = toRaw(dataObject);
  // console.log("dataObject", p)
  if (p.url) {
    let url = p.url;
    console.log("url", url);

    const friendlyName = props.friendlyName ?? "";
    console.log("friendlyName", friendlyName);

    const params = p.params;
    console.log("params", params);

    const formData = p.formData;
    console.log("formData", formData);

    let verb = (p.verb ?? "GET").toUpperCase();
    console.log("verb", verb);

    //convert to FormData
    let fData = null;
    if (verb == "POST" || verb == "PATCH") fData = objectToFormData(formData);

    //Update to Patch if there is an ID
    // if (formData)    debugger;
    if (formData && formData.id > 0) {
      verb = "PATCH";
      url += formData.id + "/";
    }

    try {
      //GET
      if (verb.toLowerCase() == "get") {
        console.log(`GET: ${url} ${friendlyName}`, params);
        api
          .get(url, {
            params,
            onDownloadProgress: (progressEvent) => {
              const {
                loaded,
                total,
                progress,
                bytes,
                rate,
                estimated,
                download,
              } = progressEvent;
              const percentage = total
                ? Math.floor((loaded / total) * 100)
                : null;
              dataProgress.value = percentage;
              // console.log(`Download Progress: ${percentage}%`);
              // console.log(`Bytes downloaded since last event: ${bytes}`);
              // console.log(`Download rate: ${rate} bytes/second`);
              // console.log(`Estimated time remaining: ${estimated} seconds`);
            },
          })
          .then((response) => {
            console.log("GET successful");
            handleResponseData(friendlyName, response);
          })
          .catch((error) => {
            console.error("GET Failed:", error);
            handleResponseError(error);
          });
      }

      //POST
      if (verb.toLowerCase() == "post") {
        // response = api.post(url, fData);
        console.log(`POST: ${url} ${friendlyName}`, formData);
        api
          .post(url, formData, {
            onUploadProgress: (progressEvent) => {
              const {
                loaded,
                total,
                progress,
                bytes,
                rate,
                estimated,
                upload,
              } = progressEvent;
              const percentage = total
                ? Math.floor((loaded / total) * 100)
                : null;
              dataProgress.value = percentage;
              // console.log(`Upload Progress: ${percentage}%`);
              // console.log(`Bytes uploaded since last event: ${bytes}`);
              // console.log(`Upload rate: ${rate} bytes/second`);
              // console.log(`Estimated time remaining: ${estimated} seconds`);
            },
          })
          .then((response) => {
            console.log("POST successful");
            handleResponseData(friendlyName, response);
          })
          .catch((error) => {
            console.error("Error in POST:", error);
            handleResponseError(friendlyName, error);
          });
      }
      //PATCH
      if (verb.toLowerCase() == "patch") {
        console.log(`PATCH: ${url} ${friendlyName}`, formData);
        api
          .patch(url, formData, {
            onUploadProgress: (progressEvent) => {
              const {
                loaded,
                total,
                progress,
                bytes,
                rate,
                estimated,
                upload,
              } = progressEvent;
              const percentage = total
                ? Math.floor((loaded / total) * 100)
                : null;
              // console.log(`Upload Progress: ${percentage}%`);
              // console.log(`Bytes uploaded since last event: ${bytes}`);
              // console.log(`Upload rate: ${rate} bytes/second`);
              // console.log(`Estimated time remaining: ${estimated} seconds`);
            },
          })
          .then((response) => {
            console.log("PATCH successful");
            handleResponseData(friendlyName, response);
          })
          .catch((error) => {
            console.error("Error in PATCH:", error);
            handleResponseError(friendlyName, error);
          });
      }
    } catch (error) {
      handleResponseError(error);
    } finally {
    }
  }
}

function handleResponseData(friendlyName, response) {
  isLoading.value = false;
  data.value = response.data;

  emit("onDataFetched", response.data);

  if (!response.data) {
    $q.notify({
      color: "negative",
      message: friendlyName + ": No Data",
    });
    return;
  }
  if (Array.isArray(data) && response.data.length == 0) {
    $q.notify({
      color: "negative",
      message: friendlyName + ": No items",
    });
    return;
  }
  if (props.showOkMessage)
    $q.notify({
      color: "positive",
      message: friendlyName + ": Successful",
    });
}
function handleResponseError(friendlyName, err) {
  isLoading.value = false;
  console.error("Error in GET: " + friendlyName, err);
  error.value = err;
  $q.notify({
    color: "negative",
    message: friendlyName + " failed: " + err,
  });
  emit("onDataError", err);
}

function objectToFormData(obj) {
  if (obj == null)
    $q.notify({
      color: "negative",
      message: friendlyName + ": No data Object to post",
    });
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return formData;
}

defineExpose({
  runDataCommand,
});
</script>
