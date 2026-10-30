import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Ezeket használd a next/link és next/navigation helyett: tudják a fordított URL-eket.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
