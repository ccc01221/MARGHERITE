<template>
  <div id="app">
    <router-view :currency="this.currencyValue" />
    <transition
      v-if="isPreload"
      enter-active-class="animated-faster fadeIn"
      leave-active-class="animated-faster fadeOut"
      mode="out-in"
    >
      <preload></preload>
    </transition>
    <vodal :show="showSessionExpired" animation="fade" @hide="showSessionExpired = false">
      <div>
        <i
          style="margin-top:-35px;display:block; margin-right: .5rem; margin-left: -.4rem; font-size:50px;margin-bottom:20px;"
          class="fas fa-exclamation-triangle"
        ></i>
        {{this.$t('sessionexpiredtext')}}
      </div>
    </vodal>
    <div class="footer">
      <div class="footer-inner">
        <div class="language-footer">
          <div class="language-footer-flex">
            <span>
              <country-flag :country="this.flag" size="normal" />
            </span>

            <div class="dropdown-content">
              <a
                :class="{'activeFlag' : lang.flag === flag}"
                v-for="(lang, index) in languages"
                :key="`lang${index}`"
                v-on:click="changeLanguage(lang)"
              >{{ lang.title }}</a>
            </div>
          </div>
          <div v-if="this.currencies" class="currency-picker">
            <Dropdown v-model="currencyValue" :options="this.currencies.results"></Dropdown>
          </div>
          <div v-if="!this.currencies && this.currencyList && this.currencyList.length" class="currency-picker">
            <Dropdown v-model="currencyValue" :options="this.currencyList"></Dropdown>
          </div>
        </div>
        <div class="copyright">
          <span>
            {{this.$t('copyright')}}
            <a href="#">Margherite {{this.$t('society')}}</a>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CountryFlag from "vue-country-flag";
import Preload from "../../loaders/Preload";
import { mapGetters } from "vuex";
import Dropdown from "../../components/selectors/Dropdown";
import Vodal from "vodal";
export default {
  data: () => ({
    currencyList: [],
    flag: "us",
    iDevice: false,
    currencyValue: null,
    options: null,
    isPreload: true,
    showSessionExpired: false,
    languages: [
      {
        title: "English",
        value: "en",
        flag: "us"
      },
      {
        title: "/ Deutsch",
        value: "de",
        flag: "de"
      }
    ]
  }),
  methods: {
    changeLanguage(lang) {
      this.$i18n.locale = lang.value;
      this.flag = lang.flag;
      this.$store.dispatch("language/setLanguage", lang.value);
      location.reload();
    }
  },
  computed: {
    ...mapGetters(["CURRENCIES"]),
    currencies() {
      return this.CURRENCIES;
    },
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    }
  },
  mounted: function() {
    document.addEventListener("touchstart", function() {}, true);
    setTimeout(() => {
      this.isPreload = false;
    }, 2000);
  },
  watch: {
    $route(to, from) {
      this.isPreload = true;
      let session = localStorage.getItem("sessionID");
      this.$store.dispatch("login", { sessionID: session });
      setTimeout(() => {
        this.isPreload = false;
      }, 2000);
    },
    currencyValue: function() {
      localStorage.setItem("savedCurrency", JSON.stringify(this.currencyValue));
    }
  },
  created: function() {
    if (this.$i18n.locale === "en") {
      this.flag = "us";
    } else {
      this.flag = "de";
    }
    if (
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/iPad/i)
    ) {
      this.iDevice = true;
    } else {
      this.iDevice = false;
    }

    this.$http.interceptors.response.use(
      response => {
        if (response.data.code === 999) {
          if (this.$router.currentRoute.path != "/")
            this.showSessionExpired = true;
          this.$store.dispatch("logout");
          if (this.$router.currentRoute.path.indexOf("/session") >= 0) {
            this.$router.push({ name: "Main" });
          }
          if (this.$router.currentRoute.name === "dashboard") {
            this.$router.push({ name: "Main" });
          }
        } else {
        }
        if (response.data.code == 200 && response.data.loggedNewlyIn == true) {
          if (this.$router.currentRoute.name != "Books") {
            this.$router.go();
          }
          if (this.$router.currentRoute.name != "teacher") {
            this.$router.go();
          }
          if (this.$router.currentRoute.name == "Main") {
            this.$router.push({ name: "dashboard" });
          }
        }
        return response;
      },
      err => {
        return new Promise(function(resolve, reject) {
          if (err.status === 401) {
            this.$store.dispatch("logout");
          }
          throw err;
        });
      }
    );
    //Getting from local storage default currency and list of currencies
    let currencyStorage = localStorage.getItem("savedCurrency");
    let currencyStorageList = localStorage.getItem("savedCurrencyList");
    let parse = JSON.parse(currencyStorage);
    let parseList = JSON.parse(currencyStorageList);
    if (!currencyStorage) {
      this.$store.dispatch("GET_CURRENCIES").then(() => {
        localStorage.setItem(
          "savedCurrency",
          JSON.stringify(this.currencies.results[0])
        );
        localStorage.setItem(
          "savedCurrencyList",
          JSON.stringify(this.currencies.results)
        );
        this.currencyValue = this.currencies.results[0];
        this.currencyList = this.currencies.results;
      });
    } else {
      this.currencyValue = parse;
      this.currencyList = parseList;
    }
  },
  components: {
    CountryFlag,
    Preload,
    Dropdown,
    Vodal
  }
};
</script>

<style lang="scss">
@import "~vodal/common.css";
@import "~vodal/zoom.css";
@import "~vodal/rotate.css";
@import "../../styles/main";
</style>
