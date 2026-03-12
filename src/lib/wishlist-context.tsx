'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface WishlistContextType {
    items: number[];
    addItem: (productId: number) => void;
    removeItem: (productId: number) => void;
    toggleItem: (productId: number) => void;
    isInWishlist: (productId: number) => boolean;
    itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<number[]>([]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('techaabid-wishlist');
            if (saved) setItems(JSON.parse(saved));
        } catch { }
    }, []);

    useEffect(() => {
        localStorage.setItem('techaabid-wishlist', JSON.stringify(items));
    }, [items]);

    const addItem = useCallback((productId: number) => {
        setItems((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
    }, []);

    const removeItem = useCallback((productId: number) => {
        setItems((prev) => prev.filter((id) => id !== productId));
    }, []);

    const toggleItem = useCallback((productId: number) => {
        setItems((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    }, []);

    const isInWishlist = useCallback(
        (productId: number) => items.includes(productId),
        [items]
    );

    return (
        <WishlistContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                toggleItem,
                isInWishlist,
                itemCount: items.length,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
