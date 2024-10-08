<template>
  <div class="q-pa-md">
    <div class="row q-gutter-x-sm justify-center">
      <q-input
        :ref="(el) => updateFieldRef(el, i - 1)"
        outlined
        v-for="i in length"
        v-model="fieldValues[i - 1]"
        :key="i"
        @keyup="onKeyUp($event, i - 1)"
        @update:model-value="onUpdate($event, i - 1)"
        maxlength="1"
        input-class="text-center"
        style="width: 6ch"
      >
      </q-input>
    </div>
    <div class="row q-gutter-x-sm justify-center">
      <q-btn
        class="q-mt-md"
        label="Reset PIN"
        color="negative"
        @click="onReset"
      />
    </div>
    <!-- fieldValues {{ fieldValues }} fields {{ fields }} -->
    <!-- <q-separator inset class="q-my-sm"></q-separator> -->

    <!-- <p>
      <span class="text-bold">Individual field values: </span>
      <span>{{ JSON.stringify(fieldValues) }}</span>
    </p>

    <p>
      <span class="text-bold">Composite value: </span>
      <span>{{ JSON.stringify(composite) }}</span>
    </p> -->
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUpdate } from "vue";

const props = defineProps({
  inputLength: {
    type: Number,
    default: 5,
  },
});
const emit = defineEmits(["update:modelValue", "onPinEntered"]);
// const length = 6;
const length = computed(() => props.inputLength);
const fields = ref([]);
const fieldValues = ref([]);

const composite = computed(() => {
  const nonNullFields = fieldValues.value.filter((value) => value);
  if (length.value !== nonNullFields.length) {
    return "";
  }
  return nonNullFields.join("");
});

watch(composite, () => {
  if (composite.value) {
    // You should emit this value, e.g.
    console.log("composite.value", composite.value);
    emit("update:modelValue", composite.value);
    console.log(composite.value);
    emit("onPinEntered", composite.value);
  }
});

// make sure to reset the refs before each update
onBeforeUpdate(() => {
  fields.value = [];
});
const onReset = () => {
  fieldValues.value = [];
  emit("update:modelValue", "");
  emit("onPinEntered", "");
};

const updateFieldRef = (element, index) => {
  if (element) {
    fields.value[index] = element;
  }
};

const focus = (index) => {
  if (index >= 0) {
    if (index < length.value) {
      fields.value[index].select();
    } else {
      if (composite.value) {
        fields.value[index - 1].blur();
      }
    }
  }
};

const onUpdate = (value, index) => {
  if (value) {
    focus(index + 1);
  }
};

const onKeyUp = (evnt, index) => {
  const key = evnt.key;

  if (["Tab", "Shift", "Meta", "Control", "Alt"].includes(key)) {
    return;
  }

  if (["Delete"].includes(key)) {
    return;
  }

  if (key === "ArrowLeft" || key === "Backspace") {
    focus(index - 1);
  } else if (key === "ArrowRight") {
    focus(index + 1);
  }
};
</script>
