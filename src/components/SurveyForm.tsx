import { useState } from 'react';
import { useRouter } from 'next/router';
import ChefCard from './ChefCard';
import { CHEFS, ROLES } from '@/utils/constants';
import { ChefRole, SurveyState } from '@/utils/types';

export default function SurveyForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const [surveyState, setSurveyState] = useState<SurveyState>({
    chefs: CHEFS,
    assignments: Object.fromEntries(CHEFS.map(chef => [chef.id, null])),
    usedRoles: [],
  });

  const assignRole = (chefId: string, role: ChefRole) => {
    // Check if this role is already assigned to another chef
    const currentChefWithThisRole = Object.entries(surveyState.assignments)
      .find(([id, assignedRole]) => id !== chefId && assignedRole === role);
      
    const updatedAssignments = { ...surveyState.assignments };
    
    // Remove the role from the chef that currently has it (if any)
    if (currentChefWithThisRole) {
      updatedAssignments[currentChefWithThisRole[0]] = null;
    }
    
    // If this chef already has a role, remove it from usedRoles
    const currentRole = updatedAssignments[chefId];
    let updatedUsedRoles = [...surveyState.usedRoles];
    
    if (currentRole) {
      updatedUsedRoles = updatedUsedRoles.filter(r => r !== currentRole);
    }
    
    // Add the new role if it's not already in usedRoles
    if (!updatedUsedRoles.includes(role)) {
      updatedUsedRoles.push(role);
    }
    
    // Assign the new role to this chef
    updatedAssignments[chefId] = role;
    
    setSurveyState({
      ...surveyState,
      assignments: updatedAssignments,
      usedRoles: updatedUsedRoles,
    });
  };

  // Remove a role assignment
  const removeAssignment = (chefId: string) => {
    const currentRole = surveyState.assignments[chefId];
    if (!currentRole) return;
    
    const updatedAssignments = { ...surveyState.assignments };
    updatedAssignments[chefId] = null;
    
    const updatedUsedRoles = surveyState.usedRoles.filter(role => role !== currentRole);
    
    setSurveyState({
      ...surveyState,
      assignments: updatedAssignments,
      usedRoles: updatedUsedRoles,
    });
  };

  // Reset all selections
  const resetSelections = () => {
    setSurveyState({
      ...surveyState,
      assignments: Object.fromEntries(CHEFS.map(chef => [chef.id, null])),
      usedRoles: [],
    });
    setShowConfirmation(false);
  };

  const validateForm = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return false;
    }
    
    const allChefsAssigned = Object.values(surveyState.assignments).every(role => role !== null);
    if (!allChefsAssigned) {
      setError('Please assign a role to each chef');
      return false;
    }
    
    if (surveyState.usedRoles.length !== ROLES.length) {
      setError('Please use each role exactly once');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setShowConfirmation(true);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      // Convert assignments to required format
      const responses = Object.entries(surveyState.assignments).reduce(
        (acc, [chefId, role]) => ({ ...acc, [chefId]: role }), 
        {}
      );
      
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: email || undefined,
          responses,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit survey');
      }
      
      setSubmitted(true);
      setShowConfirmation(false);
      
      // Redirect to thank you page after a short delay
      setTimeout(() => {
        router.push('/thank-you');
      }, 2000);
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while submitting your response. Please try again.');
      setSubmitting(false);
      setShowConfirmation(false);
    }
  };

  if (submitted) {
    return (
      <div className="card text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Thank you for your submission!</h2>
        <p className="mb-4">Your responses have been recorded.</p>
        <p>Redirecting you to the thank you page...</p>
      </div>
    );
  }

  // Confirmation dialog
  if (showConfirmation) {
    return (
      <div className="card py-6 px-8">
        <h2 className="text-xl font-bold mb-4 text-center">Confirm Your Choices</h2>
        
        <div className="mb-6">
          <p className="font-medium mb-2">Your Information:</p>
          <p>Name: {name}</p>
          {email && <p>Email: {email}</p>}
        </div>
        
        <div className="mb-6">
          <p className="font-medium mb-2">Your Assignments:</p>
          <ul className="space-y-2">
            {CHEFS.map(chef => (
              <li key={chef.id} className="flex justify-between">
                <span>{chef.name}</span>
                <span className="font-medium">
                  {ROLES.find(r => r.id === surveyState.assignments[chef.id])?.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => setShowConfirmation(false)}
            className="btn bg-gray-200 hover:bg-gray-300 text-gray-800"
            disabled={submitting}
          >
            Edit Choices
          </button>
          <button
            onClick={handleSubmit}
            className={`btn ${submitting ? 'btn-disabled' : 'btn-primary'}`}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Confirm & Submit'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handlePreSubmit} className="space-y-8">
      <div className="card space-y-4">
        <h2 className="text-xl font-semibold mb-4">Your Information</h2>
        
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input w-full"
            required
            disabled={submitting}
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email (Optional)
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input w-full"
            disabled={submitting}
          />
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Chef Assignments</h2>
          <button 
            type="button"
            onClick={resetSelections}
            className="text-sm text-blue-600 hover:text-blue-800"
            disabled={surveyState.usedRoles.length === 0 || submitting}
          >
            Reset All Selections
          </button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {CHEFS.map((chef) => (
            <ChefCard
              key={chef.id}
              chef={chef}
              assignedRole={surveyState.assignments[chef.id]}
              onAssignRole={(role) => assignRole(chef.id, role)}
              onRemoveAssignment={() => removeAssignment(chef.id)}
              usedRoles={surveyState.usedRoles}
              disabled={submitting}
            />
          ))}
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div className="flex justify-center">
        <button 
          type="submit" 
          disabled={submitting}
          className={`btn ${submitting ? 'btn-disabled' : 'btn-primary'} text-lg py-3 px-8`}
        >
          Review Choices
        </button>
      </div>
    </form>
  );
}