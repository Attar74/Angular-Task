const mongoose = require ('mongoose');

const movieSchema = mongoose.Schema({
  title: {type: String, required:true},
  rate: {type: Number, required: true},
  imagePath: {type: String, required: true},
});

module.exports = mongoose.model('Movie', movieSchema);
