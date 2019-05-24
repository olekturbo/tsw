<template>
  <div class="col-md-12">
    <p>Lista koni</p>
    <b-list-group>
      <div class="row">
        <div class="col-md-3">Imię</div>
        <div class="col-md-3">Kraj</div>
      </div>
      <b-list-group-item v-for="horse in horses" :key="horse.id">
        <div class="row">
          <div class="col-md-3">
            <router-link :to="{ name: 'horse', params: { id: horse.id }}">{{ horse.name }}</router-link>
          </div>
          <div class="col-md-3">
            <p>{{ horse.country }}</p>
          </div>
          <div class="col-md-1">
            <router-link :to="{ name: 'horse', params: { id: horse.id }}">
              <b-badge variant="success" @click="onClickUpdate(singleClass)">edytuj</b-badge>
            </router-link>
          </div>
          <div class="col-md-1">
            <a href="#">
              <b-badge variant="danger" @click="onClickRemove(horse)">&times;</b-badge>
            </a>
          </div>
        </div>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
export default {
  name: "ShowHorses",
  mounted() {
    this.$store.dispatch("loadHorses");
  },
  computed: {
    horses() {
      return this.$store.state.horses;
    }
  },
  methods: {
    onClickRemove(horse) {
      this.$http
        .delete("horse/" + horse.id)
        .then(response => {
          this.$store.dispatch("loadHorses");
          this.$store.dispatch(
            "loadMessage",
            "Koń " + horse.name + " został pomyślnie usunięty."
          );
        })
        .catch(errors => {
          console.log(errors);
        });
    }
  }
};
</script>

