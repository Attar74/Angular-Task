const express = require('express');
const router = express.Router();

const Movie = require('../models/movie');
const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: (req, file, cb)=> {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if(isValid) {
      error = null;
    }
    cb(error, "backend/images")
  },
  filename: (req, file, cb)=>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '_' + Date.now() + '.' + ext)
  }
});


router.post("",multer({storage: storage}).single("image"),(req, res, next)=>{
  const url = req.protocol+'://'+ req.get('host');
  const movie = new Movie({
    title: req.body.title,
    rate: req.body.rate,
    imagePath: url + "/images/" + req.file.filename
  });
  movie.save().then((result)=>{
    res.status(201).json({
      mesage: "Movie Added successfully",
      movie: {
        ...result,
        id: result._id
      }
    });
  })
});

router.put("/:id",multer({storage: storage}).single("image"), (req, res, next)=>{
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol+'://'+ req.get('host');
    imagePath = url + "/images/" + req.file.filename
  }
  const movie = new Movie({
    _id: req.body.id,
    title: req.body.title,
    rate: req.body.rate,
    imagePath: imagePath
  });

  Movie.updateOne({_id: req.params.id}, movie).then(result => {
    console.log(result);
    res.status(200).json({message: "Movie updated"});
  });
});

router.get("",(req, res, next)=>{
  Movie.find().then((doc)=>{
    res.status(200).json({
      message: "Movies feteched successfully!",
      Movies: doc
    });
  });
});

router.get("/:id", (req, res, next)=>{
  Movie.findById(req.params.id).then((movie)=>{
    if(movie){
      res.status(200).json(movie);
    } else {
      res.status(404).json({message: "Not found"});
    }
  })
})

router.delete("/:id", (req, res, next)=>{
  Movie.deleteOne({_id: req.params.id}).then((result)=>{
    console.log(result);
  })
  res.status(200).json({message : "Movie Deleted"});
})

module.exports = router;
