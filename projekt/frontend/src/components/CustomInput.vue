<template>
      <input type="number" v-model="inputVal" oninput="validity.valid||(value='0');" :tabindex="index" step="0.5">
</template>

<script>
export default {
  name: "CustomInput",
  props: ['value', 'index'],
  data() {
    return { inputVal: this.value }
  },
  watch: {
    inputVal(val) {
      if(val < 0) val = 0;
      else if(val > 20) val = 20;
      this.inputVal = val;
      this.$emit('input', val);
    }
  },
}
</script>
