import type { NextAuthOptions } from "next-auth"
import type { JWT } from "next-auth/jwt"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      username?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
    username?: string
    userId?: string
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    {
      id: "twitter",
      name: "X (Twitter)",
      type: "oauth",
      version: "2.0",
      authorization: {
        url: "https://twitter.com/i/oauth2/authorize",
        params: {
          scope: "tweet.read users.read like.read offline.access",
          code_challenge_method: "S256",
        },
      },
      token: "https://api.twitter.com/2/oauth2/token",
      userinfo: {
        url: "https://api.twitter.com/2/users/me",
        params: {
          "user.fields": "id,name,username,profile_image_url",
        },
      },
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      profile(profile: any) {
        return {
          id: profile.data.id,
          name: profile.data.name,
          username: profile.data.username,
          image: profile.data.profile_image_url,
        }
      },
    },
  ],
  callbacks: {
    async jwt({ token, account, profile }: { token: JWT; account?: any; profile?: any }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.userId = account.providerAccountId
      }
      if (profile) {
        token.username = profile.data?.username

        // Update user with username if not set
        if (token.sub && profile.data?.username) {
          await prisma.user
            .update({
              where: { id: token.sub },
              data: { username: profile.data.username },
            })
            .catch(() => {
              // Ignore errors if user doesn't exist yet
            })
        }
      }
      return token
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.accessToken = token.accessToken
      if (session.user) {
        session.user.id = token.sub as string
        session.user.username = token.username
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}
