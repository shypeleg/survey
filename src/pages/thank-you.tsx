import Link from 'next/link';
import Layout from '@/components/Layout';

export default function ThankYou() {
  return (
    <Layout 
      title="Thank You - Chef Role Survey" 
      description="Thank you for participating in our chef survey"
    >
      <div className="flex items-center justify-center py-12">
        <div className="max-w-md w-full space-y-8 text-center">
          <h1 className="text-3xl font-bold mb-6">Thank You!</h1>
          
          <div className="card">
            <p className="text-lg mb-4">
              Your survey response has been recorded successfully.
            </p>
            
            <p className="mb-8">
              We appreciate your participation in our chef survey!
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
              <Link href="/results" className="btn btn-secondary">
                View Results
              </Link>
              
              <Link href="/" className="btn btn-primary">
                Return to Survey
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}