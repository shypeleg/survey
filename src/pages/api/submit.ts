import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import SurveyResponseModel from '@/models/SurveyResponse';
import { validateSubmission } from '@/utils/validation';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Connect to database
  await dbConnect();
  
  try {
    const { name, email, responses } = req.body;
    
    // Basic validation
    if (!name || !responses) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Advanced validation
    const validationResult = validateSubmission(name, responses);
    if (!validationResult.valid) {
      return res.status(400).json({ error: validationResult.error });
    }
    
    // Create a new survey response in the database
    const newResponse = await SurveyResponseModel.create({
      name,
      email,
      timestamp: Date.now(),
      responses,
    });
    
    return res.status(200).json({ 
      success: true, 
      id: newResponse._id.toString() 
    });
  } catch (error) {
    console.error('Error saving survey response:', error);
    return res.status(500).json({ error: 'Failed to save response' });
  }
}