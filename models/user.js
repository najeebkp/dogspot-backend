const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
userSchema.statics.isThisEmailInUse = async function (email) {
  if (!email) throw new Error("Invalid email");
  try {
    const user = await this.findOne({ email });
    if (user) return true;
    return false;
  } catch (error) {
    console.log("Error is thisemailinuse", error.message);
    return true;
  }
};

module.exports = mongoose.model("Users", userSchema);
