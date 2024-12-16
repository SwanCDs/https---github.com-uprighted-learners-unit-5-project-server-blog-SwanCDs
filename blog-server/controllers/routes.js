const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const blogFilePath = path.join(__dirname, '../api/blog.json');

// Helper function to read the blog data from the JSON file
const readBlogs = (callback) => {
    fs.readFile(blogFilePath, 'utf-8', (err, data) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, JSON.parse(data));
    });
};

// Helper function to write updated data to the JSON file
const writeBlogs = (data, callback) => {
    fs.writeFile(blogFilePath, JSON.stringify(data, null, 2), (err) => {
        callback(err);
    });
};

// Endpoint to get all blog posts
router.get('/', (req, res) => {
    readBlogs((err, blogs) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading blogs' });
        }
        res.status(200).json(blogs);
    });
});

// Endpoint to get a single blog post by post_id
router.get('/:post_id', (req, res) => {
    const { post_id } = req.params;
    readBlogs((err, blogs) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading blogs' });
        }
        const blog = blogs.find(b => b.post_id === parseInt(post_id));
        if (blog) {
            res.status(200).json(blog);
        } else {
            res.status(404).json({ message: 'Blog post not found' });
        }
    });
});

// Endpoint to create a new blog post
router.post('/', (req, res) => {
    const newBlog = req.body;
    readBlogs((err, blogs) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading blogs' });
        }
        newBlog.post_id = blogs.length + 1; // Assign a new post_id
        blogs.push(newBlog);
        writeBlogs(blogs, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error writing blog post' });
            }
            res.status(201).json(newBlog);
        });
    });
});

// Endpoint to update an existing blog post
router.put('/:post_id', (req, res) => {
    const { post_id } = req.params;
    const updatedData = req.body;
    readBlogs((err, blogs) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading blogs' });
        }
        const index = blogs.findIndex(b => b.post_id === parseInt(post_id));
        if (index !== -1) {
            const updatedBlog = { ...blogs[index], ...updatedData };
            blogs[index] = updatedBlog;
            writeBlogs(blogs, (err) => {
                if (err) {
                    return res.status(500).json({ message: 'Error updating blog' });
                }
                res.status(200).json(updatedBlog);
            });
        } else {
            res.status(404).json({ message: 'Blog post not found' });
        }
    });
});

// Endpoint to delete a blog post
router.delete('/:post_id', (req, res) => {
    const { post_id } = req.params;
    readBlogs((err, blogs) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading blogs' });
        }
        const updatedBlogs = blogs.filter(b => b.post_id !== parseInt(post_id));
        if (updatedBlogs.length === blogs.length) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        writeBlogs(updatedBlogs, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error deleting blog' });
            }
            res.status(200).json({ message: 'Blog post deleted' });
        });
    });
});

module.exports = router;
