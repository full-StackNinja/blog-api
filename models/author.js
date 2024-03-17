const mongoose = require("mongoose");

const { Schema } = mongoose;

const AuthorSchema = new Schema({
   username: { type: String, required: true },
   password: { type: String, required: true, length: { min: 8 } },
});

module.exports = mongoose.model("Author", AuthorSchema);
