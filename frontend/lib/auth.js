/* lehetne mondjuk egyéb provider-eket is hozzáadni, pl. GitHub, Facebook, etc. Mentor javaslat hogy gondolkozzak el a token verzión  */

import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { supabaseServer } from './supabase-server'

const isDebug = process.env.NODE_ENV === 'development'

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: isDebug,
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          if (isDebug) console.error('[Auth] Missing credentials')
          throw new Error('Invalid credentials')
        }

        try {
          if (isDebug) console.log('[Auth] Attempting sign in with password for:', credentials.email)
          
          const { data, error } = await supabaseServer.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          })

          if (error || !data?.user) {
            if (isDebug) console.error('[Auth] Sign in failed:', error?.message)
            throw new Error('Invalid email or password')
          }

          if (isDebug) console.log('[Auth] Sign in successful for:', data.user.email)

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || data.user.email,
          }
        } catch (error) {
          if (isDebug) console.error('[Auth] Credentials authorize error:', error)
          throw new Error(error.message || 'Authentication failed')
        }
      }
    })
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          if (isDebug) console.log('[Auth] Google sign in callback for:', user.email)

          const { data: existingUsers, error: listError } = await supabaseServer.auth.admin.listUsers()

          if (listError) {
            if (isDebug) console.error('[Auth] Failed to list users:', listError)
            return false
          }

          const existingUser = existingUsers.users.find(u => u.email === user.email)

          if (!existingUser) {
            if (isDebug) console.log('[Auth] Creating new Supabase user for Google OAuth:', user.email)

            const { data: newUser, error: createError } = await supabaseServer.auth.admin.createUser({
              email: user.email,
              email_confirm: true,
              user_metadata: {
                name: user.name || profile?.name || user.email,
                avatar_url: user.image || profile?.picture,
              },
            })

            if (createError) {
              if (isDebug) console.error('[Auth] Failed to create Supabase user:', createError)
              return false
            }

            if (isDebug) console.log('[Auth] Supabase user created:', newUser.user.id)
            user.id = newUser.user.id
          } else {
            if (isDebug) console.log('[Auth] Existing Supabase user found:', existingUser.id)
            user.id = existingUser.id
          }

          return true
        } catch (error) {
          if (isDebug) console.error('[Auth] Google sign in callback error:', error)
          return false
        }
      }

      return true
    },
    jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      if (account) {
        token.accessToken = account.access_token
      }
      if (isDebug && user) {
        console.log('[Auth] JWT token updated for user:', user.email)
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
      }
      if (isDebug) {
        console.log('[Auth] Session created for user:', session.user?.email)
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
})

