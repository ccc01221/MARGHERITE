<template>
  <div class="sidebar">
    <slot name="dropdown-menu"></slot>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
  computed: {
    isLoggedIn: function() {
      return this.$store.getters.isLoggedIn;
    }
  },
  methods: {
    logout: function() {
      this.$emit("close", true);
      this.$store.dispatch("logout");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/colors/color";
@import "../styles/fonts/sizes";
@import "../styles/components/sidebar";
</style>