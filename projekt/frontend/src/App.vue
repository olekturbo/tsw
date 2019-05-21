<template>
    <div id="app">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#">Aplikacja</a>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <router-link to="/">Home</router-link>
                    </li>
                    <template v-if="isLoggedIn">
                        <li class="nav-item dropdown">
                            <a @click="onClickLogout" href="#">Wyloguj</a>
                        </li>
                        <li class="nav-item dropdown">
                            <router-link to="/referees">Sędziowie</router-link>
                        </li>
                        <li class="nav-item dropdown">
                            <router-link to="/classes">Klasy</router-link>
                        </li>
                    </template>
                    <template v-else>
                        <li class="nav-item dropdown">
                            <router-link to="/login">Logowanie</router-link>
                        </li>
                    </template>
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

.col-centered {
  float: none;
  margin: 0 auto;
}
</style>

<script>
    export default {
        methods: {
            onClickLogout: function() {
                this.$http.get("logout").then(() => {
                    this.$store.commit("setAuthStatus", false);
                    this.$router.go(0);
                });
            },
        },
        computed: {
            isLoggedIn() {
                return this.$store.state.isLoggedIn;
            }
        }
    };
</script>

