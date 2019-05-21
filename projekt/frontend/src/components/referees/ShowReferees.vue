<template>
    <div class="col-md-12">
        <p>Lista sędziowska</p>
        <b-alert v-if="message" show>{{ message }}</b-alert>
        <b-list-group>
            <b-list-group-item v-for="referee in referees" :key="referee.id">
                <div class="row">
                    <div class="col-md-3"><input v-model="referee.name"></div>
                    <div class="col-md-3"><input v-model="referee.country"></div>
                    <div class="col-md-3">
                        <a href="#" @click="onClickUpdate(referee)">
                            <b-badge variant="success">
                                edytuj
                            </b-badge>
                        </a>
                    </div>
                    <div class="col-md-3">
                        <a href="#"  @click="onClickRemove(referee)">
                            <b-badge variant="danger">
                                &times;
                            </b-badge>
                        </a>
                    </div>
                </div>
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
import { setTimeout } from 'timers';
export default {
    name: "ShowReferees",
    mounted() {
        this.$store.dispatch('loadReferees');
    },
    computed: {
            referees() {
                return this.$store.state.referees;
            }
    },
    data() {
        return {
            message: null
        }
    },
    methods: {
        onClickRemove(referee) {
            this.$http.delete("referee/" + referee.id).then((response) => {
                this.$store.dispatch('loadReferees');
                this.updateMessage("Sędzia " + referee.name + " został pomyślnie usunięty.")
            })
            .catch((errors) => {
                console.log(errors);
            });
        },
        onClickUpdate(referee) {
            const params = new URLSearchParams();
            params.append("name", referee.name);
            params.append("country", referee.country);
            this.$http.put("referee/" + referee.id, params).then((response) => {
                this.$store.dispatch('loadReferees');
                this.updateMessage("Sędzia " + referee.name + " został pomyślnie zaktualizowany.")
            })
            .catch((errors) => {
                console.log(errors);
            });
        },
        updateMessage(message) {
                this.message = message;
                setTimeout(() => {
                    this.message = null;
                }, 3000);
        }
    }
}
</script>

