const jwt = require("jsonwebtoken");

require("dotenv").config();

const authenticateAuthor = (req, res, next) => {
   const authHeader = req.headers["authorization"];
   const token = authHeader && authHeader.split(" ")[1];
   if (!token) return res.sendStatus(401); //Unauthorized
   jwt.verify(token, "cat", (err, authData) => {
      if (err) return res.sendStatus(403); //Forbidden
      req.author = authData;
      next();
   });
};

module.exports = authenticateAuthor;
