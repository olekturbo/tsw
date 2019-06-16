<template>
  <div>
    <h2 style="font-weight: bold; margin-top: 30px; margin-bottom: 30px;">DANE KONIA</h2>
    <div class="row">
      <div class="col-md-12">
        <b-alert v-if="message" show>{{ message }}</b-alert>
      </div>
      <div class="col-md-3">
        <div class="form-group">
          <label for="number">Numer konia</label>
          <input
            type="number"
            class="form-control"
            id="number"
            placeholder="Wprowadź numer konia"
            v-model="horse.number"
          >
        </div>
        <div class="form-group">
          <label for="class">Klasa konia</label>
          <b-form-select id="class" v-model="horse.class" :options="classOptions"></b-form-select>
        </div>
        <div class="form-group">
          <label for="name">Nazwa konia</label>
          <input
            type="text"
            class="form-control"
            id="name"
            placeholder="Wprowadź nazwę konia"
            v-model="horse.name"
          >
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-group">
          <label for="country">Kraj konia</label>
          <input
            type="text"
            class="form-control"
            id="country"
            placeholder="Wprowadź kraj konia"
            v-model="horse.country"
          >
        </div>
        <div class="form-group">
          <label for="year">Rok urodzenia konia</label>
          <input
            type="number"
            class="form-control"
            id="year"
            placeholder="Wprowadź rok urodzenia konia"
            v-model="horse.year"
            min="1950"
            max="2019"
          >
        </div>
        <div class="form-group">
          <label for="color">Maść konia</label>
          <input
            type="text"
            class="form-control"
            id="color"
            placeholder="Wprowadź maść konia"
            v-model="horse.color"
          >
        </div>
        <div class="form-group">
          <label for="gender">Płeć konia</label>
          <b-form-select id="gender" v-model="horse.gender" :options="genderOptions"></b-form-select>
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-group">
          <label for="farmersName">Nazwa hodowcy</label>
          <input
            type="text"
            class="form-control"
            id="farmersName"
            placeholder="Wprowadź nazwę hodowcy"
            v-model="horse.farmer.name"
          >
        </div>
        <div class="form-group">
          <label for="farmersCountry">Kraj hodowcy</label>
          <input
            type="text"
            class="form-control"
            id="farmersCountry"
            placeholder="Wprowadź kraj hodowcy"
            v-model="horse.farmer.country"
          >
        </div>
        <div class="form-group">
          <label for="fathersName">Nazwa ojca</label>
          <input
            type="text"
            class="form-control"
            id="fathersName"
            placeholder="Wprowadź nazwę ojca"
            v-model="horse.father.name"
          >
        </div>
        <div class="form-group">
          <label for="fathersCountry">Kraj ojca</label>
          <input
            type="text"
            class="form-control"
            id="fathersCountry"
            placeholder="Wprowadź kraj ojca"
            v-model="horse.father.country"
          >
        </div>
      </div>
      <div class="col-md-3">
        <div class="form-group">
          <label for="mothersName">Nazwa matki</label>
          <input
            type="text"
            class="form-control"
            id="mothersName"
            placeholder="Wprowadź nazwę matki"
            v-model="horse.mother.name"
          >
        </div>
        <div class="form-group">
          <label for="mothersCountry">Kraj matki</label>
          <input
            type="text"
            class="form-control"
            id="mothersCountry"
            placeholder="Wprowadź kraj matki"
            v-model="horse.mother.country"
          >
        </div>
        <div class="form-group">
          <label for="grandpasName">Nazwa ojca matki</label>
          <input
            type="text"
            class="form-control"
            id="grandpasName"
            placeholder="Wprowadź nazwę ojca matki"
            v-model="horse.grandpa.name"
          >
        </div>
        <div class="form-group">
          <label for="grandpasCountry">Kraj ojca matki</label>
          <input
            type="text"
            class="form-control"
            id="grandpasCountry"
            placeholder="Wprowadź kraj ojca matki"
            v-model="horse.grandpa.country"
          >
        </div>
      </div>
    </div>
    <div v-if="errors.length">
      <b-badge variant="danger" :key="error" v-for="error in errors" class="error-badge">{{ error }}</b-badge>
    </div>
    <button type="button" class="btn btn-primary" @click="onClickUpdate">Aktualizuj</button>
    <div>
      <Table :horse="horse"/>
    </div>
  </div>
</template>

<script>
import Table from "@/components/horses/Table.vue";
export default {
  name: "SingleHourse",
  data() {
    return {
      errors: [],
      horse: {
        number: null,
        number: null,
        singleClass: null,
        name: "",
        country: "",
        year: 2019,
        color: "",
        gender: null,
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
      },
      genderOptions: [
        { value: null, text: "Proszę wybrać płeć", disabled: true },
        { value: "male", text: "Ogier" },
        { value: "female", text: "Klacz" }
      ]
    };
  },
  components: {
    Table
  },
  mounted() {
    this.getHorseById(this.$route.params.id);
    this.$store.dispatch("loadClasses");
    setTimeout(() => {
      this.$store.dispatch("loadClassOptions", this.$store.state.classes);
    }, 100);
  },
  computed: {
    classOptions() {
      return this.$store.state.classOptions;
    },
    message() {
      return this.$store.state.message;
    }
  },
  methods: {
    getHorseById(id) {
      this.$http
        .get("horse/" + id)
        .then(response => {
          this.horse = response.data;
        })
        .catch(errors => {
          console.log(errors);
        });
    },
    onClickUpdate() {
      this.errors = [];
      if (this.horse.number && this.horse.class && this.horse.name && this.horse.country) {
        const params = new URLSearchParams();
        params.append("number", this.horse.number);
        params.append("class", this.horse.class);
        params.append("name", this.horse.name);
        params.append("country", this.horse.country);
        params.append("year", this.horse.year);
        params.append("color", this.horse.color);
        params.append("gender", this.horse.gender);
        params.append("farmersName", this.horse.farmer.name);
        params.append("farmersCountry", this.horse.farmer.country);
        params.append("fathersName", this.horse.father.name);
        params.append("fathersCountry", this.horse.father.country);
        params.append("mothersName", this.horse.mother.name);
        params.append("mothersCountry", this.horse.mother.country);
        params.append("grandpasName", this.horse.grandpa.name);
        params.append("grandpasCountry", this.horse.grandpa.country);
        this.$http
          .put("horse/" + this.horse.id, params)
          .then(response => {
            this.$store.dispatch("loadHorses");
            this.$store.dispatch(
              "loadMessage",
              "Koń " + this.horse.name + " został pomyślnie zaktualizowany."
            );
            this.$socket.emit("markHorse");
          })
          .catch(errors => {
            console.log(errors);
          });
      } else {
        if (!this.horse.number) {
          this.errors.push("Numer jest wymagany");
        }
        if (!this.horse.class) {
          this.errors.push("Klasa jest wymagana");
        }
        if (!this.horse.name) {
          this.errors.push("Nazwa jest wymagana");
        }
        if (!this.horse.country) {
          this.errors.push("Kraj jest wymagany");
        }
      }
    }
  }
};
</script>
