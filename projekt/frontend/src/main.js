import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import BootstrapVue from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import axios from "axios";
import VueSocketIO from "vue-socket.io";

Vue.use(new VueSocketIO({
    debug: true,
    connection: "http://localhost:3000",
}));


const base = axios.create({
    baseURL: "http://localhost:3000/",
    withCredentials: true
});
Vue.prototype.$http = base;
Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App)
}).$mount("#app");
