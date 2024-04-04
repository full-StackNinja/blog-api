const mongoose = require("mongoose");
require("dotenv").config();

const mongodb = async () => {
   await mongoose.connect(process.env.MONGODB_URI);
   console.log("Connected to the database!");
};

mongodb().catch((err) => {
   next(err);
});

module.exports = mongodb;
