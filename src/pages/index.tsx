import Layout from '@/components/Layout';
import SurveyForm from '@/components/SurveyForm';
import Link from 'next/link';

export default function Home() {
  return (
    <Layout title="Chef Role Survey" description="Assign roles to your favorite chefs">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Chef Role Survey</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-2">The Chef Game: Ski/Cook/Kill</h2>
          <p className="text-gray-700 mb-2">
            This is a fun game where you have to make tough choices! You are given three famous Israeli chefs (Assaf Granit, Yossi Shitrit, and Moshik Roth) and three actions:
          </p>
          <ul className="list-disc pl-5 text-gray-700 text-left mb-2">
            <li><strong>Ski/Hang With:</strong> Which chef would you want to spend time with?</li>
            <li><strong>Cook Dinners:</strong> Which chef would you want to cook all your meals?</li>
            <li><strong>Kill:</strong> Which chef would you eliminate? (It's just a game!)</li>
          </ul>
          <p className="text-gray-700 mb-2">
            The rules are simple: you must assign each chef to exactly one action, and each action must be used exactly once. No duplicates allowed!
          </p>
          <p className="text-gray-700">
            After submitting, you'll be able to see how your choices compare with others in the <Link href="/results" className="text-blue-600 hover:underline">results page</Link>.
          </p>
        </div>
        
        <p className="text-gray-600 max-w-2xl mx-auto mb-2">
          Assign each chef exactly one role, and use each role exactly once.
          Choose wisely!
        </p>
        
        <Link href="/results" className="text-blue-500 hover:text-blue-700">
          View current results
        </Link>
      </header>
      
      <SurveyForm />
    </Layout>
  );
}