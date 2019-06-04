<template>
    <table>
  <tr>
    <th>Pozycja</th>
    <th>Koń</th>
    <th>Punkty</th>
    <th>Typ</th>
    <th>Ruch</th>
    <th>Rozjemca</th>
  </tr>
  <tr v-for="(horse, index) in sortedHorses" :key="horse.id">
    <td>{{ index + 1}}</td>
    <td>{{ horse.name }}</td>
    <td>{{ horse.score ? getTotalSumByHorse(horse) : 0 }}</td>
    <td>{{ horse.score ? getSumByHorse(horse).types : 0 }}</td>
    <td>{{ horse.score ? getSumByHorse(horse).moves : 0 }}</td>
    <td v-if="horse.needToFix">
        <input :id="'input_' + horse.id" type="number" step="1">
        <button :id="'btn_' + horse.id" @click="fixDraw(horse)" style="margin-left: 30px;" class="btn btn-sm btn-success">OK</button>
    </td>
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
                if(x.score && y.score) {
                    let n = this.getTotalSumByHorse(y) - this.getTotalSumByHorse(x);
                    if(n !== 0) {
                        return n;
                    }
                    let m = this.getSumByHorse(y).types - this.getSumByHorse(x).types;
                    if(m !== 0) {
                        return m;
                    }

                    let r = this.getSumByHorse(y).moves - this.getSumByHorse(x).moves;
                    if(r !== 0) {
                        return r;
                    }

                    if(x.draw && y.draw) {
                        return x.draw.fix - y.draw.fix;
                    }
                }
            });
            this.sortedHorses = horses;
        },
        refreshData() {
            this.getClassById(this.$route.params.id);
            this.$store.dispatch("loadHorsesByClass", this.$route.params.id);
            setTimeout(() => {
                this.sortHorses();
                this.checkIfDraw();
            },100);
        },
        checkIfDraw() {
            for(let i = 0; i < this.sortedHorses.length; i++) {
                for(let j = 0; j < this.sortedHorses.length - i - 1; j++) {
                   if(this.sortedHorses[j].score && this.sortedHorses[j+1].score) {
                        if(this.getTotalSumByHorse(this.sortedHorses[j]) === this.getTotalSumByHorse(this.sortedHorses[j+1])) {
                            if(this.getSumByHorse(this.sortedHorses[j]).types === this.getSumByHorse(this.sortedHorses[j+1]).types) {
                                if(this.getSumByHorse(this.sortedHorses[j]).moves === this.getSumByHorse(this.sortedHorses[j+1]).moves) {
                                    if(!this.sortedHorses[j].draw) {
                                        this.sortedHorses[j].needToFix = true;
                                    }
                                    if(!this.sortedHorses[j+1].draw) {
                                        this.sortedHorses[j+1].needToFix = true;
                                    }
                                }
                            }
                        }
                   }
                }
            }
        },
        fixDraw(horse) {
            let input = document.getElementById("input_" + horse.id);
            let val = input.value;

            const params = new URLSearchParams();
            params.append("draw", val);

            this.$http
                .put("horse/draw/" + horse.id, params)
                .then(response => {
                    this.refreshData();
                })
                .catch(errors => {
                    console.log(errors);
            });
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

