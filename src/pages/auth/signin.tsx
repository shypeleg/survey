import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const { callbackUrl } = router.query;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Username and password are required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        username,
        password,
      });
      
      if (result?.error) {
        setError('Invalid username or password');
        setLoading(false);
      } else {
        router.push(callbackUrl ? callbackUrl as string : '/results');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setError('An error occurred during sign in');
      setLoading(false);
    }
  };

  return (
    <Layout title="Sign In - Chef Role Survey" description="Sign in to view survey results">
      <div className="flex items-center justify-center py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-6">Sign In</h1>
            <p className="text-gray-600">
              Enter your credentials to access the survey results
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="card space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="username" className="block mb-1 font-medium">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input w-full"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block mb-1 font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input w-full"
                required
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full btn ${loading ? 'btn-disabled' : 'btn-primary'}`}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}