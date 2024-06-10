const express = require('express');
const router=express.Router();

const { createPost, followUser, getPosts, getFollowingPost } = require('../controllers/userActionsController');

router.post("/createPost", createPost);
router.post('/follow',followUser);
router.get("/getPost",getPosts);
router.get("/getFollowingPost",getFollowingPost);

module.exports = router;