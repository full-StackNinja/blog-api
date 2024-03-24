const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const Author = require("../models/author");
const Comment = require("../models/comment");
const Post = require("../models/post");

exports.author_signup_post = [
   body("firstName")
      .trim()
      .notEmpty()
      .withMessage("First name is required")
      .escape(),
   body("lastName")
      .trim()
      .notEmpty()
      .withMessage("Last name is required")
      .escape(),
   body("username")
      .trim()
      .notEmpty()
      .withMessage("User name is required")
      .escape(),
   body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email")
      .escape(),
   body("password").trim().notEmpty().withMessage("Password is required"),
   body("conf-password")
      .trim()
      .notEmpty()
      .withMessage("Please re-enter password")
      .escape()
      .custom((value, { req }) => value === req.body.password)
      .withMessage("Passwords do not match"),
   asyncHandler(async (req, res) => {
      const errors = validationResult(req);
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const author = new Author({
         firstName: req.body.firstName,
         lastName: req.body.lastName,
         username: req.body.username,
         email: req.body.email,
         password: hashedPassword,
      });

      if (!errors.isEmpty()) {
         res.status(400).json({
            success: false,
            message: "One or more fields are invalid",
            errors: errors.array(),
         });
         return;
      }
      await author.save();
      res.status(200).json({
         success: true,
         message: "User signed up successfully",
      });
   }),
];

exports.author_login_post = [
   body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email"),
   body("password").trim().notEmpty().withMessage("Password is required"),
   asyncHandler(async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
         return res.status(400).json({
            errors: errors.array(),
         });
      }
      const author = await Author.findOne({ email: req.body.email });
      if (!author)
         return res.status(400).json({
            success: false,
            message: "Author not found",
         });
      if (await bcrypt.compare(req.body.password, author.password)) {
         const token = jwt.sign(
            {
               email: author.email,
            },
            "cat",
         );
         return res.status(200).json({
            success: true,
            message: "login successful",
            token: token,
         });
      }

      return res.status(400).json({
         success: false,
         message: "Email or password is incorrect",
      });
   }),
];
