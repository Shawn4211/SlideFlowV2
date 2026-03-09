import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const username = credentials.username as string;
        const password = credentials.password as string;

        if (!username || !password) {
          return null;
        }

        try {
          const supabase = createClient(supabaseUrl, supabaseAnonKey);

          // Look up the user's email by username via the database function
          const { data: email, error: lookupError } = await supabase.rpc(
            "get_email_by_username",
            { lookup_username: username }
          );

          if (lookupError || !email) {
            return null;
          }

          // Verify the password via Supabase Auth
          const { data: authData, error: authError } =
            await supabase.auth.signInWithPassword({ email, password });

          if (authError || !authData.user) {
            return null;
          }

          // Fetch the user's profile from credentials table
          const { data: profile } = await supabase
            .from("credentials")
            .select("first_name, last_name")
            .eq("username", username)
            .single();

          const name = profile
            ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || username
            : username;

          return {
            id: authData.user.id,
            email: authData.user.email,
            name,
          };
        } catch {
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
