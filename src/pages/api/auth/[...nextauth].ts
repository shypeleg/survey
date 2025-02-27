import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';

// Extend the session user type to include id
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

// This would typically be stored securely, not hardcoded
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'surveyresults2024';

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          console.log('Auth: Attempting authentication');
          
          if (!credentials) {
            console.log('Auth: No credentials provided');
            return null;
          }
          
          const { username, password } = credentials;
          
          console.log(`Auth: Login attempt with username: ${username}`);
          
          // Simple credential validation
          if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            console.log('Auth: Login successful');
            return { id: '1', name: 'Administrator', email: 'admin@example.com' };
          }
          
          console.log('Auth: Invalid credentials');
          return null;
        } catch (error) {
          console.error('Auth: Error in authorize callback:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          console.log('Auth: Adding user to token');
          token.id = user.id;
        }
        return token;
      } catch (error) {
        console.error('Auth: Error in jwt callback:', error);
        return token;
      }
    },
    async session({ session, token }) {
      try {
        if (token && session.user) {
          console.log('Auth: Adding token to session');
          session.user.id = token.id as string;
        }
        return session;
      } catch (error) {
        console.error('Auth: Error in session callback:', error);
        return session;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'chef-survey-secret-key',
  debug: true,
  logger: {
    error(code, metadata) {
      console.error(`Auth error (${code}):`, metadata);
    },
    warn(code) {
      console.warn(`Auth warning (${code})`);
    },
    debug(code, metadata) {
      console.log(`Auth debug (${code}):`, metadata);
    }
  }
};

export default NextAuth(authOptions);