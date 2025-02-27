import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import dbConnect from '@/lib/mongodb';
import SurveyResponseModel from '@/models/SurveyResponse';
import CommentModel from '@/models/Comment';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  // Check if user is authenticated
  const session = await getServerSession(req, res, authOptions);
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    // Connect to database
    await dbConnect();
    
    // Reset data by deleting all responses
    await SurveyResponseModel.deleteMany({});
    
    // Optionally, also reset all comments
    await CommentModel.deleteMany({});
    
    return res.status(200).json({ 
      success: true, 
      message: 'Survey data has been reset successfully' 
    });
  } catch (error) {
    console.error('Error resetting survey data:', error);
    return res.status(500).json({ error: 'Failed to reset survey data' });
  }
}