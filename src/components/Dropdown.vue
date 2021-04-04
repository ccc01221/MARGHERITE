<template>
  <div class="dropdown">
    <ul class="dropdown-menu">
      <li class="dropdown-menu-item">
        <i class="fal fa-columns"></i>
        <span>Dashboard</span>
      </li>
      <li class="dropdown-menu-item">
        <i class="fal fa-user-circle"></i>
        <span>Profile</span>
      </li>
      <li @click="logout" class="dropdown-menu-item">
        <i class="fal fa-power-off"></i>
        <span>Logout</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "Dropdown",
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
@import "../styles/components/dropdown";
</style>