<template>
    <div class="row" style="margin-top: 30px;">
        <div class="col-md-12">
            <b-alert v-if="message" show>{{ message }}</b-alert>
        </div>
        <div class="col-md-9">
            <ShowClasses/>
        </div>
        <div class="col-md-3">
            <AddClass/>
        </div>
    </div>
</template>

<script>
import AddClass from '@/components/classes/AddClass.vue';
import ShowClasses from '@/components/classes/ShowClasses.vue';

export default {
    name: "Class",
    components: {
        AddClass,
        ShowClasses
    },
    computed: {
        message() {
            return this.$store.state.message;
        }
    }
}
</script>


