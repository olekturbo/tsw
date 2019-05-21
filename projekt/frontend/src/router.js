import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import store from "./store";


Vue.use(Router);

let router =  new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            alias: "/home",
            name: "home",
            component: Home
        },
        {
            path: "/login",
            name: "login",
            component: Login,
            meta: {
                guest: true
            }
        }
    ]
});

router.beforeEach((to, from, next) => {
    store.state.authStatus.then(isLoggedIn => {
        if(to.matched.some(record => record.meta.guest)) {
            if(!isLoggedIn){
                next();
            }
            else{
                next({name: "home"});
            }
        }else {
            next(); 
        }
    });
});

export default router;