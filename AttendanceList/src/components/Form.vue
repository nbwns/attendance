<template>
  <div class="row">
    <div class="overlay" v-if="sending">
      <div class="loader">
         <img src="../assets/loader.gif"><br/>
          <strong>Envoi...</strong>
      </div>
    </div>
    <div class="col text-left">
      <h1>Justifier une absence</h1>
      <div class="alert alert-warning" role="alert" v-if="validationError">
        Veuillez vérifier les données du formulaire.
      </div>
      <div class="alert alert-danger" role="alert"  v-if="serverError">
        Une erreur est survenue. Veuillez réessayer plus tard.
      </div>
      <form @submit.prevent="validateBeforeSubmit">
        <div class="form-group">
          <label for="training-list">Formation</label>
          <select name="training" id="training-list" v-validate="'required'" :class="{'form-control': true, 'is-invalid': errors.has('training') }" v-model="notification.training" >
            <option v-for="t in trainings" :value="t.id" v-bind:key="t.name">{{t.name}}</option>
          </select>
          <div v-show="errors.has('training')" class="invalid-feedback">{{ errors.first('training') }}</div>
        </div>
        <div class="form-group">
          <label for="student-id">Identifiant stagiaire</label>
          <input type="text" name="student" v-validate="'required|alpha_num'" :class="{'form-control': true, 'is-invalid': errors.has('student') }" id="student-id" v-model="notification.student" placeholder="STG0000">
          <div v-show="errors.has('student')" class="invalid-feedback">{{ errors.first('student') }}</div>
        </div>
        <div class="form-group">
          <label for="date">Date</label>
          <input type="date" name="date" v-validate="'required'" :class="{'form-control': true, 'is-invalid': errors.has('date') }" id="date" v-model="notification.date" >
          <div v-show="errors.has('date')" class="invalid-feedback">{{ errors.first('date') }}</div>
        </div>
        <div class="form-group">
          <label for="non-attendance-type">Type d'absence</label>
          <select id="non-attendance-type" class="form-control" v-model="notification.type"  >
            <option v-for="t in types" :value="t.id" :key="t.id" >{{t.name}}</option>
          </select>
        </div>
        <div class="form-group" v-if="notification.type !== 'allDay'">
          <label for="time">Heure</label>
          <input type="time" name="time" :class="{'form-control': true, 'is-invalid': errors.has('time') }" v-validate ="{ rules: { required: this.notification.type !== 'allDay'} }" id="time" v-model="notification.time">
          <div v-show="errors.has('time')" class="invalid-feedback">{{ errors.first('time') }}</div>
        </div>
         <div class="form-group">
          <label for="files">Pièces justificatives</label>
           <input type="file" id="files" ref="files" multiple/>
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
import { Validator } from 'vee-validate';

const dictionary = {
  custom: {
    training: {
      required: 'Veuillez choisir votre formation'
    },
    student: {
      required: 'Veuillez entrer votre identifiant stagiaire',
      alpha_num: 'Votre identifiant stagiaire doit commencer par STG suivi de 4 chiffres',
    },
    date: {
      required: 'Veuillez choisir la date de l\'absence'
    },
    time: {
      required: 'Veuillez choisir l\'heure de l\'absence'
    }
  }
};

// Override and merge the dictionaries
Validator.localize('en',dictionary);

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
      sending: false,
      types: [
        {id: 'allDay', name: 'Jour complet', time: false},
        {id: 'lateArrival', name: 'Arrivée tardive', time: true},
        {id: 'earlyDeparture', name: 'Départ anticipé', time: true}
      ]
    }
  },
  methods: {
    validateBeforeSubmit() {
      this.$validator.validateAll().then((result) => {
         console.log(result)
        
        if (result) {
          this.submit()
        }

        console.log('errors')
      });
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
      this.sending = true
      axios.post('http://localhost:8082/nonattendance',
                  formData,
                  {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                  })
            .then(() => {
              setTimeout(() => {
                this.sending = false
                this.$router.push('/ok')
              }, 1000)
            })
            .catch((error) => {
              this.sending = false
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
div.overlay{
  position: fixed;
  top: 0; 
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height:100;
  background-color: rgba(204, 204, 204, 0.3);
  z-index:2;
}
div.overlay .loader{
  position: absolute;
  top: 50%;
  left: 40%;
}
</style>
