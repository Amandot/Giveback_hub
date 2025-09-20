 import Google from "next-auth/providers/google"
 import type { Provider } from "next-auth/providers/index"
 
 export function getAuthProviders(): Provider[] {
 	const providers: Provider[] = []
 
 	// Only add Google provider if credentials are available and not placeholder values
 	if (
 		process.env.GOOGLE_CLIENT_ID &&
 		process.env.GOOGLE_CLIENT_SECRET &&
 		process.env.GOOGLE_CLIENT_ID !== "your-google-client-id-here" &&
 		process.env.GOOGLE_CLIENT_SECRET !== "your-google-client-secret-here"
 	) {
 		providers.push(
 			Google({
 				clientId: process.env.GOOGLE_CLIENT_ID,
 				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
 				authorization: {
 					params: {
 						prompt: "consent",
 						access_type: "offline",
 						response_type: "code",
 					},
 				},
 			})
 		)
 	}
 
 	// Add other providers here in the future
 
 	return providers
 }