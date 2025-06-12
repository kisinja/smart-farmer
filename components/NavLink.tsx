"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import React from "react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
  onClick?: () => void;
}

const NavLink = ({ href, children, mobile = false, onClick }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        isActive
          ? "text-blue-500 font-normal"
          : "font-normal hover:text-blue-500 transition-colors text-gray-600",
        mobile ? "py-3 px-4 rounded-lg hover:bg-gray-100 w-full" : ""
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default NavLink;