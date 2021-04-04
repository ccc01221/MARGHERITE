<template>
  <div
    id="containerId"
    :class="{'fullHeight': !list.length}"
    class="book-holder"
    v-masonry
    horizontal-order="true"
    stamp=".book"
    transition-duration="0s"
    item-selector=".book"
    gutter="20"
  >
    <div class="loading-holder" v-if="loading">
      <div class="load"></div>
    </div>
    <div
      v-if="list.length && !loading"
      v-masonry-tile
      class="book"
      :class="{'noBottomPadding': !item.short_description.length}"
      v-for="item in list"
      :key="item.ID"
    >
      <i class="fal fa-heart full-heart2">
        <i
          class="far fa-heart full-heart"
          :class="{'fas fa-heart' : item.heart}"
          @click="favor(item)"
        ></i>
      </i>

      <div class="glanz"></div>
      <router-link :to="{path: '/books/'+item.isbn, params: {isbn: item.isbn}}">
        <img :src="apiLink+'/getpicture?key='+item.picture_key" />
        <p v-if="item.short_description">{{item.short_description}}</p>
        <div class="book-hover"></div>
      </router-link>
    </div>
    <div class="noBooks" v-if="!list.length && !loading">{{this.$t('booksPage.found')}}</div>
  </div>
</template>

<script>
import { api } from "../app/api";
import {createCookie} from "../plugins/cookieTime";
export default {
  props: {
    list: {},
    loading: {}
  },
  name: "BooksList",
  data: () => ({
    apiLink: api,
    windowWidth: 0,
    windowHeight: 0
  }),
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    },
    sessionID: function() {
      return this.$store.getters.sessionID;
    }
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener("resize", this.getWindowWidth);
      window.addEventListener("resize", this.getWindowHeight);

      //Init
      this.getWindowWidth();
      this.getWindowHeight();
    });
  },
  watch: {
    loadingBooks: function(){
      if(this.list.length){
        this.loading = false;
      }
    },
    windowWidth: function() {
      this.$nextTick(function() {
        window.addEventListener("resize", this.getWindowWidth);
        window.addEventListener("resize", this.getWindowHeight);

        //Init
        this.getWindowWidth();
        this.getWindowHeight();
        setTimeout(() => {
          this.$redrawVueMasonry();
        }, 300);
      });
    }
  },
  created(){
    let expireCookie = document.cookie.match(
            "(^|;) ?" + "bookFavorExpire" + "=([^;]*)(;|$)"
    );
    if (!expireCookie) {
      localStorage.removeItem("savedBook");
    }
    if (localStorage.getItem("savedBook")) {
      this.favor();
      localStorage.removeItem("savedBook");
    }
  },
  methods: {
    getWindowWidth(event) {
      this.windowWidth = document.documentElement.clientWidth;
    },

    getWindowHeight(event) {
      this.windowHeight = document.documentElement.clientHeight;
    },
    favor(book) {
      let data;
      if (localStorage.getItem("savedBook")) {
        let savedBook = localStorage.getItem("savedBook");
        let parse = JSON.parse(savedBook);
        data = {
          sessionID: this.sessionID,
          bookID: parse.bookID,
          value: parse.value,
        };
      }else {
        data = {
          sessionID: this.sessionID,
          bookID: book.ID,
          value: !book.heart
        };
      }
      if (this.isLoggedIn) {
        this.$http.post(api + "/session/favor", data).then(response => {
          book.heart = response.data.heart;
        });
      } else {
        localStorage.setItem("savedBook", JSON.stringify(data));
        createCookie("bookFavorExpire", "something", 1440);
        this.$emit("showLoginForFavor", data);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/components/booksList";
</style>