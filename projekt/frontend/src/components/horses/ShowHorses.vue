<template>
  <div class="col-md-12">
    <p class="d-inline-block">Lista koni</p>
    <input type="text" class="float-right" placeholder="Wyszukaj konia..." v-model="search">
    <b-list-group>
      <div class="row">
        <div class="col-md-3">Numer</div>
        <div class="col-md-3">Imię</div>
        <div class="col-md-3">Kraj</div>
      </div>
      <b-list-group-item v-for="horse in filteredHorses" :key="horse.id">
        <div class="row">
          <div class="col-md-3">
            {{ horse.number}}
          </div>
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
          <div class="col-md-1">
            <a href="#">
              <b-badge variant="danger" @click="onClickRemove(horse)">&times;</b-badge>
            </a>
          </div>
        </div>
      </b-list-group-item>
    </b-list-group>
    <div class="mt-3">
      <button class="btn btn-primary" :disabled="pageNumber==0" @click="prevPage">&lt;</button>
      <button class="btn btn-primary active">{{ pageNumber + 1 }}</button>
      <button class="btn btn-primary" :disabled="pageNumber >= pageCount -1" @click="nextPage">&gt;</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShowHorses",
  data() {
    return {
      search: "",
      pageNumber: 0,
      size: 10
    };
  },
  mounted() {
    this.$store.dispatch("loadHorses");
    this.$store.dispatch("loadClasses");
  },
  computed: {
    horses() {
      return this.$store.state.horses;
    },
    classes() {
      return this.$store.state.classes;
    },
    filteredHorses() {
      const start = this.pageNumber * this.size,
        end = start + this.size;
      if (this.search === "") {
        const slicedHorses = this.horses.slice(start, end);
        return slicedHorses.filter(horse => {
          return horse.name.toLowerCase().includes(this.search.toLowerCase());
        });
      } else {
        return this.horses.filter(horse => {
          return horse.name.toLowerCase().includes(this.search.toLowerCase());
        });
      }
    },
    pageCount() {
      let l = this.horses.length,
        s = this.size;
      return Math.ceil(l / s);
    }
  },
  methods: {
    onClickRemove(horse) {
      if (confirm("Czy na pewno chcesz usunąć konia?")) {
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
    },
    nextPage() {
      this.pageNumber++;
    },
    prevPage() {
      this.pageNumber--;
    }
  }
};
</script>

