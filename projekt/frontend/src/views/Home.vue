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
        data() {    
            return {    
                username: ""    
            };    
        }, 
        methods: {    
            getUserData: function() {    
                let self = this;    
                this.$http.get("user")    
                    .then((response) => {    
                        self.$set(this, "username", response.data.username);    
                    })    
                    .catch((errors) => {    
                        console.log(errors);  
                    });    
            }    
        },    
        mounted() {    
            this.getUserData();    
        } 
    };
</script>
