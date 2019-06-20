<template>
  <div class="home">
    <div class="col-md-12">
      <b-alert v-if="message" show>{{ message }}</b-alert>
    </div>
    <HelloWorld/>
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "home",
  components: {
    HelloWorld
  },
  computed: {
    message() {
      return this.$store.state.message;
    }
  }
};
</script>
