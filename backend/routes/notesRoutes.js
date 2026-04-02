const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getNotes, getMyNotes, createNote, deleteNote, likeNote, commentNote } = require('../controllers/notesController');
const { protect } = require('../middleware/authMiddleware');

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, TXT, PPT files are allowed'), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/', getNotes);
router.get('/my', protect, getMyNotes);
router.post('/', protect, upload.single('file'), createNote);
router.delete('/:id', protect, deleteNote);
router.post('/:id/like', protect, likeNote);
router.post('/:id/comment', protect, commentNote);

module.exports = router;
