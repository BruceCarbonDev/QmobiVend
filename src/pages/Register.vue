<template>
  <q-page>
    <div class="q-pa-sm q-mt-md text-h4 text-secondary text-bold">Register</div>

    <div class="q-pa-md">
      <div class="text-h6">{{ statusMessage }}</div>
      <br />
      <i>{{ statusFooter }}</i>
    </div>
    <!-- User Validation -->
    <dataObject
      friendlyName="User Info Validation"
      :data-object="doValidateUser"
      @onDataFetched="onUserValidated"
      :show-ok-message="true"
    />
    <!-- PIN Initiation -->
    <dataObject
      friendlyName="PIN Initiation"
      :data-object="doInitiatePIN"
      @onDataFetched="onPINInitiated"
      :show-ok-message="true"
    />
    <!-- PIN Validation -->
    <dataObject
      friendlyName="PIN Validation"
      :data-object="doValidatePIN"
      @onDataFetched="onPINValidated"
      :show-ok-message="true"
    />
    <!-- model: {{ model }}<br />
    validatedUser: {{ validatedUser }} -->

    <div class="row justify-center" v-if="showPinEntry">
      <!-- Pin Entry -->
      <!-- pin {{ pin }} -->
      <pin-entry v-model="pin" @onPinEntered="onPinEntered" />
    </div>
    <div class="row justify-center" v-if="showPinEntry">
      <q-btn
        :disable="!showReinitiate"
        :label="'Re-send me a PIN to ' + currentMode"
        :color="showReinitiate ? 'primary' : 'grey-5'"
        @click="onPinInitiate"
      />
    </div>
    <q-form @submit="onSubmit" class="q-gutter-md q-pa-md">
      <div class="row q-pa-md q-col-gutter-md">
        <template v-if="!validatedUser">
          <!-- User Name -->
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="model.userName"
              label="Please enter your name"
              :readonly="model.id > 0"
              :rules="[(val) => !!val || 'User Name is required']"
            />
          </div>

          <!-- Email -->
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="model.email"
              label="My Email Address"
              type="email"
              :rules="[
                (val) => !!val || 'Email is required',
                (val) => isValidEmail(val) || 'Must be a valid email.',
              ]"
            />
          </div>

          <!-- Repeat Email -->
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-if="isValidEmail(model.email)"
              v-model="email2"
              label="Repeat Email Please"
              hide-hint="Just to make we got it right!"
              type="email"
              :rules="[
                (val) => !!val || 'Email is required',
                (val) => isValidEmail(val) || 'Must be a valid email.',
              ]"
              @blur="onUserValidate(model.email, null)"
            />
          </div>

          <!-- Mobile Number -->
          <div class="col-xs-12 col-sm-6">
            <q-input
              v-model="model.mobile"
              v-if="isValidPart1"
              type="tel"
              label="Mobile Number"
              :rules="[(val) => !!val || 'Mobile Number is required']"
              mask="(###)###-####"
              fill-mask
            />
          </div>

          <!-- Register Button -->
          <div class="col-xs-12 col-sm-6" v-if="!validatedUser">
            <q-btn
              v-if="isValidPart1"
              label="Register"
              type="submit"
              color="primary"
            />
          </div>
        </template>
        <div class="col-xs-12 col-sm-6" v-if="validatedUser">
          <q-card flat bordered>
            <q-card-section>
              <div class="text-positive text-h6">Match Found</div>
              <div class="text-subtitle2 text-secondary">
                We found a user with these details:
              </div>

              <div><b>User Name:</b> {{ validatedUser.userName }}</div>
              <div><b>Email:</b> {{ validatedUser.email }}</div>
              <div><b>Mobile Number:</b> {{ validatedUser.mobile }}</div>
            </q-card-section>

            <q-separator dark />

            <q-card-actions align="around">
              <q-btn outline icon="close" class="text-negative" @click="onReset"
                >Reset</q-btn
              >

              <q-btn
                outline
                icon="check"
                class="text-positive"
                @click="onPinInitiate(validatedUser.email, null)"
                >&nbsp;This is me</q-btn
              >
            </q-card-actions>
          </q-card>
        </div>

        <div class="col-xs-12 col-sm-6">
          <q-btn label="Testing" color="red" @click="onTemp" />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
