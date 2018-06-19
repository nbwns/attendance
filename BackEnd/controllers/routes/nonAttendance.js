let mongoose = require('mongoose');
let NonAttendance= require('../models/nonAttendance');
let moment = require('moment');


function post(req, res){
    console.log(req.file);
    console.log(req.body);

    let {training, type, comment, student, date, time} = req.body;
    let newNonAttendance = { training, type, comment, student};
    if(!date){
        throw new Error("Date is required");
    }
    else{
        if(newNonAttendance.type === 'allDay'){
            newNonAttendance.date = moment(date, "YYYY-MM-DD").toDate();
        }
        else{
            if(!time){
                throw new Error("Time is required");                
            }
            else{
                newNonAttendance.date = moment(date + ' ' + time, "YYYY-MM-DD HH:mm");
            }
            
        }

        newNonAttendance = new NonAttendance(newNonAttendance);
        res.json({message: "Successfully added!", newNonAttendance });


        /*newNonAttendance.save((err,book) => {
            if(err) {
                res.send(err);
            }
            else { //If no errors, send it back to the client
                res.json({message: "Successfully added!", newNonAttendance });
            }
        });*/
    }
}

module.exports = { post };