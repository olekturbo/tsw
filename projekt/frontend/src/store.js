import Vue from "vue";
import axios from "axios";
import Vuex from "vuex";

Vue.use(Vuex);

const base = axios.create({
    baseURL: "http://localhost:3001/",
    withCredentials: true
});

Vue.config.productionTip = false;

const store = new Vuex.Store({
    state: {
        isLoggedIn: false,
        username: "",
        referees: [],
        classes: [],
        horses: [],
        horsesByClass: [],
        message: null,
        categoryOptions: [
            { value: "null", text: "Proszę wybrać kategorię", disabled: true},
            { value: "klacze_roczne", text: "Klacze roczne"},
            { value: "ogiery_roczne", text: "Ogiery roczne"},
            { value: "klacze_dwuletnie", text: "Klacze dwuletnie"},
            { value: "ogiery_dwuletnie", text: "Ogiery dwuletnie"},
            { value: "klacze_trzyletnie", text: "Klacze trzyletnie"},
            { value: "ogiery_trzyletnie", text: "Ogiery trzyletnie"},
            { value: "klacze_starsze", text: "Klacze starsze"},
            { value: "klacze_młodsze", text: "Klacze młodsze"},
            { value: "ogiery_młodsze", text: "Ogiery młodsze"},
            { value: "ogiery_starsze", text: "Ogiery starsze"},
        ],
        refereeOptions: [],
        classOptions: []
    },
    actions: {
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
                let classes = response.data;
                classes.forEach(element => {
                    base
                        .get("horse/marked/" + element.id)
                        .then(response => {
                            const horses = response.data;
                            let isClosed = true;
                            horses.forEach(horse => {
                                if (!horse.score) {
                                    isClosed = false;
                                }
                            });
                            if (isClosed) {
                                element.closed = true;
                            } else {
                                element.closed = false;
                            }
                        });
                });
                commit("setClasses", classes);
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
        loadHorsesByClass({
            commit
        }, id) {
            base
                .get("horse/marked/" + id)
                .then(response => {
                    commit("setHorsesByClass", response.data);
                })
                .catch(errors => {
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
        SOCKET_IS_AUTHORIZED(state, user) {
            state.isLoggedIn = user.logged_in;
            state.username = user.username;
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
        setHorsesByClass(state, horses) {
            state.horsesByClass = horses;
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
