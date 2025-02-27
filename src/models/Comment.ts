import mongoose, { Schema } from 'mongoose';

// Create schema for comments
const CommentSchema = new Schema({
  author: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  parentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Comment',
    default: null
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add virtual field for replies
CommentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentId'
});

// Ensure virtuals are included when converting to JSON
CommentSchema.set('toJSON', { virtuals: true });
CommentSchema.set('toObject', { virtuals: true });

// Use existing model if available (for hot reloading in development)
export default mongoose.models.Comment || 
  mongoose.model('Comment', CommentSchema);