const { check, validationResult } = require("express-validator");
const Post = require("../models/Post");
const User = require("../models/User");

const createPost = [
  [check("text", "Text Is Required").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const post = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: user.id,
      });

      await post.save();

      res.status(201).json(post);
    } catch (e) {
      console.error(e);

      res.status(500).send("Server Errors");
    }
  },
];

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    res.json(posts);
  } catch (e) {
    console.error(e);

    res.status(500).send("Server Errors");
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ msg: "No Post Found" });
    }

    res.json(post);
  } catch (e) {
    console.error(e);

    if (e.kind === "ObjectId") {
      return res.status(404).json({ msg: "No Post Found" });
    }
    res.status(500).send("Server Errors");
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ msg: "No Post Found" });
    }

    if (req.user.id !== post.user.toString()) {
      return res.status(401).json({ msg: "User Not Have This Post" });
    }

    await post.remove();

    res.json({ msg: "Post Removed" });
  } catch (e) {
    console.error(e);

    if (e.kind === "ObjectId") {
      return res.status(404).json({ msg: "No Post Found" });
    }
    res.status(500).send("Server Errors");
  }
};

const addLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ msg: "Post Not Found" });
    }

    if (post.likes.find((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: "User Already Like" });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    res.json(post.likes);
  } catch (e) {
    console.error(e);

    res.status(500).send("Server Error");
  }
};

const removeLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ msg: "Post Not Found" });
    }

    if (
      !post.likes ||
      !post.likes.find((like) => like.user.toString() === req.user.id)
    ) {
      return res.status(400).json({ msg: "User Dont Like It To Remove" });
    }

    const indexToRemove = post.likes.findIndex(
      (like) => like.user.toString() === req.user.id
    );

    post.likes.splice(indexToRemove, 1);

    await post.save();

    res.json(post.likes);
  } catch (e) {
    console.error(e);

    res.status(500).send("Server Error");
  }
};

const addComment = [
  [check("text", "Text Is Required").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    try {
      const post = await Post.findById(req.params.post_id);

      if (!post) {
        return res.status(404).json({ msg: "Post Not Found" });
      }

      const user = await User.findById(req.user.id);

      const comment = {
        user: req.user.id,
        name: user.name,
        avatar: user.avatar,
        text: req.body.text,
      };

      post.comments.unshift(comment);

      await post.save();

      res.json(post.comments);
    } catch (e) {
      console.error(e);

      res.status(500).send("Server Error");
    }
  },
];

const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(404).json({ msg: "Post Not Found" });
    }

    if (
      !post.comments ||
      !post.comments.find((comment) => comment.user.toString() === req.user.id)
    ) {
      return res.status(400).json({ msg: "User Dont comment It To Remove" });
    }

    const indexToRemove = post.comments.findIndex(
      (comment) => comment.id === req.params.comment_id
    );
    if (indexToRemove < 0) {
      return res.status(404).json({ msg: "Comment Not Found" });
    }

    post.comments.splice(indexToRemove, 1);

    await post.save();

    res.json(post.comments);
  } catch (e) {
    console.error(e);

    res.status(500).send("Server Error");
  }
};

module.exports = {
  getAllPosts,
  getPost,
  addComment,
  addLike,
  removeLike,
  deleteComment,
  deletePost,
  createPost,
};
