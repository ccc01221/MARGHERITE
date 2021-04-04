<template>
  <div class="intro__main">
    <Header ref="header" :noIcon="true"></Header>
    <div>
      <div
        id="scrollableElementFirst"
        :class="{'moveDown' : moveDown}"
        class="intro__main-landscape"
      >
        <div class="intro__background-image"></div>

        <div class="intro__main-holder">
          <div class="intro__main-landscape-holder">
            <div class="landscape-holder">
              <div class="intro__main-landscape-image">
                <img src="../assets/flower.png" />
              </div>
              <div class="intro__main-landscape-content">
                <h1>MARGHERITE</h1>
                <div class="intro__main-intro-group form-group">
                  <div class="content">
                    <BasicDropDownSearch
                      :placeholder="this.$t('booksPage.search')"
                      name="initialsearch"
                      :options="searchoptions"
                      v-on:selected="sendWord"
                      id="inputSearchField"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="intro__main-landscape-holder-footer">
            <h2 class="onlyDesktop">{{this.$t('greeting_info')}}</h2>
          </div>
        </div>
        <div @click="moveSlideDown" class="intro__arrow onlyDesktopArrow">
          <i class="fal fa-chevron-down"></i>
        </div>
        <div @click="moveSlideDownMobile" class="intro__arrow onlyMobileArrow">
          <i class="fal fa-chevron-down"></i>
        </div>
      </div>
    </div>
    <div id="scrollableElement" :class="{'moveUp' : moveDown}" class="intro intro__second">
      <div class="intro__second-holder">
        <div class="container">
          <div class="intro__second-holder-text">
            <span class="small black">{{this.$t('intro_text.first')}}</span>
            <span class="red">{{this.$t('intro_text.second')}}</span>
            <span class="small black">?</span>
            <span class="small black">{{this.$t('intro_text.third')}}</span>
            <span class="red">{{this.$t('intro_text.fourth')}}</span>
            <span class="small black">{{this.$t('intro_text.fifth')}}</span>
            <span class="big red">{{this.$t('intro_text.six')}}</span>
            <span class="small black">{{this.$t('intro_text.seven')}}</span>
            <span class="big red">{{this.$t('intro_text.eight')}}</span>
            <span class="big red">{{this.$t('intro_text.nine')}}</span>
            <span class="small black">{{this.$t('intro_text.ten')}}</span>
            <span class="big red">{{this.$t('intro_text.eleven')}}</span>
            <span class="small black">{{this.$t('intro_text.twelve')}}</span>
          </div>
          <div class="intro__second-holder-text smallMobile">
            <span class="small black">{{this.$t('intro_text.first')}}</span>
            <span class="red">{{this.$t('intro_text.second')}}</span>
            <span class="small black">?</span>
            <span class="small black">{{this.$t('intro_text.third')}}</span>
            <span class="red">{{this.$t('intro_text.fourth')}}</span>
            <span class="small black">{{this.$t('intro_text.fifth')}}</span>
            <span class="big red">{{this.$t('intro_text.six')}}</span>
            <span class="small black">{{this.$t('intro_text.seven')}}</span>
            <span class="big red">{{this.$t('intro_text.eight')}}</span>
            <span class="big red">{{this.$t('intro_text.nine')}}</span>
            <span class="small black">{{this.$t('intro_text.ten')}}</span>
            <span class="big red">{{this.$t('intro_text.eleven')}}</span>
            <span class="small black">{{this.$t('intro_text.twelve')}}</span>
          </div>
          <div class="intro__second-holder-text-italic">{{this.$t('intro_second_text')}}</div>
          <div class="intro__second-holder-text-italic smallMobile">{{this.$t('intro_second_text')}}</div>

          <div class="intro__second-button-holders">
            <span @click="showRegister()" class="red-button">{{this.$t('navigation.register')}}</span>
            <router-link :to="'books'" class="red-text-button">{{this.$t('browseBooks')}}</router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showCookie" id="overbox">
      <span>{{this.$t('cookies')}}</span>
      <span @click="showCookie = false" class="gotIt">{{this.$t('gotit')}}</span>
    </div>
  </div>
</template>

