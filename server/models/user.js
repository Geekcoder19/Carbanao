
const mongoose = require("mongoose");

const userschema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,

  // 🔹 Safe backend column names for questions
  pastModifications: Number,
  bodykitSpoiler: Number,
  customPaintWrap: Number,
  pastCustomPaintWrap: Number,
  newRimsTyre: Number,
  pastRimsTyre: Number,
  performanceEnhancements: Number,
  smartFeatures: Number,
});

const usermodel = mongoose.model("user", userschema);
module.exports = usermodel;
