<template>
    <div class="row" style="margin-top: 30px;">
        <div class="col-md-12">
            <b-alert v-if="message" show>{{ message }}</b-alert>
        </div>
        <div class="col-md-9">
            <ShowHorses/>
        </div>
        <div class="col-md-3">
            <AddHorse/>
        </div>
    </div>
</template>

<script>
import AddHorse from "@/components/horses/AddHorse.vue"
import ShowHorses from "@/components/horses/ShowHorses.vue"

export default {
    name: "Horse",
    components: {
        AddHorse,
        ShowHorses
    },
    computed: {
        message() {
            return this.$store.state.message;
        }
    }
}
</script>


