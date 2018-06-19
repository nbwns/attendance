let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let NonAttendanceSchema = new Schema({
    training: { type: Number, required: true },
    student : { type: String, required: true },
    date : { type: Date, required: true },
    type : { type: String, required: true },
    comment : { type: String, required: false },
    createdAt: { type: Date, default: Date.now }
}, 
{ 
  versionKey: false
});

NonAttendanceSchema.pre('save', next => {
    now = new Date();
    if(!this.createdAt) {
      this.createdAt = now;
    }
    next();
  });

  module.exports = mongoose.model('nonAttendance', NonAttendanceSchema);