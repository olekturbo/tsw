<template>
    <div class="row" style="margin-top: 30px;">
        <div class="col-md-9">
            <ShowReferees/>
        </div>
        <div class="col-md-3">
            <AddReferee/>
        </div>
    </div>
</template>

<script>
import AddReferee from '@/components/referees/AddReferee.vue'
import ShowReferees from '@/components/referees/ShowReferees.vue'

export default {
    name: "Referee",
    components: {
        AddReferee,
        ShowReferees
    }
}
</script>


