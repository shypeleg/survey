import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

const DATA_FILE = path.join(process.cwd(), 'data', 'responses.json');

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
    // Reset data by writing an empty array to the file
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    
    return res.status(200).json({ 
      success: true, 
      message: 'Survey data has been reset successfully' 
    });
  } catch (error) {
    console.error('Error resetting survey data:', error);
    return res.status(500).json({ error: 'Failed to reset survey data' });
  }
}