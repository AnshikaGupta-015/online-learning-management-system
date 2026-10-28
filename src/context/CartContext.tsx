import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, CartItem, Order } from '../types';
import { saveOrder } from '../services/firestoreService';

interface CartContextType {
  cart: CartItem[];
  wishlist: Course[];
  orders: Order[];
  coupon: { code: string; discountPercent: number } | null;
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  isInCart: (courseId: string) => boolean;
  addToWishlist: (course: Course) => void;
  removeFromWishlist: (courseId: string) => void;
  isInWishlist: (courseId: string) => boolean;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  checkout: (paymentMethod: 'razorpay' | 'card' | 'upi') => Order;
  subtotal: number;
  discountAmount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Course[]>([]);
  const [coupon, setCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord_9801',
      orderNumber: 'LNV-ORD-2026-9801',
      userId: 'user_std_01',
      items: [
        {
          courseId: 'c_uiux_02',
          title: 'Modern UI/UX Architecture & Production Design Systems',
          price: 2799,
        },
      ],
      subtotal: 2799,
      discount: 280,
      total: 2519,
      couponApplied: 'LEARNOVA10',
      paymentMethod: 'razorpay',
      status: 'completed',
      createdAt: '2026-08-10',
    },
  ]);

  // Pre-seed sample order to Firestore
  useEffect(() => {
    saveOrder(orders[0]).catch(() => {});
  }, []);

  const addToCart = (course: Course) => {
    if (!cart.some((item) => item.course.id === course.id)) {
      setCart((prev) => [...prev, { course, addedAt: new Date().toISOString() }]);
    }
  };

  const removeFromCart = (courseId: string) => {
    setCart((prev) => prev.filter((item) => item.course.id !== courseId));
  };

  const clearCart = () => setCart([]);

  const isInCart = (courseId: string) => cart.some((item) => item.course.id === courseId);

  const addToWishlist = (course: Course) => {
    if (!wishlist.some((c) => c.id === course.id)) {
      setWishlist((prev) => [...prev, course]);
    }
  };

  const removeFromWishlist = (courseId: string) => {
    setWishlist((prev) => prev.filter((c) => c.id !== courseId));
  };

  const isInWishlist = (courseId: string) => wishlist.some((c) => c.id === courseId);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'LEARNOVA20') {
      setCoupon({ code: 'LEARNOVA20', discountPercent: 20 });
      return { success: true, message: '20% discount coupon applied successfully!' };
    }
    if (clean === 'ARCHITECT15') {
      setCoupon({ code: 'ARCHITECT15', discountPercent: 15 });
      return { success: true, message: '15% architect partner discount applied!' };
    }
    return { success: false, message: 'Invalid coupon code. Try LEARNOVA20 or ARCHITECT15' };
  };

  const removeCoupon = () => setCoupon(null);

  const subtotal = cart.reduce((sum, item) => sum + item.course.price, 0);
  const discountAmount = coupon ? Math.round((subtotal * coupon.discountPercent) / 100) : 0;
  const total = Math.max(0, subtotal - discountAmount);

  const checkout = (paymentMethod: 'razorpay' | 'card' | 'upi'): Order => {
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber: `LNV-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: 'user_std_01',
      items: cart.map((i) => ({
        courseId: i.course.id,
        title: i.course.title,
        price: i.course.price,
      })),
      subtotal,
      discount: discountAmount,
      total,
      couponApplied: coupon?.code,
      paymentMethod,
      status: 'completed',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setOrders((prev) => [newOrder, ...prev]);
    saveOrder(newOrder).catch(() => {});
    setCart([]);
    setCoupon(null);
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        orders,
        coupon,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        applyCoupon,
        removeCoupon,
        checkout,
        subtotal,
        discountAmount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
