const mongoose = require("mongoose");

const { Schema } = mongoose;

const CommentSchema = new Schema({
   post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
   email: { type: String, required: true },
   firstName: { type: String, required: true },
   lastName: { type: String, required: true },
   timestamp: { type: Date, default: Date.now },
});
