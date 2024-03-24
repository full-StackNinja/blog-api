# BLOG API

This blog api has been built by following Restful API structure on Nodejs with express.js. This api provides resources to create new post, edit and update and delete posts. Also this api manages adding and deleting and updating comments on every post. The post creation, deletion and updating has been protected by JSONWEBTOKEN authentication strategy.

MONGODB has been used as a database and managed through mongoose which is an ODM (Object Data Modeling).

## List of Resourceful Endpoints

-  /api/posts:
   -  POST method to create new post.
   -  GET method to get all the posts.
-  /api/posts/postId:
   -  GET method to get specific post.
   -  PUT method to update post.
   -  DELETE method to delete specific post.
-  /api/posts/postId/comments:
   -  POST method to create new comment under specific post.
   -  GET method to get all the comments under specific post.
-  /api/posts/postId/comments/commentId:
   -  GET method to get single post with id "commentId"
   -  PUT method to edit single comment
   -  DELETE method to delete comment
