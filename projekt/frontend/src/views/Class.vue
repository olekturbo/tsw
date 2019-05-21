<template>
    <div class="row" style="margin-top: 30px;">
        <div class="col-md-12">
            <b-alert v-if="message" show>{{ message }}</b-alert>
        </div>
        <div class="col-md-9">
        
        </div>
        <div class="col-md-3">
            <AddClass/>
        </div>
    </div>
</template>

<script>
import AddClass from '@/components/classes/AddClass.vue'

export default {
    name: "Class",
    components: {
        AddClass
    },
    computed: {
        message() {
            return this.$store.state.message;
        }
    }
}
</script>


