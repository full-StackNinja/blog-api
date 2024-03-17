const mongoose = require("mongoose");

const { Schema } = mongoose;

const PostSchema = new Schema({
   author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
   title: { type: String, required: true },
   description: { type: String, required: true },
   timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema)
