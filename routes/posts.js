const router = require("express").Router();
const {
  createPost,
  deletePost,
  addLike,
  removeLike,
  addComment,
  deleteComment,
  getAllPosts,
  getPost,
} = require("../controll/posts");
const auth = require("../middelware/auth");

// Method POST
// Route For Create A Post

router.post("/", auth, createPost);

// Method GET
//  Route For Get All Posts

router.get("/", getAllPosts);

// Method GET
//  Route For Get Post

router.get("/:post_id", getPost);

// Method DELETE
// Route For Delete Post

router.delete("/:post_id", auth, deletePost);

// Method PUT
// Route For Add Like To Post

router.put("/like/:post_id", auth, addLike);

// Method PUT
// Route For  UnLike To Post

router.put("/unlike/:post_id", auth, removeLike);

// Method PUT
// Route For Add comment To Post

router.put("/comment/:post_id", auth, addComment);

// Method PUT
// Route For  Delete comment To Post

router.put("/uncomment/:post_id&:comment_id", auth, deleteComment);

module.exports = router;
