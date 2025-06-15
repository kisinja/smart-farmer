"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ProductViewTracker({
  productId,
}: {
  productId: string;
}) {
  const pathname = usePathname();

  useEffect(() => {
    // Only track views on product detail pages
    if (pathname.startsWith("/products/")) {
      const trackView = async () => {
        try {
          await fetch(`/api/products/${productId}/view`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          console.error("Error tracking view:", error);
        }
      };

      trackView();
    }
  }, [productId, pathname]);

  return null;
}