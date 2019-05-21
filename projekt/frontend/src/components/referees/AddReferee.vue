<template>
    <form>
        <div class="col-md-12 col-centered">
            <div class="form-group">
                <label for="name">Nazwa</label>
                <input
                    type="text"
                    class="form-control text-center"
                    id="name"
                    placeholder="Wprowadź nazwę sędziego"
                    v-model="name"
                >
            </div>
            <div class="form-group">
                <label for="country">Kraj</label>
                <input
                    type="text"
                    class="form-control text-center"
                    id="country"
                    placeholder="Wprowadź kraj sędziego"
                    v-model="country"
                >
            </div>
            <button @click="onClickAdd" type="button" class="btn btn-primary">Dodaj</button>
            <div v-if="errors.length">
                <b-badge variant="danger" :key="error" v-for="error in errors" class="error-badge"> 
                    {{ error }}
                </b-badge>
            </div>
        </div>
    </form>
</template>

<script>
    export default {
        name: "AddReferee",
        data() {
            return {
                name: "",
                country: "",
                errors: []
            };
        },
        methods: {
            onClickAdd() {
                this.errors = [];
                if(this.name && this.country) {
                    const params = new URLSearchParams();
                    params.append("name", this.name);
                    params.append("country", this.country);
                    this.$http.post("referee", params).then((response) => {
                        this.$store.dispatch('loadReferees');
                        this.$store.dispatch('loadMessage', "Sędzia został pomyślnie dodany.");
                        this.name = "";
                        this.country = "";
                    })
                    .catch((e) => {
                        alert("Coś poszło nie tak. Spróbuj ponownie później: " + e.message);
                    });
                } else {
                    if(!this.name) {
                        this.errors.push("Nazwa jest wymagana.");
                    }
                    if(!this.country) {
                        this.errors.push("Kraj jest wymagany.");
                    }

                }
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