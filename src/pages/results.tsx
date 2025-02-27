import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { CHEFS } from '@/utils/constants';
import { SurveyResponse, SurveyStats } from '@/utils/types';
import { createCsvFromResponses, downloadCsv, getMostPopularRoleForChef } from '@/utils/surveyHelpers';
import Layout from '@/components/Layout';
import ChefChartCard from '@/components/ChefChartCard';
import ResultsTable from '@/components/ResultsTable';
import Link from 'next/link';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Results() {
  const { data: session } = useSession();
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [stats, setStats] = useState<SurveyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/results');
        if (!res.ok) {
          throw new Error('Failed to fetch results');
        }
        
        const data = await res.json();
        setResponses(data.responses);
        setStats(data.stats);
      } catch (err) {
        console.error(err);
        setError('Failed to load survey results');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const handleExport = () => {
    const csvContent = createCsvFromResponses(responses);
    downloadCsv(csvContent, 'chef-survey-results.csv');
  };

  // Generate summary text about most popular roles
  const getMostPopularRoleSummary = () => {
    if (!stats) return null;
    
    const mostPopularRoles = CHEFS.map(chef => {
      const mostPopular = getMostPopularRoleForChef(chef.id, stats.chefRoleCounts);
      return { chef, ...mostPopular };
    }).filter(result => result.role);
    
    if (mostPopularRoles.length === 0) return null;
    
    return (
      <div className="mt-4 text-sm text-gray-600">
        <h3 className="font-medium mb-2">Most Popular Assignments:</h3>
        <ul className="list-disc pl-5 space-y-1">
          {mostPopularRoles.map(item => (
            <li key={item.chef.id}>
              {item.chef.name}: {item.role === 'ski' ? 'Ski/Hang With' : item.role === 'cook' ? 'Cook Dinners' : 'Kill'}
              {' '}({item.count} vote{item.count !== 1 ? 's' : ''})
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const handleReset = async () => {
    if (!session) {
      alert('You need to be logged in as admin to reset data');
      return;
    }
    
    if (!confirm('Are you sure you want to reset all survey data? This action cannot be undone.')) {
      return;
    }
    
    try {
      setLoading(true);
      const res = await fetch('/api/reset', {
        method: 'POST',
      });
      
      if (!res.ok) {
        throw new Error('Failed to reset survey data');
      }
      
      // Refresh the data
      const dataRes = await fetch('/api/results');
      if (!dataRes.ok) {
        throw new Error('Failed to fetch results');
      }
      
      const data = await dataRes.json();
      setResponses(data.responses);
      setStats(data.stats);
      
      alert('Survey data has been reset successfully');
    } catch (err) {
      console.error(err);
      setError('Failed to reset survey data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout 
      title="Survey Results - Chef Role Survey" 
      description="View chef survey results"
      maxWidth="max-w-6xl"
    >
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Survey Results</h1>
        
        <div className="space-x-4">
          {session ? (
            <>
              <button 
                onClick={handleReset}
                className="text-red-500 hover:text-red-700 mr-4"
                disabled={loading}
              >
                Reset Data
              </button>
              <button 
                onClick={() => signOut()} 
                className="text-blue-500 hover:text-blue-700"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/" className="text-blue-500 hover:text-blue-700 mr-4">
                Back to Survey
              </Link>
              <button 
                onClick={() => signIn()} 
                className="text-gray-500 hover:text-gray-700"
              >
                Admin Login
              </button>
            </>
          )}
        </div>
      </header>
      
      {loading ? (
        <div className="text-center py-12">Loading results...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      ) : (
        <>
          <div className="card mb-8">
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <p className="text-lg">
              <span className="font-medium">Total Responses:</span>{' '}
              {stats?.totalResponses || 0}
            </p>
            
            {getMostPopularRoleSummary()}
          </div>
          
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {CHEFS.map((chef) => (
              <ChefChartCard 
                key={chef.id} 
                chef={chef} 
                counts={stats?.chefRoleCounts[chef.id] || {}}
              />
            ))}
          </div>
          
          {session && (
            <ResultsTable 
              responses={responses} 
              onExport={handleExport} 
            />
          )}
        </>
      )}
    </Layout>
  );
}