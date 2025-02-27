import { ChefRole } from './types';
import { CHEFS, ROLES } from './constants';

/**
 * Validates that the survey submission is correct
 */
export function validateSubmission(name: string, responses: Record<string, ChefRole>) {
  // Check if name is provided
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return { valid: false, error: 'Name is required' };
  }
  
  // Check if all chefs have been assigned a role
  const chefIds = CHEFS.map(chef => chef.id);
  const responseChefIds = Object.keys(responses);
  
  // Check if all chefs are included
  const missingChefs = chefIds.filter(id => !responseChefIds.includes(id));
  if (missingChefs.length > 0) {
    return { 
      valid: false, 
      error: `Missing assignments for chefs: ${missingChefs.join(', ')}` 
    };
  }
  
  // Check for invalid chef IDs
  const invalidChefIds = responseChefIds.filter(id => !chefIds.includes(id));
  if (invalidChefIds.length > 0) {
    return { 
      valid: false, 
      error: `Invalid chef IDs: ${invalidChefIds.join(', ')}` 
    };
  }
  
  // Check if all roles are valid
  const validRoles = ROLES.map(role => role.id);
  const responseRoles = Object.values(responses);
  
  const invalidRoles = responseRoles.filter(role => !validRoles.includes(role));
  if (invalidRoles.length > 0) {
    return { 
      valid: false, 
      error: `Invalid roles: ${invalidRoles.join(', ')}` 
    };
  }
  
  // Check if each role is used exactly once
  const roleCounts: Record<string, number> = {};
  responseRoles.forEach(role => {
    roleCounts[role] = (roleCounts[role] || 0) + 1;
  });
  
  const multipleRoles = Object.entries(roleCounts)
    .filter(([_, count]) => count > 1)
    .map(([role]) => role);
    
  if (multipleRoles.length > 0) {
    return { 
      valid: false, 
      error: `Roles used multiple times: ${multipleRoles.join(', ')}` 
    };
  }
  
  // Check if all roles are used
  const missingRoles = validRoles.filter(role => !responseRoles.includes(role));
  if (missingRoles.length > 0) {
    return { 
      valid: false, 
      error: `Missing roles: ${missingRoles.join(', ')}` 
    };
  }
  
  return { valid: true };
}