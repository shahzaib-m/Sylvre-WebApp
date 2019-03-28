<template>
  <div id="app">
    <Navbar v-bind:isGettingUserDetails="isGettingUserDetails" v-bind:isLoggedIn="isLoggedIn"
            v-bind:username="currentUser.username" 
            v-on:login-click="openLoginModal" v-on:register-click="openRegisterModal"
            v-on:logout-click="logout" v-bind:isLoggingOut="isLoggingOut"
            v-bind:isServerDown="isServerDown" />

    <LoginModal ref="loginModalRef" v-bind:errorMessage="loginModalErrorMessage"
                v-on:login-performed="attemptLogin" v-bind:isLoggingIn="isLoggingIn"
                v-on:modal-closed="loginModalClosed" />

    <RegisterModal ref="registerModalRef" v-on:server-down="receivedServerDown"
                   v-on:register-performed="attemptRegister" v-bind:isRegistering="isRegistering"
                   v-bind:successfulRegister="successfulRegister" v-on:modal-closed="registerModalClosed"
                   v-bind:errorMessage="registerModalErrorMessage" />

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
import RegisterModal from './components/RegisterModal.vue';

import AuthApi from './services/api/Auth.js';
import UsersApi from './services/api/Users.js';

export default {
  name: 'app',
  components: {
    Navbar,
    LoginModal,
    RegisterModal
  },
  data() {
    return {
      isServerDown: false,
      isLoggedIn: false,
      
      isGettingUserDetails: false,
      currentUser: {
        userId: null,
        username: '',
        email: '',
        fullName: ''
      },

      loginModalErrorMessage: '',
      isLoggingIn: false,
      isLoggingOut: false,

      registerModalErrorMessage: '',
      isRegistering: false,
      successfulRegister: false
    }
  },
  methods: {
    receivedServerDown() {
      this.closeLoginModal();
      this.closeRegisterModal();

      this.isServerDown = true;
    },
    openLoginModal() {
      this.$refs.loginModalRef.show();
    },
    closeLoginModal() {
      this.$refs.loginModalRef.hide();
    },
    loginModalClosed(){
      this.loginModalErrorMessage = '';
    },
    openRegisterModal() {
      this.$refs.registerModalRef.show();
    },
    closeRegisterModal() {
      this.$refs.registerModalRef.hide();
    },
    registerModalClosed() {
      this.registerModalErrorMessage = '';
      this.successfulRegister = false;
    },
    openSettings() {
      console.log('settings clicked')
    },
    async logout() {
      this.isLoggingOut = true;

      try {
        await AuthApi.logout();

        this.isLoggedIn = false;
      }
      catch (error){
        if (!error.response) {
          this.isServerDown = true;
        }
      }
      finally {
        this.isLoggingOut = false;
      }
    },
    async attemptLogin(credentials) {
      this.loginModalErrorMessage = '';
      this.isLoggingIn = true;

      try {
        const data = await AuthApi.login(credentials.usernameOrEmail, credentials.password);

        this.isLoggedIn = true;
        this.isLoggingIn = false;

        this.closeLoginModal();

        this.isGettingUserDetails = true;

        var user = await UsersApi.getUserByIdentity();
        this.currentUser.userId = user.userId;
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
    },
    async attemptRegister(details) {
      this.isRegistering = true;

      try {
        await UsersApi.registerUser(details.username, details.password, details.email, '');
        this.successfulRegister = true;
      }
      catch(error) {
        if (error.response) {
          this.registerModalErrorMessage = 'Unknown error encountered.';
        }
        else {  // server down
          this.closeRegisterModal();

          this.isServerDown = true;
        }
      }
      finally {
        this.isRegistering = false;
      }
    }
  },
  created: async function() {
    try {
      this.isGettingUserDetails = true;
      
      var user = await UsersApi.getUserByIdentity();
      this.currentUser.userId = user.userId;
      this.currentUser.username = user.username;
      this.currentUser.email = user.email;
      this.currentUser.fullName = user.fullName;

      this.isLoggedIn = true;
    }
    catch(error) {
      if (!error.response) {
        this.isServerDown = true;
      }
      
      this.isLoggedIn = false;
    }
    finally {
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
