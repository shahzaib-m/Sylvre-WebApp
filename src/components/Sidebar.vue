<template>
<div>
  <b-list-group>
    <h3 align="left" class="sidebar-heading">Code blocks</h3>
    
    <b-list-group-item class="list-group-item" id="sample-list-item" button>Sample blocks</b-list-group-item>
    <b-list-group-item class="list-group-item" id="saved-list-item" button>Saved blocks</b-list-group-item>
  </b-list-group>
</div>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {

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
</style>
