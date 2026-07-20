"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sectionLinks } from "./nav-links";

/**
 * Icon-only section menu for small screens.
 *
 * The header is already tight on a phone (logo + flex-1 search + GitHub), so the
 * desktop text links cannot simply be unhidden. Radix's dropdown gives us a
 * keyboard-operable, focus-trapped menu for the cost of a single 40px button.
 */
export function MobileNav() {
	const pathname = usePathname();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				aria-label="Open section menu"
				className="flex shrink-0 items-center justify-center rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:bg-accent data-[state=open]:text-foreground md:hidden"
			>
				<Menu className="h-5 w-5" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-64">
				<DropdownMenuLabel>Sections</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{sectionLinks.map(({ href, label, description, icon: Icon }) => {
					const isActive = pathname === href || pathname.startsWith(`${href}/`);
					return (
						<DropdownMenuItem key={href} asChild className="cursor-pointer py-2.5">
							<Link href={href} aria-current={isActive ? "page" : undefined}>
								<Icon className={isActive ? "text-foreground" : "text-muted-foreground"} />
								<span className="flex flex-col gap-0.5">
									<span className={isActive ? "font-medium text-foreground" : "font-medium"}>
										{label}
									</span>
									<span className="text-xs text-muted-foreground">{description}</span>
								</span>
							</Link>
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
