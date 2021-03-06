 const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
var path = require('path')
var fs = require('fs')
var Origami = require('../models/origami.js');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'origami/')
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

router.route('/origami/:id')
    .get( function(req, res){


    Origami.findOne({_id:req.params.id}).populate({path:'userId commentaArray.userId',select:'username profilepath'  })
          .exec(function(err,orig){
        if(err) { return res.send(500, err); }

        if(!orig) { return res.send(404,err); }
        else{
             res.json(orig);
            console.log(JSON.stringify(orig));
        }


        })
    })
    .put((req, res,next) => {
            if (!req.session.username) {

                var err = new Error('No user atm.');
                err.status = 401;
               err.message="No user atm.";
		 return next(err);


            } else {
if (req.body.content ) {
var comm= {
    userId: req.session.userid,
    title: req.body.title,
    comment: req.body.content
};

Origami.findOneAndUpdate({_id: req.params.id},{ $push: { commentaArray: comm}}, function (err, data) {
    if (err) {
        return res.status(500).send(err);
    }
    if (!data) {
        return res.status(404).end();
    }
    console.log("yayayay");
    return res.status(200).send(data);
});



}  else {
                        var err = new Error('Toate campurile sunt obligatorii.');
                        err.status = 400;
			   err.message="Toate campurile sunt obligatorii.";

                        return next( err); }




}})
router.route('/origami')
    .get((req, res) => {
        Origami.find().populate('userId', 'username profilepath')
  .exec(function (err, origami) {
    if (err) return handleError(err);
    res.json( origami);
   })
    })
    .post(upload.single('file'),function(req, res, next) {
            if (req.session.username == "undefined") {

                var err = new Error('No user atm.');
		   err.message="No user atm.";
                err.status = 401;
                return next(err);

            } else {
                        console.log(req.body);
                if (req.body.origamidescription &&
                    req.body.origamititle && req.file ) {
                    console.log(req.body);
                    console.log(req.file);
                    var bitmap = fs.readFileSync('origami/' + req.file.filename).toString('hex', 0, 4)
                    console.log(bitmap);
                    if (!checkMagicNumbers(bitmap)) {
                        fs.unlinkSync('origami/' + req.file.filename);
                        var err = new Error('Not a picture');
                        err.status = 401;
                        return next(err);

                    } else {
                        var newUpload = {
                            userId: req.session.userid,
                            origamipath: 'origami/' + req.file.filename,
                            origamititle:req.body.origamititle,
                            origamidescription:req.body.origamidescription,
                            tags: req.body.tags,

};




                        Origami.create(newUpload, function(error, user) {
                            if (error) {
                                return next(error);
                            } else {


                                return res.redirect('/');
                            }
                        });

               }     } else {
                        var err = new Error('Toate campurile sunt obligatorii.');
                        err.status = 400;
			 err.message="Toate campurile sunt obligatorii.";

                        return next(err);
                    }
               } });


router.route('/like/:id')
      .post((req,res,next) => {
 if (!req.session.username) {

                var err = new Error('No user atm.');
                err.status = 401;
		err.message="No user atm.";

                return next(err);

            } else {
console.log(req.params.id);
Origami.findOne({'_id': req.params.id,'likes':req.session.username})
  .exec(function (err, origami) {
if (err) return next(err);
else{ if(!(origami)){
console.log("no like here");
Origami.findOneAndUpdate({'_id': req.params.id},{$push:{'likes':req.session.username}},{new: true}, function(err, origami){
    if(err){
        console.log("Something wrong when updating data!");
    }
        console.log("like adaugat");
   })
Origami.findOne({'_id': req.params.id,'dislikes':req.session.username})
 .exec(function (err, origami2) {
if (err) return next(err);
else{   if(!(origami2)){
 res.send("1");
}
else{
Origami.findOneAndUpdate({'_id': req.params.id},{$pull:{'dislikes':req.session.username}},{new: true}, function(err, origami3){
    if(err){
        console.log("Something wrong when updating data!");
    }
        console.log("dislike sters");
        res.send("2");
   })


   
   }}});

}

else{
Origami.findOneAndUpdate({'_id': req.params.id},{$pull:{'likes':req.session.username}},{new: true}, function(err, origami){
    if(err){
        console.log("Something wrong when updating data!");
    }
console.log("unlike dat")
    res.send("3");
});


console.log(origami);
console.log(origami.likes);

}}
})
      }})
router.route('/dislike/:id')
      .post((req,res,next) => {
 if (!req.session.username) {

                var err = new Error('No user atm.');
                err.status = 401;
                err.message="No user atm.";
		return next(err);

            } else {
console.log(req.params.id);
Origami.findOne({'_id': req.params.id,'dislikes':req.session.username})
  .exec(function (err, origami) {
if (err) return next(err);
else{ if(!(origami)){
console.log("no dislike here");
Origami.findOneAndUpdate({'_id': req.params.id},{$push:{'dislikes':req.session.username}},{new: true}, function(err, origami){
    if(err){
        console.log("Something wrong when updating data!");
    }
        console.log("dislike adaugat");
   })
Origami.findOne({'_id': req.params.id,'likes':req.session.username})
 .exec(function (err, origami2) {
if (err) return next(err);
else{   if(!(origami2)){
 res.send("4");
}
else{
Origami.findOneAndUpdate({'_id': req.params.id},{$pull:{'likes':req.session.username}},{new: true}, function(err, origami3){
    if(err){
        console.log("Something wrong when updating data!");
    }
        console.log("like sters");
        res.send("5");
   })


   
   }}});

}

else{
Origami.findOneAndUpdate({'_id': req.params.id},{$pull:{'dislikes':req.session.username}},{new: true}, function(err, origami){
    if(err){
        console.log("Something wrong when updating data!");
    }
console.log("undislike dat");
    res.send("6");
});


console.log(origami);
console.log(origami.likes);

}}
})
      }})




module.exports = router;

