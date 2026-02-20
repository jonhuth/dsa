"use client";

import type React from "react";
import { useId } from "react";

interface TreeNode {
	val: number;
	left?: TreeNode | null;
	right?: TreeNode | null;
}

interface TreeVisualizerProps {
	tree: TreeNode | null;
	highlights?: Array<{
		type: "node";
		id: number;
		color: string;
	}>;
	width?: number;
	height?: number;
}

interface PositionedNode {
	val: number;
	x: number;
	y: number;
	left?: PositionedNode;
	right?: PositionedNode;
}

export function TreeVisualizer({
	tree,
	highlights = [],
	width = 800,
	height = 500,
}: TreeVisualizerProps) {
	const titleId = useId();
	const colorClasses = {
		default: "fill-gray-500 stroke-gray-700",
		active: "fill-blue-500 stroke-blue-700",
		visited: "fill-gray-600 stroke-gray-800",
		comparing: "fill-yellow-500 stroke-yellow-700",
		sorted: "fill-green-500 stroke-green-700",
	};

	const edgeColorClasses = {
		default: "stroke-gray-600",
	};

	// Calculate tree depth
	const getDepth = (node: TreeNode | null | undefined): number => {
		if (!node) return 0;
		return 1 + Math.max(getDepth(node.left), getDepth(node.right));
	};

	// Position nodes using a hierarchical layout
	const positionNodes = (
		node: TreeNode | null | undefined,
		x: number,
		y: number,
		level: number,
		maxLevel: number,
	): PositionedNode | null => {
		if (!node) return null;

		const horizontalSpacing = width / 2 ** (level + 1);
		const verticalSpacing = height / (maxLevel + 1);

		const positioned: PositionedNode = {
			val: node.val,
			x,
			y: y + verticalSpacing,
		};

		if (node.left) {
			positioned.left =
				positionNodes(node.left, x - horizontalSpacing, y + verticalSpacing, level + 1, maxLevel) ||
				undefined;
		}

		if (node.right) {
			positioned.right =
				positionNodes(
					node.right,
					x + horizontalSpacing,
					y + verticalSpacing,
					level + 1,
					maxLevel,
				) || undefined;
		}

		return positioned;
	};

	const maxDepth = getDepth(tree);
	const positionedTree = tree ? positionNodes(tree, width / 2, 0, 0, maxDepth) : null;

	// Render edges recursively
	const renderEdges = (node: PositionedNode | null | undefined): React.ReactElement[] => {
		if (!node) return [];

		const edges: React.ReactElement[] = [];

		if (node.left) {
			edges.push(
				<line
					key={`${node.val}-${node.left.val}`}
					x1={node.x}
					y1={node.y}
					x2={node.left.x}
					y2={node.left.y}
					className={`${edgeColorClasses.default} transition-all duration-300`}
					strokeWidth={2}
				/>,
			);
			edges.push(...renderEdges(node.left));
		}

		if (node.right) {
			edges.push(
				<line
					key={`${node.val}-${node.right.val}`}
					x1={node.x}
					y1={node.y}
					x2={node.right.x}
					y2={node.right.y}
					className={`${edgeColorClasses.default} transition-all duration-300`}
					strokeWidth={2}
				/>,
			);
			edges.push(...renderEdges(node.right));
		}

		return edges;
	};

	// Render nodes recursively
	const renderNodes = (node: PositionedNode | null | undefined): React.ReactElement[] => {
		if (!node) return [];

		const nodes: React.ReactElement[] = [];

		const highlight = highlights.find((h) => h.type === "node" && h.id === node.val);
		const color = highlight?.color || "default";

		nodes.push(
			<g key={node.val}>
				<circle
					cx={node.x}
					cy={node.y}
					r={25}
					className={`${colorClasses[color as keyof typeof colorClasses]} transition-all duration-300`}
					strokeWidth={3}
				/>
				<text
					x={node.x}
					y={node.y}
					textAnchor="middle"
					dominantBaseline="middle"
					className="text-sm font-bold fill-white pointer-events-none"
				>
					{node.val}
				</text>
			</g>,
		);

		if (node.left) {
			nodes.push(...renderNodes(node.left));
		}
		if (node.right) {
			nodes.push(...renderNodes(node.right));
		}

		return nodes;
	};

	if (!tree) {
		return (
			<div
				className="flex items-center justify-center border border-border rounded-lg bg-background text-muted-foreground"
				style={{ width, height }}
			>
				Empty tree
			</div>
		);
	}

	return (
		<svg
			width={width}
			height={height}
			className="border border-border rounded-lg bg-background"
			aria-labelledby={titleId}
		>
			<title id={titleId}>Binary tree visualization</title>
			{/* Edges */}
			<g>{renderEdges(positionedTree)}</g>

			{/* Nodes */}
			<g>{renderNodes(positionedTree)}</g>
		</svg>
	);
}
