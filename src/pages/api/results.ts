import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { SurveyStats, ChefRole } from '@/utils/types';
import { CHEFS } from '@/utils/constants';
import dbConnect from '@/lib/mongodb';
import SurveyResponseModel from '@/models/SurveyResponse';

// Calculate stats from survey responses
const calculateStats = (responses: any[]): SurveyStats => {
  console.log(`Calculating stats for ${responses.length} responses`);
  
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
    try {
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
    } catch (err) {
      console.error('Error processing response:', err, response);
    }
  });
  
  return stats;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('API: /api/results called');
  
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Connect to database
    console.log('Connecting to MongoDB...');
    await dbConnect();
    console.log('Connected to MongoDB successfully');
    
    // Default empty responses and stats in case of error
    let responses: any[] = [];
    let stats: SurveyStats = {
      totalResponses: 0,
      chefRoleCounts: {}
    };
    
    // Initialize empty stats
    CHEFS.forEach(chef => {
      stats.chefRoleCounts[chef.id] = {
        ski: 0,
        cook: 0,
        kill: 0,
      };
    });
    
    try {
      // Fetch responses from database
      console.log('Fetching survey responses from MongoDB...');
      responses = await SurveyResponseModel.find({}).lean();
      console.log(`Found ${responses.length} responses`);
      
      // Calculate statistics
      stats = calculateStats(responses);
      console.log('Statistics calculated successfully');
    } catch (dbError) {
      console.error('Database error while fetching responses:', dbError);
      // Continue with empty responses/default stats
    }
    
    // Check if user is authenticated - only return full response data to authenticated users
    let session = null;
    try {
      console.log('Checking user session...');
      session = await getServerSession(req, res, authOptions);
      console.log('Session check result:', session ? 'Authenticated' : 'Not authenticated');
    } catch (sessionError) {
      console.error('Error checking session:', sessionError);
      // Continue with null session
    }
    
    if (!session) {
      // Public access - only return stats, not individual responses
      console.log('Returning public data (stats only)');
      return res.status(200).json({ 
        responses: [], // Empty array for privacy
        stats 
      });
    }
    
    // Format responses to match expected format in frontend
    console.log('Formatting responses for admin view');
    const formattedResponses = responses.map(response => {
      try {
        return {
          id: (response?._id?.toString()) || 'unknown',
          name: response?.name || 'unknown',
          email: response?.email || '',
          timestamp: response?.timestamp || Date.now(),
          responses: response?.responses || {},
          createdAt: response?.createdAt || null,
          updatedAt: response?.updatedAt || null
        };
      } catch (err) {
        console.error('Error formatting response:', err, response);
        return null;
      }
    }).filter(Boolean); // Remove null entries
    
    // Admin access - return complete data including individual responses
    console.log('Returning admin data (stats + responses)');
    return res.status(200).json({ 
      responses: formattedResponses, 
      stats 
    });
  } catch (error) {
    console.error('Error in results API handler:', error);
    
    // Return default empty data structure on error
    const defaultStats: SurveyStats = {
      totalResponses: 0,
      chefRoleCounts: {}
    };
    
    // Initialize empty stats
    CHEFS.forEach(chef => {
      defaultStats.chefRoleCounts[chef.id] = {
        ski: 0,
        cook: 0,
        kill: 0,
      };
    });
    
    return res.status(200).json({ 
      error: 'Failed to fetch results, showing default empty data',
      responses: [],
      stats: defaultStats
    });
  }
}