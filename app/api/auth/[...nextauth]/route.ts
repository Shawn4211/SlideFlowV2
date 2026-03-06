import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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

        const adminAccounts: Record<string, { password: string; id: string; name: string }> = {
          "Admin": { password: "Password1", id: "1", name: "Admin User" },
          "Admin2": { password: "Password2", id: "2", name: "Admin User 2" },
          "Admin3": { password: "Password3", id: "3", name: "Admin User 3" },
          "Admin4": { password: "Password4", id: "4", name: "Admin User 4" },
          "Admin5": { password: "Password5", id: "5", name: "Admin User 5" },
          "Admin6": { password: "Password6", id: "6", name: "Admin User 6" },
        };

        const account = adminAccounts[username];
        if (account && password === account.password) {
          return {
            id: account.id,
            email: `${username.toLowerCase()}@slideflow.app`,
            name: account.name,
          };
        }

        return null;
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
