<template>
  <div class="register">
    <h1>Register</h1>
    <input placeholder="email" type="email" />
    <input placeholder="password" type="password" />
    <input placeholder="retype password" type="password" />
    <button>Register</button>
    <router-link :to="{name: 'login'}">Back to login</router-link>
  </div>
</template>

<script>
export default {
  name: "Register"
};
</script>

<style scoped>
</style>