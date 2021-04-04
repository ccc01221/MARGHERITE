<template>
  <div>
    <Header class="noOpacity" ref="header" :title="this.$t('books')"></Header>
    <div class="single-book">
      <div class="single-book__holder">
        <div class="container">
          <div class="single-book__title">
            <router-link :to="{name: 'Books'}">{{this.$t('books')}} /</router-link>
            {{this.book.title}}
          </div>
          <div class="single-book__content">
            <div class="single-book__image">
              <div v-if="loading" class="loading-container">
                <div class="loading-holder">
                  <div class="load"></div>
                </div>
              </div>
              <img v-else :src="book.image" />
            </div>
            <div class="single-book__author">
              <h2>
                <span>{{this.$t('general.by')}}</span>
                {{book.authors}}
              </h2>
              <div class="single-book__author-specs">
                <div>
                  <span>{{this.$t('general.category')}}</span>
                  <span class="red">{{this.book.category}}</span>
                </div>
                <div>
                  <span>{{this.$t('general.published')}}</span>
                  <span class="red">{{this.book.publishingYear}}</span>
                </div>
                <div>
                  <span>{{this.$t('general.isbn')}}</span>
                  <span class="red">{{this.book.isbn}}</span>
                </div>
                <div>
                  <span>{{this.$t('general.language')}}</span>
                  <span class="red">{{this.book.language}}</span>
                </div>
                <div>
                  <span>{{this.$t('general.price')}}</span>
                  <span
                    class="red"
                    v-if="this.currency"
                  >{{(this.book.price * this.currency.rate).toFixed(2)}} {{this.currency.currency}}</span>
                </div>
                <a :href="this.book.amazonLink" target="_blank">{{this.$t('general.amazon')}}</a>
              </div>
              <p v-html="this.book.description"></p>
            </div>
          </div>
          <div class="single-book__second-title">
            <b>{{this.$t('general.teachers')}}</b>
            <div class="single-book__second-title-selector-search">
              <input
                @keyup.enter="focusOut"
                v-model="filterText"
                :placeholder="this.$t('booksPage.search')"
                type="text"
                ref="searchSelector"
              />
              <span class="searchbutton">
                <i class="fal fa-search"></i>
              </span>
            </div>
          </div>
          <div class="single-book__teachers">
            <div
              :class="{'showExpandedGeneral': author.read}"
              :id="'height_second'+index"
              v-if="filteredElementsAuthor && filteredElementsAuthor.length"
              v-for="(author,index) in filteredElementsAuthor"
              :key="author.ID"
              class="single-book__teacher-block red"
            >
              <div :id="'height'+index" class="single-book__teacher-left">
                <div class="single-book__teacher-left-first">
                  <h2>
                    {{author.name}}
                    <country-flag :country="author.country" size="normal" />
                  </h2>
                  <div class="single-book__teacher-image">
                    <img :src="apiLink+'/getpicture?key='+author.picture_key" />
                  </div>
                  <div class="single-book__teacher-stars">
                    <star-rating
                      :increment="0.1"
                      :max-rating="5"
                      :read-only="true"
                      :rating="author.rating"
                      inactive-color="#747474"
                      :rounded-corners="true"
                      :show-rating="false"
                      active-color="#fda700"
                      :star-size="30"
                    ></star-rating>
                  </div>
                  <span class="single-book__teacher-lessons">
                    <span>
                      <strong>{{author.taughtLessons}}</strong>
                    </span>
                    <span>{{$t('general.lessons')}}</span>
                  </span>
                  <span class="single-book__teacher-books">
                    <span>
                      <strong>{{author.booksWritten}}</strong>
                    </span>
                    <span
                      v-if="author.booksWritten === 1"
                    >{{$t('general.bookWritten')}}{{$t('general.written')}}</span>
                    <span v-else>{{$t('general.booksWritten')}}{{$t('general.written')}}</span>
                  </span>
                  <span class="single-book__teacher-experts">
                    <span>{{$t('general.expertFor')}}</span>
                    <span>
                      <strong>{{author.expertFor}}</strong>
                      {{$t('general.booksWritten')}}
                    </span>
                  </span>
                  <span
                    class="browseBooks"
                    @click="showTeacherBooks(author.ID,author.name)"
                  >{{$t('general.browseBooks')}}</span>
                </div>
                <div class="single-book__teacher-left-second">
                  <h2>
                    {{author.name}}
                    <country-flag :country="author.country" size="normal" />
                  </h2>
                  <span class="single-book__teacher-title">{{$t('author')}}</span>
                  <div class="single-book__teacher-specs">
                    <div>
                      <span>{{$t('general.speaks')}}</span>
                      <span class="red">{{author.speaks}}</span>
                    </div>
                    <div>
                      <span>{{$t('general.hourlyRate')}}</span>
                      <span v-if="author.hourlyRateRound" class="red">
                        {{author.hourlyRateRound}}
                        {{currency.currency}}
                      </span>
                      <span v-else class="red">-$</span>
                    </div>
                  </div>
                  <h3>{{$t('general.introduction')}}</h3>
                  <p :class="{'showExpanded': author.read}" v-html="author.introduction"></p>
                  <span @click="readMore(author)" class="readMore red">
                    <span v-if="!author.read">{{$t('readMore')}}</span>
                    <span v-else>{{$t('readLess')}}</span>
                  </span>
                </div>
              </div>
            </div>

            <div
              :class="{'showExpandedGeneral' : author.read}"
              :id="'heightE_second'+index"
              v-if="filteredElementsExpert && filteredElementsExpert.length"
              v-for="(author,index) in filteredElementsExpert"
              :key="author.ID"
              class="single-book__teacher-block blue"
            >
              <div :id="'heightE'+index" class="single-book__teacher-left">
                <div class="single-book__teacher-left-first">
                  <h2>
                    {{author.name}}
                    <country-flag :country="author.country" size="normal" />
                  </h2>
                  <div class="single-book__teacher-image">
                    <img :src="apiLink+'/getpicture?key='+author.picture_key" />
                  </div>
                  <div class="single-book__teacher-stars">
                    <star-rating
                      :increment="0.1"
                      :max-rating="5"
                      :read-only="true"
                      :rating="author.rating"
                      inactive-color="#747474"
                      :rounded-corners="true"
                      :show-rating="false"
                      active-color="#fda700"
                      :star-size="30"
                    ></star-rating>
                  </div>
                  <span class="single-book__teacher-lessons">
                    <span>
                      <strong>{{author.taughtLessons}}</strong>
                    </span>
                    <span>{{$t('general.lessons')}}</span>
                  </span>
                  <span class="single-book__teacher-books">
                    <span>
                      <strong>{{author.booksWritten}}</strong>
                    </span>
                    <span
                      v-if="author.booksWritten === 1"
                    >{{$t('general.bookWritten')}}{{$t('general.written')}}</span>
                    <span v-else>{{$t('general.booksWritten')}}{{$t('general.written')}}</span>
                  </span>
                  <span class="single-book__teacher-experts">
                    <span>{{$t('general.expertFor')}}</span>
                    <span>
                      <strong>{{author.expertFor}}</strong>
                      {{$t('books')}}
                    </span>
                  </span>
                  <span
                    class="browseBooks"
                    @click="showTeacherBooks(author.ID,author.name)"
                  >{{$t('general.browseBooks')}}</span>
                </div>
                <div class="single-book__teacher-left-second">
                  <h2>
                    {{author.name}}
                    <country-flag :country="author.country" size="normal" />
                  </h2>
                  <span class="single-book__teacher-title">{{$t('expert')}}</span>
                  <div class="single-book__teacher-specs">
                    <div>
                      <span>{{$t('general.speaks')}}</span>
                      <span class="red">{{author.speaks}}</span>
                    </div>
                    <div>
                      <span>{{$t('general.hourlyRate')}}</span>
                      <span v-if="author.hourlyRateRound" class="red">
                        {{author.hourlyRateRound}}
                        {{currency.currency}}
                      </span>
                    </div>
                  </div>
                  <h3>{{$t('general.introduction')}}</h3>
                  <p :class="{'showExpanded': author.read}" v-html="author.introduction"></p>
                  <span @click="readMore(author)" class="readMore blue">
                    <span v-if="!author.read">{{$t('readMore')}}</span>
                    <span v-else>{{$t('readLess')}}</span>
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Login from "../forms/Login";
import CountryFlag from "vue-country-flag";
import Signup from "../forms/Signup";
import { mixin as clickaway } from "vue-clickaway";
import { api } from "../app/api";
import { timezone } from "../plugins/timezone";
import moment from "moment";
import StarRating from "vue-star-rating";
import Header from "../intro/Header";
export default {
  name: "SingleBook",
  mixins: [clickaway],
  props: {
    getFilters: {},
    currency: {}
  },
  data: function() {
    return {
      filterText: "",
      apiLink: api,
      modal: {
        isLogin: false,
        isRegister: false,
        isTeacher: false,
        scrollUp: false
      },
      timezone2: timezone,
      dataLoaded: false,
      loading: true,
      book: {},
      authors: [],
      experts: [],
      generalDay: [],
      isMobile: false,
      config: {
        rating: 5.0,
        isIndicatorActive: false,
        style: {
          fullStarColor: "#fda700",
          emptyStarColor: "#737373",
          starWidth: 20,
          starHeight: 20
        }
      }
    };
  },
  watch: {
    currency: function() {
      this.authors.filter(author => {
        if (author.hourlyRateFrom) {
          this.$set(
            author,
            "hourlyRateRound",
            (author.hourlyRateFrom * this.currency.rate).toFixed(2)
          );
        }
      });
      this.experts.filter(author => {
        if (author.hourlyRateFrom) {
          this.$set(
            author,
            "hourlyRateRound",
            (author.hourlyRateFrom * this.currency.rate).toFixed(2)
          );
        }
      });
    }
  },
  created() {
    let data;
    let expireCookie = document.cookie.match(
      "(^|;) ?" + "filterExpire" + "=([^;]*)(;|$)"
    );
    if (!expireCookie) {
      localStorage.removeItem("savedSettings");
      localStorage.removeItem("getFilters");
    }
    let language = this.$i18n.locale;

    if (localStorage.getItem("getFilters") && expireCookie) {
      let getFilters = localStorage.getItem("getFilters");
      let parse = JSON.parse(getFilters);
      let getLanguages = parse.author_properties.languages;
      let getTeachers = parse.author_properties.teacher_type;
      let getPriceRange = parse.author_properties.price_range;
      let getFrom = parse.author_properties.from;


      data = {
        isbn: this.$route.params.id,
        language: language,
        timezone: timezone,
        author_properties: {
          languages: getLanguages,
          teacher_type: getTeachers,
          price_range: getPriceRange,
          from: getFrom,
        }
      };
      // console.log(data);
    } else {
      data = {
        isbn: this.$route.params.id,
        language: language,
        timezone: timezone,
        author_properties: {
          teacher_type: {
            author: true,
            expert: true
          }
        }
      };
    }
    let $this = this;
    this.$http.post(api + "/getsinglebook", data).then(response => {
      this.book = response.data.results.book;
      this.$set(this.book, "image", null);
      this.authors = response.data.results.authors;
      this.experts = response.data.results.experts;
      this.timezone2 = response.data.results.timezone;
      this.authors.filter(author => {
        if (author.hourlyRateFrom) {
          this.$set(
            author,
            "hourlyRateRound",
            (author.hourlyRateFrom * this.currency.rate).toFixed(2)
          );
        }
        this.$set(author, "read", false);
      });
      this.experts.filter(author => {
        if (author.hourlyRateFrom) {
          this.$set(
            author,
            "hourlyRateRound",
            (author.hourlyRateFrom * this.currency.rate).toFixed(2)
          );
        }
        this.$set(author, "read", false);
      });
      this.book.image = api + "/getpicture?key=" + this.book.picture_key;
      if (this.book.image) {
        this.loading = false;
      }
      this.dataLoaded = true;
      this.$nextTick(() => {
        this.authors.filter((author, index) => {
          let element = document.getElementById("height" + index).offsetHeight;
          let paragraph = document.getElementById("height_second" + index);
          paragraph.setAttribute("style", "height:" + element + "px");
        });
        this.experts.filter((author, index) => {
          let element = document.getElementById("heightE" + index).offsetHeight;
          let paragraph = document.getElementById("heightE_second" + index);
          paragraph.setAttribute("style", "height:" + element + "px");
        });
      });
    });
  },
  methods: {
    focusOut: function() {
      this.$refs.searchSelector.focus();
      setTimeout(() => {
        this.$refs.searchSelector.blur();
      }, 50);
    },
    readMore(author) {
      if (!author.read) {
        this.$set(author, "read", true);
      } else {
        this.$set(author, "read", false);
      }
      this.$forceUpdate();
    },
    showTeacherBooks(teacherID, teacherName) {
      this.$router.push({
        name: "teacher",
        params: {
          teacherID: teacherID,
          teacherName: teacherName,
          text: teacherName
        }
      });
    },
    awayMobile() {
      this.isMobile = false;
    }
  },
  mounted() {

  },
  computed: {
    filteredElementsAuthor() {
      return this.authors.filter(element => {
        return element.name.match(new RegExp(this.filterText, "i"));
      });
    },
    filteredElementsExpert() {
      return this.experts.filter(element => {
        return element.name.match(new RegExp(this.filterText, "i"));
      });
    },
    margin: function() {
      return 0; //this.mymargin;
    }
  },

  components: { Login, Signup, StarRating, CountryFlag, Header }
};
</script>

<style lang="scss">
@import "../styles/intro/intro";
@import "../styles/intro/single-book";
</style>