<template>
  <h2 class="mt-50">
      <template v-if="username">
          Witaj {{ username }}!<br/> Dziękuję za zalogowanie się na stronie.
      </template>
      <template v-else>
          Witaj, jesteś gościem!<br/> Zaloguj się aby mieć więcej uprawnień.
      </template>
  </h2>
</template>

<script>
    export default {
        name: "HelloWorld",
        computed: {
            username() {
                return this.$store.state.username;
            }
        }
    };
</script>

<style>
.mt-50 {
    margin-top: 50px;
}
</style>

