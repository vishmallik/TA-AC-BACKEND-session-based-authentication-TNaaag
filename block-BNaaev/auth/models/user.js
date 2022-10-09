const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, match: /@/, unique: true, required: true },
  password: { type: String, required: true },
  age: Number,
  phone: String,
});

userSchema.pre("save", function (next) {
  if (this.password && this.isModified("password")) {
    bcrypt.hash(this.password, 15, (err, hashedPassword) => {
      if (err) return next(err);
      this.password = hashedPassword;
      next();
    });
  } else {
    next();
  }
});

module.exports = mongoose.model("User", userSchema);
