import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import SurveyResponseModel from '@/models/SurveyResponse';
import { validateSubmission } from '@/utils/validation';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('API: /api/submit called');
  
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Connect to database
    console.log('Connecting to MongoDB for submit...');
    await dbConnect();
    console.log('Connected to MongoDB successfully for submit');
    
    const { name, email, responses } = req.body;
    console.log(`Processing submission from: ${name}`);
    
    // Basic validation
    if (!name || !responses) {
      console.log('Submission missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Advanced validation
    console.log('Validating submission data...');
    const validationResult = validateSubmission(name, responses);
    if (!validationResult.valid) {
      console.log('Validation failed:', validationResult.error);
      return res.status(400).json({ error: validationResult.error });
    }
    
    // Create a new survey response in the database
    console.log('Creating new response in database...');
    const newResponse = await SurveyResponseModel.create({
      name,
      email,
      timestamp: Date.now(),
      responses,
    });
    
    console.log('Survey response saved successfully with ID:', newResponse._id);
    return res.status(200).json({ 
      success: true, 
      id: newResponse._id.toString() 
    });
  } catch (error) {
    console.error('Error saving survey response:', error);
    return res.status(500).json({ 
      error: 'Failed to save response',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}