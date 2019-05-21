<template>
    <form>
        <div class="col-md-6 col-centered">
            <div class="form-group">
                <label for="username">Login</label>
                <input
                    type="text"
                    class="form-control text-center"
                    id="username"
                    aria-describedby="loginHelp"
                    placeholder="Wprowadź swój login"
                    v-model="username"
                >
                <small
                    id="loginHelp"
                    class="form-text text-muted"
                >Jeśli zapomniałeś swojego loginu, skontaktuj się z Administratorem</small>
            </div>
            <div class="form-group">
                <label for="password">Hasło</label>
                <input
                    type="password"
                    class="form-control text-center"
                    id="password"
                    placeholder="Wprowadź swoje hasło"
                    v-model="password"
                >
            </div>
            <button @click="onClickLogin" type="button" class="btn btn-primary">Zaloguj się</button>
        </div>
    </form>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                username: "",
                password: ""
            };
        },
        methods: {
            onClickLogin() {
                const params = new URLSearchParams();
                params.append("username", this.username);
                params.append("password", this.password);
                this.$http.post("login", params).then(() => {
                    this.$socket.on("news", (data) => {
                        console.log(JSON.stringify(data));
                        this.$socket.emit("reply", {
                            reply: "odzew klienta"
                        });
                    });
                    this.$store.commit("setAuthStatus", true);
                    this.$router.push("home");
                })
                    .catch((e) => {
                        alert("Coś poszło nie tak. Spróbuj ponownie później: " + e.message);
                    });
            }
        },
    };
</script>


<style>
.col-centered {
  float: none;
  margin: 0 auto;
}
</style>

