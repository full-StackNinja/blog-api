const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const indexRoute = require("../routes/index");

app.use("/api", indexRoute);

app.listen(3000, () => {
   console.log("Server is running on port 3000");
});

module.exports = app;
