<template>
  <div id="app">
    <Navbar v-bind:isLoggingIn="isLoggingIn" v-bind:isLoggedIn="isLoggedIn" v-bind:username="username"
            v-on:login-click="openLogin" v-on:register-click="openRegister"
            v-on:settings-click="openSettings" v-on:logout-click="openLogout" />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  name: 'app',
  components: {
    Navbar
  },
  data() {
    return {
      isLoggingIn: true,
      isLoggedIn: false,
      username: ''
    }
  },
  methods: {
    openLogin() {
      console.log('login clicked');
    },
    openRegister() {
      console.log('register clicked');
    },
    openSettings() {
      console.log('settings clicked')
    },
    openLogout() {
      console.log('loguout clicked');
    }
  },
  created: function() {
    this.isLoggingIn = false;
    this.isLoggedIn = false;
  }
}
</script>

<style>
#app {
  font-family: 'Roboto', 'Avenir', Helvetica, Arial, sans-serif;
}
</style>
