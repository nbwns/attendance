let port = 8082;
let express = require('express');
let app = express();
const { check } = require('express-validator/check');
let boom = require('express-boom');
let bodyParser = require('body-parser');
let cors = require('cors');
let mongoose = require('mongoose');
let multer  = require('multer')
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

mongoose.connect('mongodb://localhost:27017/attendancelist');

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'))


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type: 'application/json'}));
app.use(cors());
app.use(boom());

app.get('/', (req, res) => res.json({message: "OK"}));

app.post('/nonattendance', 
    upload.single('files'), [
        check('training').not().isEmpty().not(), 
        check('student').not().isEmpty().not().trim(), 
        check('date').not().isEmpty().isISO8601(),
        check('time').not().isEmpty()],
    nonAttendance.post);

app.listen(port);
console.log("Listening on port " + port);
