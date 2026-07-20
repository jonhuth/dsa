import { BarChart3, Binary, type LucideIcon } from "lucide-react";

export type SectionLink = {
	href: string;
	label: string;
	/** Short blurb shown in the mobile menu, where there is room for it. */
	description: string;
	icon: LucideIcon;
};

/**
 * The site's top-level sections. Shared by the desktop header nav and the
 * mobile menu so the two can never drift apart.
 */
export const sectionLinks: SectionLink[] = [
	{
		href: "/algorithms",
		label: "Algorithms",
		description: "Sorting, graphs, trees & more",
		icon: Binary,
	},
	{
		href: "/information-theory",
		label: "Information Theory",
		description: "Entropy, KL divergence, complexity",
		icon: BarChart3,
	},
];
