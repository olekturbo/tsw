<template>
  <h2 class="mt-50">Witaj {{ username }}</h2>
</template>

<script>
    export default {
        name: "HelloWorld",
        computed: {
            username() {
                return this.$store.state.username;
            }
        },
        mounted() {
            this.$store.dispatch("loadUsername");
        }
    };
</script>

<style>
.mt-50 {
    margin-top: 50px;
}
</style>

