import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" },
          });
          const user = await res.json();
          if (res.ok && user && user.accessToken) {
            return user;
          }
          return null;
        } catch (e) {
          console.error("Error during credentials authorize", e);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (account && profile) {
        if (account.provider === "google") {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
              method: "POST",
              body: JSON.stringify({
                googleId: profile.sub,
                email: profile.email,
                name: profile.name,
                picture: (profile as any).picture,
              }),
              headers: { "Content-Type": "application/json" },
            });
            const backendUser = await res.json();
            if (res.ok && backendUser.accessToken) {
              token.accessToken = backendUser.accessToken;
              token.refreshToken = backendUser.refreshToken;
            }
          } catch (e) {
            console.error("Error during Google backend auth", e);
          }
        }
      } else if (user) {
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
