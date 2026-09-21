"use client";

import { useMemo, useState } from "react";
import { categories, products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function ProductGrid() {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== "All") {
      list = list.filter((p) => p.category === category);
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
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
  }, [category, query, sort]);

  return (
    <section id="products" className="section">
      <div className="section-head">
        <div>
          <h2>Shop products</h2>
          <p className="muted">
            {filtered.length} item{filtered.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="toolbar">
          <input
            type="search"
            placeholder="Search products…"
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
        {categories.map((c) => (
          <button
            key={c}
            className={c === category ? "chip chip-active" : "chip"}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <p>No products match your search.</p>
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
