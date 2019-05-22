<template>
    <form>
        <div class="col-md-12">
            <div class="form-group">
                <label for="number">Numer</label>
                <input
                    type="number"
                    class="form-control"
                    id="number"
                    placeholder="Wprowadź numer klasy"
                    v-model="number"
                >
            </div>
            <div class="form-group">
                <label for="category">Kategoria</label>
                <b-form-select id="category" v-model="category" :options="categoryOptions"></b-form-select>
            </div>
            <div class="form-group">
                <label for="comission">Komisja</label>
                <b-form-select v-model="comission" :options="refereeOptions" multiple :select-size="5"></b-form-select>
            </div>
            <button @click="onClickAdd" type="button" class="btn btn-primary">Dodaj</button>
            <div v-if="errors.length">
                <b-badge variant="danger" :key="error" v-for="error in errors" class="error-badge"> 
                    {{ error }}
                </b-badge>
            </div>
        </div>
    </form>
</template>

<script>
import { setTimeout } from 'timers';
    export default {
        name: "AddClass",
        data() {
            return {
                number: null,
                category: null,
                comission: [],
                errors: [],
            };
        },
        computed: {
            categoryOptions() {
                return this.$store.state.categoryOptions;
            },
            refereeOptions() {
                return this.$store.state.refereeOptions;
            }
        },
        mounted() {
            this.$store.dispatch('loadReferees');
            setTimeout(() => {
                this.$store.dispatch('loadRefereeOptions', this.$store.state.referees);
            }, 100);
        },
        methods: {
            onClickAdd() {
                this.errors = [];
                if(this.number && this.category && this.comission.length) {
                    const params = new URLSearchParams();
                    params.append("number", this.number);
                    params.append("category", this.category);
                    params.append("comission", JSON.stringify(this.comission));
                    this.$http.post("class", params).then((response) => {
                        this.number = null;
                        this.$store.dispatch('loadMessage', "Klasa została pomyślnie dodana.");
                        this.$store.dispatch('loadClasses');
                    })
                    .catch((e) => {
                        alert("Coś poszło nie tak. Spróbuj ponownie później: " + e.message);
                    });
                } else {
                    if(!this.number) {
                        this.errors.push("Numer jest wymagany.");
                    }
                    if(!this.category) {
                        this.errors.push("Kategoria jest wymagana.");
                    }
                    if(!this.comission.length) {
                        this.errors.push("Komisja jest wymagana.");
                    }
                }
            }
        }
    };
</script>

<style>
.error-badge {
    margin-top: 10px !important;
    display: block !important;
}
</style>