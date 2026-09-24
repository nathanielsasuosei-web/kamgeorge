"use client";

import { useEffect, useMemo, useState } from "react";
import { categories as defaultCategories } from "@/lib/products";
import { useSettings } from "@/components/SettingsContext";
import { SHOP_SEARCH_EVENT } from "@/lib/shopSearch";
import { useProducts } from "@/components/ProductsContext";
import ProductCard from "@/components/ProductCard";

export default function ProductGrid() {
  const { products: allProducts } = useProducts();
  const { settings } = useSettings();
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");

  const categoriesList = useMemo(() => {
    if (settings?.categories && settings.categories.length > 0) {
      return settings.categories.map((c) => c.name || c.label);
    }
    return defaultCategories;
  }, [settings?.categories]);

  useEffect(() => {
    const apply = ({ q = "", c = "" } = {}) => {
      if (c && c !== "All" && c !== "Official Stores") {
        setCategory(c);
      } else {
        setCategory("All");
      }
      setQuery(q);
    };

    const fromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      apply({ q: params.get("q") || "", c: params.get("c") || "" });
    };

    const onHeaderSearch = (event) => apply(event.detail || {});

    fromUrl();
    window.addEventListener(SHOP_SEARCH_EVENT, onHeaderSearch);
    window.addEventListener("popstate", fromUrl);
    return () => {
      window.removeEventListener(SHOP_SEARCH_EVENT, onHeaderSearch);
      window.removeEventListener("popstate", fromUrl);
    };
  }, []);

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (category !== "All" && category !== "Official Stores") {
      const catLower = category.toLowerCase();
      list = list.filter((p) => {
        const pCat = (p.category || "").toLowerCase();
        return (
          pCat === catLower ||
          catLower.includes(pCat) ||
          pCat.includes(catLower)
        );
      });
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q))
      );
    }
    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return list;
  }, [allProducts, category, query, sort]);

  return (
    <section id="products" className="section">
      <div className="section-head">
        <div>
          <h2>Shop Products</h2>
          <p className="muted">
            {filtered.length} item{filtered.length === 1 ? "" : "s"}
            {category !== "All" ? ` in ${category}` : ""}
          </p>
        </div>
        <div className="toolbar">
          <input
            type="search"
            placeholder="Search in products…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input"
            aria-label="Sort products"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
      </div>

      <div className="chips">
        {categoriesList.map((c) => (
          <button
            key={c}
            className={
              c === category || (c === "Official Stores" && category === "All")
                ? "chip chip-active"
                : "chip"
            }
            onClick={() => setCategory(c === "Official Stores" ? "All" : c)}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <p>No products match your search or selected category.</p>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
