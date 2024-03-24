const mongoose = require("mongoose");

const { Schema } = mongoose;

const PostSchema = new Schema({
   author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
   title: { type: String, required: true },
   description: { type: String, required: true },
   published: { type: Boolean, default: false },
   timestamp: { type: Date, default: Date.now },
});

PostSchema.virtual("url").get(function () {
   return `/api/posts/${this._id}`;
});

module.exports = mongoose.model("Post", PostSchema);
