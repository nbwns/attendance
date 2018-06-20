let NonAttendance= require('../models/nonAttendance');
const { validationResult } = require('express-validator/check');
let moment = require('moment');


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
    if(req.file){
        newNonAttendance.files = [req.file.path];
    }

    if(newNonAttendance.type === 'allDay'){
        newNonAttendance.date = moment(date, "YYYY-MM-DD").toDate();
    }
    else{
        newNonAttendance.date = moment(date + ' ' + time, "YYYY-MM-DD HH:mm");
        if(!newNonAttendance.date.isValid()){
            res.boom.badData('Date is not valid');
        }
    }

    newNonAttendance = new NonAttendance(newNonAttendance);
    //res.json({message: "Successfully added!", newNonAttendance });


    newNonAttendance.save((err, item) => {
        
        if(err) {
            res.boom.badImplementation('Could not save to DB', err);
        }
        else { //If no errors, send it back to the client
            res.json({message: "Successfully added!", item });
        }
    });

}

module.exports = { post };