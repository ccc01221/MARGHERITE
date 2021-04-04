<template>
  <div>
    <div class="modal">
      <div class="modal__holder" v-bind:style="{'margin-top': margin + 'px'}">
        <div class="modal__holder-first">
          <i @click="$emit('close'),$emit('showLogin')" class="fas fa-times"></i>
          <h1>{{this.$t('modal.forgotPassword')}}</h1>

          <div class="modal__holder-tabs">
            <span
              :class="{'activeTab': isForgotEmail}"
              @click="openEmailForgotTab"
            >{{this.$t('modal.email')}}</span>
            <span
              :class="{'activeTab': isForgotPhone}"
              @click="openPhoneForgotTab"
            >{{this.$t('modal.phone')}}</span>
          </div>

          <span v-if="isForgotEmail" class="forgot-info">{{this.$t('forgotemail')}}</span>
          <span v-if="isForgotPhone" class="forgot-info">{{this.$t('forgotphone')}}</span>
          <div v-if="isForgotEmail" class="modal__holder-content">
            <div class="form-group" :class="{error: validation.firstError('forgot_email_password')}">
              <div class="content">
                <label :class="{error: validation.firstError('forgot_email_password')}" class="pure-material-textfield-outlined">
                <input
                  autocomplete="my-field-name1"
                  placeholder=" "
                  name="forgot_email"
                  type="text"
                  class="form-control"
                  v-model="forgot_email_password"
                  style="font-family:Arial, sans-serif, 'Font Awesome 5 Pro' !important; font-weight: 500;"
                />
                <span>{{this.$t('modal.emailfield')}}</span>
                </label>
                <div class="message">{{ validation.firstError('forgot_email_password') }}</div>
              </div>
            </div>
            <div
              class="form-group"
              :class="{error: validation.firstError('forgot_email_verification')}"
            >
              <div class="content">
                <label :class="{error: validation.firstError('forgot_email_verification')}" class="pure-material-textfield-outlined">
                <input
                  autocomplete="my-field-name1"
                  placeholder=" "
                  name="forgot_email_verification"
                  type="text"
                  class="form-control"
                  v-model="forgot_email_verification"
                  style="font-family:Arial, sans-serif, 'Font Awesome 5 Pro' !important; font-weight: 500;"
                />
                <span>{{this.$t('modal.verification')}}</span>
                </label>
                <div class="message">{{ validation.firstError('forgot_email_verification') }}</div>
                <div class="verification-holder">
                  <button
                    class="sendSMS"
                    :disabled="!forgot_email_password"
                    @click="sendEmailMessage()"
                  >{{this.$t('modal.sendEmail')}}</button>
                </div>
              </div>
            </div>
            <div
              :class="{'error' : validation.firstError('new_email_password')}"
              class="form-group"
            >
              <div class="content">
                <label :class="{error: validation.firstError('new_email_password')}" class="pure-material-textfield-outlined">
                <input
                  ref="password"
                  autocomplete="my-field-name1"
                  placeholder=" "
                  name="new_email_password"
                  type="password"
                  class="form-control"
                  v-model="new_email_password"
                  style="font-family:Arial, sans-serif, 'Font Awesome 5 Pro' !important; font-weight: 500;"
                />
                <span>{{this.$t('modal.newPassword')}}</span>
                </label>
                <div class="message">{{ validation.firstError('new_email_password') }}</div>
                <span
                  v-if="new_email_password.length && !isShowPassword"
                  @click="showPassword"
                  class="showPassword"
                >{{this.$t('modal.show')}}</span>
                <span
                  v-if="new_email_password.length && isShowPassword"
                  @click="hidePassword"
                  class="showPassword"
                >{{this.$t('modal.hide')}}</span>
              </div>
            </div>
          </div>
          <div v-if="isForgotPhone" class="modal__holder-content">
            <div class="form-group flex">
              <div class="content">
                <vue-tel-input
                  v-bind="bindProps"
                  placeholder=" "
                  @onInput="onInput"
                  name="forgot_phone_number"
                  @country-changed="getNumberInfo"
                  :preferredCountries="['us', 'de', 'gb', 'se', 'mx']"
                  v-model="forgot_phone_password"
                ></vue-tel-input>
                <div class="message">{{ validation.firstError('phone') }}</div>
              </div>
            </div>
            <div
              class="form-group"
              :class="{error: validation.firstError('forgot_verification_phone')}"
            >
              <div class="content">
                <label :class="{error: validation.firstError('forgot_verification_phone')}" class="pure-material-textfield-outlined">
                <input
                  autocomplete="my-field-name1"
                  placeholder=" "
                  name="forgot_phone_verification_code"
                  class="form-control"
                  v-model="forgot_verification_phone"
                  style="font-family:Arial, sans-serif, 'Font Awesome 5 Pro' !important; font-weight: 500;"
                />
                  <span>{{this.$t('modal.verification')}}</span>
                </label>
                <div class="message">{{ validation.firstError('forgot_verification_phone') }}</div>
                <div class="verification-holder">
                  <button
                    class="sendSMS"
                    :disabled="!sendSms"
                    @click="sendPhoneMessage()"
                  >{{this.$t('modal.sendSMS')}}</button>
                </div>
              </div>
            </div>
            <div
              :class="{'error' : validation.firstError('new_phone_password')}"
              class="form-group"
            >
              <div class="content">
                <label :class="{error: validation.firstError('new_phone_password')}" class="pure-material-textfield-outlined">
                <input
                  ref="password"
                  autocomplete="my-field-name1"
                  placeholder=" "
                  name="password_second"
                  type="password"
                  class="form-control"
                  v-model="new_phone_password"
                  style="font-family:Arial, sans-serif, 'Font Awesome 5 Pro' !important; font-weight: 500;"
                />
                  <span>{{this.$t('modal.newPassword')}}</span>
                </label>
                <div class="message">{{ validation.firstError('new_email_password') }}</div>
                <span
                  v-if="new_phone_password.length && !isShowPassword"
                  @click="showPassword"
                  class="showPassword"
                >{{this.$t('modal.show')}}</span>
                <span
                  v-if="new_phone_password.length && isShowPassword"
                  @click="hidePassword"
                  class="showPassword"
                >{{this.$t('modal.hide')}}</span>
              </div>
            </div>
          </div>

          <button
            v-if="isForgotEmail"
            @keyup.enter="getForgotPassword"
            @click="getForgotPassword"
            :disabled="this.status === 'loading' || !forgot_email_password.length"
          >
            {{this.$t('modal.submit')}}
            <div v-if="this.status === 'loading'" class="lds-dual-ring"></div>
          </button>
          <button
            v-if="isForgotPhone"
            @keyup.enter="getForgotPasswordPhone"
            @click="getForgotPasswordPhone"
            :disabled="this.status === 'loading' || !forgot_phone_password.length"
          >
            {{this.$t('modal.submit')}}
            <div v-if="this.status === 'loading'" class="lds-dual-ring"></div>
          </button>
        </div>
        <div class="modal__holder-sign">
          <span>{{this.$t('modal.noAccount')}}</span>
          <span @click="showRegister">{{this.$t('navigation.register')}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueTelInput from "../components/VueTelInput";
import Header from "../intro/Header";
import SimpleVueValidation from "simple-vue-validator";
import {api} from '../app/api'
const Validator = SimpleVueValidation.Validator;

export default {
  name: "ForgotPassword",

  data() {
    return {
      isForgotEmail: true,
      isForgotPhone: false,
      isForgotPassword: true,
      new_email_password: "",
      new_phone_password: "",
      maxLength: 7,
      forgot_email_verification: null,
      forgot_verification_phone: null,
      email: "",
      password: "",
      sendSms: "",
      countryCode: "",
      keepMeLoggedIn: false,
      forgot_email_password: "",
      forgot_phone_password: "",
      phone: "",
      country_code: "",
      status: null,
      isShowPassword: false,
      bindProps: {
        disabledFetchingCountry: false,
        enabledCountryCode: true,
        inputOptions: {
          showDialCode: false
        }
      },
      mymargin: 0
    };
  },
  created() {
    this.mymargin = window.scrollY + Math.max(40, window.innerHeight / 2 - 300);
  },
  computed: {
    margin: function() {
      return this.mymargin;
    }
  },
  validators: {
    password(value) {
      return Validator.value(value).required(this.$t("error.enterPassword"));
    },
    phone(value) {
      return Validator.value(value).required(this.$t("error.enterPhone"));
    },
    country_code(value) {
      return Validator.value(value).required(this.$t("error.enterCode"));
    },
    forgot_email_password(value) {
      return Validator.value(value)
        .required(this.$t("error.enterEmail"))
        .email(this.$t("error.enterCorrectEmail"));
    },
    forgot_email_verification(value) {
      return Validator.value(value).required(
        this.$t("error.enterVerification")
      );
    },
    forgot_verification_phone(value) {
      return Validator.value(value).required(
        this.$t("error.enterVerificationMobile")
      );
    }
  },
  methods: {
    openEmailTab() {
      this.isEmail = true;
      this.isPhone = false;
      this.isForgotPassword = false;
      this.password = "";
    },
    limitNumber() {
      if (this.forgot_email_verification.length > this.maxLength)
        this.forgot_email_verification = this.forgot_email_verification.slice(
          0,
          this.maxLength
        );
    },
    limitNumberPhone() {
      if (this.forgot_verification_phone().length > this.maxLength)
        this.forgot_verification_phone = this.forgot_verification_phone.slice(
          0,
          this.maxLength
        );
    },
    openPhoneTab() {
      this.isEmail = false;
      this.isPhone = true;
      this.isForgotPassword = false;
      this.password = "";
    },
    openEmailForgotTab() {
      this.isForgotEmail = true;
      this.isForgotPhone = false;
      this.password = "";
    },
    onInput({ number, isValid, country }) {
      this.sendSms = number.e164;
      this.forgot_phone_password = number.national;
    },
    getNumberInfo(value) {
      this.countryCode = value.dialCode;
    },
    openPhoneForgotTab() {
      this.isForgotEmail = false;
      this.isForgotPhone = true;
      this.password = "";
    },
    showForgotPassword() {
      this.isEmail = false;
      this.isPhone = false;
      this.password = "";
      this.isForgotPassword = true;
      this.isForgotEmail = true;
    },
    sendEmailMessage() {
      let data = {
        email: this.forgot_email_password,
        language: this.$i18n.locale
      };
      this.$http
        .post(api+"/requestpasswordreset", data)
        .then(resp => {
          if (resp.data.code === 200) {
            this.$toasted.show(
              '<i style="margin-right: .5rem; margin-left: -.4rem;" class="fal fa-check"></i> ' +
                resp.data.message,
              {
                position: "top-right",
                type: "success",
                duration: 5000
              }
            );
          } else {
            this.$toasted.show(
              '<i style="margin-right: .5rem; margin-left: -.4rem;" class="fas fa-exclamation-triangle"></i> ' +
                resp.data.message,
              {
                position: "top-right",
                type: "error",
                duration: 5000
              }
            );
          }
        });
    },
    getForgotPassword() {
      let data = {
        email: this.forgot_email_password,
        code: this.forgot_email_verification,
        password: this.new_email_password,
        language: this.$i18n.locale
      };
      this.status = "loading";
      this.$store.dispatch("forgotPassword", data).then(response => {
        if (response.data.code === 200) {
          this.status = null;
          this.$toasted.show(
            '<i style="margin-right: .5rem; margin-left: -.4rem;" class="fal fa-check"></i> ' +
              response.data.message,
            {
              position: "top-right",
              type: "success",
              duration: 5000
            }
          );
          this.isEmail = true;
          this.isPhone = false;
          this.password = "";
          this.isForgotPassword = false;
          this.isForgotEmail = false;
        } else {
          this.status = null;
          this.$toasted.show(
            '<i style="margin-right: .5rem; margin-left: -.4rem;" class="fas fa-exclamation-triangle"></i> ' +
              response.data.message,
            {
              position: "top-right",
              type: "error",
              duration: 5000
            }
          );
        }
      });
    },
    sendPhoneMessage() {
      let data = {
        phonenumber: this.sendSms,
        channel: "sms",
        language: this.$i18n.locale
      };
      this.$http
        .post(api+"/verificationrequest", data)
        .then(resp => {
          if (resp.data.code === 200) {
            this.$toasted.show(
              '<i style="margin-right: .5rem; margin-left: -.4rem;" class="fal fa-check"></i> ' +
                resp.data.message,
              {
                position: "top-right",
                type: "success",
                duration: 5000
              }
            );
          } else {
            this.$toasted.show(
              '<i style="margin-right: .5rem; margin-left: -.4rem;" class="fas fa-exclamation-triangle"></i> ' +
                resp.data.message,
              {
                position: "top-right",
                type: "error",
                duration: 5000
              }
            );
          }
        });
    },
    getForgotPasswordPhone() {
      let data = {
        countrycode_phone: "+" + this.countryCode,
        nationalnumber_phone: this.forgot_phone_password.replace(/\s+/g, ""),
        code: this.forgot_verification_phone,
        password: this.new_phone_password,
        language: this.$i18n.locale
      };
      this.status = "loading";
      this.$store.dispatch("forgotPassword", data).then(response => {
        if (response.data.code === 200) {
          this.status = null;
          this.$toasted.show(
            '<i style="margin-right: .5rem; margin-left: -.4rem;" class="fal fa-check"></i> ' +
              response.data.message,
            {
              position: "top-right",
              type: "success",
              duration: 5000
            }
          );
          this.isEmail = false;
          this.isPhone = true;
          this.password = "";
          this.isForgotPassword = false;
          this.isForgotEmail = false;
        } else {
          this.status = null;
          this.$toasted.show(
            '<i style="margin-right: .5rem; margin-left: -.4rem;" class="fas fa-exclamation-triangle"></i> ' +
              response.data.message,
            {
              position: "top-right",
              type: "error",
              duration: 5000
            }
          );
        }
      });
    },
    showPassword() {
      if (this.$refs.password.type === "password") {
        this.$refs.password.type = "text";
        this.isShowPassword = true;
      }
    },
    hidePassword() {
      if (this.$refs.password.type === "text") {
        this.$refs.password.type = "password";
        this.isShowPassword = false;
      }
    },
    showRegister() {
      this.$emit("showRegister", true);
      this.$emit("close", true);
    },
    onInput({ number, isValid, country }) {
      this.sendSms = number.e164;
    },
    login() {
      let email = this.email;
      let password = this.password;
      let keepMeLoggedIn = true;
      let language = this.$i18n.locale;
      this.status = "loading";
      this.$store
        .dispatch("login", { email, password, keepMeLoggedIn, language })
        .then(response => {
          this.status = null;
          if (response.data.code === 200) {
            this.$toasted.clear();
            this.$router.push("/dashboard");
          } else {
            this.status = null;
            this.$toasted.show(
              '<i style="margin-right: .5rem; margin-left: -.4rem;" class="fas fa-exclamation-triangle"></i> ' +
                response.data.message,
              {
                position: "top-right",
                type: "error",
                duration: 5000
              }
            );
          }
        });
    },
    loginWithPhone() {
      let data = {
        countrycode_phone: "+" + this.countryCode,
        nationalnumber_phone: this.phone.replace(/\s+/g, ""),
        password: this.password,
        keepMeLoggedIn: true,
        language: this.$i18n.locale
      };
      this.status = "loading";
      this.$store.dispatch("login", data).then(response => {
        this.status = null;
        if (response.data.code === 200) {
          this.$toasted.clear();
          this.$router.push("/dashboard");
        } else {
          this.status = null;
          this.$toasted.show(
            '<i style="margin-right: .5rem; margin-left: -.4rem;" class="fas fa-exclamation-triangle"></i> ' +
              response.data.message,
            {
              position: "top-right",
              type: "error",
              duration: 5000
            }
          );
        }
      });
    }
  },
  components: {
    VueTelInput,
    Header
  }
};
</script>

<style scoped lang="scss">
@import "../styles/colors/color";
@import "../styles/modals/modal";
@import "../styles/components/materialTextfield";
</style>