import { PrismaAdapter } from '@auth/prisma-adapter'
import NextAuth, { DefaultSession } from 'next-auth'
import { client } from './prisma'
import authConfig from './auth.config';

declare module "next-auth" {
    interface Session extends DefaultSession {
      user: {
        id: string;
        credits: number;
      } & DefaultSession["user"];
    }
  }

export const {handlers, signIn, signOut, auth} = NextAuth({
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        jwt: async ({token}) => {
            const db_user = await client.user.findFirst({
                where: {
                    email: token.email,
                },
            })
            if (db_user) {
                token.id = db_user.id
                token.credits = db_user.credits
            }
            return token
        },
        session: ({session, token}) => {
            if (token) {
                session.user.id = token.id as string
                session.user.name = token.name as string
                session.user.email = token.email as string
                session.user.image = token.picture
                session.user.credits = token.credits as number
            }
            return session
        },
    },
    adapter: PrismaAdapter(client),
    secret: process.env.AUTH_SECRET as string,
    ...authConfig
})
