"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeViewerProps {
	code: string;
	language?: string;
	highlightedLine?: number;
	showLineNumbers?: boolean;
}

export function CodeViewer({
	code,
	language = "python",
	highlightedLine,
	showLineNumbers = true,
}: CodeViewerProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};
	// Custom style to highlight the current line
	const customStyle = {
		...vscDarkPlus,
		'code[class*="language-"]': {
			...vscDarkPlus['code[class*="language-"]'],
			background: "transparent",
		},
		'pre[class*="language-"]': {
			...vscDarkPlus['pre[class*="language-"]'],
			background: "hsl(var(--card))",
			margin: 0,
			padding: "1rem",
			borderRadius: "0.5rem",
		},
	};

	return (
		<div className="relative">
			<div className="absolute top-1 sm:top-2 right-1 sm:right-2 z-10 flex items-center gap-1 sm:gap-2">
				<button
					type="button"
					onClick={handleCopy}
					className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground hover:text-foreground bg-background/50 hover:bg-background/80 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded transition-colors touch-manipulation"
					title="Copy code"
				>
					{copied ? (
						<>
							<Check className="h-3 w-3" />
							<span className="hidden sm:inline">Copied!</span>
						</>
					) : (
						<>
							<Copy className="h-3 w-3" />
							<span className="hidden sm:inline">Copy</span>
						</>
					)}
				</button>
				<span className="text-[10px] sm:text-xs text-muted-foreground bg-background/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
					{language}
				</span>
			</div>
			<SyntaxHighlighter
				language={language}
				style={customStyle}
				showLineNumbers={showLineNumbers}
				wrapLines={true}
				lineProps={(lineNumber) => {
					const isHighlighted = highlightedLine === lineNumber;
					return {
						style: {
							backgroundColor: isHighlighted ? "rgba(124, 58, 237, 0.2)" : "transparent",
							display: "block",
							width: "100%",
							borderLeft: isHighlighted ? "3px solid rgb(124, 58, 237)" : "none",
							paddingLeft: isHighlighted ? "0.75rem" : "0.875rem",
							transition: "all 0.2s ease",
						},
					};
				}}
				customStyle={{
					fontSize: "0.75rem",
					maxHeight: "300px",
					overflow: "auto",
				}}
			>
				{code}
			</SyntaxHighlighter>
		</div>
	);
}
