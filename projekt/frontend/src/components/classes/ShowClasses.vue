<template>
  <div class="col-md-12">
    <p>Lista klas</p>
    <b-list-group>
      <div class="row">
        <div class="col-md-3">Numer</div>
        <div class="col-md-3">Kategoria</div>
        <div class="col-md-4">Komisja</div>
      </div>
      <b-list-group-item v-for="singleClass in classes" :key="singleClass.id">
        <div class="row">
          <div class="col-md-3">
            <input v-model="singleClass.number">
          </div>
          <div class="col-md-3">
            <b-form-select id="category" v-model="singleClass.category" :options="categoryOptions"></b-form-select>
          </div>
          <div class="col-md-3">
            <b-form-select
              v-model="singleClass.comission"
              :options="refereeOptions"
              multiple
              :select-size="5"
            ></b-form-select>
          </div>
          <div class="col-md-1">
            <a href="#">
              <b-badge variant="primary">
                <router-link
                  style="color: white"
                  :to="{ name: 'showHorsesByClass', params: { id: singleClass.id }}"
                >podgląd</router-link>
              </b-badge>
            </a>
          </div>
          <div class="col-md-1">
            <a href="#">
              <b-badge variant="success" @click="onClickUpdate(singleClass)">edytuj</b-badge>
            </a>
          </div>
          <div class="col-md-1">
            <a href="#">
              <b-badge variant="danger" @click="onClickRemove(singleClass)">&times;</b-badge>
            </a>
          </div>
        </div>
      </b-list-group-item>
    </b-list-group>
    <div v-if="errors.length">
      <b-badge variant="danger" :key="error" v-for="error in errors" class="error-badge">{{ error }}</b-badge>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShowClasses",
  data() {
    return {
      errors: []
    };
  },
  mounted() {
    this.$store.dispatch("loadClasses");
    setTimeout(() => {
      this.$store.dispatch("loadRefereeOptions", this.$store.state.referees);
    }, 100);
  },
  computed: {
    classes() {
      return this.$store.state.classes;
    },
    categoryOptions() {
      return this.$store.state.categoryOptions;
    },
    refereeOptions() {
      return this.$store.state.refereeOptions;
    }
  },
  methods: {
    onClickRemove(singleClass) {
      if (confirm("Czy na pewno chcesz usunąć klasę?")) {
        this.$http
          .delete("class/" + singleClass.id)
          .then(response => {
            this.$store.dispatch("loadClasses");
            this.$store.dispatch(
              "loadMessage",
              "Klasa nr " + singleClass.number + " została pomyślnie usunięta."
            );
          })
          .catch(errors => {
            console.log(errors);
          });
      }
    },
    onClickUpdate(singleClass) {
      this.errors = [];
      if (
        singleClass.number &&
        singleClass.category &&
        singleClass.comission.length
      ) {
        const params = new URLSearchParams();
        params.append("id", singleClass.id);
        params.append("number", singleClass.number);
        params.append("category", singleClass.category);
        params.append("comission", JSON.stringify(singleClass.comission));
        this.$http
          .put("class/" + singleClass.id, params)
          .then(response => {
            this.$store.dispatch("loadClasses");
            this.$store.dispatch(
              "loadMessage",
              "Klasa nr " +
                singleClass.number +
                " została pomyślnie zaktualizowana."
            );
          })
          .catch(errors => {
            console.log(errors);
          });
      } else {
        if (!singleClass.number) {
          this.errors.push("Numer jest wymagany.");
        }
        if (!singleClass.category) {
          this.errors.push("Kategoria jest wymagana.");
        }
        if (!singleClass.comission.length) {
          this.errors.push("Komisja jest wymagana.");
        }
      }
    }
  }
};
</script>

