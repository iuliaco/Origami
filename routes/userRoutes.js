
const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
var path = require('path')
var fs = require('fs')
var multer= require('multer');
var glob = require("glob")
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, req.session.username + '-' + Date.now())
  }
})
var upload = multer({ storage: storage })


var MAGIC_NUMBERS = {
	jpg: 'ffd8ffe0',
	jpg1: 'ffd8ffe1',
	png: '89504e47',
	gif: '47494638'
}

function checkMagicNumbers(magic) {
	if (magic == MAGIC_NUMBERS.jpg || magic == MAGIC_NUMBERS.jpg1 || magic == MAGIC_NUMBERS.png || magic == MAGIC_NUMBERS.gif) return true
}



router.route('/register')

        .post( function (req, res, next){
if (req.body.email &&
   req.body.username &&
    req.body.password &&
    req.body.name &&
    req.body.surname &&
    req.body.gender ) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      name:req.body.name,
      surname: req.body.surname,  
      birthdate: req.body.birthdate,     
      gender: req.body.gender
}

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
  req.session.username = user.username;
      req.session.userid=user._id;
 res.success=1;
res.data={};

        res.data.username=user.username;
return res.send(user.username);
        

 }
    });

  }  else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
});
router.route('/users/:user_username') 
    .get( function(req, res){
   

    User.findOne({username:req.params.user_username},'-password -admin' ) 
	  .exec(function(err,user){  
        if(err) { return res.send(500, err); } 

        if(!user) { return res.send(404,err); } 
        else{
             res.json(user);
            console.log(JSON.stringify(user));
        }
        

        })
    })
router.route('/login')
        .get( (req,res,next) =>
        {
          if( req.session.username == "undefined"){
 
        var err =  new Error('No user atm.');
	err.status=401;
            return next(err);
    
}
          else{
              return res.send(req.session.username);
        }}
)

	.post( (req,res,next) => {

if(req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
 var err = new Error('Wrong email or password');
        err.status = 401;
        return next(err);
      } else {
        req.session.username = user.username;
      req.session.userid=user._id; 
 res.success=1;
res.data={};

	res.data.username=user.username;
return res.send(user.username);
     	 
}
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }})


        .put(upload.single('file') ,(req, res, next) => {
            if (!req.session.username) {

                var err = new Error('No user atm.');
                err.status = 401;
                return next(err);

            } else {
 console.log(req.body);
  console.log(req.file);
var bitmap = fs.readFileSync('uploads/' + req.file.filename).toString('hex', 0, 4)
console.log(bitmap);
		if (!checkMagicNumbers(bitmap)) {
			fs.unlinkSync('uploads/' + req.file.filename);
			 var err = new Error('Not a picture');
        err.status = 401;
        return next(err);

		}else{

  User.findOne({username: req.session.username})
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      } else{	if(user.profilepath){fs.unlinkSync(user.profilepath);}   }})

  
 User.findOneAndUpdate({username:req.session.username}, { profilepath:'uploads/' + req.file.filename  }, function(err, doc){
    if (err) return res.send(500, { error: err });
    return res.send("succesfully saved");
})
}  }});





module.exports = router;
