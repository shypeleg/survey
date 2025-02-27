import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { SurveyStats, ChefRole } from '@/utils/types';
import { CHEFS } from '@/utils/constants';
import dbConnect from '@/lib/mongodb';
import SurveyResponseModel from '@/models/SurveyResponse';

// Calculate stats from survey responses
const calculateStats = (responses: any[]): SurveyStats => {
  const stats: SurveyStats = {
    totalResponses: responses.length,
    chefRoleCounts: {},
  };
  
  // Initialize counts for each chef and role
  CHEFS.forEach(chef => {
    stats.chefRoleCounts[chef.id] = {
      ski: 0,
      cook: 0,
      kill: 0,
    };
  });
  
  // Count role assignments for each chef
  responses.forEach(response => {
    CHEFS.forEach(chef => {
      let role;
      
      // Handle both Map and object formats (MongoDB returns as object)
      if (response.responses instanceof Map) {
        role = response.responses.get(chef.id) as ChefRole;
      } else if (response.responses && typeof response.responses === 'object') {
        role = response.responses[chef.id] as ChefRole;
      }
      
      if (role) {
        stats.chefRoleCounts[chef.id][role]++;
      }
    });
  });
  
  return stats;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Connect to database
    await dbConnect();
    
    // Fetch responses from database
    const responses = await SurveyResponseModel.find({}).lean();
    
    // Calculate statistics
    const stats = calculateStats(responses);
    
    // Check if user is authenticated - only return full response data to authenticated users
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      // Public access - only return stats, not individual responses
      return res.status(200).json({ 
        responses: [], // Empty array for privacy
        stats 
      });
    }
    
    // Format responses to match expected format in frontend
    const formattedResponses = responses.map(response => ({
      id: (response as any)._id.toString(),
      name: (response as any).name,
      email: (response as any).email,
      timestamp: (response as any).timestamp,
      responses: (response as any).responses,
      createdAt: (response as any).createdAt,
      updatedAt: (response as any).updatedAt
    }));
    
    // Admin access - return complete data including individual responses
    return res.status(200).json({ 
      responses: formattedResponses, 
      stats 
    });
  } catch (error) {
    console.error('Error fetching survey results:', error);
    return res.status(500).json({ error: 'Failed to fetch results' });
  }
}