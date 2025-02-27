import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { SurveyResponse, SurveyStats, ChefRole } from '@/utils/types';
import { CHEFS, ROLES } from '@/utils/constants';

const DATA_FILE = path.join(process.cwd(), 'data', 'responses.json');

// Calculate stats from survey responses
const calculateStats = (responses: SurveyResponse[]): SurveyStats => {
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
      const role = response.responses[chef.id] as ChefRole;
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
    // Check if data file exists
    if (!fs.existsSync(DATA_FILE)) {
      return res.status(200).json({ 
        responses: [],
        stats: {
          totalResponses: 0,
          chefRoleCounts: CHEFS.reduce((acc, chef) => ({
            ...acc,
            [chef.id]: {
              ski: 0,
              cook: 0,
              kill: 0,
            }
          }), {})
        }
      });
    }
    
    // Read responses from file
    const responseData = fs.readFileSync(DATA_FILE, 'utf8');
    const responses: SurveyResponse[] = responseData ? JSON.parse(responseData) : [];
    
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
    
    // Admin access - return complete data including individual responses
    return res.status(200).json({ responses, stats });
  } catch (error) {
    console.error('Error fetching survey results:', error);
    return res.status(500).json({ error: 'Failed to fetch results' });
  }
}