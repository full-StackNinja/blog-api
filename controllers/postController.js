const Post = require("../models/post");
const Comment = require("../models/comment");
const Author = require("../models/author");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const comment = require("../models/comment");

exports.all_posts = asyncHandler(async (req, res, next) => {
   const all_posts = await Post.find();
   res.status(200).json({ all_posts });
});

exports.create_post = [
   body("author").trim().notEmpty().withMessage("Author id is required"),
   body("title").trim().notEmpty().withMessage("Title is required").escape(),
   body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required")
      .escape(),
   asyncHandler(async (req, res) => {
      const errors = validationResult(req);
      const author = await Author.findById(req.body.author);
      const post = new Post({
         author,
         title: req.body.title,
         description: req.body.description,
      });
      if (!errors.isEmpty()) {
         res.json({
            post,
            errors: errors.array(),
         });
         return;
      } else {
         await post.save();
         res.status(201).json({
            success: true,
            message: "Post created successfully!",
            post,
         });
      }
   }),
];

exports.update_post_get = asyncHandler(async (req, res, next) => {
   const post = await Post.findById(req.params.postId);
   res.json({
      post,
   });
});

exports.update_post_post = [
   body("title").trim().notEmpty().withMessage("Title is required").escape(),
   body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required")
      .escape(),
   body("published")
      .optional()
      .trim()
      .isBoolean()
      .withMessage("Published field must be Boolean type"),
   asyncHandler(async (req, res) => {
      const errors = validationResult(req);
      const post = await new Post({
         title: req.body.title,
         description: req.body.description,
         published: req.body.published
            ? req.body.published
            : await Post.findById(req.params.postId).published,
         _id: req.params.postId,
      });
      if (!errors.isEmpty()) {
         res.json({
            post,
            errors: errors.array(),
         });
         return;
      } else {
         const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            post,
         );
         res.status(200).json({
            success: true,
            message: "Post updated successfully!",
            updatedPost,
         });
      }
   }),
];

exports.toggle_publish_status_patch = asyncHandler(async (req, res, next) => {
   const post = await Post.findById(req.params.postId);
   const { publishStatus } = req.body;
   post.published = publishStatus;
   await post.save();
   res.status(200).json({
      success: true,
      message: `post publish status toggled from ${!publishStatus} to ${publishStatus}`,
      post,
   });
});

exports.delete_post = asyncHandler(async (req, res, next) => {
   try {
      const [post, comments] = await Promise.all([
         Post.findById(req.params.postId),
         Comment.find({ post: req.params.postId }),
      ]);
      if (!post) {
         return res.status(404).json({ error: "Post not found" });
      }
      if (comments.length) {
         comments.forEach(async (comment) => {
            await Comment.findByIdAndDelete(comment._id);
         });
      }
      const deletedPost = await Post.findByIdAndDelete(req.params.postId);
      res.status(200).json({
         success: true,
         message: "Deleted post successfully",
         deletedPost: deletedPost,
      });
   } catch (err) {
      res.status(500).json({ err });
   }
});
