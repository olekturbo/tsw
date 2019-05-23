import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import Referee from "./views/Referee.vue";
import Class from "./views/Class.vue";
import Horse from "./views/Horse.vue";
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
        },
        {
            path: "/referees",
            name: "referees",
            component: Referee,
            meta: {
                auth: true
            }
        },
        {
            path: "/classes",
            name: "classes",
            component: Class,
            meta: {
                auth: true
            }
        },
        {
            path: "/horses",
            name: "horses",
            component: Horse,
            meta: {
                auth: true
            }
        }
    ]
});

router.beforeEach((to, from, next) => {
    store.state.authStatus.then(isLoggedIn => {
        if(to.matched.some(record => record.meta.guest)) {
            isLoggedIn ? next({name: "home"}) : next();
        } else if(to.matched.some(record => record.meta.auth)) {
            isLoggedIn ?  next() : next({name: "home"});
        } else {
            next(); 
        }
    });
});

export default router;