<template>
<div>
  <b-list-group>
    <b-list-group-item class="list-group-item" id="sample-list-item" button
                       v-on:click="closeSidebar">
      <div class="item-container">
        <fa-icon icon="bars"></fa-icon>
        Close menu
      </div>
    </b-list-group-item>
    <b-list-group-item class="list-group-item" id="sample-list-item" button>
      <div class="item-container">
        <fa-icon icon="lightbulb"></fa-icon>
        Sample blocks
      </div>
      <div class="item-container item-arrow" align="right"><fa-icon align="right" icon="caret-right"></fa-icon></div>
    </b-list-group-item>
    <b-list-group-item class="list-group-item" id="sample-list-item" button>
      <div class="item-container">
        <fa-icon icon="edit"></fa-icon>
        Saved blocks
      </div>
      <div class="item-container item-arrow" align="right"><fa-icon align="right" icon="caret-right"></fa-icon></div>
    </b-list-group-item>
  </b-list-group>
</div>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {

  },
  methods: {
    closeSidebar() {
      this.$emit('close-sidebar');
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
</style>
