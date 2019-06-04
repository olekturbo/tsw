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
              <b-badge variant="success">edytuj</b-badge>
            </router-link>
          </div>
        </div>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
export default {
  name: "ShowHorsesByClass",
  data() {
    return {
      id: null,
    }
  },
  mounted() {
    this.id = this.$route.params.id;
    this.$store.dispatch("loadHorsesByClass", this.id);
  },
  computed: {
    horses() {
      return this.$store.state.horsesByClass;
    },
  },
};
</script>

