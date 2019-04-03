<template>
<b-modal v-model="showModal" title="Confirm" ok-title="Yes" cancel-title="No"
         ok-variant="outline-success" cancel-variant="outline-danger"
         hide-header-close v-on:ok="confirm" v-on:cancel="cancel">
  {{ message }}
</b-modal>
</template>

<script>
export default {
  name: 'DiscardConfirmationModal',
  data() {
		return {
      message: '',
      isRevert: false,
      newBlockToLoad: null,
			showModal: false
    }
  },
  methods: {
    show(message, isRevert, newBlockToLoad) { // isRevert - for when a block is being reverted to previous save, false if a complete discard (unsaved)
      this.message = message;
      this.isRevert = isRevert;
      this.newBlockToLoad = newBlockToLoad;
      this.showModal = true;
    },
    confirm() {
			this.$emit('discard-confirmed', this.isRevert, this.newBlockToLoad);
    },
    cancel() {
		  this.showModal = false;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
