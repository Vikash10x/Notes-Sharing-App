const Note = require('../models/Note');
const Category = require('../models/Category');
const path = require('path');
const fs = require('fs');

// @desc  Get all notes (with search & category filter)
// @route GET /api/notes
const getNotes = async (req, res) => {
  try {
    const { search, category } = req.query;
    let filter = {};

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      const cat = await Category.findOne({ name: { $regex: `^${category}$`, $options: 'i' } });
      if (cat) filter.categoryId = cat._id;
    }

    const notes = await Note.find(filter)
      .populate('categoryId', 'name')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get notes by current user
// @route GET /api/notes/my
const getMyNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user._id })
      .populate('categoryId', 'name')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Upload a note
// @route POST /api/notes
const createNote = async (req, res) => {
  try {
    const { title, description, categoryId } = req.body;
    if (!title || !description || !categoryId) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const fileURL = `/uploads/${req.file.filename}`;
    const note = await Note.create({
      title,
      description,
      fileURL,
      fileName: req.file.originalname,
      categoryId,
      userId: req.user._id,
    });

    const populated = await note.populate([
      { path: 'categoryId', select: 'name' },
      { path: 'userId', select: 'name email' },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Delete a note
// @route DELETE /api/notes/:id
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this note' });
    }

    // Remove file from disk
    const filePath = path.join(__dirname, '..', note.fileURL);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await note.deleteOne();
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Like or Unlike a note
// @route POST /api/notes/:id/like
const likeNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if user already liked
    const isLiked = note.likes.includes(req.user._id);
    if (isLiked) {
      // Unlike
      note.likes = note.likes.filter((userId) => userId.toString() !== req.user._id.toString());
    } else {
      // Like
      note.likes.push(req.user._id);
    }

    await note.save();
    
    // Populate before sending back so UI has complete data
    const populated = await note.populate([
      { path: 'categoryId', select: 'name' },
      { path: 'userId', select: 'name email' },
    ]);
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Comment on a note
// @route POST /api/notes/:id/comment
const commentNote = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const newComment = {
      user: req.user._id,
      userName: req.user.name,
      text,
    };

    note.comments.push(newComment);
    await note.save();

    const populated = await note.populate([
      { path: 'categoryId', select: 'name' },
      { path: 'userId', select: 'name email' },
    ]);
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getNotes, getMyNotes, createNote, deleteNote, likeNote, commentNote };
