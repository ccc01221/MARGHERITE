<template>
  <div class="books">
    <Header class="noOpacity" ref="header" :title="this.$t('books')"></Header>
    <div class="books__holder" :class="{'fixedPositionSearchMargin': this.scrolled}">
      <div class="container">
        <div :class="{'fixedPositionSearch': this.scrolled}" class="books__search mobileOnly">
          <div class="mobileBorder">
            <input
              ref="searchMobile"
              @keyup.enter="searchBookMobile"
              v-model="search"
              :placeholder="this.$t('booksPage.search')"
              type="text"
            />
            <span class="searchbutton" @click="searchBookMobile">
              <i class="fal fa-search"></i>
            </span>
          </div>
        </div>
        <div :class="{'fixedPosition': this.scrolled}" class="books__holder-properties">
          <div class="books__holder-properties-left">
            <div
              :class="{'activeFilter': this.hoverBookTitle}"
              class="books__holder-properties-title"
            >
              <h3 @click="showHoverBook">{{this.$t('book')}}</h3>
              <i class="fas fa-angle-right"></i>
            </div>
            <div
              :class="{'showDropdown': this.hoverBook, 'dontShow': filters.category || filters.price || filters.publication || filters.languages}"
              class="books__holder-properties-left-dropdown"
            >
              <div class="menu" :class="{'iDevice': this.iDevice}">
                <span @click="openFilterCategory()">
                  {{this.$t('booksPage.category')}}
                  <i
                    class="black"
                  >({{this.bookCategoryValue.length}})</i>
                </span>
              </div>
              <div class="menu" :class="{'iDevice': this.iDevice}">
                <span @click="openFilterPrice()">
                  {{this.$t('booksPage.price')}}
                  <i
                    v-if="(this.valueBook[0]!=null || this.valueBook[1]!=null) && ((this.valueBook[0])>this.priceOptions.min || (this.valueBook[1])<this.priceOptions.max)"
                    class="black"
                  >(*)</i>
                </span>
              </div>
              <div class="menu" :class="{'iDevice': this.iDevice}">
                <span @click="openFilterLanguages()">
                  {{this.$t('booksPage.languages')}}
                  <i
                    class="black"
                  >({{this.bookLanguageValue.length}})</i>
                </span>
              </div>
              <div class="menu" :class="{'iDevice': this.iDevice}">
                <span @click="openFilterPublication()">
                  {{this.$t('booksPage.publication')}}
                  <i
                    v-if="this.years.from!=null ||this.years.to != null"
                    class="black"
                  >(*)</i>
                </span>
              </div>
              <div class="books__filter-mainfooter">
                <div
                  @click="clearBookFilters()"
                  :class="{'iDevice': this.iDevice}"
                  class="clear"
                >{{this.$t('booksPage.clear')}}</div>
                <div
                  @click="applyFilters"
                  :class="{'iDevice': this.iDevice}"
                >{{this.$t('booksPage.apply')}}</div>
              </div>
            </div>
            <div
              v-if="filters.category"
              :class="{'mobileDropdown': filters.category}"
              class="books__filter"
            >
              <i @click="openFilterCategory()" class="mobileCloseTabs fas fa-times"></i>
              <span class="books__filter-title">{{this.$t('booksPage.category')}}</span>
              <div class="books__filter-holder">
                <div>
                  <selector
                    v-model="bookCategoryValue"
                    :options="bookCategoryOptions"
                    category="'booksCategories'"
                  />
                </div>
              </div>
              <div class="books__filter-footer">
                <span @click="clearCategories" class="clear">{{this.$t('booksPage.clear')}}</span>
                <span @click="applyFilters">{{this.$t('booksPage.apply')}}</span>
              </div>
            </div>

            <div
              v-if="filters.price"
              :class="{'mobileDropdown': filters.price}"
              class="books__filter"
            >
              <i @click="openFilterPrice()" class="mobileCloseTabs fas fa-times"></i>
              <span class="books__filter-title">{{this.$t('booksPage.price')}}</span>
              <div class="books__filter-holder price-holder">
                <span
                  class="books__filter-price"
                >{{(valueBook[0] * this.currency.rate).toFixed(2)}}{{this.currency.symbol}} - {{(valueBook[1] * this.currency.rate).toFixed(2)}}{{this.currency.symbol}}</span>
                <img :src="histogramBook" />
                <vue-slider
                  @drag-start="dragStart"
                  @drag-end="dragEnd"
                  v-bind="priceOptions"
                  v-if="filters.price"
                  :dot-options="dotOptions"
                  v-model="valueBook"
                  :class="{'dragStarted' : this.isDragingStarted}"
                />
              </div>
              <div class="books__filter-footer">
                <span @click="clearPrice" class="clear">{{this.$t('booksPage.clear')}}</span>
                <span @click="applyFilters">{{this.$t('booksPage.apply')}}</span>
              </div>
            </div>

            <div
              v-if="filters.languages"
              :class="{'mobileDropdown': filters.languages}"
              class="books__filter"
            >
              <i @click="openFilterLanguages()" class="mobileCloseTabs fas fa-times"></i>
              <span class="books__filter-title">{{this.$t('booksPage.languages')}}</span>
              <div class="books__filter-holder">
                <div>
                  <Selector
                    v-model="bookLanguageValue"
                    :options="bookLanguageOptions"
                    :category="'booklanguages'"
                  ></Selector>
                </div>
              </div>
              <div class="books__filter-footer">
                <span @click="clearBookLanguages" class="clear">{{this.$t('booksPage.clear')}}</span>
                <span @click="applyFilters">{{this.$t('booksPage.apply')}}</span>
              </div>
            </div>

            <div
              v-if="filters.publication"
              :class="{'mobileDropdown': filters.publication}"
              class="books__filter"
            >
              <i @click="openFilterPublication()" class="mobileCloseTabs fas fa-times"></i>
              <span class="books__filter-title">{{this.$t('booksPage.publication')}}</span>
              <div class="books__filter-holder">
                <div class="form-group">
                  <span class="books__filter-text">{{this.$t('booksPage.fromString')}}</span>
                  <div class="content">
                    <input
                      :placeholder="this.$t('booksPage.year')"
                      type="text"
                      class="form-control"
                      v-model="years.from"
                    />
                  </div>
                </div>
                <div class="form-group">
                  <span class="books__filter-text">{{this.$t('booksPage.to')}}</span>
                  <div class="content">
                    <input
                      :placeholder="this.$t('booksPage.year')"
                      type="text"
                      class="form-control"
                      v-model="years.to"
                    />
                  </div>
                </div>
              </div>
              <div class="books__filter-footer">
                <span @click="clearBookYear" class="clear">{{this.$t('booksPage.clear')}}</span>
                <span @click="applyFilters">{{this.$t('booksPage.apply')}}</span>
              </div>
            </div>
          </div>
          <div class="books__holder-properties-right">
            <div
              :class="{'activeFilter': this.hoverAuthorTitle}"
              class="books__holder-properties-title"
            >
              <h3 @click="showHoverAuthor">{{this.$t('teacher')}}</h3>
              <i class="fas fa-angle-right"></i>
            </div>

            <div
              :class="{'showDropdown': this.hoverAuthor, 'dontShow': authorTabs.price || authorTabs.teacher || authorTabs.available || authorTabs.fromCountry || authorTabs.languages}"
              class="books__holder-properties-left-dropdown rightDrop"
            >
              <div class="menu" :class="{'iDevice': this.iDevice}">
                <span @click="openGeneralTab()">
                  {{this.$t('booksPage.availability')}}
                  <i
                    class="black"
                    v-if="(this.arrayDays.length > 0) || (this.arrayDaysGeneral.length > 0) || (this.arrayHours.length > 0) || (this.arrayTimesGeneral.length > 0)"
                  >(*)</i>
                </span>
              </div>
              <div class="menu" :class="{'iDevice': this.iDevice}">
                <span @click="openPriceRange()">
                  {{this.$t('booksPage.price')}}
                  <i
                    class="black"
                    v-if="(this.valueAuthor[1]!=null || this.valueAuthor[0]!=null) && ((this.valueAuthor[0])>this.priceOptionsAuthor.min || (this.valueAuthor[1])<this.priceOptionsAuthor.max)"
                  >(*)</i>
                </span>
              </div>
              <div class="menu" :class="{'iDevice': this.iDevice}">
                <span @click="openTeacherTab()" :class="{'activeTab' : authorTabs.teacher}">
                  {{this.$t('booksPage.teacherType')}}
                  <i
                    v-if="!this.checked.author || !this.checked.expert"
                    class="black"
                  >(*)</i>
                </span>
              </div>
              <div class="menu" :class="{'iDevice': this.iDevice}">
                <span @click="openFromTab" :class="{'activeTab' : authorTabs.fromCountry}">
                  {{this.$t('booksPage.fromCountry')}}
                  <i
                    class="black"
                  >({{this.countryValue.length}})</i>
                </span>
              </div>
              <div class="menu" :class="{'iDevice': this.iDevice}">
                <span @click="openLanguagesTab" :class="{'activeTab' : authorTabs.languages}">
                  {{this.$t('booksPage.languages')}}
                  <i
                    class="black"
                  >({{this.authorLanguageValue.length}})</i>
                </span>
              </div>
              <div class="books__filter-mainfooter">
                <div
                  @click="clearAuthorFilters()"
                  :class="{'iDevice': this.iDevice}"
                  class="clear"
                >{{this.$t('booksPage.clear')}}</div>
                <div
                  @click="applyFilters"
                  :class="{'iDevice': this.iDevice}"
                >{{this.$t('booksPage.apply')}}</div>
              </div>
            </div>
            <div
              v-if="authorTabs.available"
              :class="{'showDropdown': this.hoverAuthor}"
              class="books__holder-properties-right-dropdown"
            >
              <div class="books__time">
                <i @click="closeGeneralTab()" class="mobileCloseTabs fas fa-times"></i>
                <div class="books__time-header">
                  <span
                    @click="openGeneralTab()"
                    :class="{'activeTab' : authorTabs.general}"
                  >{{this.$t('booksPage.generalTime')}}</span>
                  <span
                    @click="openSpecificTab()"
                    :class="{'activeTab' : authorTabs.specific}"
                  >{{this.$t('booksPage.specificTime')}}</span>
                </div>
                <div v-if="authorTabs.general">
                  <div v-if="authorTabs.general" class="books__time-general">
                    <div class="books__time-general-hours">
                      <span>{{this.$t('booksPage.timeRange')}}</span>
                      <div>
                        <span
                          @click="selectGeneralTime(time,index)"
                          :class="{'selectedSpecificDay': time.selected}"
                          v-for="(time,index) in generalTime"
                          :key="`time-${index}`"
                        >{{time.hour}}</span>
                      </div>
                    </div>
                    <div class="books__time-general-days">
                      <span>{{this.$t('booksPage.daysOfTheWeek')}}</span>
                      <div>
                        <span
                          @click="selectGeneralDay(day,index)"
                          :class="{'selectedSpecificDay': day.selected}"
                          v-for="(day,index) in generalDay"
                          :key="day.day"
                        >{{day.day}}</span>
                      </div>
                    </div>
                    <div class="books__filter-footer">
                      <span @click="clearGeneral" class="clear">{{this.$t('booksPage.clear')}}</span>
                      <span @click="applyFilters">{{this.$t('booksPage.apply')}}</span>
                    </div>
                  </div>
                </div>
                <div v-if="authorTabs.specific" class="books__time-specific">
                  <div class="books__time-specific-days">
                    <div
                      class="books__time-header-days"
                    >{{firstDayOfWeek | moment("MMM DD, YYYY")}} - {{lastDayOfWeek | moment("MMM DD, YYYY")}}</div>
                    <slick @afterChange="changeDates" ref="slick" :options="slickOptions">
                      <div
                        class="books__time-specific-days-slide"
                        :key="d.date"
                        v-for="(d,i) in days"
                      >
                        <p>{{d.date | moment("dd")}}</p>
                        <p
                          :class="{'selectedSpecificDay' : d.selected}"
                          @click="selectDay(d,i)"
                        >{{d.date | moment("DD")}}</p>
                      </div>
                    </slick>
                    <div class="books__time-header-hours">{{firstHour}} - {{lastHour}}</div>
                    <div class="slider-hours">
                      <slick
                        @afterChange="changeHours"
                        ref="slick_second"
                        :options="slickOptionsHours"
                      >
                        <div
                          class="books__time-specific-days-slide"
                          :key="h.time"
                          v-for="(h,i) in hours"
                        >
                          <p
                            :class="{'selectedSpecificDay' : h.selected}"
                            @click="selectHour(h,i)"
                          >{{h.time}}</p>
                        </div>
                      </slick>
                    </div>
                  </div>
                  <div class="books__filter-footer mobileShow">
                    <span @click="clearDates" class="clear">{{this.$t('booksPage.clear')}}</span>
                    <span @click="applyFilters">{{this.$t('booksPage.apply')}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="authorTabs.price"
              :class="{'mobileDropdown': authorTabs.specific}"
              class="books__filter author__filter"
            >
              <i @click="openPriceRange()" class="mobileCloseTabs fas fa-times"></i>
              <span class="books__filter-title">{{this.$t('booksPage.price')}}</span>
              <div class="books__filter-holder price-holder">
                <span
                  class="books__filter-price"
                >{{(valueAuthor[0] * this.currency.rate).toFixed(2)}}{{this.currency.symbol}} - {{(valueAuthor[1] * this.currency.rate).toFixed(2)}}{{this.currency.symbol}}</span>
                <img :src="histogramAuthor" />
                <vue-slider
                  @drag-start="dragStart"
                  @drag-end="dragEnd"
                  v-bind="priceOptionsAuthor"
                  v-if="authorTabs.price"
                  :dot-options="dotOptions"
                  v-model="valueAuthor"
                  :class="{'dragStarted' : this.isDragingStarted}"
                />
              </div>
              <div class="books__filter-footer">
                <span @click="clearPriceAuthor" class="clear">{{this.$t('booksPage.clear')}}</span>
                <span @click="applyFilters">{{this.$t('booksPage.apply')}}</span>
              </div>
            </div>
            <div
              v-if="authorTabs.fromCountry"
              :class="{'mobileDropdown': authorTabs.fromCountry}"
              class="books__filter author__filter"
            >
              <i @click="openFromTab()" class="mobileCloseTabs fas fa-times"></i>
              <span class="books__filter-title">{{this.$t('booksPage.fromCountry')}}</span>
              <div class="books__filter-holder">
                <div>
                  <Selector
                    v-model="countryValue"
                    :options="options"
                    :category="'authorcountriesfrom'"
                  ></Selector>
                </div>
              </div>
              <div class="books__filter-footer mobileShow">
                <span @click="clearCountries" class="clear">{{this.$t('booksPage.clear')}}</span>
                <span @click="applyFilters">{{this.$t('booksPage.apply')}}</span>
              </div>
            </div>
            <div
              v-if="authorTabs.teacher"
              :class="{'mobileDropdown': authorTabs.teacher}"
              class="books__filter author__filter"
            >
              <i @click="openTeacherTab()" class="mobileCloseTabs fas fa-times"></i>
              <span class="books__filter-title">{{this.$t('booksPage.teacher')}}</span>
              <div class="books__filter-holder">
                <div>
                  <input v-model="checked.author" type="checkbox" id="teacher" />
                  <label for="teacher">
                    <span>{{this.$t('author')}}</span>
                  </label>
                </div>
                <div>
                  <input v-model="checked.expert" type="checkbox" id="expert" />
                  <label for="expert">
                    <span>{{this.$t('booksPage.expert')}}</span>
                  </label>
                </div>
              </div>
              <div class="books__filter-footer mobileShow">
                <span @click="clearTeacher" class="clear">{{this.$t('booksPage.clear')}}</span>
                <span @click="applyFilters">{{this.$t('booksPage.apply')}}</span>
              </div>
            </div>
            <div
              v-if="authorTabs.languages"
              :class="{'mobileDropdown': authorTabs.languages}"
              class="books__filter author__filter"
            >
              <i @click="openLanguagesTab()" class="mobileCloseTabs fas fa-times"></i>
              <span class="books__filter-title">{{this.$t('booksPage.languages')}}</span>
              <div class="books__filter-holder">
                <div>
                  <Selector
                    v-model="authorLanguageValue"
                    :options="languageOptions"
                    :category="'authorlanguge'"
                  ></Selector>
                </div>
              </div>
              <div class="books__filter-footer">
                <span @click="clearAuthorLanguages" class="clear">{{this.$t('booksPage.clear')}}</span>
                <span @click="applyFilters">{{this.$t('booksPage.apply')}}</span>
              </div>
            </div>

            <div class="books__search noMobile">
              <input
                @keyup.enter="searchBook"
                v-model="search"
                :placeholder="this.$t('booksPage.search')"
                type="text"
              />
              <span class="searchbutton" @click="searchBookMobile">
                <i class="fal fa-search"></i>
              </span>
            </div>
          </div>
        </div>
        <div class="numberOfBooks">
          <div v-if="filteredBooks.length === 1">
            <b style="margin-right: 5px">{{filteredBooks.length}}</b>
            {{this.$t('booksSingle')}}
          </div>
          <div v-else>
            <b style="margin-right: 5px">{{filteredBooks.length}}</b>
            {{this.$t('booksFound')}}
          </div>
        </div>
        <books-list
          @showLoginForFavor="showLoginForFavor"
          class="books-holder"
          :list="filteredBooks"
          :loading="loadingBooks"
        ></books-list>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../intro/Header";
import TextTruncate from "vue-text-truncate";
import VueSlider from "vue-slider-component";
import { mixin as clickaway } from "vue-clickaway";
import { api } from "../app/api";
import {createCookie} from "../plugins/cookieTime";
import { timezone } from "../plugins/timezone";
import Slick from "vue-slick";
import Login from "../forms/Login";
import Signup from "../forms/Signup";
import moment from "moment";
import Selector from "../components/selectors/Selector";
import { mapGetters } from "vuex";
import Vodal from "vodal";
import BooksList from "../components/BooksList";

export default {
  name: "Books",
  mixins: [clickaway],
  props: {
    currency: {}
  },
  data: () => ({
    isDragingStarted: false,
    options: [],
    languageOptions: [],
    bookLanguageOptions: [],
    bookCategoryOptions: [],
    loadingBooks: false,
    days: [],
    generalDay: [],
    histogramBook: null,
    histogramAuthor: null,
    numberOfTeachers: 2,
    savedSettings: {
      checked: [],
      bookPrice: [],
      authorPrice: [],
      published_years: [],
      countries: [],
      authorLanguages: [],
      bookLanguages: [],
      bookCategoryValue: [],
      generalDay: [],
      generalTime: [],
      days: [],
      hours: []
    },
    generalTime: [
      {
        hour: "00-04",
        selected: false,
        min: 0,
        max: 4
      },
      {
        hour: "04-08",
        selected: false,
        min: 4,
        max: 8
      },
      {
        hour: "08-12",
        selected: false,
        min: 8,
        max: 12
      },
      {
        hour: "12-16",
        selected: false,
        min: 12,
        max: 16
      },
      {
        hour: "16-20",
        selected: false,
        min: 16,
        max: 20
      },
      {
        hour: "20-24",
        selected: false,
        min: 20,
        max: 24
      }
    ],
    countryValue: [],
    authorLanguageValue: [],
    bookLanguageValue: [],
    bookCategoryValue: [],
    selectedSpecificDays: [],
    valueBook: [],
    valueAuthor: [],
    firstDayOfWeek: null,
    lastDayOfWeek: null,
    firstHour: null,
    lastHour: null,
    hoverBook: false,
    hoverBookTitle: false,
    hoverAuthorTitle: false,
    hoverAuthor: false,
    hoverTag: false,
    search: "",
    filteredBooks: [],
    hours: {},
    authorTabs: {
      available: false,
      general: true,
      specific: false,
      price: false,
      fromCountry: false,
      teacher: false,
      languages: false
    },
    years: {
      from: null,
      to: null
    },
    checked: {
      author: true,
      expert: true
    },
    filters: {
      category: false,
      languages: false,
      publication: false,
      price: false
    },
    priceOptions: {
      min: 0,
      max: 300,
      speed: 0.5,
      width: "100%",
      tooltipDir: "bottom",
      formatter: v => `€${("" + v).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
      disabled: false,
      enableCross: false,
      show: true
    },
    priceOptionsAuthor: {
      min: 0,
      max: 300,
      speed: 0.5,
      width: "100%",
      tooltipDir: "bottom",
      formatter: v => `€${("" + v).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`,
      disabled: false,
      enableCross: false,
      show: true
    },
    dotOptions: [
      {
        tooltip: "none",
        style: {
          backgroundColor: "#F77A70"
        }
      },
      {
        tooltip: "none",
        style: {
          backgroundColor: "#F77A70"
        }
      }
    ],
    slickOptions: {
      slidesToShow: 7,
      slidesToScroll: 7,
      infinite: false
    },
    slickOptionsHours: {
      slidesToShow: 6,
      slidesToScroll: 6,
      infinite: false
    },
    books: [],
    modal: {
      isLogin: false,
      isRegister: false,
      isTeacher: false,
      scrollUp: false
    },
    isMobile: false,
    iDevice: false,
    moveDown: false,
    showCookie: false,
    arrayHours: [],
    arrayDays: [],
    arrayDaysGeneral: [],
    arrayTimesGeneral: [],
    scrolled: false,
    selectedFilters: {
      phrase: null,
      timezone: timezone,
      book_properties: {
        categories: [],
        price_range: {
          min: null,
          max: null
        },
        publication_year: {},
        languages: []
      },
      author_properties: {
        availability: {
          general: {
            time_range: [],
            week_days: []
          },
          specific: {
            time_range: {
              dates: [],
              hours: []
            }
          }
        },
        teacher_type: {},
        price_range: {
          min: null,
          max: null
        },
        languages: [],
        from: []
      }
    }
  }),
  destroyed() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("touchmove", this.handleScroll);
  },
  created() {
    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("touchmove", this.handleScroll);

    this.loadingBooks = true;
    let expireCookie = document.cookie.match(
      "(^|;) ?" + "filterExpire" + "=([^;]*)(;|$)"
    );
    if (!expireCookie) {
      localStorage.removeItem("savedSettings");
    }

    if (this.$route.params.text && this.$route.params.text !== " ") {
      this.search = this.$route.params.text;
    }

    if (localStorage.getItem("savedSettings")) {
      let savedSettings = localStorage.getItem("savedSettings");
      let parse = JSON.parse(savedSettings);
      if (!this.$route.params.text) this.search = parse.phrase;
      this.checked = parse.checked[0];

      this.histogramBook = parse.bookPrice[3];
      this.histogramAuthor = parse.authorPrice[3];

      this.valueBook = [parse.bookPrice[0], parse.bookPrice[1]];
      this.valueAuthor = [parse.authorPrice[0], parse.authorPrice[1]];

      this.priceOptions = parse.bookPrice[2];
      this.priceOptionsAuthor = parse.authorPrice[2];

      this.years = parse.published_years[0];

      if (parse.countries[0] === this.$i18n.locale) {
        this.countryValue = parse.countries[1];
        this.authorLanguageValue = parse.authorLanguages[1];
        this.bookLanguageValue = parse.bookLanguages[1];
        this.bookCategoryValue = parse.bookCategoryValue[1];
        this.languageOptions = parse.authorLanguages[2];
        this.bookLanguageOptions = parse.bookLanguages[2];
        this.bookCategoryOptions = parse.bookCategoryValue[2];
        this.options = parse.countries[2];
      } else {
        this.options = [];
      }

      this.generalDay = parse.generalDay;
      this.generalTime = parse.generalTime;
      this.days = parse.days;
      this.hours = parse.hours;
      this.arrayHours = [];
      this.hours.filter(value => {
        let hourNum = value.timeForApi;
        let $this = this;
        if (value.selected) {
          $this.arrayHours.push({
            hour: hourNum
          });
        }
        this.$forceUpdate();
      });
      this.arrayDays = [];
      this.days.filter(value => {
        let $this = this;
        if (value.selected) {
          let day = moment(value.date).format("DD-MM-YYYY");
          this.arrayDays.push({
            date: day
          });
        }
        this.$forceUpdate();
      });
      this.arrayTimesGeneral = [];
      this.generalTime.filter(value => {
        if (value.selected) {
          this.arrayTimesGeneral.push({
            min: value.min,
            max: value.max
          });
        }
        this.$forceUpdate();
      });
      this.arrayDaysGeneral = [];
      this.generalDay.filter(value => {
        if (value.selected) {
          this.arrayDaysGeneral.push({
            day: value.dayForApi
          });
        }
        this.$forceUpdate();
      });
    }

    let dayIndex = 0;
    let newDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    let endDay = new Date();
    endDay.setDate(endDay.getDate() + 7);
    if (this.generalDay.length == 0) {
      this.generalDay = [];
      if (this.$i18n.locale === "de") {
        while (newDay <= endDay) {
          moment.locale("de");
          this.generalDay.push({
            day: moment(new Date(newDay)).format("dd"),
            selected: false
          });
          moment.locale("en");
          this.generalDay[dayIndex].dayForApi = moment(new Date(newDay)).format(
            "dd"
          );
          dayIndex++;
          newDay.setDate(newDay.getDate() + 1);
        }
      } else {
        moment.locale("en");
        while (newDay <= endDay) {
          this.generalDay.push({
            day: moment(new Date(newDay)).format("dd"),
            selected: false
          });
          this.generalDay[dayIndex].dayForApi = moment(new Date(newDay)).format(
            "dd"
          );
          dayIndex++;
          newDay.setDate(newDay.getDate() + 1);
        }
      }
    } else if (this.generalDay.length > 0) {
      if (this.$i18n.locale === "de") {
        while (newDay <= endDay) {
          moment.locale("de");
          this.generalDay[dayIndex].day = moment(new Date(newDay)).format("dd");
          dayIndex++;
          newDay.setDate(newDay.getDate() + 1);
        }
      } else {
        moment.locale("en");
        while (newDay <= endDay) {
          this.generalDay[dayIndex].day = moment(new Date(newDay)).format("dd");

          dayIndex++;
          newDay.setDate(newDay.getDate() + 1);
        }
      }
    }

    if (this.days.length == 0) this.getDays();
    this.firstDayOfWeek = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    this.lastDayOfWeek = new Date(
      new Date().getTime() + 24 * 60 * 60 * 1000 * 7
    );

    var d = new Date(),
      h = d.getHours();
    let timeArray = [];
    for (var i = 0; i < 10; ++i) {
      timeArray.push({
        time: "0" + i,
        timeForApi: i,
        selected: false
      });
    }
    for (var i = 10; i < 24; ++i) {
      timeArray.push({
        time: i,
        timeForApi: i,
        selected: false
      });
    }
    this.hours = timeArray;
    this.firstHour = this.hours[0].time;
    this.lastHour = this.hours[6].time;

    if (!this.options.length) {
      let data = {
        language: this.$i18n.locale,
        timezone: timezone
      };

      this.$http.post(api + "/getfilterlists", data).then(response => {
        this.options = response.data.results.teacherCountries;
        this.languageOptions = response.data.results.teacherLanguages;
        this.bookLanguageOptions = response.data.results.bookLanguages;
        this.bookCategoryOptions = response.data.results.bookCategories;
        this.saveSettings();
      });
    }

    if (!this.histogramBook || !this.histogramAuthor) {
      this.$http.get(api + "/priceranges").then(response => {
        let minBook = response.data.price_range_books.min;
        let maxBook = response.data.price_range_books.max;
        let minAuthor = response.data.price_range_authors.min;
        let maxAuthor = response.data.price_range_authors.max;
        minBook = Math.floor(minBook);
        maxBook = Math.round(maxBook);
        minAuthor = Math.floor(minAuthor);
        maxAuthor = Math.round(maxAuthor);

        let calculateInterval = (maxBook - minBook) / 50;
        if (calculateInterval < 1 && calculateInterval >= 0.1) {
          this.priceOptions.interval = 0.1;
        } else if (calculateInterval < 0.1) {
          this.priceOptions.interval = 0.01;
        } else if (calculateInterval > 1) {
          this.priceOptions.interval = 1;
        }

        let calculateIntervalAuthor = (maxAuthor - minAuthor) / 50;
        if (calculateIntervalAuthor < 1 && calculateIntervalAuthor >= 0.1) {
          this.priceOptionsAuthor.interval = 0.1;
        } else if (calculateIntervalAuthor < 0.1) {
          this.priceOptionsAuthor.interval = 0.01;
        } else if (calculateIntervalAuthor > 1) {
          this.priceOptionsAuthor.interval = 1;
        }
        this.valueBook = [minBook, maxBook];
        this.valueAuthor = [minAuthor, maxAuthor];
        this.priceOptions.min = minBook;
        this.priceOptions.max = maxBook;
        this.priceOptionsAuthor.min = minAuthor;
        this.priceOptionsAuthor.max = maxAuthor;
        this.histogramBook =
          api +
          "/getpicture?key=" +
          response.data.price_range_books.histogram_key;
        this.histogramAuthor =
          api +
          "/getpicture?key=" +
          response.data.price_range_authors.histogram_key;
        this.saveSettings();
      });
    }
    this.$forceUpdate();

    //this.applyFilters();
  },
  computed: {
    ...mapGetters(["CURRENCIES"]),
    getCurrency() {
      return this.CURRENCIES;
    },
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    },
    sessionID: function() {
      return this.$store.getters.sessionID;
    }
  },
  methods: {
    showLoginForFavor(value) {
      console.log(value);
      if (value) {
        this.$refs.header.showLogin();
      }
    },
    handleScroll() {
      this.scrolled = window.scrollY > 75;
      this.$forceUpdate();
    },
    selectCategories() {
      let categoryArray = [];
      this.bookCategoryValue.filter(category => {
        categoryArray.push({
          category: category.code
        });
      });
      this.selectedFilters.book_properties.categories = categoryArray;
    },
    selectLanguages() {
      let languageArray = [];
      this.bookLanguageValue.filter(language => {
        languageArray.push({
          language: language.code
        });
      });
      this.selectedFilters.book_properties.languages = languageArray;
    },

    selectLanguagesAuthor() {
      let languageArray = [];
      this.authorLanguageValue.filter(language => {
        languageArray.push({
          language: language.code
        });
      });
      this.selectedFilters.author_properties.languages = languageArray;
    },
    selectPhrase() {
      if (this.search == null || this.search.length == 0) {
        this.selectedFilters.phrase = null;
      } else {
        this.selectedFilters.phrase = this.search;
      }
      if (
        this.$route.params.teacherID &&
        this.search === this.$route.params.teacherName
      ) {
        if (this.search.length)
          this.selectedFilters.phrase =
            "" + this.selectedFilters.phrase + " teacherID:";
        this.selectedFilters.phrase =
          this.selectedFilters.phrase + "" + this.$route.params.teacherID + "";
      }
    },
    selectPrice() {
      this.selectedFilters.book_properties.price_range.min = this.valueBook[0];
      this.selectedFilters.book_properties.price_range.max = this.valueBook[1];
    },
    selectAuthorPrice() {
      this.selectedFilters.author_properties.price_range.min = this.valueAuthor[0];
      this.selectedFilters.author_properties.price_range.max = this.valueAuthor[1];
    },
    selectTeacher() {
      this.selectedFilters.author_properties.teacher_type.author = this.checked.author;
      this.selectedFilters.author_properties.teacher_type.expert = this.checked.expert;
    },
    selectPublish() {
      if (this.years.from) {
        this.selectedFilters.book_properties.publication_year.from = parseFloat(
          this.years.from
        );
      }
      if (this.years.to) {
        this.selectedFilters.book_properties.publication_year.to = parseFloat(
          this.years.to
        );
      }
    },
    selectCountry() {
      let countryArray = [];
      this.countryValue.filter(country => {
        countryArray.push({
          country: country.code
        });
      });
      this.selectedFilters.author_properties.from = countryArray;
    },
    saveSettings() {
      this.savedSettings = {
        checked: [],
        bookPrice: [],
        authorPrice: [],
        published_years: [],
        countries: [],
        authorLanguages: [],
        bookLanguages: [],
        bookCategoryValue: [],
        generalDay: [[], []],
        generalTime: [],
        days: [],
        hours: []
      };

      if (this.options.length == 0) {
        return;
      }

      this.savedSettings.checked.push(this.checked);
      this.savedSettings.published_years.push(this.years);
      this.savedSettings.bookPrice.push(this.valueBook[0]);
      this.savedSettings.bookPrice.push(this.valueBook[1]);
      this.savedSettings.authorPrice.push(this.valueAuthor[0]);
      this.savedSettings.authorPrice.push(this.valueAuthor[1]);

      this.savedSettings.bookPrice.push(this.priceOptions);
      this.savedSettings.authorPrice.push(this.priceOptionsAuthor);
      this.savedSettings.bookPrice.push(this.histogramBook);
      this.savedSettings.authorPrice.push(this.histogramAuthor);

      this.savedSettings.countries.push(
        this.$i18n.locale,
        this.countryValue,
        this.options
      );
      this.savedSettings.authorLanguages.push(
        this.$i18n.locale,
        this.authorLanguageValue,
        this.languageOptions
      );
      this.savedSettings.bookLanguages.push(
        this.$i18n.locale,
        this.bookLanguageValue,
        this.bookLanguageOptions
      );
      this.savedSettings.bookCategoryValue.push(
        this.$i18n.locale,
        this.bookCategoryValue,
        this.bookCategoryOptions
      );

      this.savedSettings.generalDay = this.generalDay;
      this.savedSettings.generalTime = this.generalTime;
      this.savedSettings.days = this.days;
      this.savedSettings.hours = this.hours;
      this.savedSettings.phrase = this.search;
      localStorage.setItem("savedSettings", JSON.stringify(this.savedSettings));
      createCookie("filterExpire", "something", 10);
    },
    applyFilters() {
      this.selectedFilters = {
        phrase: null,
        sessionID: this.sessionID,
        timezone: timezone,
        book_properties: {
          categories: [],
          price_range: {},
          publication_year: {},
          languages: []
        },
        author_properties: {
          availability: {
            general: {
              time_range: [],
              week_days: []
            },
            specific: {
              time_range: {
                dates: [],
                hours: []
              }
            }
          },
          price_range: {},
          teacher_type: {},
          from: [],
          languages: []
        }
      };

      this.loadingBooks = true;
      this.selectPhrase();
      this.selectCategories();
      this.selectPrice();
      this.selectAuthorPrice();
      this.selectAuthorPrice();
      this.selectPublish();
      this.selectLanguages();
      this.selectTeacher();
      this.selectCountry();
      this.selectLanguagesAuthor();
      this.selectedDaysFilter();
      this.selectedHoursFilter();
      this.selectDaysGeneralFilter();
      this.selectTimesGeneralFilter();
      this.closeAllTabs();

      let numberOfTeachers = [];

      if (this.checked.author) {
        numberOfTeachers.push(this.checked.author);
      }
      if (this.checked.expert) {
        numberOfTeachers.push(this.checked.expert);
      }

      this.numberOfTeachers = numberOfTeachers.length;

      localStorage.setItem("getFilters", JSON.stringify(this.selectedFilters));

      this.$http.post(api + "/search", this.selectedFilters).then(response => {
        this.filteredBooks = response.data.results;
        this.filteredBooks.filter(book => {
          this.$set(book, "image", api + "/getpicture?key=" + book.picture_key);
        });
        this.loadingBooks = false;
      });

      this.saveSettings();
    },
    searchBook() {
      this.selectedFilters.phrase = this.search;
      localStorage.setItem(
        "savedPhrase",
        JSON.stringify(this.selectedFilters.phrase)
      );
      this.applyFilters();
    },
    searchBookMobile() {
      this.selectedFilters.phrase = this.search;
      localStorage.setItem(
        "savedPhrase",
        JSON.stringify(this.selectedFilters.phrase)
      );
      this.applyFilters(this.search);
      this.$refs.searchMobile.focus();
      setTimeout(() => {
        this.$refs.searchMobile.blur();
      }, 50);
    },
    selectGeneralTime(value, index) {
      value.selected = !value.selected;
      let $this = this;
      if (value.selected) {
        this.arrayTimesGeneral.push({
          min: value.min,
          max: value.max
        });
      }
      if (!value.selected) {
        this.arrayTimesGeneral.filter((item, index) => {
          if (item.min === value.min && item.max === value.max) {
            this.arrayTimesGeneral.splice(index, 1);
          }
        });
      }
      this.$forceUpdate();
    },
    selectGeneralDay(value, index) {
      value.selected = !value.selected;
      let $this = this;
      if (value.selected) {
        this.arrayDaysGeneral.push({
          day: value.dayForApi
        });
      }
      if (!value.selected) {
        this.arrayDaysGeneral.filter((item, index) => {
          if (item.day === value.dayForApi) {
            this.arrayDaysGeneral.splice(index, 1);
          }
        });
      }
      this.$forceUpdate();
    },
    selectDay(value, index) {
      value.selected = !value.selected;
      let $this = this;
      if (value.selected) {
        let day = moment(value.date).format("DD-MM-YYYY");
        this.arrayDays.push({
          date: day
        });
      }
      if (!value.selected) {
        let dayNew = moment(value.date).format("DD-MM-YYYY");
        this.arrayDays.filter((item, index) => {
          if (item.date === dayNew) {
            this.arrayDays.splice(index, 1);
          }
        });
      }
      this.$forceUpdate();
    },
    selectHour(value, index) {
      value.selected = !value.selected;
      let hourNum = value.timeForApi;
      let $this = this;
      if (value.selected) {
        $this.arrayHours.push({
          hour: hourNum
        });
      }
      if (!value.selected) {
        this.arrayHours.filter((item, index) => {
          if (item.hour === hourNum) {
            $this.arrayHours.splice(index, 1);
          }
        });
      }
      this.$forceUpdate();
    },
    selectedHoursFilter() {
      this.selectedFilters.author_properties.availability.specific.time_range.hours = this.arrayHours;
    },
    selectedDaysFilter() {
      this.selectedFilters.author_properties.availability.specific.time_range.dates = this.arrayDays;
    },
    selectTimesGeneralFilter() {
      this.selectedFilters.author_properties.availability.general.time_range = this.arrayTimesGeneral;
    },
    selectDaysGeneralFilter() {
      this.selectedFilters.author_properties.availability.general.week_days = this.arrayDaysGeneral;
    },
    dragStart() {
      this.isDragingStarted = true;
    },
    dragEnd() {
      this.isDragingStarted = false;
    },
    awayMobile() {
      this.isMobile = false;
    },
    changeDates(slide, index) {
      this.firstDayOfWeek = this.days[index.currentSlide].date;
      this.lastDayOfWeek = this.days[index.currentSlide + 6].date;
    },
    changeHours(slide, index) {
      this.firstHour = this.hours[index.currentSlide].time;
      if (this.firstHour === 18) {
        this.lastHour = 24;
        this.$forceUpdate();
      }
      this.lastHour = this.hours[index.currentSlide + 6].time;
    },
    reInit() {
      let $this = this;
      this.$nextTick(() => {
        $this.$refs.slick.reSlick();
        $this.$refs.slick_second.reSlick();
      });
    },
    beforeUpdate() {
      if (this.$refs.slick) {
        this.$refs.slick.destroy();
      }
      if (this.$refs.slick_second) {
        this.$refs.slick_second.destroy();
      }
    },
    updated() {
      this.$nextTick(function() {
        if (this.$refs.slick) {
          this.$refs.slick.create(this.slickOptions);
        }
        if (this.$refs.slick_second) {
          this.$refs.slick_second.create(this.slickOptions);
        }
      });
    },
    getDays() {
      let newDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
      let endDay = new Date();
      let $this = this;
      endDay.setDate(endDay.getDate() + 365);
      while (newDay <= endDay) {
        this.days.push({
          date: new Date(newDay),
          selected: false
        });
        newDay.setDate(newDay.getDate() + 1);
      }
    },
    closeGeneralTab() {
      this.authorTabs.languages = false;
      this.authorTabs.fromCountry = false;
      this.authorTabs.teacher = false;
      this.authorTabs.price = false;
      this.authorTabs.general = false;
      this.authorTabs.available = false;
      this.authorTabs.specific = false;
    },
    openGeneralTab() {
      this.authorTabs.languages = false;
      this.authorTabs.fromCountry = false;
      this.authorTabs.teacher = false;
      this.authorTabs.price = false;
      this.authorTabs.general = true;
      this.authorTabs.available = true;
      this.authorTabs.specific = false;
    },
    openSpecificTab() {
      this.authorTabs.languages = false;
      this.authorTabs.fromCountry = false;
      this.authorTabs.teacher = false;
      this.authorTabs.price = false;
      this.authorTabs.general = false;
      this.authorTabs.specific = true;

      this.reInit();
    },

    openPriceRange() {
      this.authorTabs.price = !this.authorTabs.price;
    },
    openTeacherTab() {
      this.authorTabs.teacher = !this.authorTabs.teacher;
    },
    openFromTab() {
      this.authorTabs.fromCountry = !this.authorTabs.fromCountry;
    },
    openLanguagesTab() {
      this.authorTabs.languages = !this.authorTabs.languages;
    },
    clearTeacher() {
      this.checked.author = true;
      this.checked.expert = true;
    },
    clearAuthorFilters() {
      this.clearGeneral();
      this.clearDates();
      this.clearAuthorLanguages();
      this.clearPriceAuthor();
      this.clearCountries();
      this.checked.expert = true;
      this.checked.author = true;
      this.selectedFilters.author_properties.teacher_type.author = this.checked.author;
      this.selectedFilters.author_properties.teacher_type.expert = this.checked.expert;

      this.applyFilters();
    },
    clearBookFilters() {
      this.clearBookLanguages();
      this.clearCategories();
      this.clearPrice();
      this.clearBookYear();

      this.applyFilters();
    },
    clearBookYear() {
      this.years.from = null;
      this.years.to = null;
      this.selectedFilters.book_properties.publication_year.from = null;
      this.selectedFilters.book_properties.publication_year.to = null;
    },
    clearBookLanguages() {
      this.bookLanguageValue = [];
      this.selectedFilters.book_properties.languages = [];
    },
    clearAuthorLanguages() {
      this.authorLanguageValue = [];
      this.selectedFilters.author_properties.languages = [];
    },
    clearPrice() {
      this.valueBook = [this.priceOptions.min, this.priceOptions.max];

      this.selectedFilters.book_properties.price_range.min = this.priceOptions.min;
      this.selectedFilters.book_properties.price_range.max = this.priceOptions.max;
    },
    clearPriceAuthor() {
      this.valueAuthor = [
        this.priceOptionsAuthor.min,
        this.priceOptionsAuthor.max
      ];

      this.selectedFilters.author_properties.price_range.min = this.priceOptionsAuthor.min;
      this.selectedFilters.author_properties.price_range.max = this.priceOptionsAuthor.max;
    },
    clearDates() {
      this.days.filter(day => {
        this.$set(day, "selected", false);
      });
      this.hours.filter(hour => {
        this.$set(hour, "selected", false);
      });

      this.selectedFilters.author_properties.availability.specific.time_range.dates = [];
      this.selectedFilters.author_properties.availability.specific.time_range.hours = [];
      this.arrayDays = [];
      this.arrayHours = [];
    },
    clearCategories() {
      this.selectedFilters.book_properties.categories = [];
      this.bookCategoryValue = [];
    },
    clearGeneral() {
      this.generalDay.filter(day => {
        this.$set(day, "selected", false);
      });
      this.generalTime.filter(hour => {
        this.$set(hour, "selected", false);
      });
      this.arrayTimesGeneral = [];
      this.arrayDaysGeneral = [];

      this.selectedFilters.author_properties.availability.general.time_range = [];
      this.selectedFilters.author_properties.availability.general.week_days = [];
    },
    clearCountries() {
      this.countryValue = [];
      this.selectedFilters.author_properties.availability.from = [];
    },
    openFilterCategory() {
      this.filters.category = !this.filters.category;
    },
    openFilterLanguages() {
      this.filters.languages = !this.filters.languages;
    },
    openFilterPublication() {
      this.filters.publication = !this.filters.publication;
    },
    openFilterPrice() {
      this.filters.price = !this.filters.price;
    },
    closeAllTabs() {
      this.authorTabs.fromCountry = false;
      this.authorTabs.languages = false;
      this.authorTabs.available = false;
      this.authorTabs.teacher = false;
      this.authorTabs.price = false;
      this.filters.category = false;
      this.filters.languages = false;
      this.filters.publication = false;
      this.filters.price = false;
      this.hoverBook = false;
      this.hoverBookTitle = false;
      this.hoverAuthorTitle = false;
      this.hoverAuthor = false;
      this.authorTabs.specific = false;
      this.authorTabs.general = true;
    },
    awayFilter() {
      this.filters.category = false;
      this.filters.languages = false;
      this.filters.publication = false;
      this.filters.price = false;
      this.hoverBookTitle = false;
      this.hoverAuthorTitle = false;
    },
    away() {
      this.hoverBook = false;
      this.hoverAuthor = false;
      this.authorTabs.general = true;
      this.authorTabs.specific = false;
      this.hoverTag = false;
      this.hoverBookTitle = false;
      this.hoverAuthorTitle = false;
    },
    showHoverBook() {
      if (this.hoverBook === false) {
        this.hoverBook = true;
        this.hoverBookTitle = true;
        this.hoverAuthorTitle = false;
        this.filters.category = false;
        this.filters.languages = false;
        this.filters.publication = false;
        this.filters.price = false;
        this.authorTabs.general = false;
        this.authorTabs.specific = false;
        this.hoverAuthor = false;
        this.authorTabs.teacher = false;
        this.authorTabs.available = false;
        this.authorTabs.price = false;
        this.authorTabs.languages = false;
        this.authorTabs.fromCountry = false;
        this.authorTabs.price = false;
      } else {
        this.hoverBook = false;
        this.hoverBookTitle = false;
        this.hoverAuthorTitle = false;
        this.filters.category = false;
        this.filters.languages = false;
        this.filters.publication = false;
        this.filters.price = false;
        this.authorTabs.general = false;
        this.authorTabs.specific = false;
        this.hoverAuthor = false;
      }
    },
    showHoverAuthor() {
      if (this.hoverAuthor === false) {
        this.hoverAuthor = true;
        this.filters.category = false;
        this.filters.languages = false;
        this.filters.publication = false;
        this.filters.price = false;
        this.hoverBookTitle = false;
        this.hoverAuthorTitle = true;

        this.hoverBook = false;
      } else {
        this.hoverAuthor = false;
        this.hoverAuthorTitle = false;
        this.authorTabs.available = false;
        this.authorTabs.price = false;
        this.authorTabs.languages = false;
        this.authorTabs.fromCountry = false;
        this.authorTabs.price = false;
        this.authorTabs.teacher = false;
      }
    },
  },
  mounted() {
    if (
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/iPad/i)
    ) {
      this.iDevice = true;
    } else {
      this.iDevice = false;
    }

    this.$moment.locale(this.$i18n.locale);

    this.searchBook();
  },
  watch: {
    search: function() {
      if (this.search === "") {
        localStorage.removeItem("savedPhrase");
        this.applyFilters();
      }
    },
    hoverBook: function() {
      if (this.hoverBook) {
        var root = document.getElementsByTagName("html")[0];
        root.classList.add("noScroll");
      } else {
        var root = document.getElementsByTagName("html")[0];
        root.classList.remove("noScroll");
      }
    },
    hoverAuthor: function() {
      if (this.hoverAuthor) {
        var root = document.getElementsByTagName("html")[0];
        root.classList.add("noScroll");
      } else {
        var root = document.getElementsByTagName("html")[0];
        root.classList.remove("noScroll");
      }
    }
  },
  components: {
    Header,
    TextTruncate,
    VueSlider,
    Login,
    Signup,
    Slick,
    Vodal,
    BooksList,
    Selector
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/intro/intro";
@import "../styles/intro/books";
</style>
