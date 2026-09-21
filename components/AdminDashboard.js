"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { useAuth } from "@/components/AuthContext";
import { useProducts } from "@/components/ProductsContext";

const EMPTY_FORM = {
  name: "",
  price: "",
  oldPrice: "",
  category: "Electronics",
  description: "",
  image: "",
  badge: "",
};

const CATEGORIES = ["Electronics", "Fashion", "Home", "Beauty"];
const BADGES = ["", "New", "Sale", "Bestseller"];

// Downscale uploaded photos so they stay small enough for browser storage
const processImageFile = (file) =>
  new Promise((resolve) => {
    if (!file || !file.type.startsWith("image/")) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        try {
          const MAX = 800;
          let { width, height } = img;
          const scale = Math.min(1, MAX / Math.max(width, height));
          width = Math.max(1, Math.round(width * scale));
          height = Math.max(1, Math.round(height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = reader.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });

export default function AdminDashboard() {
  const { user, loaded: authLoaded, logout } = useAuth();
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetCatalog,
    loaded: productsLoaded,
  } = useProducts();
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [photoLabel, setPhotoLabel] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  if (!authLoaded || !productsLoaded) {
    return (
      <div className="empty">
        <p>Loading…</p>
      </div>
    );
  }

  // Only managers see the manage UI — everyone else gets a restricted notice.
  if (!user || user.role !== "manager") {
    return (
      <div className="empty">
        <p className="empty-title">Restricted area</p>
        <p className="muted">
          {user
            ? `You are logged in as ${user.email || user.phone}, which is a customer account.`
            : "You must be logged in as a store manager to view this page."}
        </p>
        <Link href="/admin/login" className="btn btn-primary">
          Go to manager login
        </Link>
      </div>
    );
  }

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price: String(p.price),
      oldPrice: p.oldPrice ? String(p.oldPrice) : "",
      category: p.category,
      description: p.description,
      image: p.image,
      badge: p.badge || "",
    });
    setMessage("");
    setPhotoLabel(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setPhotoLabel(null);
  };

  const handleFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file (JPG, PNG, etc.).");
      return;
    }
    setUploading(true);
    const dataUrl = await processImageFile(file);
    setUploading(false);
    if (!dataUrl) {
      setMessage(
        "Couldn't read that photo. Try a different file or paste an image URL."
      );
      return;
    }
    setForm((f) => ({ ...f, image: dataUrl }));
    setPhotoLabel(`“${file.name}” uploaded`);
    setMessage("");
  };

  const submit = (e) => {
    e.preventDefault();
    const id = editingId;
    const data = {
      name: form.name.trim(),
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      category: form.category,
      description: form.description.trim(),
      image:
        form.image.trim() ||
        `https://picsum.photos/seed/${id || Date.now()}/800/600`,
      badge: form.badge || null,
    };
    if (!data.name || !(data.price > 0)) {
      setMessage("Please enter a name and a valid price.");
      return;
    }
    if (id) {
      updateProduct(id, data);
    } else {
      addProduct(data);
    }
    cancelEdit();
    setMessage(id ? `Updated “${data.name}”.` : `Added “${data.name}”.`);
  };

  const remove = (p) => {
    if (window.confirm(`Delete “${p.name}” from the store?`)) {
      deleteProduct(p.id);
      if (editingId === p.id) cancelEdit();
      setMessage(`Deleted “${p.name}”.`);
    }
  };

  const reset = () => {
    if (
      window.confirm(
        "Reset the catalog to the original products? Your changes will be lost."
      )
    ) {
      resetCatalog();
      cancelEdit();
      setMessage("Catalog reset to the original products.");
    }
  };

  const totalValue = products.reduce((sum, p) => sum + p.price, 0);
  const hasUploadedPhoto = form.image.startsWith("data:");

  return (
    <>
      <div className="admin-head">
        <div>
          <p className="muted">Signed in as {user.email}</p>
          <h1 className="page-title">Manage store</h1>
        </div>
        <div className="admin-head-actions">
          <Link href="/" className="btn btn-secondary">
            View storefront
          </Link>
          <button className="btn btn-secondary" onClick={logout}>
            Log out
          </button>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat">
          <strong>{products.length}</strong>
          <span>Products</span>
        </div>
        <div className="stat">
          <strong>{formatPrice(totalValue)}</strong>
          <span>Catalog value</span>
        </div>
        <div className="stat">
          <strong>{CATEGORIES.length}</strong>
          <span>Categories</span>
        </div>
      </div>

      {message && <p className="form-success">{message}</p>}

      <div className="admin-layout">
        <form className="checkout-form" onSubmit={submit}>
          <h3>{editingId ? "Edit product" : "Add product"}</h3>
          <label>
            Name
            <input
              className="input"
              required
              value={form.name}
              onChange={update("name")}
              placeholder="Product name"
            />
          </label>
          <div className="form-row">
            <label>
              Price (GH₵)
              <input
                className="input"
                required
                type="number"
                min="1"
                step="0.01"
                value={form.price}
                onChange={update("price")}
                placeholder="999"
              />
            </label>
            <label>
              Old price (optional)
              <input
                className="input"
                type="number"
                min="0"
                step="0.01"
                value={form.oldPrice}
                onChange={update("oldPrice")}
                placeholder="1299"
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Category
              <select
                className="input"
                value={form.category}
                onChange={update("category")}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Badge
              <select
                className="input"
                value={form.badge}
                onChange={update("badge")}
              >
                {BADGES.map((b) => (
                  <option key={b} value={b}>
                    {b || "None"}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Description
            <textarea
              className="input"
              rows={3}
              value={form.description}
              onChange={update("description")}
              placeholder="Short description…"
            />
          </label>
          <label>
            Product photo
            <div className="photo-row">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => fileRef.current && fileRef.current.click()}
                disabled={uploading}
              >
                {uploading ? "Processing…" : "Upload photo"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleFile}
              />
              {photoLabel && (
                <span className="muted">{photoLabel}</span>
              )}
            </div>
            <input
              className="input"
              value={hasUploadedPhoto ? "" : form.image}
              onChange={(e) => {
                setPhotoLabel(null);
                update("image")(e);
              }}
              placeholder={
                hasUploadedPhoto
                  ? "Photo uploaded — paste a URL here to replace it"
                  : "…or paste image URL (https://…)"
              }
            />
          </label>
          {form.image.trim() ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={form.image}
              src={form.image.trim()}
              alt="Preview"
              className="form-preview"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : null}
          <div className="form-row">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Save changes" : "Add product"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="admin-table-wrap">
          <div className="admin-table-head">
            <h3>Products ({products.length})</h3>
            <button type="button" className="link-danger" onClick={reset}>
              Reset catalog
            </button>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className={editingId === p.id ? "row-editing" : ""}>
                  <td>
                    <div className="admin-product">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt="" />
                      <span>{p.name}</span>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>{formatPrice(p.price)}</td>
                  <td className="admin-actions">
                    <button className="link-btn" onClick={() => startEdit(p)}>
                      Edit
                    </button>
                    <button className="link-danger" onClick={() => remove(p)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
