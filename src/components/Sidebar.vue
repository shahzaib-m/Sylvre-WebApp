<template>
<div>
  <b-list-group v-if="isAtMainMenu">
    <b-list-group-item class="list-group-item" id="sample-list-item" button
                       v-on:click="closeSidebar">
      <div class="item-container">
        <fa-icon icon="bars"></fa-icon>
        Close menu
      </div>
    </b-list-group-item>
    <b-list-group-item class="list-group-item" id="sample-list-item" button
                       v-on:click="isSampleBlocksOpen = true">
      <div class="item-container">
        <fa-icon icon="lightbulb"></fa-icon>
        Sample blocks
      </div>
      <div class="item-container item-arrow" align="right"><fa-icon align="right" icon="caret-right"></fa-icon></div>
    </b-list-group-item>
    <b-list-group-item class="list-group-item" id="saved-list-item" button
                       v-on:click="isSavedBlocksOpen = true" :disabled="!isLoggedIn">
      <div class="item-container">
        <fa-icon icon="edit"></fa-icon>
        Saved blocks
      </div>
      <div class="item-container item-arrow" align="right"><fa-icon align="right" icon="caret-right"></fa-icon></div>
    </b-list-group-item>
  </b-list-group>

  <b-list-group v-else>
    <b-list-group-item class="list-group-item" id="sample-list-item" button
                       v-on:click="closeSidebar">
      <div class="item-container">
        <fa-icon icon="bars"></fa-icon>
        Close menu
      </div>
    </b-list-group-item>
    <b-list-group-item class="list-group-item" id="sample-list-item" button
                       v-on:click="isSampleBlocksOpen = false; isSavedBlocksOpen = false;">
      <div class="item-container">
        <fa-icon icon="caret-square-left"></fa-icon>
        Back to main menu
      </div>
    </b-list-group-item>

    <h3 v-if="isSampleBlocksOpen && !sampleBlocksLoading" align="left" class="sidebar-heading">Sample blocks</h3>
    <h3 v-else-if="isSavedBlocksOpen && !savedBlocksLoading" align="left" class="sidebar-heading">Saved blocks</h3>
    <div v-if="isSampleBlocksOpen" id="blocks-container">
      <div v-if="sampleBlocksLoading" class="mid-container">
        <b-spinner class="loading-spinner" type="grow" label="Loading"></b-spinner>
      </div>
      <b-list-group-item v-else class="list-group-item block-item" id="sample-list-item"
                        v-for="block in sampleBlocks" :key="block.id" button
                        v-on:click="openBlock(block.id)">
        <p class="block-title">{{ block.title }}</p>
      </b-list-group-item>
    </div>
    <div v-else-if="isSavedBlocksOpen" id="blocks-container">
      <div v-if="savedBlocksLoading" class="mid-container">
        <b-spinner class="loading-spinner" type="grow" label="Loading"></b-spinner>
      </div>
      <b-list-group-item v-else-if="savedBlocks.length >= 1" class="list-group-item block-item" id="sample-list-item"
                        v-for="block in savedBlocks" :key="block.id" button
                        v-on:click="openBlock(block.id)">
        <p class="block-title">{{ block.title }}</p>
        <b-button variant="outline-warning" 
                  v-on:click.stop="editSavedBlock(block.id)">Edit</b-button>
        <b-button id="delete-saved-block-button" variant="outline-danger"
                  v-on:click.stop="deleteSavedBlock(block.id)">Delete</b-button>
      </b-list-group-item>
      <div v-else class="mid-container">
        <h5>You have no saved blocks yet!</h5>
      </div>
    </div>
  </b-list-group>
</div>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    isLoggedIn: Boolean,

    sampleBlocks: Array,
    savedBlocks: Array,

    sampleBlocksLoading: Boolean,
    savedBlocksLoading: Boolean
  },
  data() {
    return {
      isSampleBlocksOpen: false,
      isSavedBlocksOpen: false,
    }
  },
  methods: {
    closeSidebar() {
      this.$emit('close-sidebar');
    },
    openBlock(id) {
      console.log('open: ' + id);
    },
    editSavedBlock(id) {
      console.log('edit: ' + id);
    },
    deleteSavedBlock(id) {
      console.log('delete: ' + id);
    }
  },
  computed: {
    isAtMainMenu() {
      return !this.isSampleBlocksOpen && !this.isSavedBlocksOpen;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sidebar-heading {
  padding: 0.875rem 1.25rem;
  font-size: 1.2rem;
}

#sample-list-item, #saved-list-item {
  width: 20rem;
  opacity: 0.6;
  transition: 0.2s;
}

@media only screen and (max-width: 768px) {
  #sample-list-item, #saved-list-item {
    width: 12rem;
  }
}

#sample-list-item:hover, #saved-list-item:hover {
  opacity: 1;
}

.item-container {
  display: inline;
}

.item-arrow {
  float: right;
}

.list-group-item {
  padding: 0.75rem 0.4rem 0.75rem 1.25rem;
}

#blocks-container {
  height: 50vh;
  max-width: 20rem;
  overflow-y: auto;
  overflow-x: hidden;
}

@media only screen and (max-width: 768px) {
  #blocks-container {
    max-width: 12rem;
  }
}

.block-item {
  color: #ffffff;
  background-color: rgb(50, 31, 109)
}

.mid-container {
  margin: 20px 0 0 0;
  text-align: center;
}

.loading-spinner {
  color:  rgb(152, 117, 255);
}

#delete-saved-block-button {
  margin: 0px 0px 0px 8px;
}
</style>
