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
        classes: [],
        horses: [],
        message: null,
        categoryOptions: [
            { value: "null", text: "Proszę wybrać kategorię", disabled: true},
            { value: "klacze_roczne", text: "Klacze roczne"},
            { value: "ogiery_roczne", text: "Ogiery roczne"},
            { value: "klacze_dwuletnie", text: "Klacze dwuletnie"},
            { value: "ogiery_dwuletnie", text: "Ogiery dwuletnie"},
            { value: "klacze_trzyletnie", text: "Klacze trzyletnie"},
            { value: "ogiery_trzyletnie", text: "Ogiery trzyletnie"},
        ],
        refereeOptions: [],
        classOptions: []
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
        loadClasses({
            commit
        }) {
            base.get("class").then((response) => {
                commit("setClasses", response.data);
            })
                .catch((errors) => {
                    console.log(errors);
                });
        },
        loadHorses({
            commit
        }) {
            base.get("horse").then((response) => {
                commit("setHorses", response.data);
            })
                .catch((errors) => {
                    console.log(errors);
                });
        },
        loadMessage({
            commit
        }, message) {
            commit("setMessage", message);
        },
        loadRefereeOptions({
            commit
        }, referees) {
            commit("setRefereeOptions", referees);
        },
        loadClassOptions({
            commit
        }, classes) {
            commit("setClassOptions", classes);
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
        setClasses(state, classes) {
            state.classes = classes;
        },
        setHorses(state, horses) {
            state.horses = horses;
        },
        setMessage(state, message) {
            state.message = message;
            setTimeout(() => {
                state.message = null;
            }, 3000);
        },
        setRefereeOptions(state, referees) {
            let options = [];
            referees.forEach(referee => {
                options.push({
                    value: referee.id,
                    text: referee.name + " (" + referee.country + ")" 
                });
            });

            state.refereeOptions = options;
        },
        setClassOptions(state, classes) {
            let options = [];
            options.push({
                value: null,
                text: "Proszę wybrać klasę"
            });
            classes.forEach(singleClass => {
                let category = singleClass.category.replace("_", " ");
                category = category[0].toUpperCase() + category.slice(1);
                options.push({
                    value: singleClass.id,
                    text: singleClass.number + " (" + category + ")" 
                });
            });

            state.classOptions = options;
        }
    }
});

export default store;
