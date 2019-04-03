<template>
  <b-navbar class="navbar" toggleable="xl" type="dark">
      <b-button id="sidebar-toggle-button" variant="outline-info" v-b-tooltip.hover
                :title="sidebarHidden ? 'Show menu' : 'Collapse menu'"
                v-on:click="sidebarToggle">
        <fa-icon v-if="!sidebarHidden" icon="chevron-left"></fa-icon>
        <fa-icon v-else icon="chevron-right"></fa-icon>
      </b-button>
    <b-navbar-toggle target="nav_collapse_2" />

    <b-collapse is-nav id="nav_collapse_2">
      <b-navbar-nav>
        <b-nav-item class="nav-item new-button-item" :disabled="codeLoading">
          <b-button id="new-button" variant="outline-dark" v-b-tooltip.hover
                    title="Create a new block" :disabled="codeLoading">
            <fa-icon icon="plus"></fa-icon>
            New
          </b-button>
        </b-nav-item>
        <b-nav-item class="nav-item" :disabled="codeLoading || (!changesMadeSinceSave && !isSampleBlock)">
          <b-button id="save-button" variant="outline-info" v-b-tooltip.hover
                    title="Save current block" :disabled="codeLoading || (!changesMadeSinceSave && !isSampleBlock)"
                    v-on:click="saveChanges">
            <fa-icon icon="save"></fa-icon>
            Save
            <b-spinner v-if="isSaving" small class="spinner" type="grow" />
          </b-button>
        </b-nav-item>
        <b-nav-item class="nav-item" :disabled="codeLoading || !changesMadeSinceSave">
          <b-button id="discard-button" variant="outline-danger" v-b-tooltip.hover
                    title="Discard changes in block" :disabled="codeLoading || !changesMadeSinceSave"
                    v-on:click="discardChanges">
            <fa-icon icon="trash-alt"></fa-icon>
            Discard
          </b-button>
        </b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item class="nav-item" :disabled="codeLoading">
          <b-button align="right" id="execute-button" variant="outline-success" v-b-tooltip.hover
                    title="Execute current block" :disabled="codeLoading">
            <fa-icon icon="play"></fa-icon>
              Execute
          </b-button>
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: 'CodeAreaNavbar',
  props: {
    sidebarHidden: Boolean,
    
    changesMadeSinceSave: Boolean,
    isSampleBlock: Boolean,

    isSaving: Boolean,
    codeLoading: Boolean
  },
  methods: {
    sidebarToggle() {
			this.$emit('sidebar-toggle');
    },
    discardChanges() {
      this.$emit('discard-changes');
    },
    saveChanges() {
      this.$emit('save-changes');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.navbar {
  background-color: rgb(27, 27, 27);
  padding: 5px 5px 5px 5px;
}

#sidebar-toggle-button {
    color: #8c84ff;
    border-color: #8c84ff
}

@media only screen and (min-width: 1200px) {
  .navbar {
    height: 40px;
  }

  .new-button-item {
    margin: 0px 0px 0px 30px;
  }

  .navbar-nav .nav-link {
    padding-left: 0;
  }
}
</style>
