const mongoose = require("mongoose");

const { Schema } = mongoose;

const AuthorSchema = new Schema({
   firstName: { type: String, required: true },
   lastName: { type: String, required: true },
   username: { type: String, required: true },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true, },
});

module.exports = mongoose.model("Author", AuthorSchema);
