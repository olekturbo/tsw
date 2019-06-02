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
                    <div class="col-md-3"><input disabled v-model="singleClass.number"></div>
                    <div class="col-md-3">
                        <b-form-select disabled id="category" v-model="singleClass.category" :options="categoryOptions"></b-form-select>
                    </div>
                    <div class="col-md-4">
                        <b-form-select disabled v-model="singleClass.comission" :options="refereeOptions" multiple :select-size="5"></b-form-select>
                    </div>
                    <div class="col-md-2">
                        <a href="#">
                            <b-badge variant="success">
                                <router-link style="color: white" :to="{ name: 'panelClass', params: { id: singleClass.id }}">podgląd</router-link>
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
        this.$store.dispatch('loadClasses');
        this.$store.dispatch('loadReferees');
        setTimeout(() => {
                this.$store.dispatch('loadRefereeOptions', this.$store.state.referees);
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
    }
}
</script>

