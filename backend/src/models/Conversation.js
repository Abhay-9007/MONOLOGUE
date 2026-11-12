import mongoose from 'mongoose';
const conversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, default: 'New conversation' },
  messages: [{ role: { type: String, enum: ['user','assistant'], required: true }, content: { type: String, required: true }, createdAt: { type: Date, default: Date.now } }]
}, { timestamps: true });
export default mongoose.model('Conversation', conversationSchema);
