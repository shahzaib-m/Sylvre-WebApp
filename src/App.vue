<template>
  <div id="app">
    <Navbar v-bind:isGettingUserDetails="isGettingUserDetails" v-bind:isLoggedIn="isLoggedIn"
            v-bind:username="currentUser.username" 
            v-on:login-click="openLoginModal" v-on:register-click="openRegisterModal"
            v-on:logout-click="logout" v-bind:isLoggingOut="isLoggingOut"
            v-bind:isServerDown="isServerDown" />

    <!-- Modals -->
    <LoginModal ref="loginModalRef" v-bind:errorMessage="loginModalErrorMessage"
                v-on:login-performed="attemptLogin" v-bind:isLoggingIn="isLoggingIn"
                v-on:modal-closed="loginModalClosed" />

    <RegisterModal ref="registerModalRef" v-on:server-down="receivedServerDown"
                   v-on:register-performed="attemptRegister" v-bind:isRegistering="isRegistering"
                   v-bind:successfulRegister="successfulRegister" v-on:modal-closed="registerModalClosed"
                   v-bind:errorMessage="registerModalErrorMessage" />

    <DiscardConfirmationModal ref="discardConfirmationModal" v-on:discard-confirmed="discardChanges" />
    <!------------>

    <div v-if="isServerDown" id="server-down-container" align="center">
      <fa-icon :icon="['far', 'frown-open']" size="10x" spin></fa-icon>
      <h1 id="server-down-message">Sorry, the server seems to be down.</h1>
    </div>
    <div v-else class="d-flex" id="wrapper" v-bind:class="{ toggled: sidebarHidden }">
      <div id="sidebar-wrapper">
        <Sidebar v-on:close-sidebar="sidebarHidden = true"
                 v-bind:sampleBlocks="sampleBlocks" v-bind:savedBlocks="savedBlocks"
                 v-bind:savedBlocksLoading="savedBlocksLoading" 
                 v-bind:sampleBlocksLoading="sampleBlocksLoading"
                 v-bind:isLoggedIn="isLoggedIn" 
                 v-bind:loadedBlockId="currentlyLoadedBlock.id" />
      </div>
      <div id="code-area-container">
        <div id="code-area-navbar">
          <CodeAreaNavbar v-on:sidebar-toggle="sidebarHidden = !sidebarHidden"
                          v-bind:sidebarHidden="sidebarHidden"
                          v-bind:changesMadeSinceSave="changesMadeSinceSave"
                          v-bind:isSampleBlock="currentlyLoadedBlock.isSampleBlock"
                          v-on:discard-changes="handleDiscardChangesRequest" />
        </div>
        <div id="code-editor">
          <CodeEditor :codeLoading="codeLoading" ref="codeEditor" v-on:code-changed="changesMadeSinceSave = true" />
        </div>
        <div id="code-output">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
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
import DiscardConfirmationModal from './components/DiscardConfirmationModal.vue';

import CodeAreaNavbar from './components/CodeAreaNavbar.vue';
import CodeEditor from './components/CodeEditor.vue';

import AuthApi from './services/api/Auth.js';
import UsersApi from './services/api/Users.js';
import SylvreBlocksApi from './services/api/SylvreBlocks.js';

export default {
  name: 'app',
  components: {
    Navbar,
    Sidebar,

    LoginModal,
    RegisterModal,
    DiscardConfirmationModal,

    CodeAreaNavbar,
    CodeEditor
  },
  data() {
    return {
      isServerDown: false,
      isLoggedIn: false,
      
      isGettingUserDetails: false,
      currentUser: {
        id: null,
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

      sidebarHidden: false,

      sampleBlocks: [],
      sampleBlocksLoading: true,
      savedBlocks: [],
      savedBlocksLoading: false,

      codeLoading: false,
      currentlyLoadedBlock: {},

      changesMadeSinceSave: false
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
        this.savedBlocks = [];
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
        this.isLoggingIn = false;
        this.closeLoginModal();

        this.isGettingUserDetails = true;

        var user = await UsersApi.getUserByIdentity();
        this.currentUser.id = user.id;
        this.currentUser.username = user.username;
        this.currentUser.email = user.email;
        this.currentUser.fullName = user.fullName;

        this.isGettingUserDetails = false;
        this.isLoggedIn = true;

        this.getAndPopulateSavedBlocks();
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
    },
    async getAndPopulateSavedBlocks() {
      this.savedBlocksLoading = true;

      var savedBlocks = await SylvreBlocksApi.getAllSylvreBlocks(true);
      this.savedBlocks = savedBlocks;

      this.savedBlocksLoading = false;
    },
    handleDiscardChangesRequest() {
      var message = this.currentlyLoadedBlock.id == null ? 'Your unsaved changes will be lost. '
        : 'The current code block will be reverted to its last saved state. ';
      message += 'Are you sure you want to discard your current changes?'

      this.$refs.discardConfirmationModal.show(message, this.currentlyLoadedBlock.id != null, null);
    },
    async discardChanges(isRevert, newBlockToLoad) {
      if (isRevert) { // reverting changes
        this.$refs.codeEditor.setNewCode(this.currentlyLoadedBlock.body);
        this.changesMadeSinceSave = false;
      }
      else if (newBlockToLoad == null) {  // nothing to load, clear editor
        this.$refs.codeEditor.setNewCode('');
        this.changesMadeSinceSave = false;
      }
      else {  // loading in this block from the API
        this.loadBlock(newBlockToLoad);
      }
    },
    async loadBlock(newBlockToLoad) {
      try {
        this.codeLoading = true;
        var newBlock = {};
        if (newBlockToLoad.isSampleBlock) {
          newBlock = await SylvreBlocksApi.getSampleSylvreBlockById(newBlockToLoad.id);
        }
        else {
          var newBlock = await SylvreBlocksApi.getSylvreBlockById(newBlockToLoad.id);
        }

        this.currentlyLoadedBlock = newBlock;
        this.$refs.codeEditor.setNewCode(newBlock.body);
        this.changesMadeSinceSave = false;
      }
      catch(error) {
        if (!error.response) {
          this.isServerDown = true;
        }
      }
      finally {
        this.codeLoading = false;
      }
    }
  },
  created: async function() {
    try {
      this.isGettingUserDetails = true;
      
      var user = await UsersApi.getUserByIdentity();
      this.currentUser.id = user.id;
      this.currentUser.username = user.username;
      this.currentUser.email = user.email;
      this.currentUser.fullName = user.fullName;

      this.isLoggedIn = true;
      this.isGettingUserDetails = false;
      this.getAndPopulateSavedBlocks();
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

    try {
      var sampleBlocks = await SylvreBlocksApi.getAllSampleSylvreBlocks(true);
      this.sampleBlocks = sampleBlocks;
      this.sampleBlocksLoading = false;

      this.loadBlock(sampleBlocks[0]);
    }
    catch(error) {
      if (!error.response) {
        this.isServerDown = true;
      }
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
  max-height: 75vh;
}
</style>
