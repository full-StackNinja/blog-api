const Post = require("../models/post");
const Comment = require("../models/comment");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.all_post_comments_get = asyncHandler(async (req, res, next) => {
   const allComments = await Comment.find({ post: req.params.postId });
   res.json({
      allComments,
   });
});

exports.create_comment_post = [
   body("post").trim().notEmpty().withMessage("Post is required").escape(),
   body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Enter valid email address")
      .escape(),
   body("firstName")
      .trim()
      .notEmpty()
      .withMessage("First name is required")
      .escape(),
   body("lastName")
      .trim()
      .notEmpty()
      .withMessage("Last name is require")
      .escape(),
   body("comment")
      .trim()
      .notEmpty()
      .withMessage("Please write your comment")
      .escape(),
   asyncHandler(async (req, res) => {
      const errors = validationResult(req);
      const comment = new Comment({
         post: req.body.post,
         email: req.body.email,
         firstName: req.body.firstName,
         lastName: req.body.lastName,
         comment: req.body.comment,
      });
      if (!errors.isEmpty()) {
         res.json({
            comment,
            errors: errors.array(),
         });
         return;
      } else {
         await comment.save();
         res.status(200).json({
            success: true,
            message: "comment saved successfully",
            comment,
         });
      }
   }),
];

exports.update_comment_get = asyncHandler(async (req, res, next) => {
   try {
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) {
         return res.status(404).json({ error: "Cannot find comment" });
      }
      res.status(200).json({
         comment,
      });
   } catch (err) {
      throw new Error(err);
   }
});

exports.update_comment_post = [
   body("comment")
      .trim()
      .notEmpty()
      .withMessage("comment is required")
      .escape(),
   asyncHandler(async (req, res) => {
      const comment = await Comment.findById(req.params.commentId);
      comment.comment = req.body.comment;
      await comment.save();
      res.status(200).json({
         success: true,
         message: "Comment updated successfully",
         comment,
      });
   }),
];

exports.delete_comment_post = asyncHandler(async (req, res, next) => {
   const comment = await Comment.findById(req.params.commentId);
   if (!comment) {
      return res.status(404).json({ error: "No comment found in database" });
   }
   const deletedComment = await Comment.findByIdAndDelete(req.params.commentId);
   res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      deletedComment,
   });
});
