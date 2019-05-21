<template>
    <div class="home">
        <img alt="Vue logo" src="../assets/logo.png">
        <HelloWorld msg="Welcome to Your Vue.js App"/>
        <h2>Witaj {{ username }}</h2>
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
            username() {
                return this.$store.state.username;
            }
        },
        mounted() {
            this.$store.dispatch("loadUsername");
        }
    };
</script>
