import Image from 'next/image';
import { Chef, ChefRole } from '@/utils/types';
import { ROLES } from '@/utils/constants';

interface ChefCardProps {
  chef: Chef;
  assignedRole: ChefRole | null;
  onAssignRole: (role: ChefRole) => void;
  onRemoveAssignment?: () => void;
  usedRoles: ChefRole[];
  disabled?: boolean;
}

export default function ChefCard({ 
  chef, 
  assignedRole, 
  onAssignRole, 
  onRemoveAssignment,
  usedRoles,
  disabled = false
}: ChefCardProps) {
  return (
    <div className="card">
      <div className="mb-4 relative w-full h-48 bg-gray-200 rounded overflow-hidden">
        {chef.imageUrl ? (
          <Image 
            src={chef.imageUrl}
            alt={chef.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            priority
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Chef Image
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium">{chef.name}</h3>
        {assignedRole && onRemoveAssignment && (
          <button 
            type="button"
            onClick={onRemoveAssignment}
            disabled={disabled}
            className="text-xs text-red-600 hover:text-red-800 disabled:text-gray-400"
          >
            Clear
          </button>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mb-4">{chef.description}</p>
      
      {assignedRole ? (
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-600">Current assignment:</p>
          <div className="mt-1 py-2 px-3 bg-green-100 border border-green-300 rounded text-green-800 font-medium">
            {ROLES.find(r => r.id === assignedRole)?.label}
          </div>
        </div>
      ) : (
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-600">No role assigned yet</p>
        </div>
      )}
      
      <div className="space-y-2">
        {ROLES.map((role) => {
          const isAssigned = assignedRole === role.id;
          const isButtonDisabled = disabled || (usedRoles.includes(role.id) && !isAssigned);
          
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onAssignRole(role.id)}
              disabled={isButtonDisabled}
              className={`w-full ${
                isAssigned
                  ? 'bg-green-500 text-white'
                  : isButtonDisabled
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-100 hover:bg-gray-200'
              } py-2 px-3 rounded transition-colors`}
            >
              {role.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}