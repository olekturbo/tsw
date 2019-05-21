import Vue from "vue";
import axios from "axios";
import Vuex from "vuex";

Vue.use(Vuex);

const base = axios.create({
    baseURL: "http://localhost:3001/",
    withCredentials: true
});
Vue.prototype.$http = base;

Vue.config.productionTip = false;

const store = new Vuex.Store({
    state: {
        authStatus: new Promise(resolve => {
            setTimeout(() => {
                base.get("user")
                    .then((response) => {
                        let requestResult = response.data.user ? true : false;
                        store.commit("setAuthStatus", requestResult);
                        resolve(requestResult);
                    })
                    .catch((errors) => {
                        console.log(errors);
                    });
            }, 1000);
        }),
        isLoggedIn: false,
        username: "",
        referees: [],
        message: null
    },
    actions: {
        loadUsername({
            commit
        }) {
            base.get("user")
                .then((response) => {
                    let requestName = response.data.user ? response.data.user.username : "Gość";
                    commit("setUsername", requestName);
                })
                .catch((errors) => {
                    console.log(errors);
                });
        },
        loadReferees({
            commit
        }) {
            base.get("referee").then((response) => {
                commit("setReferees", response.data);
            })
                .catch((errors) => {
                    console.log(errors);
                });
        },
        loadMessage({
            commit
        }, message) {
            commit("setMessage", message);
        }
    },
    mutations: {
        setAuthStatus(state, isLoggedIn) {
            state.isLoggedIn = isLoggedIn;
        },
        setUsername(state, username) {
            state.username = username;
        },
        setReferees(state, referees) {
            state.referees = referees;
        },
        setMessage(state, message) {
            state.message = message;
            setTimeout(() => {
                state.message = null;
            }, 3000);
        }
    }
});

export default store;
