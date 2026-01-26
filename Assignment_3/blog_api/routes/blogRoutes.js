const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

router.post('/blogs', async (req, res) => {
  try {
    const { title, body, author } = req.body;

    if (!title || !body) {
      return res.status(400).json({success: false, message: 'Title and body are required fields'});
    }

    const newBlog = new Blog({title, body, author: author || 'Anonymous'
    });

    const savedBlog = await newBlog.save();

    res.status(201).json({success: true, message: 'Blog post created successfully', data: savedBlog
    });

  } catch (error) {
    res.status(500).json({success: false, message: 'Error creating blog post', error: error.message});
  }
});

router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });

    res.status(200).json({success: true, count: blogs.length, data: blogs
    });

  } catch (error) {
    res.status(500).json({success: false, message: 'Error retrieving blog posts', error: error.message
    });
  }
});

router.get('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({success: false, message: 'Blog post not found'
      });
    }

    res.status(200).json({success: true, data: blog
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({success: false, message: 'Invalid blog ID format'
      });
    }

    res.status(500).json({success: false, message: 'Error retrieving blog post', error: error.message
    });
  }
});

router.put('/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body, author } = req.body;

    if (!title && !body && !author) {
      return res.status(400).json({success: false, message: 'Please provide at least one field to update'
      });
    }

    const updateData = {};
    if (title) updateData.title = title;
    if (body) updateData.body = body;
    if (author) updateData.author = author;

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: updatedBlog
    });

  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID format'
      });
    }

    res.status(500).json({success: false, message: 'Error updating blog post', error: error.message
    });
  }
});


router.delete('/blogs/:id', async (req, res) => {
  try {

    const { id } = req.params;


    const deletedBlog = await Blog.findByIdAndDelete(id);


    if (!deletedBlog) {
      return res.status(404).json({success: false, message: 'Blog post not found'
      });
    }


    res.status(200).json({success: true, message: 'Blog post deleted successfully', data: deletedBlog
    });

  } catch (error) {

    if (error.kind === 'ObjectId') {
      return res.status(400).json({success: false, message: 'Invalid blog ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error deleting blog post',
      error: error.message
    });
  }
});

module.exports = router;