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
                        <li class="nav-item dropdown">
                            <router-link to="/horses">Konie</router-link>
                        </li>
                         <li class="nav-item dropdown">
                        <a @click="generateData" href="#"><b>Wygeneruj dane</b></a>
                    </li>
                    </template>
                    <template v-else>
                        <li class="nav-item dropdown">
                            <router-link to="/login">Logowanie</router-link>
                        </li>
                    </template>
                    <li class="nav-item dropdown">
                        <router-link to="/panel">Panel Kibica</router-link>
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
  outline: 0;
}

.col-centered {
  float: none;
  margin: 0 auto;
}

::-webkit-scrollbar {
  width: 15px;
  height: 15px;
}
::-webkit-scrollbar-track-piece {
  background-color: #c2d2e4;
}
::-webkit-scrollbar-thumb:vertical {
  height: 30px;
  background-color: #0a4c95;
}

</style>

<script>
    export default {
        methods: {
            onClickLogout: function() {
                this.$http.get("logout").then(() => {
                    this.$router.go(0);
                });
            },
            generateData: function() {
                if(confirm("Czy na pewno chcesz wygenerować przykładowe dane i NADPISAĆ obecne?")) {
                    this.$router.push('generator');
                }
            }
        },
        computed: {
            isLoggedIn() {
                return this.$store.state.isLoggedIn;
            }
        }
    };
</script>

