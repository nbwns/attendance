<template>
  <div class="row">
    <div class="col text-left">
      <h1>Justifier une absence</h1>
      <form @submit="submit">
        <div class="form-group">
          <label for="training-list">Formation</label>
          <select id="training-list" class="form-control" v-model="notification.training" >
            <option v-for="t in trainings" :value="t.id" v-bind:key="t.name">{{t.name}}</option>
          </select>
        </div>
        <div class="form-group">
          <label for="student-id">Identifiant stagiaire</label>
          <input type="text" class="form-control" id="student-id" v-model="notification.student" placeholder="STG0000">
        </div>
        <div class="form-group">
          <label for="date">Date</label>
          <input type="date" class="form-control" id="date" v-model="notification.date" >
        </div>
        <div class="form-group">
          <label for="non-attendance-type">Type d'absence</label>
          <select id="non-attendance-type" class="form-control" v-model="notification.type"  >
            <option v-for="t in types" :value="t.id" :key="t.id" >{{t.name}}</option>
          </select>
        </div>
        <div class="form-group" v-if="notification.type !== 'allDay'">
          <label for="time">Heure</label>
          <input type="time" class="form-control" id="time" v-model="notification.time">
        </div>
        <div class="form-group">
          <label for="comment">Commentaire</label>
          <textarea class="form-control" id="comment" v-model="notification.comment"></textarea>
        </div>
        <button type="submit"  class="btn btn-primary">Envoyer</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Form',
  data () {
    return {
      notification: {
        training: null,
        student: null,
        date: this.$moment().format('YYYY-MM-DD'),
        time: this.$moment().format('HH:mm'),
        comment: null,
        type: 'allDay'
      },
      trainings: [
        {id: 1, name: 'Développeur .NET'},
        {id: 2, name: 'Développeur d\'applications mobiles'}
      ],
      types: [
        {id: 'allDay', name: 'Jour complet', time: false},
        {id: 'lateArrival', name: 'Arrivée tardive', time: true},
        {id: 'earlyDeparture', name: 'Départ anticipé', time: true}
      ]
    }
  },
  methods: {
    submit () {
      let {training, student, date, time, comment, type } = this.notification;
      console.log(training, student, date, time, comment, type);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
