import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import app from './src/app.js';

// console.log("MongoDB URI:", !!process.env.MONGODB_URI);
// console.log("JWT Secret:", !!process.env.JWT_SECRET);

const PORT = process.env.PORT || 5000;
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error('MONGODB_URI and JWT_SECRET are required.');
  process.exit(1);
}
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`MONOLOGUE API running on port ${PORT}`));
  })
  .catch((err) => { console.error('MongoDB connection failed:', err.message); process.exit(1); });
