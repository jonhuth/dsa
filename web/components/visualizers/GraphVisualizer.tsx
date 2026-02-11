"use client";

interface GraphNode {
	id: number;
	label?: string;
}

interface GraphEdge {
	from: number;
	to: number;
}

interface GraphVisualizerProps {
	nodes: GraphNode[];
	edges: GraphEdge[];
	highlights?: Array<{
		type: "node" | "edge";
		id: number | string;
		color: string;
	}>;
	width?: number;
	height?: number;
}

export function GraphVisualizer({
	nodes,
	edges,
	highlights = [],
	width = 600,
	height = 400,
}: GraphVisualizerProps) {
	const colorClasses = {
		default: "fill-gray-500 stroke-gray-700",
		active: "fill-blue-500 stroke-blue-700",
		visited: "fill-purple-500 stroke-purple-700",
		comparing: "fill-yellow-500 stroke-yellow-700",
		found: "fill-green-500 stroke-green-700",
		path: "fill-green-400 stroke-green-600",
	};

	const edgeColorClasses = {
		default: "stroke-gray-600",
		active: "stroke-blue-500",
		visited: "stroke-purple-500",
		path: "stroke-green-500",
	};

	// Simple circular layout
	const nodePositions = nodes.reduce(
		(acc, node, idx) => {
			const angle = (2 * Math.PI * idx) / nodes.length - Math.PI / 2;
			const radius = Math.min(width, height) * 0.35;
			const centerX = width / 2;
			const centerY = height / 2;

			acc[node.id] = {
				x: centerX + radius * Math.cos(angle),
				y: centerY + radius * Math.sin(angle),
			};
			return acc;
		},
		{} as Record<number, { x: number; y: number }>,
	);

	return (
		<svg width={width} height={height} className="border border-border rounded-lg bg-background">
			{/* Edges */}
			<g>
				{edges.map((edge, idx) => {
					const from = nodePositions[edge.from];
					const to = nodePositions[edge.to];
					if (!from || !to) return null;

					const edgeId = `${edge.from}-${edge.to}`;
					const highlight = highlights.find((h) => h.type === "edge" && h.id === edgeId);
					const color = highlight?.color || "default";

					return (
						<line
							key={idx}
							x1={from.x}
							y1={from.y}
							x2={to.x}
							y2={to.y}
							className={`${edgeColorClasses[color as keyof typeof edgeColorClasses]} transition-all duration-300`}
							strokeWidth={2}
							markerEnd="url(#arrowhead)"
						/>
					);
				})}
			</g>

			{/* Arrowhead marker */}
			<defs>
				<marker
					id="arrowhead"
					markerWidth="10"
					markerHeight="10"
					refX="9"
					refY="3"
					orient="auto"
					markerUnits="strokeWidth"
				>
					<path d="M0,0 L0,6 L9,3 z" fill="currentColor" />
				</marker>
			</defs>

			{/* Nodes */}
			<g>
				{nodes.map((node) => {
					const pos = nodePositions[node.id];
					if (!pos) return null;

					const highlight = highlights.find((h) => h.type === "node" && h.id === node.id);
					const color = highlight?.color || "default";

					return (
						<g key={node.id}>
							<circle
								cx={pos.x}
								cy={pos.y}
								r={25}
								className={`${colorClasses[color as keyof typeof colorClasses]} transition-all duration-300`}
								strokeWidth={3}
							/>
							<text
								x={pos.x}
								y={pos.y}
								textAnchor="middle"
								dominantBaseline="middle"
								className="text-sm font-bold fill-white pointer-events-none"
							>
								{node.label || node.id}
							</text>
						</g>
					);
				})}
			</g>
		</svg>
	);
}
