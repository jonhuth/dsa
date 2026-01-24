"use client";

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
      <div className="absolute top-2 right-2 z-10">
        <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded">
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
          fontSize: "0.875rem",
          maxHeight: "calc(100vh - 16rem)",
          overflow: "auto",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
