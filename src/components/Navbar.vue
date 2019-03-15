<template>
  <b-navbar class="navbar" toggleable="lg" type="dark">
    <b-navbar-brand href="#">
      <img class="d-inline-block align-top" src="../assets/logo-250.png" width="25" height="25" alt="">
      Sylvre Web Editor
    </b-navbar-brand>
     <b-navbar-toggle target="nav_collapse" />

    <b-collapse is-nav id="nav_collapse">
      <b-navbar-nav>
        <b-nav-item class="nav-item" v-bind:href="sylvreDocsUrl" target="_blank">
          Documentation
          <i class="fas fa-book nav-item-icon"></i>
        </b-nav-item>
        <b-nav-item class="nav-item" v-bind:href="mainProjectGithubUrl" target="_blank">
          Sylvre and WebAPI
          <i class="fab fa-github nav-item-icon"></i>
        </b-nav-item>
        <b-nav-item class="nav-item" v-bind:href="webAppProjectGithubUrl" target="_blank">
          Web Application
          <i class="fab fa-github nav-item-icon"></i>
        </b-nav-item>
        <b-nav-item class="nav-item" v-bind:href="authorGithubUrl" target="_blank">
          by shahzaib-m
        </b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <div v-if="isLoadingUser">
           <b-spinner type="grow" variant="success" />
        </div>
        <div v-else-if="isLoggedIn" class="not-logged-in animated infinite fadeIn">
          <span id="username">{{username}}</span>
          <b-button variant="outline-info" class="settings-button" type="button" 
                    @click="$emit('settings-click')">
            <i class="fas fa-cog"></i>
            Settings
          </b-button>
          <b-button variant="outline-warning" type="button"
                    @click="$emit('logout-click')">
            <i class="fas fa-sign-out-alt"></i>
            Logout
          </b-button>
        </div>
        <div v-else class="not-logged-in animated infinite fadeIn">
          <b-button variant="outline-success" class="sign-in-button" type="button"
                    @click="$emit('login-click')">
            <i class="fas fa-sign-in-alt"></i>
            Login
          </b-button>
          <b-button variant="outline-info" type="button"
                    @click="$emit('register-click')">
            <i class="fas fa-user-plus"></i>
            Register
          </b-button>
        </div>
      </b-navbar-nav>
     </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    isAttemptingRefreshLogin: Boolean,
    isLoggedIn: Boolean,
    isGettingUserDetails: Boolean,
    username: String
  },
  data() {
    return {
      sylvreDocsUrl: process.env.VUE_APP_SYLVRE_DOCS_URL,
      mainProjectGithubUrl: process.env.VUE_APP_SYLVRE_MAIN_PROJECT_GITHUB,
      webAppProjectGithubUrl: process.env.VUE_APP_SYLVRE_WEBAPP_PROJECT_GITHUB,
      authorGithubUrl: process.env.VUE_APP_AUTHOR_GITHUB_URL
    }
  },
  computed: {
    isLoadingUser: function() {
      return this.isAttemptingRefreshLogin || this.isGettingUserDetails;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar {
  background-color: #482C9C;
}

.navbar-dark .navbar-nav .nav-link {
  color: rgb(199, 180, 255); 
  opacity: 0.5;
  transition: .3s;
}

.navbar-dark .navbar-nav .nav-link:hover {
  color: #ffffff;
  opacity: 1;
}

.sign-in-button {
  margin: 0px 10px 0px 0px
}

.settings-button {
  margin: 0px 10px 0px 0px
}

#username {
  color: rgb(234, 234, 234);
  margin: 0px 15px 0px 0px;
  vertical-align: middle;
  font-weight: bold
}

.not-logged-in {
  animation-duration: 0.4s;
  animation-iteration-count: 1;
}

.logged-in {
  animation-duration: 0.4s;
  animation-iteration-count: 1;
}

@media only screen and (min-width: 992px) {
  .navbar {
    max-height: 55px;
  }
}
</style>
