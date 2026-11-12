import mongoose from 'mongoose';
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  otpHash: { type: String, required: true },
  purpose: { type: String, enum: ['verify','reset'], required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  attempts: { type: Number, default: 0 }
}, { timestamps: true });
export default mongoose.model('Otp', otpSchema);
