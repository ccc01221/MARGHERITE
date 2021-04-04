<template>
  <div class="dashboard">
    <Header class="noOpacity" ref="header" :title="this.$t('daydaisy')"></Header>
    <div class="dashboard__student container">
      <div class="dashboard__student-info">
        <div class="dashboard__student-info-personal">
          <div class="dashboard__student-info-personal-image">
            <img :src="apiLink+'/getpicture?key='+user.avatar_key" />
          </div>
          <div class="dashboard__student-info-personal-data">
            <h3>{{user.name}}</h3>
            <span>{{this.$t('user')}} ID: {{user.userID}}</span>
            <span v-if="student">
              14:50 ({{student.timezone}})
              <span class="edit">{{this.$t('edit')}}</span>
            </span>
          </div>
        </div>
        <div class="dashboard__student-info-package">
          <div v-if="student" class="dashboard__student-info-package-item">
            <span>{{student.upcomingLessonsNo}}</span>
            <span>{{this.$t('upcomingLessons')}}</span>
          </div>
          <div v-if="student" class="dashboard__student-info-package-item">
            <span>{{student.actionRequiredNo}}</span>
            <span>{{this.$t('actionRequired')}}</span>
          </div>
          <div v-if="student" class="dashboard__student-info-package-item">
            <span>{{student.activePackagesNo}}</span>
            <span>{{this.$t('activePackages')}}</span>
          </div>
        </div>
        <div v-if="student" class="dashboard__student-info-credit">
          <span>{{this.$t('totalBalance')}}</span>
          <span>{{currency.symbol}}{{student.studentBalance}} {{currency.currency}}</span>
          <span>{{this.$t('addCredits')}}</span>
        </div>
      </div>
      <div
        v-if="student.activePackages && student.activePackages.length"
        class="dashboard__student-activePackage"
      >
        <h2>
          {{this.$t('activePackages')}} &bull;
          <span>{{student.activePackages.length}}</span>
        </h2>
        <div v-for="item in student.activePackages" class="dashboard__student-activePackage-holder">
          <div class="dashboard__student-activePackage-item">
            <div class="dashboard__student-activePackage-item-image">
              <img :src="apiLink+'/getpicture?key='+item.teacherPictureKey" />
            </div>
            <div class="dashboard__student-activePackage-item-text">
              <h4>{{item.teacherName}}</h4>
              <span>{{$t('package')}} ID: {{item.teacherID}}</span>
            </div>
          </div>
          <div class="dashboard__student-activePackage-item">
            <div class="dashboard__student-activePackage-item-text">
              <h4>{{item.bookTitle}}</h4>
              <span>60 min lesson</span>
            </div>
          </div>
          <div class="dashboard__student-activePackage-item">
            <div class="dashboard__student-activePackage-item-text">
              <h4>{{item.unscheduledLessons}}/{{item.amountOfLessons}} Unscheduled Lessons</h4>
              <span>Valid until {{item.validUntil | moment("ddd, MMM DD, hh:mm")}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="dashboard__student-myTeachers">
        <div class="dashboard__student-title">
          <h2>{{this.$t('myTeachers')}}</h2>
        </div>
        <div v-if="student" class="dashboard__student-myTeachers-holder">
          <div v-for="teacher in student.activeTeachers" class="dashboard__student-myTeachers-item">
            <div class="dashboard__student-myTeachers-item-image">
              <img :src="apiLink+'/getpicture?key='+teacher.teacherPictureKey" />
            </div>
            <div class="dashboard__student-myTeachers-item-text">
              <div class="dashboard__student-myTeachers-item-text-header">
                <h4>
                  {{teacher.teacherName}}
                  <country-flag :country="teacher.teacherCountry" size="normal" />
                </h4>
                <span>{{teacher.teacherQualification}}</span>
              </div>
            </div>
            <div class="dashboard__student-myTeachers-item-calendar">
              <i class="fal fa-calendar-plus"></i>
            </div>
          </div>
        </div>
        <span class="dashboard__student-myTeachers-button">{{this.$t('showAll')}}</span>
      </div>
      <div class="dashboard__student-myBooks">
        <div class="dashboard__student-title">
          <h2>{{this.$t('myBooks')}}</h2>
        </div>
        <div v-if="student" class="dashboard__student-books-holder">
          <books-list
            @favorNotLoggedin="showLoginForFavor"
            :list="filteredBooks"
          ></books-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../intro/Header";
import CountryFlag from "vue-country-flag";
import { api } from "../app/api";
import BooksList from "../components/BooksList";
import { timezone } from "../plugins/timezone";
export default {
  name: "Dashboard",
  components: { Header, CountryFlag, BooksList },
  props: {
    currency: {}
  },
  data: () => ({
    apiLink: api,
    student: {},
    sessionID: null,
    redraw: false,
    filteredBooks: []
  }),
  created() {
    this.sessionID = this.$store.getters.sessionID;

    let data = {
      language: this.$i18n.locale,
      sessionID: this.sessionID,
      timezone: timezone
    };

    this.$http.post(api + "/session/studentdashboard", data).then(response => {
      this.student = response.data.result;

      this.filteredBooks = response.data.result.activeBooks;
    });
  },
  computed: {
    user: function() {
      return this.$store.getters.user;
    }
  },
  methods: {
    showLoginForFavor(value) {
      console.log(value);
      this.$refs.header.showLogin();
    }
  }
};
</script>

<style scoped lang="scss">
@import "../styles/dashboard";
</style>