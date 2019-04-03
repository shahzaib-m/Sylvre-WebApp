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
  props: {
    isAnyBlockLoaded: Boolean
  },
  data() {
		return {
			showModal: false
    }
  },
  methods: {
    show() {
      this.showModal = true;
    },
    confirm() {
			console.log('confirmed');
    },
    cancel() {
		  this.showModal = false;
    }
  },
  computed: {
    message() {
      var message = '';
      message += this.isAnyBlockLoaded ? 'The current code block will be reverted to its last saved state. '
        : 'Your unsaved changes will be lost. ';

      message += 'Are you sure you want to discard your current changes?'

      return message;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