defineOptions({
  name: "RegisterPage",
});
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useAuthStore } from "src/stores/auth";
const $q = useQuasar();
import PinEntry from "src/components/PinEntry.vue";
// console.log("process.env.API_BASE_URL", process.env.API_BASE_URL);
import dataObject from "src/components/DataComponent.vue";
const authStore = useAuthStore();
const router = useRouter();
const email2 = ref("");
const model = ref({ userID: 0, userName: "", email: "", mobile: "" });
const pin = ref("");
const currentMode = ref("email");
const showPinEntry = ref(false);
const doValidateUser = ref(null);
const doInitiatePIN = ref(null);
const doValidatePIN = ref(null);
const validatedUser = ref(null);
const showReinitiate = ref(false);
const statusMessage = ref("Let's get started ...");
const statusFooter = ref(
  "All information & OTP confirmation SMS's will be sent to these details"
);
const emit = defineEmits(["update:modelValue"]);
onMounted(() => {
  $q.notify({
    message: "Welcome to Vendy!",
    color: "yellow-9",
    icon: "check_circle",
    position: "top",
    timeout: 2000,
  });
});
//for testing
const onTemp = () => {
  model.value = {
    userID: 0,
    userName: "Bruce Barrett",
    email: "bruce@netvendor.co.za",
    // mobile: "0827730508",
  };
};

const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isValidPart1 = computed(() => {
  const m = model.value;
  if (m.email && email2.value && m.userName) {
    if (
      m.email.length > 5 &&
      m.email === email2.value &&
      isValidEmail(m.email) &&
      m.userName.length > 5
    ) {
      return true;
    }
  }
  return false;
});

//Validate if the user already exists
const onUserValidate = (email, mobile) => {
  currentMode.value = email ? "email" : "mobile";
  const data = {
    userID: null,
    userName: "",
    email: email,
    mobile: mobile,
  };

  //this will trigger a post
  doValidateUser.value = {
    url: "pwaSwitch/validateUser",
    formData: data,
    verb: "POST",
  };
};

const onUserValidated = (data) => {
  // console.log("validated", data);
  if (data.hasData) {
    validatedUser.value = data.data;
    model.value.mobile = validatedUser.value.mobile;
    $q.notify({
      message: "We found this user",
      color: "negative",
      icon: "check_circle",
      position: "top",
      timeout: 2000,
    });
    statusMessage.value = "User Found";
    statusFooter.value = "Is this you? If so we need to verify you.";
  }
};

const onPinInitiate = () => {
  console.log("onPinInitiate");
  const vu = validatedUser.value;
  const data = {
    userKey: vu.userKey ?? 0,
    mode: currentMode.value,
    email: currentMode.value === "email" ? vu.email : null,
    mobile: currentMode.value === "mobile" ? vu.mobile : null,
  };

  //this will trigger a post
  doInitiatePIN.value = {
    url: "pwaSwitch/InitiateOTP",
    formData: data,
    verb: "POST",
  };

  statusMessage.value = "Sending PIN ...";
  (statusFooter.value =
    "A PIN has been sent to your " +
    currentMode.value +
    ". Please enter it below"),
    +" address ...";
  showPinEntry.value = true;
  showReinitiate.value = false;
  setTimeout(() => {
    showReinitiate.value = true;
  }, 30000);
};

const onPinEntered = (pin) => {
  console.log("pinEntered", pin);
  showPinEntry.value = false;
  const data = {
    userKey: validatedUser.value.userKey ?? 0,
    userName: "",
    otp: pin,
    email: model.value.email,
    // mobile: mobile,
  };
  //this will trigger a post
  doValidatePIN.value = {
    url: "pwaSwitch/ValidateOTP",
    formData: data,
    verb: "POST",
  };
  statusMessage.value = "Pin Sent";
  statusFooter.value = "Please wait ...";
};

const onPINValidated = (data) => {
  console.log("PIN Validated", data);
  if (data.data == "OK") {
    authStore.storeUser(validatedUser.value);
    router.push("/");
  }
};

const onReset = () => {
  model.value = {
    userID: 0,
    userName: "",
    email: "",
    mobile: "",
  };
  validatedUser.value = null;
};

const onSubmit = async () => {
  console.log("submitting");

  const m = model.value;

  const data = {
    userID: -1,
    userName: m.userName,
    email: m.email,
    mobile: m.mobile.replace(/[^0-9]/g, ""),
  };

  //this will trigger a post
  doValidateUser.value = {
    url: "pwaSwitch/validateUser",
    formData: data,
    verb: "POST",
  };
};
</script>
