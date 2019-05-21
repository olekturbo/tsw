import Vue from "vue";
import axios from "axios";
import Vuex from "vuex";

Vue.use(Vuex);

const base = axios.create({
    baseURL: "http://localhost:3000/",
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
        username: ""
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
        }
    },
    mutations: {
        setAuthStatus(state, isLoggedIn) {
            state.isLoggedIn = isLoggedIn;
        },
        setUsername(state, username) {
            state.username = username;
        }
    }
});

export default store;
