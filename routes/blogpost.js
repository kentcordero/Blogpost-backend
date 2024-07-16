const express = require('express');
const router = express.Router();
const blogpostController = require('../controllers/blogpost');
const { verify, verifyAdmin } = require('../auth');

router.post('/addBlog', verify, blogpostController.createBlog);

router.get('/getBlogs', blogpostController.getAllBlogs);

router.get('/getBlog/:id', blogpostController.getBlog);

router.patch('/updateBlog/:id', verify, blogpostController.updateBlog);

router.delete('/deleteBlog/:id', verify, blogpostController.deleteBlog);

router.patch('/addComment/:id', verify, blogpostController.addComment);

router.delete('/deleteComment/:id', verify, verifyAdmin, blogpostController.deleteComment);

module.exports = router;