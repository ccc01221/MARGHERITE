<template>
  <div>
    <div :class="{'noOpacity': this.opacity}" class="header__main-header header">
      <div class="container">
        <div class="header__main-header-logo">
          <router-link :to="{path:'/'}">
            <img v-if="!noIcon" src="../assets/logo.png" />
          </router-link>
          <h1>{{this.title}}</h1>
        </div>
        <div v-if="!isLoggedIn" class="header__main-header-holder">
          <span @click="modal.isLogin = true">
            <div>{{this.$t('navigation.login')}}</div>
          </span>
          <span @click="modal.isRegister = true">
            <div>{{this.$t('navigation.register')}}</div>
          </span>
          <span @click="modal.isTeacher = true">
            <div>{{this.$t('navigation.becomeATeacher')}}</div>
          </span>
        </div>
        <div v-else class="header__main-header-holder-loggedIn">
          <span @click="books()">
            <div>{{this.$t('findABook')}}</div>
          </span>
          <span>
            <div>{{this.$t('findATeacher')}}</div>
          </span>
          <span>
            <div>{{this.$t('messages')}}</div>
          </span>
        </div>
        <transition
          enter-active-class="animated-faster slideInRight"
          leave-active-class="animated-faster slideInRightReverse"
        >
          <sidebar @close="this.openMenu = false" v-on-clickaway="awaySidebar" v-if="this.openMenu">
            <ul v-if="!this.isLoggedIn" slot="dropdown-menu" class="dropdown-menu">
              <li @click="modal.isLogin = true" class="dropdown-menu-item">
                <i class="fal fa-sign-in-alt"></i>
                <span>{{this.$t('navigation.login')}}</span>
              </li>
              <li @click="modal.isRegister = true" class="dropdown-menu-item">
                <i class="fal fa-user-plus"></i>
                <span>{{this.$t('navigation.register')}}</span>
              </li>
              <li @click="modal.isTeacher = true" class="dropdown-menu-item">
                <i class="fal fa-graduation-cap"></i>
                <span>{{this.$t('navigation.becomeATeacher')}}</span>
              </li>
            </ul>
            <ul v-else slot="dropdown-menu" class="dropdown-menu">
              <li class="dropdown-menu-item showMobileLink" @click="books()">
                <i class="fal fa-columns"></i>
                <span>{{this.$t('findABook')}}</span>
              </li>
              <li class="dropdown-menu-item showMobileLink">
                <i class="fal fa-user-circle"></i>
                <span>{{this.$t('findATeacher')}}</span>
              </li>
              <li class="dropdown-menu-item showMobileLink showipadportrait">
                <i class="fal fa-inbox"></i>
                <span>{{this.$t('messages')}}</span>
              </li>
              <li class="dropdown-menu-item" @click="dashboard">
                <i class="fal fa-columns"></i>
                <span>{{this.$t('dashboard')}}</span>
              </li>
              <li class="dropdown-menu-item" @click="logout">
                <i class="fal fa-power-off"></i>
                <span>{{this.$t('logout')}}</span>
              </li>
            </ul>
          </sidebar>
        </transition>
        <div v-if="!isLoggedIn" @click="toggleIcon" :class="{'open': openMenu}" id="nav-icon">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div v-else>
          <span class="avatar-holder" @click="toggleIcon">
            <img :src="api+'/getpicture?key='+user.avatar_key" />
          </span>
        </div>
      </div>
    </div>
    <div class="modal">
      <div class="modalinner">
        <Login
          @showForgotPassword="modal.isForgotPassword = true"
          @showRegister="modal.isRegister = true"
          @close="modal.isLogin = false"
          v-if="modal.isLogin"
        ></Login>

        <Signup
          @showLogin="modal.isLogin = true"
          @close="modal.isRegister = false"
          v-if="modal.isRegister"
        ></Signup>

        <ForgotPassword
          @close="modal.isForgotPassword = false"
          @showLogin="modal.isLogin = true"
          @showRegister="modal.isRegister = true"
          v-if="modal.isForgotPassword"
        ></ForgotPassword>
      </div>

      <transition
        enter-active-class="animated-faster fadeIn"
        leave-active-class="animated-faster fadeOut"
      >
        <div v-if="modal.isLogin || modal.isRegister || modal.isForgotPassword">
          <div class="modal__mask"></div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mixin as clickaway } from "vue-clickaway";
import Login from "../forms/Login";
import Signup from "../forms/Signup";
import ForgotPassword from "../forms/ForgotPassword";
import Dropdown from "../components/Dropdown";
import Sidebar from "../components/Sidebar";
import { api } from "../app/api";

export default {
  name: "Header",
  mixins: [clickaway],
  props: {
    title: {},
    opacity: {},
    noIcon: {}
  },
  data: () => ({
    modal: {
      isLogin: false,
      isRegister: false,
      isForgotPassword: false,
      isTeacher: false,
      scrollUp: false
    },
    isMobile: false,
    moveDown: false,
    showCookie: false,
    openDropdown: false,
    openMenu: false
  }),
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    },
    user: function() {
      return this.$store.getters.user;
    },
    api: function() {
      return api;
    }
  },
  mounted() {
    if (this.isLoggedIn) {
      this.modal.isLogin = false;
    }
  },
  methods: {
    toggleIcon() {
      this.openMenu = !this.openMenu;
    },
    showMenuDropdown() {
      this.openDropdown = !this.openDropdown;
      this.$forceUpdate();
    },
    away() {
      this.isMobile = false;
    },
    awayDropdown() {
      this.openDropdown = false;
    },
    awaySidebar() {
      this.openMenu = false;
    },
    showRegister() {
      this.modal.isRegister = true;
      this.$forceUpdate();
    },
    showLogin() {
      this.modal.isLogin = true;
      this.$forceUpdate();
    },
    logout() {
      this.$store.dispatch("logout");
      this.openMenu = false;
      this.$router.push({ name: "Main" });
    },
    books() {
      this.openMenu = false;
      this.$router.push({ name: "Books" });
    },
    dashboard() {
      this.$router.push({ name: "dashboard" });
    }
  },
  components: {
    Login,
    Signup,
    ForgotPassword,
    Dropdown,
    Sidebar
  }
};
</script>

<style scoped lang="scss">
@import "../styles/intro/header";
@import "../styles/modals/modal";
</style>