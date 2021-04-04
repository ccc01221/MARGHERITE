<template>
  <div class="currencydropdown" v-on-clickaway="awaydropdown">
    <div :class="{'selected': showMenu}" class="currencydropdown__anchora" @click="toggleShow">
      <span>{{selected.currency}} {{selected.symbol}}</span>
      <i class="fas fa-angle-down"></i>
    </div>
    <transition
      enter-active-class="animated-faster fadeIn"
      leave-active-class="animated-faster fadeOut"
    >
      <div v-if="showMenu" class="currencydropdown__menu">
        <div
          class="currencydropdown__menu-menu-item"
          v-for="item in this.options"
          @click="itemClicked(item)"
        >
          <span v-if="item.currency===selected.currency">
            <i class="fas fa-check"></i>
          </span>
          {{item.currency}} {{item.symbol}}
          <ul></ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mixin as clickaway } from "vue-clickaway";

export default {
  name: "Dropdown",
  mixins: [clickaway],

  data: () => ({
    showMenu: false,
    selected: null
  }),
  datacollection: {},
  props: {
    options: {
      type: Array,
      default: [{ symbol: "€", rate: 1.0, currency: "EUR" }],
      required: true
    },
    value: {}
  },
  created() {
    if (this.options.length > 0) {
      if (this.value == undefined) {
        this.$emit("input", this.options[0]);
        this.selected = this.options[0];
      } else {
        this.selected = this.value;
      }
    }
  },
  methods: {
    toggleShow: function() {
      this.showMenu = !this.showMenu;
    },
    awaydropdown: function() {
      this.showMenu = false;
    },
    itemClicked: function(item) {
      this.selected = item;
      this.toggleShow();

      this.$emit("input", item);
    }
  },
  computed: {
    filteredElements() {
      return options.filter(element => {
        return element;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../styles/colors/color";
@import "../../styles/fonts/sizes";
// Breakpoints
@import "../../styles/breakpoints/breakpoints";

.currencydropdown {
  width: 150px;

  &__anchora {
    box-sizing: border-box;
    display: flex;

    align-items: center;
    justify-content: flex-start;
    border: 1px solid transparent;
    padding: 10px 10px;
    border-radius: 5px;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
      border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    background-color: $white;
    flex-wrap: nowrap;

    -webkit-box-shadow: 4px 3px 24px -71px rgba(0, 0, 0, 0.21);
    -moz-box-shadow: 4px 3px 24px -71px rgba(0, 0, 0, 0.21);
    box-shadow: 4px 3px 24px -71px rgba(0, 0, 0, 0.21);
    border-color: $darkgray;

    .span {
      font-size: $font_base;
      color: $black;
    }
    &:hover {
      cursor: pointer;
    }
    i {
      justify-self: flex-end !important;
      transform: rotate(0deg);
      color: $black;
      font-size: $font_base_bigger;
      transition: 0.3s all ease-in-out;
      margin-left: auto;
    }
  }
  &__menu {
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 0px;
    color: #212529;
    cursor: pointer;
    max-height: 350px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    font-size: $font_base;
    list-style: none;
    margin: 0;
    padding: 0 0;
    position: absolute;
    margin-bottom: 10px;

    @include breakpoint(for-phone-only) {
      margin-bottom: 0px;
    }

    text-align: left;
    -webkit-box-shadow: 4px 3px 46px -11px rgba(0, 0, 0, 0.3);
    -moz-box-shadow: 4px 3px 46px -11px rgba(0, 0, 0, 0.31);
    box-shadow: 4px 3px 46px -11px rgba(0, 0, 0, 0.31);
    bottom: 100%;
    width: 148px;

    &-menu-item {
      color: #212529;
      padding: 10px 20px;
      padding-left: 11px;
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out,
        border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      position: relative;
      span i {
        color: $red;
      }
      &:hover {
        background-color: $lightGray;
        cursor: pointer;
        font-weight: bolder;
      }
    }
  }
  .selected {
    transition: 0.3s all ease-in-out;
    background-color: $darkerGray;
    i {
      transform: rotate(-180deg);
      color: $red;
      transition: 0.3s all ease-in-out;
    }
  }
}
</style>
