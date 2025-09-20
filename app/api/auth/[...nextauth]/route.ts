import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import type { User } from "@prisma/client"

const providers = []

// Add Google provider if credentials are available and not placeholder values
const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID && 
	process.env.GOOGLE_CLIENT_SECRET &&
	process.env.GOOGLE_CLIENT_ID !== "your-google-client-id-here" &&
	process.env.GOOGLE_CLIENT_SECRET !== "your-google-client-secret-here" &&
	process.env.GOOGLE_CLIENT_ID.length > 10 &&
	process.env.GOOGLE_CLIENT_SECRET.length > 10;

if (isGoogleConfigured) {
	providers.push(
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			authorization: {
				params: {
					scope: "openid email profile",
					prompt: "consent",
					access_type: "offline",
					response_type: "code"
				}
			},
			httpOptions: {
				timeout: 30000,
			},
			profile(profile) {
				return {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					image: profile.picture,
				}
			}
		})
	)
	console.log('✅ Google OAuth provider configured successfully');
} else {
	console.warn('⚠️  Google OAuth not configured. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local');
	console.warn('   Run: node scripts/google-oauth-setup.js for guided setup');
}

// Add Credentials provider for admin login
providers.push(
	Credentials({
		id: "credentials",
		name: "credentials",
		credentials: {
			email: { label: "Email", type: "email" },
			password: { label: "Password", type: "password" }
		},
		async authorize(credentials) {
			if (!credentials?.email || !credentials?.password) {
				return null
			}

			try {
				const user = await prisma.user.findUnique({
					where: { email: credentials.email }
				})

				if (!user || !user.password) {
					return null
				}

				const isPasswordValid = await bcrypt.compare(
					credentials.password,
					user.password
				)

				if (!isPasswordValid) {
					return null
				}

				return {
					id: user.id,
					email: user.email,
					name: user.name,
					role: user.role,
					image: user.image,
				}
			} catch (error) {
				console.error("Auth error:", error)
				return null
			}
		},
	})
)

export const authOptions = {
	providers,
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: '/auth/user-login',
	},
	session: {
		strategy: "jwt" as const,
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	jwt: {
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	cookies: {
		sessionToken: {
			name: `next-auth.session-token`,
			options: {
				httpOnly: true,
				sameSite: 'lax',
				path: '/',
				secure: process.env.NODE_ENV === 'production'
			}
		}
	},
	callbacks: {
		async signIn({ user, account, profile }: any) {
			if (account?.provider === "google") {
				try {
					// Check if user exists, create if not
					const existingUser = await prisma.user.findUnique({
						where: { email: user.email! }
					})

					if (!existingUser) {
						await prisma.user.create({
							data: {
								email: user.email!,
								name: user.name,
								image: user.image,
								role: "USER",
							}
						})
					}
				} catch (error) {
					console.error("Error creating user:", error)
					return false
				}
			}
			return true
		},
		async jwt({ token, user }: any) {
			if (user) {
				// Get user from database to ensure we have the latest role
				const dbUser = await prisma.user.findUnique({
					where: { email: user.email! }
				})
				
				if (dbUser) {
					token.id = dbUser.id
					token.role = dbUser.role
				}
			}
			return token
		},
		async session({ session, token }: any) {
			if (token) {
				session.user.id = token.id as string
				session.user.role = token.role as string
			}
			return session
		},
		async redirect({ url, baseUrl, token }: any) {
			// Handle role-based redirection after sign in
			if (url === baseUrl || url === `${baseUrl}/`) {
				// Default redirect after sign in
				if (token?.role === 'ADMIN') {
					return `${baseUrl}/admin`
				} else {
					return `${baseUrl}/dashboard`
				}
			}
			
			// Allow relative URLs
			if (url.startsWith("/")) {
				return `${baseUrl}${url}`
			}
			
			// Allow URLs from the same origin
			else if (new URL(url).origin === baseUrl) {
				return url
			}
			
			return baseUrl
		},
	},
	debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }


