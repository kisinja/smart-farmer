
export type ParamsProps = Promise<{
  id: string;
}>;

export type UpdateProductDto = {
  title?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  stock?: number;
  categoryId?: string;
};

export interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

export type CartAction =
  | { type: "SET_CART"; items: CartItem[] }
  | { type: "ADD_ITEM"; product: Product }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "INCREMENT_QTY"; productId: string }
  | { type: "DECREMENT_QTY"; productId: string }
  | { type: "CLEAR_CART" };

export type ActivityProps = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  createdAt: string | Date;
  type?: string;
  status?: string;
};

export type StatCardProps = {
  // icon <FaIcon /> or string
  icon: React.ReactNode;
  title: string;
  value: number | string;
  color?: string;
}

export type OrderCardProps = {
  order: {
    order: {
      id: string;
      createdAt: string | Date;
      status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
      totalAmount: number;
      trackingNumber?: string;

    };
    orderItems: number;
  };
};