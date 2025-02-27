import { ChefRole, SurveyResponse } from './types';
import { ROLES, CHEFS } from './constants';

/**
 * Gets the role label from its ID
 */
export function getRoleLabel(roleId: ChefRole): string {
  const role = ROLES.find(r => r.id === roleId);
  return role ? role.label : '';
}

/**
 * Gets chef name from chef ID
 */
export function getChefName(chefId: string): string {
  const chef = CHEFS.find(c => c.id === chefId);
  return chef ? chef.name : '';
}

/**
 * Formats date from timestamp
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Creates CSV data from survey responses
 */
export function createCsvFromResponses(responses: SurveyResponse[]): string {
  const headers = ['Name', 'Email', 'Date', ...CHEFS.map(chef => chef.name)];
  
  const rows = responses.map(response => [
    response.name,
    response.email || '',
    formatDate(response.timestamp),
    ...CHEFS.map(chef => getRoleLabel(response.responses[chef.id] as ChefRole))
  ]);
  
  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}

/**
 * Downloads content as a CSV file
 */
export function downloadCsv(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Gets the most popular role for a chef
 */
export function getMostPopularRoleForChef(
  chefId: string, 
  roleCounts: Record<string, Record<ChefRole, number>>
): { role: ChefRole, count: number } | null {
  if (!roleCounts[chefId]) return null;
  
  const counts = roleCounts[chefId];
  let highestCount = 0;
  let mostPopularRole: ChefRole | null = null;
  
  Object.entries(counts).forEach(([role, count]) => {
    if (count > highestCount) {
      highestCount = count;
      mostPopularRole = role as ChefRole;
    }
  });
  
  return mostPopularRole ? { role: mostPopularRole, count: highestCount } : null;
}