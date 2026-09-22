"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products as defaultProducts } from "@/lib/products";

const ProductsContext = createContext(null);
const STORAGE_KEY = "kamgeorge-product-overrides";

const EMPTY_OVERRIDES = { updated: {}, deleted: [], added: [] };

function mergeProducts(defaults, overrides) {
  const { updated = {}, deleted = [], added = [] } = overrides || {};
  const deletedSet = new Set(deleted);
  const list = defaults
    .filter((p) => !deletedSet.has(p.id))
    .map((p) => (updated[p.id] ? { ...p, ...updated[p.id] } : p));
  return [...list, ...added];
}

function slugify(name) {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return slug || "product";
}

export function ProductsProvider({ children }) {
  const [overrides, setOverrides] = useState(EMPTY_OVERRIDES);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setOverrides({
          updated: parsed.updated || {},
          deleted: Array.isArray(parsed.deleted) ? parsed.deleted : [],
          added: Array.isArray(parsed.added) ? parsed.added : [],
        });
      }
    } catch {
      // ignore corrupted storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch {
      // storage unavailable
    }
  }, [overrides, loaded]);

  const value = useMemo(
    () => {
      const products = mergeProducts(defaultProducts, overrides);
      const getProduct = (id) => products.find((p) => p.id === id);

      const addProduct = (data) => {
        const id = `${slugify(data.name)}-${Date.now().toString(36)}`;
        const product = {
          rating: 5.0,
          reviews: 0,
          badge: "New",
          oldPrice: null,
          ...data,
          id,
          price: Number(data.price) || 0,
          oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
        };
        setOverrides((prev) => ({ ...prev, added: [...prev.added, product] }));
        return id;
      };

      const updateProduct = (id, data) => {
        setOverrides((prev) => {
          if (prev.added.some((p) => p.id === id)) {
            return {
              ...prev,
              added: prev.added.map((p) =>
                p.id === id ? { ...p, ...data, id } : p
              ),
            };
          }
          const base = defaultProducts.find((p) => p.id === id) || {};
          return {
            ...prev,
            updated: {
              ...prev.updated,
              [id]: { ...base, ...prev.updated[id], ...data, id },
            },
          };
        });
      };

      const deleteProduct = (id) => {
        setOverrides((prev) => {
          const next = {
            updated: { ...prev.updated },
            added: prev.added.filter((p) => p.id !== id),
            deleted: [...prev.deleted],
          };
          delete next.updated[id];
          if (
            defaultProducts.some((p) => p.id === id) &&
            !next.deleted.includes(id)
          ) {
            next.deleted.push(id);
          }
          return next;
        });
      };

      const resetCatalog = () => setOverrides(EMPTY_OVERRIDES);

      return {
        products,
        getProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        resetCatalog,
        loaded,
      };
    },
    [overrides, loaded]
  );

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
