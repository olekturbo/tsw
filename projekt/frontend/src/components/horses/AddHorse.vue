<template>
    <form>
        <div class="col-md-12 col-centered">
            <p><b>Koń</b></p>
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
            <p><b>Hodowca</b></p>
            <div class="form-group">
                <label for="farmersName">Nazwa</label>
                <input
                    type="text"
                    class="form-control"
                    id="farmersName"
                    placeholder="Wprowadź nazwę hodowcy"
                    v-model="farmer.name"
                >
            </div>
            <div class="form-group">
                <label for="farmersCountry">Kraj</label>
                <input
                    type="text"
                    class="form-control"
                    id="farmersCountry"
                    placeholder="Wprowadź kraj hodowcy"
                    v-model="farmer.country"
                >
            </div>
            <p><b>Rodowód</b></p>
            <div class="form-group">
                <label for="fathersName">Nazwa</label>
                <input
                    type="text"
                    class="form-control"
                    id="fathersName"
                    placeholder="Wprowadź nazwę ojca"
                    v-model="father.name"
                >
            </div>
            <div class="form-group">
                <label for="fathersCountry">Kraj</label>
                <input
                    type="text"
                    class="form-control"
                    id="fathersCountry"
                    placeholder="Wprowadź kraj ojca"
                    v-model="father.country"
                >
            </div>
             <div class="form-group">
                <label for="mothersName">Nazwa</label>
                <input
                    type="text"
                    class="form-control"
                    id="mothersName"
                    placeholder="Wprowadź nazwę matki"
                    v-model="mother.name"
                >
            </div>
            <div class="form-group">
                <label for="mothersCountry">Kraj</label>
                <input
                    type="text"
                    class="form-control"
                    id="mothersCountry"
                    placeholder="Wprowadź kraj matki"
                    v-model="mother.country"
                >
            </div>
            <div class="form-group">
                <label for="grandpasName">Nazwa</label>
                <input
                    type="text"
                    class="form-control"
                    id="grandpasName"
                    placeholder="Wprowadź nazwę ojca matki"
                    v-model="grandpa.name"
                >
            </div>
            <div class="form-group">
                <label for="grandpasCountry">Kraj</label>
                <input
                    type="text"
                    class="form-control"
                    id="grandpasCountry"
                    placeholder="Wprowadź kraj ojca matki"
                    v-model="grandpa.country"
                >
            </div>
            <button type="button" class="btn btn-primary" @click="onClickAdd">Dodaj</button>
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
                ], 
                farmer: {
                    name: "",
                    country: ""
                },
                father: {
                    name: "",
                    country: ""
                },
                mother: {
                    name: "",
                    country: ""
                },
                grandpa: {
                    name: "",
                    country: ""
                }
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
          onClickAdd() {
                this.errors = [];
                    const params = new URLSearchParams();
                    params.append("number", this.number);
                    params.append("class", this.singleClass);
                    params.append("name", this.name);
                    params.append("country", this.country);
                    params.append("year", this.year);
                    params.append("color", this.color);
                    params.append("gender", this.gender);
                    params.append("farmersName", this.farmer.name);
                    params.append("farmersCountry", this.farmer.country);
                    params.append("fathersName", this.father.name);
                    params.append("fathersCountry", this.father.country);
                    params.append("mothersName", this.mother.name);
                    params.append("mothersCountry", this.mother.country);
                    params.append("grandpasName", this.grandpa.name);
                    params.append("grandpasCountry", this.grandpa.country);
                    this.$http.post("horse", params).then((response) => {
                        this.number = null;
                        this.$store.dispatch('loadMessage', "Koń został pomyślnie dodany.");
                    })
                    .catch((e) => {
                        alert("Coś poszło nie tak. Spróbuj ponownie później: " + e.message);
                    });
            }
        },
    };
</script>

<style>
.error-badge {
    margin-top: 10px !important;
    display: block !important;
}
</style>