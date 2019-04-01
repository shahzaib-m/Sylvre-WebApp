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
      <fa-icon :icon="['far', 'frown-open']" size="10x" spin></fa-icon>
      <h1 id="server-down-message">Sorry, the server seems to be down.</h1>
    </div>
    <div v-else class="d-flex" id="wrapper" v-bind:class="{ toggled: sidebarHidden }">
      <div id="sidebar-wrapper">
        <Sidebar v-on:close-sidebar="sidebarHidden = true" />
      </div>
      <div id="code-area-container">
        <div id="code-area-navbar">
          <CodeAreaNavbar v-on:sidebar-toggle="sidebarHidden = !sidebarHidden"
                          v-bind:sidebarHidden="sidebarHidden" />
        </div>
        <div id="code-editor">

        </div>
        <div id="code-output">

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';

import LoginModal from './components/LoginModal.vue';
import RegisterModal from './components/RegisterModal.vue';

import CodeAreaNavbar from './components/CodeAreaNavbar.vue';

import AuthApi from './services/api/Auth.js';
import UsersApi from './services/api/Users.js';

export default {
  name: 'app',
  components: {
    Navbar,
    Sidebar,
    LoginModal,
    RegisterModal,

    CodeAreaNavbar
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
      successfulRegister: false,

      sidebarHidden: false
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
        await AuthApi.login(credentials.usernameOrEmail, credentials.password);

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

#sidebar-wrapper {
  min-height: 94vh;
  margin-left: 0;
  -webkit-transition: margin .25s ease-out;
  -moz-transition: margin .25s ease-out;
  -o-transition: margin .25s ease-out;
  transition: margin .25s ease-out;

  border-right: 1px solid rgba(117, 77, 235, 0.651);
}
#wrapper.toggled #sidebar-wrapper {
  margin-left: -20rem;
}

@media only screen and (max-width: 768px) {
  #wrapper.toggled #sidebar-wrapper {
    margin-left: -12rem;
  }
}

#code-area-container {
  min-width: 0;
  width: 100%;
}

#code-editor {
  min-height: 70vh;
}
</style>
