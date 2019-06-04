<template>
    <div>
        <h2 style="margin-top: 60px; font-weight: bold;">OCENA KONIA</h2>
        <table>
        <tr>
            <th>typ</th>
            <th>głowa</th>
            <th>kłoda</th>
            <th>nogi</th>
            <th>ruch</th>
            <th>sędzia</th>
        </tr>
        <tr v-for="(referee, index) in referees" :key="referee.id">
            <td><CustomInput v-model.number="marks.types[index]" :index="1"/></td>
            <td><CustomInput v-model.number="marks.heads[index]" :index="2"/></td>
            <td><CustomInput v-model.number="marks.blocks[index]" :index="3"/></td>
            <td><CustomInput v-model.number="marks.legs[index]" :index="4"/></td>
            <td><CustomInput v-model.number="marks.moves[index]" :index="5"/></td>
            <td>{{ referee.name }} ({{ getCountryCode(referee.country) }})</td>
        </tr>
        <tr>
            <th colspan="6">SUMA PUNKTÓW</th>
        </tr>
        <tr>
            <td style="background: #bb2124; color: white">{{ sum.types }} pkt</td>
            <td>{{ sum.heads }} pkt</td>
            <td>{{ sum.blocks }} pkt</td>
            <td>{{ sum.legs }} pkt</td>
            <td style="background: #bb2124; color: white">{{ sum.moves }} pkt</td>
            <td style="background: #22bb33; color: white">{{ totalSum.value }} pkt</td>
        </tr>
    </table>
    <div class="row" style="margin: 20px 0;">
        <div class="col-md-12">
            <button @click="onClickSend" class="btn btn-success">Wyślij</button>
        </div>
    </div>
    </div>
</template>

<script>
import { setTimeout } from 'timers';
import CustomInput from "@/components/CustomInput.vue";
export default {
    name: "SingleHourse",
    components: {
        CustomInput
    },
    props: ['horse'],
    data() {
        return {
            singleClass: null,
            referees: [],
            marks: {
                types: [],
                heads: [],
                blocks: [],
                legs: [],
                moves: []
            },
        }
    },
    computed: {
        sum() {
            return {
                types: this.add(this.marks.types),
                heads: this.add(this.marks.heads),
                blocks: this.add(this.marks.blocks),
                legs: this.add(this.marks.legs),
                moves: this.add(this.marks.moves)
            }
        },
        totalSum() {
            return {
                value: this.sum.types + this.sum.heads + this.sum.blocks
                    + this.sum.legs + this.sum.moves
            }
        }
    },
    mounted() {
        setTimeout(() => {
            if(this.horse.score) {
                this.marks = this.horse.score.marks;
            }
            this.getClassById(this.horse.class);
            setTimeout(() => {
                this.getReferees();
            }, 100);
        }, 100);
    },
    methods: {
        getClassById(id) {
            this.$http.get("class/" + id).then((response) => {
                this.singleClass = response.data;
            })
            .catch((errors) => {
                console.log(errors);
            });
        },
        getReferees() {
            this.singleClass.comission.forEach(id => {
                this.$http.get("referee/" + id).then((response) => {
                    this.referees.push(response.data);
                })
                .catch((errors) => {
                    console.log(errors);
                });
            });
        },
        add(arr) {
            return arr.map(Number).reduce(function(a,b){
                return a + b
            }, 0);
        },
        getCountryCode(country) {
            return country.substring(0,3).toUpperCase();
        },
        onClickSend() {
            const params = new URLSearchParams();
            params.append("marks", JSON.stringify(this.marks));
            this.$http.put("horse/mark/" + this.horse.id, params).then((response) => {
                this.$socket.emit('markHorse');
                this.$store.dispatch('loadMessage', "Koń został pomyślnie oceniony");
            })
            .catch((e) => {
                alert("Coś poszło nie tak. Spróbuj ponownie później: " + e.message);
            });
        },
    }
}
</script>

<style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 80%;
  margin: 50px auto 0 auto;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
  text-align: center;
}

td {
  background-color: #dddddd;
}

td input {
    text-align: center;
}
</style>