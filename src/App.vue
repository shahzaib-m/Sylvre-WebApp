<template>
  <div id="app">
    <Navbar v-bind:isAttemptingRefreshLogin="isAttemptingRefreshLogin" v-bind:isLoggedIn="isLoggedIn"
            v-bind:username="currentUser.username" v-bind:isGettingUserDetails="isGettingUserDetails"
            v-on:login-click="openLoginModal" v-on:register-click="openRegister"
            v-on:settings-click="openSettings" v-on:logout-click="logout"
            v-bind:isServerDown="isServerDown" />

    <LoginModal ref="loginModalRef" v-bind:errorMessage="loginModalErrorMessage"
                v-on:login-performed="attemptLogin" v-bind:isLoggingIn="isLoggingIn"
                v-on:modal-closed="loginModalClosed" />

    <div v-if="isServerDown" id="server-down-container" align="center">
      <i class="far fa-spin fa-frown-open fa-10x" />
      <h1 id="server-down-message">Sorry, the server seems to be down.</h1>
    </div>
    <div v-else id="body-container">

    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

import LoginModal from './components/LoginModal.vue';

import AuthApi from './services/api/Auth.js';
import UsersApi from './services/api/Users.js';

export default {
  name: 'app',
  components: {
    Navbar,
    LoginModal
  },
  data() {
    return {
      isServerDown: false,

      isAttemptingRefreshLogin: true,
      isLoggedIn: false,
      
      isGettingUserDetails: false,
      currentUser: {
        username: '',
        email: '',
        fullName: ''
      },
      userId: null,

      loginModalErrorMessage: '',
      isLoggingIn: false
    }
  },
  methods: {
    openLoginModal() {
      this.$refs.loginModalRef.show();
    },
    closeLoginModal() {
      this.$refs.loginModalRef.hide();
    },
    loginModalClosed(){
      this.loginModalErrorMessage = '';
    },
    openRegister() {
      console.log('register clicked');
    },
    openSettings() {
      console.log('settings clicked')
    },
    logout() {
      console.log('logout clicked');
    },
    async attemptLogin(credentials) {
      this.loginModalErrorMessage = '';
      this.isLoggingIn = true;

      try {
        const data = await AuthApi.login(credentials.username, credentials.password);
        this.userId = data.userId;

        this.isLoggedIn = true;
        this.isLoggingIn = false;

        this.closeLoginModal();

        this.isGettingUserDetails = true;

        var user = await UsersApi.getUser(this.userId);
        this.currentUser.username = user.username;
        this.currentUser.email = user.email;
        this.currentUser.fullName = user.fullName;

        this.isGettingUserDetails = false;
      }
      catch(error) {
        if (error.response) {
          this.loginModalErrorMessage = error.response.status === 401 ? 
            'Username or password is incorrect.' : 'Unknown error encountered with login.'
        }
        else {  // server down
          this.closeLoginModal();

          this.isServerDown = true;
        }

        this.isLoggingIn = false;
        this.isGettingUserDetails = false;
      }
    }
  },
  created: async function() { // try to get a new access token and refresh using the current refresh token, if available
    try {
      const data = await AuthApi.refresh();

      this.userId = data.userId;
      this.isLoggedIn = true;

      this.isAttemptingRefreshLogin = false;

      this.isGettingUserDetails = true;
      
      var user = await UsersApi.getUser(this.userId);
      this.currentUser.username = user.username;
      this.currentUser.email = user.email;
      this.currentUser.fullName = user.fullName;

      this.isGettingUserDetails = false;
    }
    catch(error) {
      if (!error.response) {
        this.isServerDown = true;
      }
      
      this.isLoggedIn = false;
      this.isAttemptingRefreshLogin = false;
      this.isGettingUserDetails = false;
    }
  }
}
</script>

<style>
#app {
  font-family: 'Roboto', 'Avenir', Helvetica, Arial, sans-serif;
}

#server-down-container {
  margin: 200px 0px 0px 0px;
}

@media only screen and (max-width: 768px){
  #server-down-container {
    margin: 30px 0px 0px 0px;
  }
}

#server-down-message {
  margin: 20px 0px 0px 0px;
}
</style>
