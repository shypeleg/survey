import mongoose, { Schema } from 'mongoose';

// Create schema for survey responses
const SurveyResponseSchema = new Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: false 
  },
  timestamp: { 
    type: Number, 
    default: () => Date.now() 
  },
  responses: {
    type: Map,
    of: String,
    required: true
  }
}, {
  timestamps: true
});

// Use existing model if available (for hot reloading in development)
export default mongoose.models.SurveyResponse || 
  mongoose.model('SurveyResponse', SurveyResponseSchema);