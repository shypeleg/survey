import Layout from '@/components/Layout';
import SurveyForm from '@/components/SurveyForm';

export default function Home() {
  return (
    <Layout title="Chef Role Survey" description="Assign roles to your favorite chefs">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">Chef Role Survey</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Assign each chef exactly one role, and use each role exactly once.
          Choose wisely!
        </p>
      </header>
      
      <SurveyForm />
    </Layout>
  );
}