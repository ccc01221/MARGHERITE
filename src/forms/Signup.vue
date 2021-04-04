<template>
  <div class="modal register" v-bind:style="{'margin-top': margin + 'px'}">
    <div class="modal__holder">
      <div class="modal__holder-first">
        <i @click="$emit('close')" class="fas fa-times"></i>
        <h1>{{this.$t('navigation.register')}}</h1>
        <div class="modal__holder-content">
          <div class="form-group">
            <div class="content">
              <label class="pure-material-textfield-outlined">
              <input
                placeholder=" "
                type="text"
                class="form-control"
                v-model="name"
              />
                <span>{{this.$t('modal.name')}}</span>
              </label>
            </div>
          </div>
          <div class="form-group" :class="{error: validation.firstError('email')}">
            <div class="content">
              <label :class="{error: validation.firstError('email')}" class="pure-material-textfield-outlined">
              <input
                placeholder=" "
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
          <div class="form-group flex">
            <div class="content">
              <vue-tel-input
                v-bind="bindProps"
                placeholder=" "
                @onInput="onInput"
                @country-changed="getNumberInfo"
                :preferredCountries="['us', 'de', 'gb', 'se', 'mx']"
                v-model="phone"
              ></vue-tel-input>
              <div class="message">{{ validation.firstError('phone') }}</div>
            </div>
          </div>
          <div class="form-group" :class="{error: validation.firstError('verification')}">
            <div class="content">
              <label :class="{error: validation.firstError('verification')}" class="pure-material-textfield-outlined">
              <input
                placeholder=" "
                type="number"
                @input="limitNumber"
                class="form-control"
                v-model="verification"
                style="font-family:Arial, sans-serif, 'Font Awesome 5 Pro' !important; font-weight: 500;"
              />
                <span>{{this.$t('modal.verification')}}</span>
              </label>
              <div class="message">{{ validation.firstError('verification') }}</div>
              <div class="verification-holder">
                <button
                  class="sendSMS"
                  :disabled="!sendSms"
                  @click="sendMessage('sms')"
                >{{this.$t('modal.sendSMS')}}</button>
              </div>
            </div>
          </div>
          <div :class="{'error' : validation.firstError('password')}" class="form-group">
            <div class="content">
              <label :class="{error: validation.firstError('password')}" class="pure-material-textfield-outlined">
              <input
                ref="password"
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
            <input v-model="checked" type="checkbox" id="test1" />
            <label style="margin-top: -0.5rem;" for="test1">
              <span>
                {{this.$t('modal.iAgree')}}
                <a href="#">{{this.$t('modal.terms')}}</a>
              </span>
            </label>
          </div>
        </div>
        <button
          @click="register"
          :disabled="validation.firstError('email') || validation.firstError('password') || !email.length || !password.length || !checked"
        >{{this.$t('navigation.register')}}</button>
      </div>
      <div class="modal__holder-sign">
        <span>{{this.$t('modal.account')}}</span>
        <span @click="showLogin">{{this.$t('navigation.login')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import SimpleVueValidation from "simple-vue-validator";
import VueTelInput from "../components/VueTelInput";
import Header from "../intro/Header";
import {api} from '../app/api'
const Validator = SimpleVueValidation.Validator;
const qs = require("querystring");
export default {
  name: "Signup",
  data: () => ({
    isEmail: true,
    isPhone: false,
    email: "",
    password: "",
    phone: "",
    checked: false,
    sendSms: "",
    verification: null,
    name: "",
    maxLength: 7,
    isShowPassword: false,
    countryCode: null,
    bindProps: {
      disabledFetchingCountry: false,
      enabledCountryCode: true,
      disabledFormatting: true,
      inputOptions: {
        showDialCode: false
      }
    },
    mymargin: 0
  }),

  created() {
    this.mymargin = window.scrollY + Math.max(40, window.innerHeight / 2 - 325);
  },
  destroyed() {},
  computed: {
    margin: function() {
      return this.mymargin;
    }
  },
  validators: {
    email(value) {
      return Validator.value(value)
        .required(this.$t("error.enterEmail"))
        .email(this.$t("error.enterCorrectEmail"));
    },
    password(value) {
      return Validator.value(value).required(this.$t("error.enterPassword"));
    },
    verification(value) {
      return Validator.value(value).required(
        this.$t("error.enterVerificationMobile")
      );
    }
  },
  methods: {
    openEmailTab() {
      this.isEmail = true;
      this.isPhone = false;
    },
    limitNumber() {
      if (this.verification.length > this.maxLength)
        this.verification = this.verification.slice(0, this.maxLength);
    },
    openPhoneTab() {
      this.isEmail = false;
      this.isPhone = true;
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
    showLogin() {
      this.$emit("showLogin", true);
      this.$emit("close");
    },
    onInput({ number, isValid, country }) {
      this.sendSms = number.e164;
      this.phone = number.national;
    },
    getNumberInfo(value) {
      this.countryCode = value.dialCode;
    },
    sendMessage(value) {
      let cookie = document.cookie.indexOf("sendSMS");
      let number = this.sendSms;
      let data = {
        phonenumber: this.sendSms,
        channel: value,
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
    register: function() {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (!tz.length) {
        const tz = "";
      }
      let data = {
        countrycode_phone: "+" + this.countryCode,
        nationalnumber_phone: this.phone.replace(/\s+/g, ""),
        name: this.name,
        email: this.email,
        password: this.password,
        code: this.verification,
        timezone: tz,
        language: this.$i18n.locale
      };
      this.$store.dispatch("register", data).then(response => {
        if (response.data.code === 200) {
          this.$toasted.show(
            '<i style="margin-right: .5rem; margin-left: -.4rem;" class="fal fa-check"></i> ' +
              response.data.message,
            {
              position: "top-right",
              type: "success",
              duration: 5000
            }
          );
          this.$emit("close");
          this.$emit("showLogin", true);
        } else {
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
    Header,
    VueTelInput
  }
};
</script>

<style scoped lang="scss">
@import "../styles/colors/color";
@import "../styles/modals/modal";
@import "../styles/components/materialTextfield";
</style>