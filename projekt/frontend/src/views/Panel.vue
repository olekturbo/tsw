<template>
  <div class="col-md-12">
    <p>Lista klas</p>
    <b-list-group>
      <div class="row">
        <div class="col-md-1">Status</div>
        <div class="col-md-3">Numer</div>
        <div class="col-md-3">Kategoria</div>
        <div class="col-md-4">Komisja</div>
      </div>
      <b-list-group-item v-for="singleClass in classes" :key="singleClass.id">
        <div class="row">
          <div class="col-md-1" v-if="singleClass.closed">
            <b-badge variant="success">OCENIONA</b-badge>
          </div>
          <div class="col-md-1" v-else>
            <b-badge variant="primary">DO OCENY</b-badge>
          </div>
          <div class="col-md-3">{{ singleClass.number }}</div>
          <div class="col-md-3">
            <div v-for="category in categoryOptions" :key="category.id">
              <template v-if="singleClass.category === category.value">{{ category.text }}</template>
            </div>
          </div>
          <div class="col-md-4">
            <ul class="list-unstyled">
              <li v-for="referee in refereeOptions" :key="referee.id">
                <template v-if="singleClass.comission.includes(referee.value)">{{ referee.text }}</template>
              </li>
            </ul>
          </div>
          <div class="col-md-1">
            <a href="#">
              <b-badge variant="success">
                <router-link
                  style="color: white"
                  :to="{ name: 'panelClass', params: { id: singleClass.id }}"
                >podgląd</router-link>
              </b-badge>
            </a>
          </div>
        </div>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>

<script>
export default {
  name: "Panel",
  mounted() {
    this.$store.dispatch("loadClasses");
    this.$store.dispatch("loadReferees");
    this.$store.dispatch("loadHorses");
    setTimeout(() => {
      this.$store.dispatch("loadRefereeOptions", this.$store.state.referees);
    }, 100);
  },
  computed: {
    categoryOptions() {
      return this.$store.state.categoryOptions;
    },
    refereeOptions() {
      return this.$store.state.refereeOptions;
    },
    horses() {
      return this.$store.state.horses;
    },
    classes() {
      const classes = this.$store.state.classes;
      classes.forEach(element => {
          const horses = this.horses.filter(horse => horse.class == element.id);
          let isClosed = true;
          horses.forEach(horse => {
            if (!horse.score) {
              isClosed = false;
            }
          });
          if (isClosed) {
            element.closed = true;
          } else {
            element.closed = false;
          }
      });
      return classes.sort((x,y) => {
        return y.closed - x.closed;
      });
    }
  }
};
</script>

