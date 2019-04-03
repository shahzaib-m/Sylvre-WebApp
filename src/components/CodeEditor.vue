<template>
   <codemirror :disabled="codeLoading" ref="cmInstance" v-model="code" :options="cmOptions"
	 						 @input="onCmCodeChange"></codemirror>
</template>

<script>
export default {
	name: 'CodeEditor',
	props: {
		codeLoading: Boolean
	},
  data () {
    return {
      code: '',
      newCodeReceived: false,
      cmOptions: {
        tabSize: 2,
        mode: 'sylvre',
        lineNumbers: true,
        line: true
      }
    }
	},
  methods: {
    setNewCode(code) {
      this.code = code;
      this.newCodeReceived = true;

      this.$nextTick(() => {  // need to wait for DOM to update
        this.codemirror.doc.clearHistory(); // remove undo history
      });
    },
    getCode() {
      return this.code;
    },
    onCmCodeChange() {
      if (this.newCodeReceived) { // change event fired due to setNewCode() code update
        this.newCodeReceived = false;
      }
      else {  // change event fired due to user input code update
        this.$emit('code-changed');
      }
    }
  },
  computed: {
    codemirror() {
      return this.$refs.cmInstance.codemirror
		}
  },
  mounted() {
    console.log('codemirror instance: ', this.codemirror)
  }
}
</script>
<style>
.CodeMirror {
  line-height: 1em;
  
  /* This prevents unwanted scrollbars from showing up on the body and wrapper in IE. */
  overflow: hidden;
	
	font-size: 17px;

	font-family: 'Roboto Mono', monospace !important;
	height: 70vh !important;
}

@media only screen and (max-width: 1000px) {
  .CodeMirror {
  	font-size: 15px;
  }
}

.CodeMirror-scroll {
  overflow: auto;

	height: 70vh !important;
}

/** custom/modified token styles **/
.cm-special {
  color: rgb(137, 129, 255)
}

.cm-number {
  color: #2dc78c !important;
}
</style>