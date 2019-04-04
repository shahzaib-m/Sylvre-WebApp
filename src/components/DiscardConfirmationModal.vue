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
      isClean: false,
      isBlockLoad: false,
      isLogout: false,

      blockToLoad: null,
      
			showModal: false
    }
  },
  methods: {
    confirmForDiscardAndRevert() {
      this.message = 'The current code block will be reverted to its last saved state. Are you sure you want to discard your unsaved changes?';
      this.isRevert = true;
      this.showModal = true;
    },
    confirmForDiscardAndClean() {
      this.message = 'Your unsaved changes will be lost. Are you sure you want to discard your unsaved changes?';
      this.isClean = true;
      this.showModal = true;
    },
    confirmForDiscardAndBlockLoad(blockToLoad) {
      this.message = 'Your unsaved changes will be lost. Are you sure you want to discard your unsaved changes?';
      this.isBlockLoad = true;
      this.blockToLoad = blockToLoad;
      this.showModal = true;
    },
    confirmForDiscardAndLogout() {
      this.message = 'Your unsaved changes will be lost. Are you sure you want to discard your unsaved changes and logout?';
      this.isLogout = true;
      this.showModal = true;
    },
    confirm() {
      if (this.isRevert) {
        this.$emit('revert-confirmed');
        this.isRevert = false;
      }
      else if (this.isClean) {
        this.$emit('clean-confirmed');
        this.isClean = false;
      }
      else if (this.isBlockLoad){
        this.$emit('blockload-confirmed', this.blockToLoad);
        this.isBlockLoad = false;
        this.blockToLoad = null;
      }
      else if (this.isLogout) {
        this.$emit('logout-confirmed');
        this.isLogout = false;
      }

      this.showModal = false;
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
