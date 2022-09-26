const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  number_of_dogs: {
    type: String,
    required: true,
  },
  dog_behaviour: {
    type: Array,
  },
  image: {
    type: Array,
  },
  user_email: {
    type: String,
    required: true,
  },
  coords: {
    latitude: {
      type: String,
      required: true,
    },
    longitude: {
      type: String,
      required: true,
    },
  },
  created_time: String,
});

module.exports = mongoose.model("Posts", postSchema);
