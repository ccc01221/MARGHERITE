<template>
  <div class="single-book author-profile">
    <Header class="noOpacity" ref="header" :title="this.$t('general.teacher')"></Header>
    <div v-if="!loaded && teacher && Object.keys(teacher).length > 0" class="single-book__holder">
      <div class="container">
        <div class="single-book__title">
          <router-link
            v-if="prevRoute"
            :to="{path: prevRoute.fullPath}"
          >{{this.$t('general.teachers')}} /</router-link>
          {{teacher.teacher_name}}
        </div>
        <div class="author-profile__body">
          <div :class="{'showExpandedGeneral' : teacher.read}" class="single-book__teacher-block">
            <div class="single-book__teacher-left">
              <div class="single-book__teacher-left-first">
                <div class="single-book__teacher-image">
                  <img
                    :src="apiLink+'/getpicture?key='+teacher.picture_key"
                  />
                </div>
                <div class="single-book__teacher-stars">
                  <star-rating
                    :increment="0.1"
                    :max-rating="5"
                    :read-only="true"
                    :rating="teacher.teacher_avg_rating"
                    inactive-color="#747474"
                    :rounded-corners="true"
                    :show-rating="false"
                    active-color="#fda700"
                    :star-size="30"
                  ></star-rating>
                </div>
                <span class="single-book__teacher-lessons">
                  <span>
                    <strong>{{teacher.teacher_avg_rating.toFixed(2)}}</strong>
                  </span>
                  <span>{{$t('general.stars')}}</span>
                </span>
                <span class="single-book__teacher-lessons">
                  <span>
                    <strong>{{teacher.teacher_no_ratings}}</strong>
                  </span>
                  <span>{{$t('general.ratings')}}</span>
                </span>
                <span class="single-book__teacher-lessons">
                  <span>
                    <strong>{{teacher.teacher_lessons_no}}</strong>
                  </span>
                  <span>{{$t('general.lessons')}}</span>
                </span>
                <span class="single-book__teacher-students">
                  <span>
                    <strong>{{teacher.teacher_no_students}}</strong>
                  </span>
                  <span>{{$t('general.students')}}</span>
                </span>
                <span class="single-book__teacher-books">
                  <span>
                    <strong>{{teacher.teacher_authorNo}}</strong>
                  </span>
                  <span>
                    <span v-if="teacher.booksWritten < 2">{{$t('book')}}</span>
                    <span v-else>{{$t('books')}}</span>
                    {{$t('general.written')}}
                  </span>
                </span>
                <span class="single-book__teacher-experts">
                  <span>
                    {{$t('general.expertFor')}}
                    <strong>{{teacher.teacher_expertNo}}</strong>
                    {{$t('books')}}
                  </span>
                </span>
                <span class="single-book__teacher-lessons author-profile__teacher">
                  <span>{{$t('general.teacherSince')}}</span>
                  <span>
                    <strong>{{teacher.teacher_since | moment('MMM DD, YYYY')}}</strong>
                  </span>
                </span>
                <span class="red marginSmaller">{{$t('general.lastLogin')}}</span>
                <span class="red marginSmaller">
                  <b>{{teacher.teacher_lastlogin}}</b>
                </span>
              </div>
              <div class="single-book__teacher-left-second">
                <i
                  :class="{'fas fa-heart' : teacher.heart}"
                  @click="favor"
                  class="fal fa-heart full-heart author-no-mobile"
                ></i>
                <h2>
                  {{teacher.teacher_name}}
                  <country-flag :country="teacher.teacher_country" size="normal" />
                </h2>
                <div class="single-book__teacher-specs">
                  <div class="author-profile__from">
                    {{$t('general.fromString')}}
                    <b>{{teacher.teacher_from}}</b>
                  </div>
                  <div>
                    <span>{{$t('general.speaks')}}</span>
                    <span class="red">{{teacher.teacher_speaks}}</span>
                  </div>
                </div>
                <h3 class="red">{{$t('general.introduction')}}</h3>
                <p
                  ref="text"
                  :class="{'showExpanded': teacher.read}"
                  v-html="teacher.teacher_introduction"
                ></p>
                <span v-if="textHeight > 420" @click="readMore(teacher)" class="readMore red">
                  <span v-if="!teacher.read">{{$t('readMore')}}</span>
                  <span v-else>{{$t('readLess')}}</span>
                </span>
              </div>
            </div>
            <div class="single-book__teacher-right">
              <div class="single-book__teacher-right-block">
                <div class="single-book__teacher-right-block-header">
                  <h3>{{$t('general.Lessons')}}</h3>
                  <div>
                    <span>{{$t('general.fromPriceString')}}</span>
                    <span>
                      {{currency.currency}}
                      {{(teacher.teacher_minLessonPrice * currency.rate).toFixed(2)}}
                    </span>
                  </div>
                </div>
                <span class="red-button author-no-mobile">{{$t('general.bookNow')}}</span>
                <span class="white-button">{{$t('general.contactTeacher')}}</span>
              </div>
              <div class="single-book__teacher__right-block dates-section">
                <div class="dates-section-holder">
                  <div class="dates-holder">
                    <div class="single-book__teacher-dates">
                      <div v-for="day in generalDay" :key="day.date">
                        <span>{{day.day}}</span>
                        <span>{{day.date}}</span>
                      </div>
                    </div>
                    <div class="single-book__teacher-hours">
                      <div>00-04</div>
                      <div>04-08</div>
                      <div>08-12</div>
                      <div>12-16</div>
                      <div>16-20</div>
                      <div>20-24</div>
                    </div>
                    <div class="grid">
                      <div>
                        <div
                          :class="{'green' : mo === true}"
                          class="grid-block"
                          v-for="(mo,index) in teacher.teacher_schedule[0]"
                          :key="`mo-${index}`"
                        ></div>
                      </div>
                      <div>
                        <div
                          :class="{'green' : tu === true}"
                          class="grid-block"
                          v-for="(tu,index) in teacher.teacher_schedule[1]"
                          :key="`tu-${index}`"
                        ></div>
                      </div>
                      <div>
                        <div
                          :class="{'green' : we === true}"
                          class="grid-block"
                          v-for="(we,index) in teacher.teacher_schedule[2]"
                          :key="`we-${index}`"
                        ></div>
                      </div>
                      <div>
                        <div
                          :class="{'green' : th === true}"
                          class="grid-block"
                          v-for="(th,index) in teacher.teacher_schedule[3]"
                          :key="`th-${index}`"
                        ></div>
                      </div>
                      <div>
                        <div
                          :class="{'green' : fr === true}"
                          class="grid-block"
                          v-for="(fr,index) in teacher.teacher_schedule[4]"
                          :key="`fr-${index}`"
                        ></div>
                      </div>
                      <div>
                        <div
                          :class="{'green' : sa === true}"
                          class="grid-block"
                          v-for="(sa,index) in teacher.teacher_schedule[5]"
                          :key="`sa-${index}`"
                        ></div>
                      </div>
                      <div>
                        <div
                          :class="{'green' : su === true}"
                          class="grid-block"
                          v-for="(su,index) in teacher.teacher_schedule[6]"
                          :key="`su-${index}`"
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div class="author-profile__dates-buttons">
                    <span class="white-button">{{$t('general.checkAvailability')}}</span>
                    <span
                      class="timezone-text"
                    >{{$t('general.basedOnTimezone')}} ({{teacher.timezone}})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="author-profile__lessons">
            <h2>{{$t('general.Lessons')}}</h2>

            <h3
              v-if="teacher.lessons.authorLessons && teacher.lessons.authorLessons.length > 0"
              class="red"
            >{{$t('author')}} {{$t('general.Lessons')}}</h3>
            <div v-if="teacher.lessons.authorLessons && teacher.lessons.authorLessons.length > 0">
              <div
                v-for="(lesson,index) in teacher.lessons.authorLessons"
                :key="`lesson-${index}`"
                class="author-profile__lessons-block red"
              >
                <div class="author-profile__lessons-block-left">
                  <div class="author-profile__lessons-block-image">
                    <img
                      :src="apiLink+'/getpicture?key='+lesson.picture_key"
                    />
                  </div>
                  <div class="author-profile__lessons-block-text">
                    <h4>{{lesson.title}}</h4>
                    <span
                      class="author-profile__lessons-block-text-info"
                    >{{lesson.lessons}} {{$t('general.lessons')}}</span>
                    <p v-html="lesson.description"></p>
                  </div>
                </div>
                <div class="author-profile__lessons-block-right">
                  <div class="author-profile__lessons-block-price">
                    <span class="author-profile__lessons-discount">{{lesson.maxdiscount}}</span>
                    <span
                      class="author-profile__lessons-price_info"
                    >{{currency.currency}} {{(lesson.priceFrom * currency.rate).toFixed(2)}}</span>
                  </div>
                </div>
              </div>
            </div>

            <h3
              v-if="teacher.lessons.expertLessons && teacher.lessons.expertLessons.length > 0"
              class="blue"
            >{{$t('expert')}} {{$t('general.Lessons')}}</h3>
            <div>
              <div
                v-for="lesson in teacher.lessons.expertLessons"
                :key="lesson.title"
                class="author-profile__lessons-block blue"
              >
                <div class="author-profile__lessons-block-left">
                  <div class="author-profile__lessons-block-image">
                    <img
                      :src="apiLink+'/getpicture?key='+lesson.picture_key"
                    />
                  </div>
                  <div class="author-profile__lessons-block-text">
                    <h4>{{lesson.title}}</h4>
                    <span
                      class="author-profile__lessons-block-text-info"
                    >{{lesson.lessons}} {{$t('general.lessons')}}</span>
                    <p v-html="lesson.description"></p>
                  </div>
                </div>
                <div class="author-profile__lessons-block-right">
                  <div class="author-profile__lessons-block-price">
                    <span class="author-profile__lessons-discount">{{lesson.maxdiscount}}</span>
                    <span
                      class="author-profile__lessons-price_info"
                    >{{currency.currency}} {{(lesson.priceFrom * currency.rate).toFixed(2)}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="teacher.resume" class="author-profile__lessons author-profile__work">
            <h2>{{$t('general.resume')}}</h2>
            <div
              v-if="teacher.resume.work && teacher.resume.work.length > 0"
              class="author-profile__work-left"
            >
              <h3>{{$t('general.workExperience')}}</h3>
              <div class="author-profile__work-holder">
                <div
                  v-for="(work,index) in teacher.resume.work"
                  :key="`work-${index}`"
                  class="author-profile__work-block"
                >
                  <div class="author-profile__work-block-date">{{work.from}} - {{work.to}}</div>
                  <div class="author-profile__work-block-title">{{work.title}}</div>
                  <p v-html="work.description"></p>
                </div>
              </div>
            </div>
            <div
              v-if="teacher.resume.education && teacher.resume.education.length > 0"
              class="author-profile__work-right"
            >
              <h3>{{$t('general.education')}}</h3>
              <div class="author-profile__work-holder">
                <div
                  v-for="(education,index) in teacher.resume.education"
                  :key="`education-${index}`"
                  class="author-profile__work-block"
                >
                  <div class="author-profile__work-block-date">{{education.from}} - {{education.to}}</div>
                  <div class="author-profile__work-block-title">{{education.title}}</div>
                  <p v-html="education.description"></p>
                </div>
              </div>
            </div>
          </div>
          <div class="author-profile__lessons author-profile__statistics">
            <h2>{{$t('general.statistics')}}</h2>
            <div
              v-if="teacher.statistics.completedLessons && teacher.statistics.completedLessons.length > 0"
              class="author-profile__statistics-holder"
            >
              <div class="author-profile__statistics-block">
                <div class="author-profile__statistics-title">
                  <h2>{{teacher.statistics.overallCompletedLessons}}</h2>
                  <span>{{$t('general.completedLessons')}}</span>
                </div>
                <div class="author-profile__statistics-graphs">
                  <div class="vertical-graph">
                    <div class="vertical-graph-bar">
                      <div
                        :style="{'height': Number(100*teacher.statistics.completedLessons[0]/(Math.max(teacher.statistics.completedLessons[0], teacher.statistics.completedLessons[1],teacher.statistics.completedLessons[2])))+'%'}"
                        class="vertical-graph-bar-filled"
                        :class="{'lowBar': Number(100*teacher.statistics.completedLessons[0]/(Math.max(teacher.statistics.completedLessons[0], teacher.statistics.completedLessons[1],teacher.statistics.completedLessons[2]))) < 30}"
                      >
                        <span>{{teacher.statistics.completedLessons[0]}}</span>
                      </div>
                    </div>
                    <span class="vertical-graph-month">{{getLastMonths[2]}}</span>
                  </div>
                  <div class="vertical-graph">
                    <div class="vertical-graph-bar">
                      <div
                        :style="{'height': Number(100*teacher.statistics.completedLessons[1]/(Math.max(teacher.statistics.completedLessons[0], teacher.statistics.completedLessons[1],teacher.statistics.completedLessons[2])))+'%'}"
                        class="vertical-graph-bar-filled"
                        :class="{'lowBar': Number(100*teacher.statistics.completedLessons[1]/(Math.max(teacher.statistics.completedLessons[0], teacher.statistics.completedLessons[1],teacher.statistics.completedLessons[2]))) < 30}"
                      >
                        <span>{{teacher.statistics.completedLessons[1]}}</span>
                      </div>
                    </div>
                    <span class="vertical-graph-month">{{getLastMonths[1]}}</span>
                  </div>
                  <div class="vertical-graph red">
                    <div class="vertical-graph-bar">
                      <div
                        :style="{'height': Number(100*teacher.statistics.completedLessons[2]/(Math.max(teacher.statistics.completedLessons[0], teacher.statistics.completedLessons[1],teacher.statistics.completedLessons[2])))+'%'}"
                        class="vertical-graph-bar-filled"
                        :class="{'lowBar': Number(100*teacher.statistics.completedLessons[2]/(Math.max(teacher.statistics.completedLessons[0], teacher.statistics.completedLessons[1],teacher.statistics.completedLessons[2]))) < 30}"
                      >
                        <span>{{teacher.statistics.completedLessons[2]}}</span>
                      </div>
                    </div>
                    <span class="vertical-graph-month">{{getLastMonths[0]}}</span>
                  </div>
                </div>
              </div>
              <div class="author-profile__statistics-block">
                <div class="author-profile__statistics-title">
                  <h2>{{teacher.statistics.overallResponseRate}}%</h2>
                  <span>{{$t('general.responseRate')}}</span>
                </div>
                <div
                  v-if="teacher.statistics.responseRate && teacher.statistics.responseRate.length > 0"
                  class="author-profile__statistics-graphs horizontal"
                >
                  <div class="horizontal-graph red">
                    <div class="horizontal-graph-bar">
                      <div
                        :class="{'lowBar': teacher.statistics.responseRate[0] < 30}"
                        class="horizontal-graph-bar-filled"
                        :style="{'width': teacher.statistics.responseRate[0]+'%'}"
                      >
                        <span>{{teacher.statistics.responseRate[0]}}%</span>
                      </div>
                    </div>
                    <span class="horizontal-graph-month">{{getLastMonths[0]}}</span>
                  </div>
                  <div class="horizontal-graph">
                    <div class="horizontal-graph-bar">
                      <div
                        :class="{'lowBar': teacher.statistics.responseRate[1] < 30}"
                        :style="{'width': teacher.statistics.responseRate[1]+'%'}"
                        class="horizontal-graph-bar-filled"
                      >
                        <span>{{teacher.statistics.responseRate[1]}}%</span>
                      </div>
                    </div>
                    <span class="horizontal-graph-month">{{getLastMonths[1]}}</span>
                  </div>
                  <div class="horizontal-graph">
                    <div class="horizontal-graph-bar">
                      <div
                        :class="{'lowBar': teacher.statistics.responseRate[2] < 30}"
                        :style="{'width': teacher.statistics.responseRate[2]+'%'}"
                        class="horizontal-graph-bar-filled"
                      >
                        <span>{{teacher.statistics.responseRate[2]}}%</span>
                      </div>
                    </div>
                    <span class="horizontal-graph-month">{{getLastMonths[2]}}</span>
                  </div>
                </div>
              </div>
              <div class="author-profile__statistics-block">
                <div class="author-profile__statistics-title">
                  <h2>{{teacher.statistics.overallAttendanceRate}}%</h2>
                  <span>{{$t('general.attendanceRate')}}</span>
                </div>
                <div
                  v-if="teacher.statistics.attendanceRate && teacher.statistics.attendanceRate.length > 0"
                  class="author-profile__statistics-graphs horizontal"
                >
                  <div class="horizontal-graph red">
                    <div class="horizontal-graph-bar">
                      <div
                        :class="{'lowBar': teacher.statistics.attendanceRate[0] < 30}"
                        :style="{'width': teacher.statistics.attendanceRate[0]+'%'}"
                        class="horizontal-graph-bar-filled"
                      >
                        <span>{{teacher.statistics.attendanceRate[0]}}%</span>
                      </div>
                    </div>
                    <span class="horizontal-graph-month">{{getLastMonths[0]}}</span>
                  </div>
                  <div class="horizontal-graph">
                    <div class="horizontal-graph-bar">
                      <div
                        :class="{'lowBar': teacher.statistics.attendanceRate[1] < 30}"
                        :style="{'width': teacher.statistics.attendanceRate[1]+'%'}"
                        class="horizontal-graph-bar-filled"
                      >
                        <span>{{teacher.statistics.attendanceRate[1]}}%</span>
                      </div>
                    </div>
                    <span class="horizontal-graph-month">{{getLastMonths[1]}}</span>
                  </div>
                  <div class="horizontal-graph">
                    <div class="horizontal-graph-bar">
                      <div
                        :class="{'lowBar': teacher.statistics.attendanceRate[2] < 30}"
                        :style="{'width': teacher.statistics.attendanceRate[2]+'%'}"
                        class="horizontal-graph-bar-filled"
                      >
                        <span>{{teacher.statistics.attendanceRate[2]}}%</span>
                      </div>
                    </div>
                    <span class="horizontal-graph-month">{{getLastMonths[2]}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="author-mobile-footer">
        <i
                :class="{'fas fa-heart' : teacher.heart}"
                @click="favor"
                class="fal fa-heart full-heart"
        ></i>
        <span class="red-button">{{$t('general.bookNow')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../intro/Header";
import { mixin as clickaway } from "vue-clickaway";
import { timezone } from "../plugins/timezone";
import StarRating from "vue-star-rating";
import CountryFlag from "vue-country-flag";
import Dates from "../mixins/Dates";
import { api } from "../app/api";
import {createCookie} from "../plugins/cookieTime";
import moment from "moment";
export default {
  name: "teacher",
  mixins: [clickaway, Dates],
  props: {
    getFilters: {},
    currency: {}
  },
  data: function() {
    return {
      apiLink: api,
      textHeight: null,
      isMobile: false,
      heart: false,
      generalDay: [],
      modal: {
        isLogin: false,
        isRegister: false,
        isTeacher: false,
        scrollUp: false
      },
      loaded: false,
      teacher: {},
      prevRoute: null,
      getLastMonths: []
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.prevRoute = from;
    });
  },
  created() {
    this.loaded = true;
    let teacherId = this.$route.params.teacherID;
    teacherId = {
      teacherID: this.$route.params.teacherID,
      language: this.$i18n.locale,
      timezone: timezone,
      sessionID: this.sessionID
    };
    this.$http.post(api + "/getTeacher", teacherId).then(response => {
      Object.assign(this.teacher, response.data.result || {});
      this.$set(this.teacher, "read", false);
      this.loaded = false;
    });
    let expireCookie = document.cookie.match(
            "(^|;) ?" + "authorFavorExpire" + "=([^;]*)(;|$)"
    );
    if (!expireCookie) {
      localStorage.removeItem("savedAuthor");
    }
    if (localStorage.getItem("savedAuthor")) {
      this.favor();
      localStorage.removeItem("savedAuthor");
    }
  },
  mounted() {
    this.$moment.locale(this.$i18n.locale);
    this.getLastMonths = this.getLastMonthies(3);
    setTimeout(() => {
      this.textHeight = this.$refs.text.clientHeight;
    }, 2000);
  },
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    },
    sessionID: function() {
      return this.$store.getters.sessionID;
    }
  },
  methods: {
    favor() {
      let data;
      if (localStorage.getItem("savedAuthor")) {
        let savedAuthor = localStorage.getItem("savedAuthor");
        let parse = JSON.parse(savedAuthor);
        data = {
          sessionID: this.sessionID,
          teacherID: parse.teacherID,
          value: parse.value,
        };
      }else{
        data = {
          sessionID: this.sessionID,
          teacherID: this.teacher.teacherID,
          value: !this.teacher.heart
        };
      }
      if (this.isLoggedIn) {
        this.$http.post(api + "/session/favor", data).then(response => {
          this.teacher.heart = response.data.heart;
          this.$forceUpdate();
        });
      } else {
        localStorage.setItem("savedAuthor", JSON.stringify(data));
        createCookie("authorFavorExpire", "something", 1440);
        this.$refs.header.showLogin();
      }
    },
    readMore(author) {
      if (!author.read) {
        this.$set(author, "read", true);
      } else {
        this.$set(author, "read", false);
      }
      this.$forceUpdate();
    },
    getLastMonthies(n) {
      var last_n_months = [];
      var d = new Date();
      d.setMonth(d.getMonth() - 1);

      for (var i = 0; i < n; i++) {
        last_n_months[i] = moment(d).format("MMM");
        d.setMonth(d.getMonth() - 1);
      }
      return last_n_months;
    },

    awayMobile() {
      this.isMobile = false;
    }
  },
  components: { Header, StarRating, CountryFlag }
};
</script>

<style lang="scss">
@import "../styles/intro/intro";
@import "../styles/intro/author";
.single-book__teacher-left-second p {
  i {
    font-style: italic;
  }
  ul {
    list-style: initial;
    padding-left: $space_base;
  }
}
.single-book__author p {
  i {
    font-style: italic;
  }
  ul {
    list-style: initial;
    padding-left: $space_base;
  }
}
</style>