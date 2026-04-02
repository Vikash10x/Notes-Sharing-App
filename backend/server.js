const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const Category = require('./models/Category');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/notes', require('./routes/notesRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: '📚 Notes Sharing API is running!' });
});

// Seed default categories
const seedCategories = async () => {
  const categories = ['Programming', 'DBMS', 'Operating System', 'Aptitude', 'Mathematics', 'Data Structures', 'Networks'];
  for (const name of categories) {
    const exists = await Category.findOne({ name });
    if (!exists) {
      await Category.create({ name });
      console.log(`✅ Seeded category: ${name}`);
    }
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Seed after connection is ready
const mongoose_conn = require('mongoose').connection;
mongoose_conn.once('open', async () => {
  try {
    await seedCategories();
  } catch (e) {
    console.error('Seeding error:', e.message);
  }
});
