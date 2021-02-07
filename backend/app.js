const express = require('express');
const bodyParser = require('body-parser');
const app = new express();
const mongoose = require('mongoose');
const moviesRoutes = require('./routes/movies');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

mongoose.connect("mongodb+srv://Mo:frcFZv64aB4xkOv7@cluster0.h7le4.mongodb.net/movieDB?retryWrites=true&w=majority")
        .then(()=>{
          console.log("connected to DB");
        }).catch(()=>{
          console.log("connection failed");
        })

app.use((req, res, next)=>{
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', "origin, x-Requsted-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, PUT, OPTIONS");
  next();
});

app.use("/api/movies",moviesRoutes);

module.exports = app;
