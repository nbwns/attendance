require('dotenv').config()
const express = require('express');
const app = express();
const { check } = require('express-validator/check');
const boom = require('express-boom');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer  = require('multer')
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, req.body.student+'-'+req.body.date+'-'+file.originalname)
    }
  })
let upload = multer({ storage: storage })
let nonAttendance = require('./controllers/routes/nonAttendance.js');

mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: 'application/json'}));
app.use(cors());
app.use(boom());

app.get('/', nonAttendance.requestInternalApi);

app.post('/nonattendance', 
    upload.single('files'), [
        check('training').not().isEmpty().not(), 
        check('student').not().isEmpty().not().trim(), 
        check('date').not().isEmpty().isISO8601(),
        check('time').not().isEmpty()],
    nonAttendance.post);

app.listen(process.env.APP_PORT);
console.log("Listening on port " + process.env.APP_PORT);
