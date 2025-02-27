import { SurveyResponse } from '@/utils/types';
import { CHEFS, ROLES } from '@/utils/constants';
import { formatDate, getRoleLabel } from '@/utils/surveyHelpers';

interface ResultsTableProps {
  responses: SurveyResponse[];
  onExport: () => void;
}

export default function ResultsTable({ responses, onExport }: ResultsTableProps) {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">All Responses</h2>
      
      {responses.length === 0 ? (
        <p className="text-gray-500 py-4 text-center">No responses yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                {CHEFS.map((chef) => (
                  <th key={chef.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {chef.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {responses.map((response) => (
                <tr key={response.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {response.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {response.email || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(response.timestamp)}
                  </td>
                  {CHEFS.map((chef) => (
                    <td key={chef.id} className="px-6 py-4 whitespace-nowrap">
                      {getRoleLabel(response.responses[chef.id]) || '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div className="mt-6 flex justify-end">
        <button 
          onClick={onExport} 
          className="btn btn-primary"
          disabled={responses.length === 0}
        >
          Export to CSV
        </button>
      </div>
    </div>
  );
}