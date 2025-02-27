export type ChefRole = 'ski' | 'cook' | 'kill';

export interface Chef {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
}

export interface SurveyResponse {
  id: string;
  name: string;
  email?: string;
  timestamp: number;
  responses: Record<string, ChefRole>; // chefId -> role
}

export interface SurveyState {
  chefs: Chef[];
  assignments: Record<string, ChefRole | null>; // chefId -> role
  usedRoles: ChefRole[];
}

export interface SurveyStats {
  totalResponses: number;
  chefRoleCounts: Record<string, Record<ChefRole, number>>; // chefId -> role -> count
}