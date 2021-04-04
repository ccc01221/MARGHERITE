<template>
  <div>
    <div class="modal">
      <div class="modal__holder" :style="{'margin-top': margin + 'px'}">
        <div class="modal__holder-first">
          <i @click="$emit('close')" class="fas fa-times"></i>
          <h1>{{this.$t('navigation.login')}}</h1>
          <div style="margin-bottom: 2rem;" class="modal__holder-tabs">
            <span :class="{'activeTab': isEmail}" @click="openEmailTab">{{this.$t('modal.email')}}</span>
            <span :class="{'activeTab': isPhone}" @click="openPhoneTab">{{this.$t('modal.phone')}}</span>
          </div>
          <div v-if="isEmail" class="modal__holder-content">
            <div class="form-group" :class="{error: validation.firstError('email')}">
              <div class="content">
                <label :class="{'error': validation.firstError('email')}" class="pure-material-textfield-outlined">
                  <input
                    autocomplete="email address"
                    placeholder=" "
                    name="email"
                    type="text"
                    class="form-control"
                    v-model="email"
                    style="font-family:Arial, sans-serif, 'Font Awesome 5 Pro' !important; font-weight: 500;"
                  />
                  <span>{{this.$t('modal.emailfield')}}</span>
                </label>
                <div class="message">{{ validation.firstError('email') }}</div>
              </div>
            </div>
            <div :class="{error : validation.firstError('password')}" class="form-group">
              <div class="content">
                <label class="pure-material-textfield-outlined">
                <input
                  ref="password"
                  autocomplete="my-field-name1"
                  @keyup.enter="login"
                  type="password"
                  class="form-control"
                  v-model="password"
                  placeholder=" "
                  style="font-family:Arial, sans-serif, 'Font Awesome 5 Pro' !important; font-weight: 500;"
                />
                <span>{{this.$t('modal.passwordfield')}}</span>
                </label>
                <div class="message">{{ validation.firstError('password') }}</div>
                <span
                  v-if="password.length && !isShowPassword"
                  @click="showPassword"
                  class="showPassword"
                >{{this.$t('modal.show')}}</span>
                <span
                  v-if="password.length && isShowPassword"
                  @click="hidePassword"
                  class="showPassword"
                >{{this.$t('modal.hide')}}</span>
              </div>
            </div>
          </div>
          <div v-if="isPhone" class="modal__holder-content">
            <div class="form-group flex">
              <div class="content">
                <vue-tel-input
                  v-bind="bindProps"
                  placeholder=" "
                  name="phone"
                  @onInput="onInput"
                  @country-changed="getNumberInfo"
                  :preferredCountries="['us', 'de', 'gb', 'se', 'mx']"
                  v-model="phone"
                  style="font-family:Arial, sans-serif, 'Font Awesome 5 Pro' !important; font-weight: 500;"
                ></vue-tel-input>
              </div>
            </div>
            <div :class="{'error' : validation.firstError('password')}" class="form-group">
              <div class="content">
                <label :class="{error: validation.firstError('password')}" class="pure-material-textfield-outlined">
                <input
                  ref="password"
                  autocomplete="my-field-name1"
                  name="phone_password"
                  @keyup.enter="loginWithPhone"
                  placeholder=" "
                  type="password"
                  class="form-control"
                  v-model="password"
                  style="font-family:Arial, sans-serif, 'Font Awesome 5 Pro' !important; font-weight: 500;"
                />
                <span>{{this.$t('modal.passwordfield')}}</span>
                </label>
                <div class="message">{{ validation.firstError('password') }}</div>
                <span
                  v-if="password.length && !isShowPassword"
                  @click="showPassword"
                  class="showPassword"
                >{{this.$t('modal.show')}}</span>
                <span
                  v-if="password.length && isShowPassword"
                  @click="hidePassword"
                  class="showPassword"
                >{{this.$t('modal.hide')}}</span>
              </div>
            </div>
          </div>
          <div class="modal__holder-content-footer">
            <div>
              <input
                autocomplete="my-field-name1"
                v-model="keepMeLoggedIn"
                type="checkbox"
                id="test1"
              />
              <label for="test1">{{this.$t('modal.loggedIn')}}</label>
            </div>
            <span>
              <span @click="showForgotPassword">{{this.$t('modal.forgotPassword')}}</span>
            </span>
          </div>
          <button
            v-if="isEmail"
            @click="login"
            :disabled="this.status === 'loading' || validation.firstError('email') || validation.firstError('password') || !email.length || !password.length"
          >
            {{this.$t('navigation.login')}}
            <div v-if="this.status === 'loading'" class="lds-dual-ring"></div>
          </button>
          <button
            v-if="isPhone"
            @click="loginWithPhone"
            :disabled="this.status === 'loading' || !this.phone.length || validation.firstError('password') || !password.length"
          >
            {{this.$t('navigation.login')}}
            <div v-if="this.status === 'loading'" class="lds-dual-ring"></div>
          </button>
          <button
            v-if="isForgotPassword && isForgotEmail"
            @keyup.enter="getForgotPassword"
            @click="getForgotPassword"
            :disabled="this.status === 'loading' || !forgot_email_password.length"
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
import VueTelInput  from "../components/VueTelInput";
import Header from "../intro/Header";
import SimpleVueValidation from "simple-vue-validator";
import { api } from "../app/api";
const Validator = SimpleVueValidation.Validator;

export default {
  name: "Login",

  data() {
    return {
      isEmail: true,
      isPhone: false,
      isForgotEmail: false,
      isForgotPhone: false,
      isForgotPassword: false,
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
    this.mymargin = window.scrollY + Math.max(40, window.innerHeight / 2 - 250);
  },
  computed: {
    margin: function() {
      return this.mymargin;
    }
  },

  validators: {
    email(value) {
      return Validator.value(value)
        .email(this.$t("error.enterCorrectEmail"));
    },
    phone(value) {
      return Validator.value(value).required(this.$t("error.enterPhone"));
    },
    country_code(value) {
      return Validator.value(value).required(this.$t("error.enterCode"));
    },
    forgot_email_password(value) {
      return Validator.value(value)
        .email();
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
      this.$emit("showForgotPassword", true);
      this.$emit("close", true);
    },
    sendEmailMessage() {
      let data = {
        email: this.forgot_email_password,
        language: this.$i18n.locale
      };
      this.$http.post(api + "/requestpasswordreset", data).then(resp => {
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
      this.$http.post(api + "/verificationrequest", data).then(resp => {
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
            this.$emit("close", true);
            this.$toasted.show(
              '<i style="margin-right: .5rem; margin-left: -.4rem;" class="fal fa-check"></i> ' +
                response.data.message,
              {
                position: "top-right",
                type: "success",
                duration: 5000
              }
            );
            // this.$router.push("/dashboard");
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