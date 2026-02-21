"use client";

import { useEffect } from "react";

// biome-ignore lint/suspicious/noShadowRestrictedNames: Next.js error boundary convention
export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error("Application error:", error);
	}, [error]);

	return (
		<div className="min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center">
			<div className="max-w-md w-full text-center space-y-6">
				{/* Error Icon */}
				<div className="text-6xl sm:text-8xl">⚠️</div>

				{/* Error Message */}
				<div className="space-y-3">
					<h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
						Something went wrong
					</h1>
					<p className="text-sm sm:text-base text-muted-foreground">
						An unexpected error occurred while loading this page.
					</p>
					{error.digest && (
						<p className="text-xs text-muted-foreground font-mono">Error ID: {error.digest}</p>
					)}
				</div>

				{/* Actions */}
				<div className="flex flex-col sm:flex-row gap-3 justify-center">
					<button
						type="button"
						onClick={reset}
						className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
					>
						Try again
					</button>
					<a
						href="/"
						className="px-6 py-3 border border-border hover:bg-accent text-foreground font-medium rounded-lg transition-colors"
					>
						Go home
					</a>
				</div>

				{/* Debug info in development */}
				{process.env.NODE_ENV === "development" && (
					<details className="text-left mt-8 p-4 border border-border rounded-lg">
						<summary className="cursor-pointer text-sm font-medium text-muted-foreground">
							Error details
						</summary>
						<pre className="mt-4 text-xs overflow-auto p-3 bg-background rounded border border-border text-red-400">
							{error.message}
							{error.stack && `\n\n${error.stack}`}
						</pre>
					</details>
				)}
			</div>
		</div>
	);
}
