<template>
    <div id="app">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#">Aplikacja</a>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <router-link to="/">Home</router-link>
                    </li>
                    <li v-if="!isLogged" class="nav-item dropdown">
                        <router-link to="/login">Logowanie</router-link>
                    </li>
                    <li v-if="isLogged" class="nav-item dropdown">
                        <a @click="onClickLogout" href="#">Wyloguj</a>
                    </li>
                </ul>
            </div>
        </nav>
        <router-view/>
    </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.nav-item a {
  padding: 30px;
}
</style>

<script>
    export default {
        data() {
            return {
                isLogged: false
            };
        },
        methods: {
            onClickLogout: function() {
                this.$http.get("logout").then(() => {
                    window.location.reload();
                });
            },
            checkIfUserIsLogged: function() {
                let self = this;    
                this.$http.get("user")    
                    .then((response) => {    
                        if(response.data) {
                            self.$set(this, "isLogged", true); 
                        } else {
                            self.$set(this, "isLogged", false); 
                        }
                    })    
                    .catch((errors) => {    
                        console.log(errors);  
                    });    
            }
        },
        mounted() {    
            this.checkIfUserIsLogged();    
        } 
    };
</script>

