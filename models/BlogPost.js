const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'User ID is required'],
    },
    comment: {
        type: String,
        required: [true, 'Comment is required'],
    }
});

const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    authorInformation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    comments: [commentSchema]
});

module.exports = mongoose.model('BlogPost', blogPostSchema);