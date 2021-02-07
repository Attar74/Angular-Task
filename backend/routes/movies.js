const express = require('express');

const  router = express.Router();

const Movie = require('../models/movie');


router.post("",(req, res, next)=>{
  const movie = new Movie({
    title: req.body.title,
    rate: req.body.rate
  });
  movie.save().then((result)=>{
    res.status(201).json({
      mesage: "Movie Added successfully", _id: result.id
    });
  })
});

router.put("/:id", (req, res, next)=>{
  const movie = new Movie({
    _id: req.body.id,
    title: req.body.title,
    rate: req.body.rate
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
