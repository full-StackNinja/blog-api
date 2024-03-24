const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const commentController = require("../controllers/commentController");
const authorController = require("../controllers/authorController");

const authenticateAuthor = require("../authentication/jwt_authentication");

// Author signup
router.post("/author/signup", authorController.author_signup_post);

router.post("/author/login", authorController.author_login_post);

// Get all posts
router.get("/posts", postController.all_posts);
// Create new post
router.post("/posts", authenticateAuthor, postController.create_post);
// get existing post for update
router.get("/posts/:postId", authenticateAuthor, postController.update_post_get);

// Update existing post
router.post("/posts/:postId",authenticateAuthor, postController.update_post_post);

// Toggle post's publish status
router.patch(
   "/posts/:postId/toggle-publish",
   authenticateAuthor,
   postController.toggle_publish_status_patch,
);

// Delete post
router.delete("/posts/:postId", authenticateAuthor, postController.delete_post);

// ROUTES FOR COMMENTS

// Get all comments
router.get("/posts/:postId/comments", commentController.all_post_comments_get);

// Create new comment
router.post("/posts/:postId/comments", commentController.create_comment_post);

// Get existing comment
router.get(
   "/posts/:postId/comments/:commentId",
   commentController.update_comment_get,
);

// Update existing comment
router.post(
   "/posts/:postId/comments/:commentId",
   commentController.update_comment_post,
);

// Delete existing comment
router.delete(
   "/posts/:postId/comments/:commentId",
   commentController.delete_comment_post,
);

module.exports = router;
