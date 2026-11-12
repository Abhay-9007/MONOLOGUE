import mongoose from 'mongoose';
const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, default: '', maxlength: 3000 },
  category: { type: String, default: 'Personal' },
  priority: { type: String, enum: ['Low','Medium','High','Urgent'], default: 'Medium' },
  status: { type: String, enum: ['Not Started','In Progress','Completed','On Hold'], default: 'Not Started' },
  startDate: { type: Date, default: null },
  dueDate: { type: Date, default: null },
  startTime: String,
  endTime: String,
  estimatedDuration: { type: Number, min: 0, default: 30 },
  tags: [String],
  subtasks: [{ title: String, completed: { type: Boolean, default: false }, estimatedMinutes: Number }],
  reminder: { type: Date, default: null },
  completedAt: { type: Date, default: null }
}, { timestamps: true });
taskSchema.index({ userId: 1, dueDate: 1 });
export default mongoose.model('Task', taskSchema);