<script>
import Header from "../intro/Header";
import Preload from "../loaders/Preload";
import BasicDropDownSearch from "../components/selectors/BasicDropDownSearch";
import { api } from "../app/api";
import {createCookie} from "../plugins/cookieTime";
import { timezone } from "../plugins/timezone";
export default {
  name: "Main",
  data: () => ({
    text: null,
    isMobile: false,
    moveDown: false,
    deltaInfo: null,
    showCookie: false,
    bookCategoryOptions: {},
    searchoptions: []
  }),
  components: {
    Header,
    Preload,
    Keypress: () => import("vue-keypress"),
    BasicDropDownSearch
  },
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    }
  },
  created() {
    let expireCookie = document.cookie.match(
      "(^|;) ?" + "bookCategoriesExpire" + "=([^;]*)(;|$)"
    );
    if (!expireCookie) {
      localStorage.removeItem("bookCategories");
    }

    let language = this.$i18n.locale;

    if (localStorage.getItem("bookCategories")) {
      let categories = localStorage.getItem("bookCategories");
      let parse = JSON.parse(categories);

      this.bookCategoryOptions = parse;
      this.searchoptions = this.bookCategoryOptions[language];
    }

    if (
      this.bookCategoryOptions.language === undefined ||
      this.bookCategoryOptions.language != this.$i18n.locale
    ) {
      let data = {
        language: this.$i18n.locale,
        timezone: timezone
      };

      this.$http.post(api + "/getfilterlists", data).then(response => {
        let language = this.$i18n.locale;

        this.bookCategoryOptions[language] =
          response.data.results.bookCategories;

        console.log(response.data.results.bookCategories);
        localStorage.setItem(
          "bookCategories",
          JSON.stringify(this.bookCategoryOptions)
        );
        createCookie("bookCategoriesExpire", "something", 360);
        this.searchoptions = this.bookCategoryOptions[language];
      });
    }
  },
  mounted() {
    // var scrollableElement = document.getElementById('scrollableElement');
    // var scrollableElementFirst = document.getElementById('scrollableElementFirst');
    // scrollableElement.addEventListener('wheel', this.findScrollDirectionOtherBrowsers);
    // scrollableElementFirst.addEventListener('wheel', this.findScrollDirectionOtherBrowsers);
    // scrollableElement.addEventListener('ontouchmove', this.findScrollDirectionOtherBrowsers);
    // scrollableElementFirst.addEventListener('ontouchmove', this.findScrollDirectionOtherBrowsers);
    // scrollableElement.addEventListener('keydown', this.findScrollDirectionOtherBrowsers);
    this.firstTimeCookie();
  },
  methods: {
    showRegister() {
      this.$refs.header.showRegister();
    },
    sendWord(word) {
      this.$router.push({ name: "Books", params: { text: word } });
    },
    moveSlideDown() {
      var elmnt = document.getElementById("scrollableElement");
      elmnt.scrollIntoView({
        behavior: "smooth"
      });
    },
    moveSlideUp() {
      this.moveDown = false;
      this.deltaInfo = 0;
    },
    moveSlideDownMobile() {
      var elmnt = document.getElementById("scrollableElement");
      elmnt.scrollIntoView({
        behavior: "smooth"
      });
    },
    findScrollDirectionOtherBrowsers(event) {
      if (event.wheelDelta) {
        this.deltaInfo = event.wheelDelta;
      } else {
        this.deltaInfo = -1 * event.deltaY;
      }
      if (event.keydown) {
        this.deltaInfo = event.keydown;
      } else {
        this.deltaInfo = -1 * event.deltaY;
      }
      if (this.deltaInfo > 0) {
        this.moveDown = false;
        var myDiv = document.getElementById("scrollableElement");
        myDiv.scrollTop = 0;
      }
      if (this.deltaInfo < 0) {
        this.moveDown = true;
      }
    },
    firstTimeCookie() {
      let visit = document.cookie.indexOf("FirstTime");

      if (visit === -1) {
        this.showCookie = true;
      }
      let expire = new Date();
      expire = new Date(expire.getTime() + 7776000000);
      document.cookie = "FirstTime=here; expires=" + expire;
    }
  }
};
</script>

<style scoped lang="scss">
@import "../styles/intro/intro";
</style>