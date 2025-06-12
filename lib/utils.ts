import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

export const cartItems = [
  {
    id: "1",
    product: {
      title: "Organic Tomatoes",
      price: 4.99,
      image:
        "https://images.unsplash.com/photo-1603037011330-e3c5f389f1c5?auto=format&fit=crop&w=300&q=80",
    },
    quantity: 2,
  },
  {
    id: "2",
    product: {
      title: "Fresh Kale",
      price: 3.5,
      image:
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=300&q=80",
    },
    quantity: 1,
  },
];
