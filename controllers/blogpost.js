const BlogPost = require('../models/BlogPost');

module.exports.createBlog = async (req, res) => {
    const existingBlog = await BlogPost.findOne({ title: req.body.title }).then(data => data);
    
    if (existingBlog) {
        return res.status(409).send({ error: 'BlogPost already exists' });
    }

    const newBlog = new BlogPost({
        title: req.body.title,
        content: req.body.content,
        authorInformation: req.user.id,
    });

    return newBlog
        .save()
        .then(blog => res.status(201).send(blog))
        .catch(saveError => {
            console.error('Error in saving the blog: ', saveError);
            res.status(500).send({ error: 'Failed to save the blog' });
        });
};

module.exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await BlogPost.find({}).then(blogs => blogs);
        return res.status(200).send({ blogs });
    } catch (err) {
        console.error('Error in finding blogposts:', err);
        return res.status(400).send({ error: 'Error in finding blogposts' });
    }
}

module.exports.getBlog = async (req, res) => {
    const blogId = req.params.id;

    await BlogPost.findById(blogId)
        .then(blog => {
            if (!blog) {
                return res.status(404).send({ error: 'BlogPost not found' });
            }
            res.status(200).send(blog);
        })
        .catch(error => {
            console.error('Error in finding the blog:', error);
            res.status(500).send({ error: 'Failed to retrieve the blog' });
        });
};

module.exports.updateBlog = async (req, res) => {
    try {
        const blogId = req.params.id;

        const blog = await BlogPost.findById(blogId).then(blog => blog);

        if (!blog) {
            return res.status(404).send({ error: 'BlogPost not found' });
        }

        if (blog.authorInformation.toString() !== req.user.id.toString()) {
            return res.status(403).send({ error: 'Forbidden' });
        }

        const updatedData = {
            title: req.body.title,
            content: req.body.content,
        };

        const updatedBlog = await BlogPost.findByIdAndUpdate(blogId, updatedData, {
            new: true,
        });

        res.send({
            message: 'BlogPost updated successfully',
            updatedBlog: updatedBlog,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Server error' });
    }
};

module.exports.deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;

        const blog = await BlogPost.findById(blogId).then(blog => blog);

        if (!blog) {
            return res.status(404).send({ error: 'BlogPost not found' });
        }

        if (!req.user.isAdmin) {
            if (blog.authorInformation.toString() !== req.user.id.toString()) return res.status(403).send({ error: 'Forbidden' });
        }

        await BlogPost.findByIdAndDelete(blogId).then(data => data);

        res.status(200).send({ message: 'BlogPost deleted successfully' });
    } catch (error) {
        console.error('Error in deleting the blog:', error);
        res.status(500).send({ error: 'Failed to delete the blog' });
    }
};

module.exports.addComment = async (req, res) => {
    const blogId = req.params.id;
    const userId = req.user.id;
    const { comment } = req.body;
    const formattedComment = {
        userId,
        comment,
    };

    try {
        const updatedBlog = await BlogPost.findByIdAndUpdate(
            blogId,
            { $push: { comments: formattedComment } },
            { new: true }
        );

        return res.status(200).send({ message: 'Comment added successfully', updatedBlog });
    } catch (error) {
        console.error('Error in saving comment:', error);
        return res.status(500).send({ error: 'Failed to save the comment' });
    }
};

module.exports.deleteComment = async (req, res) => {
    const blogPostId = req.params.id;
    const { commentId } = req.body;
    try {
        if (req.user.isAdmin) {
            const blogPost = await BlogPost.findById(blogPostId).then(blogPost => blogPost);
            const commentIndex = blogPost.comments?.findIndex(comment => comment._id == commentId);

            if (commentIndex === -1) {
                return res.status(404).send({ error: 'Comment not found in blogpost' });
            }

            blogPost.comments.splice(commentIndex, 1);
            blogPost.save();

            const updateBlogPost = await BlogPost.findById(blogPostId).then(blogPost => blogPost);

            return res.status(200).send({ message: 'Comment deleted successfully', updateBlogPost: blogPost });
        } else {
            res.status(500).send('No admin privilege to update a blog');
        }
    } catch (err) {
        console.error('Error in updating blog:', err);
        return res.status(400).send({ error: 'Error in updating blog' });
    }
}