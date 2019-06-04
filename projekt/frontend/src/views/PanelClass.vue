<template>
    <table>
  <tr>
    <th>Pozycja</th>
    <th>Koń</th>
    <th>Punkty</th>
    <th>Typ</th>
    <th>Ruch</th>
  </tr>
  <tr v-for="(horse, index) in sortedHorses" :key="horse.id">
    <td>{{ index + 1}}</td>
    <td>{{ horse.name }}</td>
    <td>{{ horse.score ? getTotalSumByHorse(horse) : 0 }}</td>
    <td>{{ horse.score ? getSumByHorse(horse).types : 0 }}</td>
    <td>{{ horse.score ? getSumByHorse(horse).moves : 0 }}</td>
  </tr>
</table>
</template>

<script>
import { setTimeout } from 'timers';
export default {
    name: "PanelClass",
    data() {
        return {
            class: null,
            sortedHorses: []
        }
    },
    computed: {
        horses() {
            return this.$store.state.horsesByClass;
        },
    },
    methods: {
        getClassById(id) {
            this.$http
                .get("class/" + id)
                .then(response => {
                    this.class = response.data;
                })
                .catch(errors => {
                    console.log(errors);
            });
        },
        add(arr) {
            return arr.map(Number).reduce(function(a,b){
                return a + b
            }, 0);
        },
        getSumByHorse(horse) {
            return {
                types: this.add(horse.score.marks.types),
                heads: this.add(horse.score.marks.heads),
                blocks: this.add(horse.score.marks.blocks),
                legs: this.add(horse.score.marks.legs),
                moves: this.add(horse.score.marks.moves)
            }
        },
        getTotalSumByHorse(horse) {
            let sum = this.getSumByHorse(horse);
        
            return sum.types + sum.heads + sum.blocks
                + sum.legs + sum.moves
        },
        sortHorses() {
            let horses = this.horses;
            horses.sort((x,y) => {
                let n = this.getTotalSumByHorse(y) - this.getTotalSumByHorse(x);
                if(n !== 0) {
                    return n;
                }
                let m = this.getSumByHorse(y).types - this.getSumByHorse(x).types;
                if(m !== 0) {
                    return m;
                }

                return this.getSumByHorse(y).moves - this.getSumByHorse(x).moves;
            });
            this.sortedHorses = horses;
        },
        refreshData() {
            this.getClassById(this.$route.params.id);
            this.$store.dispatch("loadHorsesByClass", this.$route.params.id);
            setTimeout(() => {
                this.sortHorses();
            },100);
        }
    },
    mounted() {
        this.refreshData();
    },
    sockets: {
        refreshHorses: function(data) {
            this.refreshData();
        }
    }
}
</script>

