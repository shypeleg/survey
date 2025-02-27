import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { SurveyResponse } from '@/utils/types';
import { validateSubmission } from '@/utils/validation';

const DATA_FILE = path.join(process.cwd(), 'data', 'responses.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
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
    
    // Generate a new survey response
    const newResponse: SurveyResponse = {
      id: uuidv4(),
      name,
      email,
      timestamp: Date.now(),
      responses,
    };
    
    // Ensure data directory exists
    ensureDataDir();
    
    // Read existing responses
    const responseData = fs.readFileSync(DATA_FILE, 'utf8');
    const existingResponses: SurveyResponse[] = responseData ? JSON.parse(responseData) : [];
    
    // Add new response
    existingResponses.push(newResponse);
    
    // Write updated responses back to file
    fs.writeFileSync(DATA_FILE, JSON.stringify(existingResponses, null, 2));
    
    return res.status(200).json({ success: true, id: newResponse.id });
  } catch (error) {
    console.error('Error saving survey response:', error);
    return res.status(500).json({ error: 'Failed to save response' });
  }
}