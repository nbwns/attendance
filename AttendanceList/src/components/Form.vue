<template>
  <div class="row">
    <div class="col text-left">
      <h1>Justifier une absence</h1>
      <div class="alert alert-warning" role="alert" v-if="validationError">
        Veuillez vérifier les données du formulaire.
      </div>
      <div class="alert alert-danger" role="alert"  v-if="serverError">
        Une erreur est survenue. Veuillez réessayer plus tard.
      </div>
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
          <label for="files">Pièces justificatives</label>
           <input type="file" id="files" ref="files" multiple v-on:change="handleFileUploads()"/>
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
import axios from 'axios'
export default {
  name: 'Form',
  data () {
    return {
      notification: {
        training: '',
        student: '',
        date: this.$moment().format('YYYY-MM-DD'),
        time: this.$moment().format('HH:mm'),
        comment: '',
        type: 'allDay',
        files: ''
      },
      trainings: [
        {id: 1, name: 'Développeur .NET'},
        {id: 2, name: 'Développeur d\'applications mobiles'}
      ],
      validationError: false,
      serverError: false,
      types: [
        {id: 'allDay', name: 'Jour complet', time: false},
        {id: 'lateArrival', name: 'Arrivée tardive', time: true},
        {id: 'earlyDeparture', name: 'Départ anticipé', time: true}
      ]
    }
  },
  methods: {
    handleFilesUpload () {
      this.notification.files = this.$refs.files.files
    },
    submit () {
      this.notification.files = this.$refs.files.files
      let {training, student, date, time, comment, type} = this.notification
      let formData = new FormData()
      formData.append('training', training)
      formData.append('student', student)
      formData.append('date', date)
      formData.append('time', time)
      formData.append('comment', comment)
      formData.append('type', type)
      for (var i = 0; i < this.notification.files.length; i++ ){
        let file = this.notification.files[i]
        formData.append('files', file)
      }
      for(var pair of formData.entries()) {
        console.log(pair[0]+ ', '+ pair[1]);
      }
      this.serverError = false
      this.validationError = false
      axios.post('http://localhost:8082/nonattendance',
                  formData,
                  {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                  })
            .then(function(){
              console.log('SUCCESS!!')
            })
            .catch((error) => {
              console.log(error.response.status)
              if(error.response.status >= 500){
                this.serverError = true
              }
              else{
                this.validationError = true
              }
            })
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
div.alert{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
</style>
