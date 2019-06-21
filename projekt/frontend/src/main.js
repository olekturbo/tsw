import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import axios from "axios";
import VueSocketIO from "vue-socket.io";
import store from "./store";

Vue.use(new VueSocketIO({
    debug: true,
    connection: "http://localhost:3001",
    vuex: {
        store,
        actionPrefix: "SOCKET_",
        mutationPrefix: "SOCKET_"
    }
}));


const base = axios.create({
    baseURL: "http://localhost:3001/",
    withCredentials: true,
});
const gen = axios.create();
Vue.prototype.$http = base;
Vue.prototype.$gen = gen;
Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
