<template>
    <form>
        <div class="col-md-12 col-centered">
            <div class="form-group">
                <label for="number">Numer</label>
                <input
                    type="number"
                    class="form-control"
                    id="number"
                    placeholder="Wprowadź numer konia"
                    v-model="number"
                >
            </div>
            <div class="form-group">
                <label for="class">Klasa</label>
                <b-form-select id="class" v-model="singleClass" :options="classOptions"></b-form-select>
            </div>
            <div class="form-group">
                <label for="name">Nazwa</label>
                <input
                    type="text"
                    class="form-control"
                    id="name"
                    placeholder="Wprowadź nazwę konia"
                    v-model="name"
                >
            </div>
            <div class="form-group">
                <label for="country">Kraj</label>
                <input
                    type="text"
                    class="form-control"
                    id="country"
                    placeholder="Wprowadź kraj konia"
                    v-model="country"
                >
            </div>
            <div class="form-group">
                <label for="year">Rok urodzenia</label>
                <input
                    type="number"
                    class="form-control"
                    id="year"
                    placeholder="Wprowadź rok urodzenia konia"
                    v-model="year"
                    min="1950"
                    max="2019"
                >
            </div>
            <div class="form-group">
                <label for="color">Maść</label>
                <input
                    type="text"
                    class="form-control"
                    id="color"
                    placeholder="Wprowadź maść konia"
                    v-model="color"
                >
            </div>
            <div class="form-group">
                <label for="gender">Płeć</label>
                <b-form-select id="gender" v-model="gender" :options="genderOptions"></b-form-select>
            </div>
            <button type="button" class="btn btn-primary">Dodaj</button>
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
        name: "AddHorse",
        data() {
            return {
                errors: [],
                number: null,
                singleClass: null,
                name: "",
                country: "",
                year: 2019,
                color: "",
                gender: null,
                genderOptions: [
                    { value: null, text: "Proszę wybrać płeć", disabled: true },
                    { value: "male", text: "Ogier" },
                    { value: "female", text: "Klacz" }
                ]
            };
        },
        mounted() {
            this.$store.dispatch('loadClasses');
            setTimeout(() => {
                this.$store.dispatch('loadClassOptions', this.$store.state.classes);
            }, 100);
        },
        computed: {
            classOptions() {
                return this.$store.state.classOptions;
            }
        },
        methods: {
          
        },
    };
</script>

<style>
.error-badge {
    margin-top: 10px !important;
    display: block !important;
}
</style>