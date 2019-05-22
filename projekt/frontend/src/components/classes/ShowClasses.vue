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
                    <div class="col-md-3"><input v-model="singleClass.number"></div>
                    <div class="col-md-3">
                        <b-form-select id="category" v-model="singleClass.category" :options="categoryOptions"></b-form-select>
                    </div>
                    <div class="col-md-4">
                            <b-form-select v-model="singleClass.comission" :options="refereeOptions" multiple :select-size="5"></b-form-select>
                    </div>
                    <div class="col-md-1">
                        <a href="#">
                            <b-badge variant="success" @click="onClickUpdate(singleClass)">
                                edytuj
                            </b-badge>
                        </a>
                    </div>
                    <div class="col-md-1">
                        <a href="#">
                            <b-badge variant="danger" @click="onClickRemove(singleClass)">
                                &times;
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
    name: "ShowClasses",
    mounted() {
        this.$store.dispatch('loadClasses');
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
    },
    methods: {
        onClickRemove(singleClass) {
            this.$http.delete("class/" + singleClass.id).then((response) => {
                this.$store.dispatch('loadClasses');
                this.$store.dispatch('loadMessage', "Klasa nr " + singleClass.number + " została pomyślnie usunięta.");
            })
            .catch((errors) => {
                console.log(errors);
            });
        },
        onClickUpdate(singleClass) {
            const params = new URLSearchParams();
            params.append("number", singleClass.number);
            params.append("category", singleClass.category);
            params.append("comission", JSON.stringify(singleClass.comission));
            this.$http.put("class/" + singleClass.id, params).then((response) => {
                this.$store.dispatch('loadClasses');
                this.$store.dispatch('loadMessage', "Klasa nr " + singleClass.number + " została pomyślnie zaktualizowana.");
            })
            .catch((errors) => {
                console.log(errors);
            });
        }
    }
}
</script>

