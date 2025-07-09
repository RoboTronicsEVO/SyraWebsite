import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/mongodb';
import User, { IUser } from '@/models/user.model';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'user@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Ensure database connection
        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email }).select('+password') as IUser | null;

        if (!user) return null;

        const isMatch = await user.comparePassword(credentials.password);
        if (!isMatch) return null;

        // Only allow verified users or admin/school-admin
        if (!user.verified && user.role !== 'admin' && user.role !== 'school-admin') {
          // Throw a custom error for NextAuth
          throw new Error('not_verified');
        }

        return { 
          id: (user as any)._id.toString(), 
          name: user.name, 
          email: user.email, 
          image: user.image || null,
          role: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: '/signin',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      // If user is logging in, add id and role
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.verified = (user as any).verified;
      } else if (token?.email && !token.role) {
        // If token exists but no role, fetch from DB
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) token.role = dbUser.role;
        if (dbUser) token.verified = dbUser.verified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).verified = token.verified;
      }
      return session;
    },
  },
};