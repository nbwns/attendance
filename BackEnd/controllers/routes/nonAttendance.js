let NonAttendance= require('../models/nonAttendance');
const { validationResult } = require('express-validator/check');
const moment = require('moment');
const axios = require('axios');
const smtpTransport = require('../../smtpTransport.js');
let trainings = [];

function requestInternalApi(req, res){
    axios.get(process.env.TRAINING_API)
        .then((response) => {
            trainings = response.data;
            
            let vm = trainings.map((t) => {
                return {id: t.id, name: t.name};
            });
            res.json(vm);
        });
}

function post(req, res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({ errors: errors.array() });
    }

    console.log(req.file);
    console.log(req.body);

    let {training, type, comment, student, date, time} = req.body;
    let newNonAttendance = { training, type, comment, student};
    
    //assign file
    if(req.file){
        newNonAttendance.files = [req.file.path];
    }

    //contruct date
    if(newNonAttendance.type === 'allDay'){
        newNonAttendance.date = moment(date, "YYYY-MM-DD").toDate();
    }
    else{
        newNonAttendance.date = moment(date + ' ' + time, "YYYY-MM-DD HH:mm");
        if(!newNonAttendance.date.isValid()){
            res.boom.badData('Date is not valid');
        }
    }

    //save object to db
    newNonAttendance = new NonAttendance(newNonAttendance);
    newNonAttendance.save((err, item) => {
        if(err) {
            res.boom.badImplementation('Could not save to DB', err);
        }
        else { 
            //notify training advisor & admin
            console.log(trainings);
            let trainingData = trainings.find(t => t.id === parseInt(training));
            if(trainingData){
                let sendTo = [];
                if(trainingData.advisor){
                    sendTo.push(trainingData.advisor.email);
                }
                if(trainingData.advisor){
                    sendTo.push(trainingData.admin.email);
                }

                if(sendTo.length > 0){
                    let message = {
                        from: 'outoftraining@bruxellesformation.brussels',
                        to: 'n.bauwens@bruxellesformation.brussels',
                        subject: 'Absence',
                        text: `${student} de la formation ${trainingData.name} signale une absence le ${date}`,
                        html: `${student} de la formation ${trainingData.name} signale une absence le ${date}`
                    };
                    console.log('sending mail to', sendTo);
                    //smtpTransport.sendMail(message);
                }
            }
            else{
                console.log(`data not found for training ${training}`)
            }
            //send it back to the client
            res.json({message: "Successfully added!", item });
        }
    });

}

module.exports = { post, requestInternalApi, trainings };