const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const answerRoutes = require('./routes/answerRoutes');



const app = express();


app.use(cors({
  origin: 'https://amnesia-qa.vercel.app',
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api', questionRoutes);
app.use('/api', answerRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'defined' : 'undefined');
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
  });