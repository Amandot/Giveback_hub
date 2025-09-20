"use client"

import { signIn, useSession, getProviders } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogoutDialog } from "@/components/logout-dialog"
import { useEffect, useState } from "react"

export function AuthButtons() {
	const { status, data } = useSession()
	const [providers, setProviders] = useState<any>(null)

	useEffect(() => {
		getProviders().then(setProviders)
	}, [])

	if (status === "loading") {
		return <Button variant="ghost" disabled>Loading...</Button>
	}

	if (status === "authenticated") {
		return (
			<div className="flex items-center gap-2">
				<span className="text-sm">{data?.user?.name}</span>
				<LogoutDialog 
					redirectTo="/"
					showConfirmation={true}
					variant="outline"
					size="sm"
				>
					Sign out
				</LogoutDialog>
			</div>
		)
	}

	// Check if Google provider is available
	if (providers?.google) {
		return (
			<Button size="sm" onClick={() => signIn("google")}>Sign in with Google</Button>
		)
	}

	// No providers configured
	return (
		<Button variant="outline" disabled size="sm" title="Google OAuth not configured">
			Sign in (Setup Required)
		</Button>
	)
}


