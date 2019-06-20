<template>
  <div class="col-md-12">
    <p>Lista sędziowska</p>
    <b-list-group>
      <div class="row">
        <div class="col-md-3">Imię</div>
        <div class="col-md-3">Kraj</div>
      </div>
      <b-list-group-item v-for="referee in referees" :key="referee.id">
        <div class="row">
          <div class="col-md-3">
            <input v-model="referee.name">
          </div>
          <div class="col-md-3">
            <input v-model="referee.country">
          </div>
          <div class="col-md-3">
            <a href="#" @click="onClickUpdate(referee)">
              <b-badge variant="success">edytuj</b-badge>
            </a>
          </div>
          <div class="col-md-3">
            <a href="#" @click="onClickRemove(referee)">
              <b-badge variant="danger">&times;</b-badge>
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
  name: "ShowReferees",
  data() {
    return {
      errors: []
    };
  },
  mounted() {
    this.$store.dispatch("loadReferees");
  },
  computed: {
    referees() {
      return this.$store.state.referees;
    }
  },
  methods: {
    onClickRemove(referee) {
      if (confirm("Czy na pewno chcesz usunąć sędziego?")) {
        this.$http
          .delete("referee/" + referee.id)
          .then(response => {
            this.$store.dispatch("loadReferees");
            this.$store.dispatch(
              "loadMessage",
              "Sędzia " + referee.name + " został pomyślnie usunięty."
            );
          })
          .catch(errors => {
            console.log(errors);
          });
      }
    },
    onClickUpdate(referee) {
      this.errors = [];
      if (referee.name && referee.country) {
        const params = new URLSearchParams();
        params.append("name", referee.name);
        params.append("country", referee.country);
        this.$http
          .put("referee/" + referee.id, params)
          .then(response => {
            this.$store.dispatch("loadReferees");
            this.$store.dispatch(
              "loadMessage",
              "Sędzia " + referee.name + " został pomyślnie zaktualizowany."
            );
          })
          .catch(errors => {
            console.log(errors);
          });
      } else {
        if (!referee.name) {
          this.errors.push("Nazwa jest wymagana.");
        }
        if (!referee.country) {
          this.errors.push("Kraj jest wymagany.");
        }
      }
    }
  }
};
</script>

