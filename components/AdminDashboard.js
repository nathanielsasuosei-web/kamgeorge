"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/products";
import { useAuth } from "@/components/AuthContext";
import { useProducts } from "@/components/ProductsContext";
import { useSettings } from "@/components/SettingsContext";
import {
  CheckIcon,
  EditIcon,
  HelpIcon,
  PlusIcon,
  RenderCategoryIcon,
  StarBadgeIcon,
  TrashIcon,
} from "@/components/icons";

const EMPTY_PRODUCT_FORM = {
  name: "",
  price: "",
  oldPrice: "",
  category: "Electronics",
  description: "",
  image: "",
  badge: "",
};

const EMPTY_SLIDE_FORM = {
  id: "",
  badge: "SPECIAL PROMO",
  title: "New Season Deals",
  subtitle: "Up to 50% off · Limited time only",
  buttonText: "Shop Now →",
  buttonLink: "/#products",
  disclaimer: "T&Cs apply",
  theme: "blue",
  bgColor: "#0062ff",
  image:
    "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80",
  active: true,
};

const EMPTY_CATEGORY_FORM = {
  id: "",
  name: "",
  label: "",
  icon: "store",
};

const BADGES = ["", "New", "Sale", "Bestseller"];

const THEME_OPTIONS = [
  { value: "blue", label: "Royal Blue (Back to School)" },
  { value: "orange", label: "Vibrant Orange" },
  { value: "dark", label: "Midnight Slate" },
  { value: "purple", label: "Deep Purple" },
  { value: "green", label: "Emerald Green" },
];

const ICON_OPTIONS = [
  { value: "store", label: "Official Store (Bag)" },
  { value: "phone", label: "Phones & Tablets" },
  { value: "beauty", label: "Health & Beauty" },
  { value: "home", label: "Home & Office" },
  { value: "appliances", label: "Appliances" },
  { value: "electronics", label: "Electronics & TV" },
  { value: "fashion", label: "Fashion & Clothes" },
  { value: "supermarket", label: "Supermarket / Food" },
  { value: "headphones", label: "Audio & Headphones" },
  { value: "watch", label: "Watches & Jewelry" },
  { value: "glasses", label: "Eyewear / Accessories" },
];

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
          const MAX = 900;
          let { width, height } = img;
          const scale = Math.min(1, MAX / Math.max(width, height));
          width = Math.max(1, Math.round(width * scale));
          height = Math.max(1, Math.round(height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
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
  const {
    user,
    loaded: authLoaded,
    logout,
    adminEmail,
    changeManagerCredentials,
  } = useAuth();
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetCatalog,
    loaded: productsLoaded,
  } = useProducts();
  const {
    settings,
    updateSettings,
    updateTopBanner,
    updateSubHeader,
    updateHeroSlides,
    updateCategories,
    updateHelpInfo,
    resetSettings,
    loaded: settingsLoaded,
  } = useSettings();

  const [activeTab, setActiveTab] = useState("products"); // "products" | "topBanner" | "heroSlides" | "categories" | "settings"

  // Product state
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT_FORM);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productMsg, setProductMsg] = useState("");
  const [photoLabel, setPhotoLabel] = useState(null);
  const [uploading, setUploading] = useState(false);
  const productFileRef = useRef(null);

  // Top Banner state
  const [topBannerDraft, setTopBannerDraft] = useState(settings.topBanner);
  const [bannerMsg, setBannerMsg] = useState("");

  // Hero Slides state
  const [slidesDraft, setSlidesDraft] = useState(settings.heroSlides || []);
  const [editingSlide, setEditingSlide] = useState(null);
  const [slideForm, setSlideForm] = useState(EMPTY_SLIDE_FORM);
  const [slideMsg, setSlideMsg] = useState("");
  const [slideUploading, setSlideUploading] = useState(false);
  const slideFileRef = useRef(null);

  // Categories state
  const [categoriesDraft, setCategoriesDraft] = useState(
    settings.categories || []
  );
  const [editingCatId, setEditingCatId] = useState(null);
  const [catForm, setCatForm] = useState(EMPTY_CATEGORY_FORM);
  const [catMsg, setCatMsg] = useState("");

  // Site settings: footer Support lines
  const [supportDraft, setSupportDraft] = useState(settings.support);
  const [helpDraft, setHelpDraft] = useState(settings.helpInfo);
  const [subHeaderDraft, setSubHeaderDraft] = useState(settings.subHeader);
  const [settingsMsg, setSettingsMsg] = useState("");
  const [settingsErr, setSettingsErr] = useState("");

  // Site settings: manager login
  const [loginForm, setLoginForm] = useState({
    currentPassword: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loginMsg, setLoginMsg] = useState("");
  const [loginErr, setLoginErr] = useState("");

  // Sync state from context
  useEffect(() => {
    setTopBannerDraft(settings.topBanner);
    setSlidesDraft(settings.heroSlides || []);
    setCategoriesDraft(settings.categories || []);
    setSupportDraft(settings.support || []);
    setHelpDraft(settings.helpInfo || {});
    setSubHeaderDraft(settings.subHeader || {});
  }, [settings]);

  if (!authLoaded || !productsLoaded || !settingsLoaded) {
    return (
      <div className="empty">
        <p>Loading manager portal…</p>
      </div>
    );
  }

  // Restricted check
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

  const availableCategories = categoriesDraft.map((c) => c.name || c.label);

  // ================= PRODUCTS LOGIC =================
  const updateProductField = (key) => (e) =>
    setProductForm((f) => ({ ...f, [key]: e.target.value }));

  const startEditProduct = (p) => {
    setEditingProductId(p.id);
    setProductForm({
      name: p.name,
      price: String(p.price),
      oldPrice: p.oldPrice ? String(p.oldPrice) : "",
      category: p.category,
      description: p.description || "",
      image: p.image || "",
      badge: p.badge || "",
    });
    setProductMsg("");
    setPhotoLabel(null);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const cancelEditProduct = () => {
    setEditingProductId(null);
    setProductForm(EMPTY_PRODUCT_FORM);
    setPhotoLabel(null);
  };

  const handleProductFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    const dataUrl = await processImageFile(file);
    setUploading(false);
    if (!dataUrl) {
      setProductMsg("Could not process photo file.");
      return;
    }
    setProductForm((f) => ({ ...f, image: dataUrl }));
    setPhotoLabel(`"${file.name}" uploaded`);
  };

  const submitProduct = (e) => {
    e.preventDefault();
    const id = editingProductId;
    const data = {
      name: productForm.name.trim(),
      price: Number(productForm.price),
      oldPrice: productForm.oldPrice ? Number(productForm.oldPrice) : null,
      category: productForm.category,
      description: productForm.description.trim(),
      image:
        productForm.image.trim() ||
        `https://picsum.photos/seed/${id || Date.now()}/800/600`,
      badge: productForm.badge || null,
    };
    if (!data.name || !(data.price > 0)) {
      setProductMsg("Please enter a name and a valid price.");
      return;
    }
    if (id) {
      updateProduct(id, data);
    } else {
      addProduct(data);
    }
    cancelEditProduct();
    setProductMsg(id ? `Updated "${data.name}".` : `Added "${data.name}".`);
  };

  const removeProduct = (p) => {
    if (window.confirm(`Delete "${p.name}" from the catalog?`)) {
      deleteProduct(p.id);
      if (editingProductId === p.id) cancelEditProduct();
      setProductMsg(`Deleted "${p.name}".`);
    }
  };

  const resetProductsCatalog = () => {
    if (
      window.confirm(
        "Reset the catalog to the original products? Your custom additions/edits will be restored."
      )
    ) {
      resetCatalog();
      cancelEditProduct();
      setProductMsg("Catalog reset to defaults.");
    }
  };

  // ================= TOP PROMO BANNER LOGIC =================
  const updateTopBannerField = (key, value) => {
    setTopBannerDraft((prev) => ({ ...prev, [key]: value }));
  };

  const saveTopBanner = (e) => {
    e.preventDefault();
    updateTopBanner(topBannerDraft);
    setBannerMsg("Top promotional banner saved successfully!");
    setTimeout(() => setBannerMsg(""), 4000);
  };

  // ================= HERO SLIDES LOGIC =================
  const startAddSlide = () => {
    setEditingSlide("new");
    setSlideForm({
      ...EMPTY_SLIDE_FORM,
      id: "slide-" + Date.now().toString(36),
    });
    setSlideMsg("");
  };

  const startEditSlide = (slide) => {
    setEditingSlide(slide.id);
    setSlideForm({ ...slide });
    setSlideMsg("");
  };

  const cancelSlideEdit = () => {
    setEditingSlide(null);
    setSlideForm(EMPTY_SLIDE_FORM);
  };

  const handleSlideFile = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setSlideUploading(true);
    const dataUrl = await processImageFile(file);
    setSlideUploading(false);
    if (dataUrl) {
      setSlideForm((f) => ({ ...f, image: dataUrl }));
    }
  };

  const saveSlide = (e) => {
    e.preventDefault();
    let updated;
    if (editingSlide === "new") {
      updated = [...slidesDraft, slideForm];
    } else {
      updated = slidesDraft.map((s) =>
        s.id === editingSlide ? { ...slideForm } : s
      );
    }
    setSlidesDraft(updated);
    updateHeroSlides(updated);
    cancelSlideEdit();
    setSlideMsg("Hero carousel updated successfully!");
    setTimeout(() => setSlideMsg(""), 4000);
  };

  const toggleSlideActive = (slideId) => {
    const updated = slidesDraft.map((s) =>
      s.id === slideId ? { ...s, active: !s.active } : s
    );
    setSlidesDraft(updated);
    updateHeroSlides(updated);
  };

  const deleteSlide = (slideId) => {
    if (slidesDraft.length <= 1) {
      alert("You need at least one slide in the carousel.");
      return;
    }
    if (window.confirm("Delete this banner slide?")) {
      const updated = slidesDraft.filter((s) => s.id !== slideId);
      setSlidesDraft(updated);
      updateHeroSlides(updated);
      if (editingSlide === slideId) cancelSlideEdit();
      setSlideMsg("Slide deleted.");
      setTimeout(() => setSlideMsg(""), 4000);
    }
  };

  // ================= CATEGORIES LOGIC =================
  const startAddCategory = () => {
    setEditingCatId("new");
    setCatForm({
      ...EMPTY_CATEGORY_FORM,
      id: "cat-" + Date.now().toString(36),
    });
    setCatMsg("");
  };

  const startEditCategory = (cat) => {
    setEditingCatId(cat.id || cat.name);
    setCatForm({ ...cat });
    setCatMsg("");
  };

  const cancelCatEdit = () => {
    setEditingCatId(null);
    setCatForm(EMPTY_CATEGORY_FORM);
  };

  const saveCategory = (e) => {
    e.preventDefault();
    if (!catForm.name.trim()) return;
    let updated;
    const catToSave = {
      ...catForm,
      label: catForm.label.trim() || catForm.name.trim(),
    };
    if (editingCatId === "new") {
      updated = [...categoriesDraft, catToSave];
    } else {
      updated = categoriesDraft.map((c) =>
        (c.id || c.name) === editingCatId ? catToSave : c
      );
    }
    setCategoriesDraft(updated);
    updateCategories(updated);
    cancelCatEdit();
    setCatMsg("Categories updated.");
    setTimeout(() => setCatMsg(""), 4000);
  };

  const deleteCategory = (catId) => {
    if (categoriesDraft.length <= 1) {
      alert("Keep at least one category.");
      return;
    }
    if (window.confirm("Remove this category from the navigation strip?")) {
      const updated = categoriesDraft.filter(
        (c) => (c.id || c.name) !== catId
      );
      setCategoriesDraft(updated);
      updateCategories(updated);
      if (editingCatId === catId) cancelCatEdit();
    }
  };

  // ================= SETTINGS LOGIC =================
  const updateSupportLine = (index, value) =>
    setSupportDraft((lines) =>
      lines.map((line, i) => (i === index ? value : line))
    );

  const addSupportLine = () => setSupportDraft((lines) => [...lines, ""]);

  const removeSupportLine = (index) =>
    setSupportDraft((lines) => lines.filter((_, i) => i !== index));

  const saveStoreSettings = (e) => {
    e.preventDefault();
    const lines = supportDraft.map((l) => l.trim()).filter(Boolean);
    if (!lines.length) {
      setSettingsErr("Add at least one support line.");
      return;
    }
    updateSettings({
      support: lines,
      helpInfo: helpDraft,
      subHeader: subHeaderDraft,
    });
    setSettingsErr("");
    setSettingsMsg("Store settings saved successfully!");
    setTimeout(() => setSettingsMsg(""), 4000);
  };

  const submitLogin = (e) => {
    e.preventDefault();
    const email = loginForm.email.trim() || adminEmail;
    if (loginForm.password && loginForm.password !== loginForm.confirm) {
      setLoginMsg("");
      setLoginErr("New password and confirmation don't match.");
      return;
    }
    const res = changeManagerCredentials({
      currentPassword: loginForm.currentPassword,
      email,
      newPassword: loginForm.password || null,
    });
    if (!res.ok) {
      setLoginMsg("");
      setLoginErr(res.error);
      return;
    }
    setLoginErr("");
    setLoginMsg(
      loginForm.password
        ? "Login details updated. Use your new credentials next time."
        : "Email updated."
    );
    setLoginForm({ currentPassword: "", email: "", password: "", confirm: "" });
  };

  const totalValue = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="admin-container">
      {/* Admin Header */}
      <div className="admin-head">
        <div>
          <p className="muted">Store Manager · {user.email}</p>
          <h1 className="page-title">Store Control Center</h1>
        </div>
        <div className="admin-head-actions">
          <Link href="/" className="btn btn-secondary">
            View Live Store
          </Link>
          <button className="btn btn-secondary" onClick={logout}>
            Log out
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stat-row">
        <div className="stat">
          <strong>{products.length}</strong>
          <span>Products</span>
        </div>
        <div className="stat">
          <strong>{formatPrice(totalValue)}</strong>
          <span>Catalog Value</span>
        </div>
        <div className="stat">
          <strong>{slidesDraft.length}</strong>
          <span>Hero Banners</span>
        </div>
        <div className="stat">
          <strong>{categoriesDraft.length}</strong>
          <span>Category Strip</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="admin-tabs">
        <button
          type="button"
          className={`admin-tab ${activeTab === "products" ? "active" : ""}`}
          onClick={() => setActiveTab("products")}
        >
          📦 Products Catalog
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === "topBanner" ? "active" : ""}`}
          onClick={() => setActiveTab("topBanner")}
        >
          📢 Top Promo Banner
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === "heroSlides" ? "active" : ""}`}
          onClick={() => setActiveTab("heroSlides")}
        >
          🎨 Hero Carousel Banners
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === "categories" ? "active" : ""}`}
          onClick={() => setActiveTab("categories")}
        >
          🏷️ Category Strip
        </button>
        <button
          type="button"
          className={`admin-tab ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          ⚙️ General Settings
        </button>
      </div>

      {/* ================= TAB 1: PRODUCTS ================= */}
      {activeTab === "products" && (
        <div className="admin-tab-content">
          {productMsg && <p className="form-success">{productMsg}</p>}

          <div className="admin-layout">
            <form className="checkout-form" onSubmit={submitProduct}>
              <h3>{editingProductId ? "Edit Product" : "Add New Product"}</h3>
              <label>
                Product Name
                <input
                  className="input"
                  required
                  value={productForm.name}
                  onChange={updateProductField("name")}
                  placeholder="e.g. Wireless Noise-Cancelling Headphones"
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
                    value={productForm.price}
                    onChange={updateProductField("price")}
                    placeholder="1200"
                  />
                </label>
                <label>
                  Original Price (Optional)
                  <input
                    className="input"
                    type="number"
                    min="1"
                    step="0.01"
                    value={productForm.oldPrice}
                    onChange={updateProductField("oldPrice")}
                    placeholder="1500 (shows strikethrough)"
                  />
                </label>
              </div>

              <div className="form-row">
                <label>
                  Category
                  <select
                    className="input"
                    value={productForm.category}
                    onChange={updateProductField("category")}
                  >
                    {availableCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  Badge Tag
                  <select
                    className="input"
                    value={productForm.badge}
                    onChange={updateProductField("badge")}
                  >
                    {BADGES.map((b) => (
                      <option key={b} value={b}>
                        {b ? b : "None"}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label>
                Description
                <textarea
                  className="input textarea"
                  rows={3}
                  value={productForm.description}
                  onChange={updateProductField("description")}
                  placeholder="Details, key features, warranty…"
                />
              </label>

              <label>
                Photo
                <div className="file-input-wrap">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                      productFileRef.current && productFileRef.current.click()
                    }
                    disabled={uploading}
                  >
                    {uploading ? "Uploading…" : "Upload photo"}
                  </button>
                  <input
                    ref={productFileRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleProductFile}
                  />
                  {photoLabel && <span className="muted">{photoLabel}</span>}
                </div>
                <input
                  className="input"
                  value={productForm.image}
                  onChange={(e) => {
                    setPhotoLabel(null);
                    updateProductField("image")(e);
                  }}
                  placeholder="…or paste image URL (https://…)"
                />
              </label>

              {productForm.image.trim() ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={productForm.image.trim()}
                  alt="Product preview"
                  className="form-preview"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : null}

              <div className="form-row">
                <button type="submit" className="btn btn-primary">
                  {editingProductId ? "Save Changes" : "Add Product"}
                </button>
                {editingProductId && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cancelEditProduct}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="admin-table-wrap">
              <div className="admin-table-head">
                <h3>Catalog ({products.length})</h3>
                <button
                  type="button"
                  className="link-danger"
                  onClick={resetProductsCatalog}
                >
                  Reset Defaults
                </button>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr
                      key={p.id}
                      className={
                        editingProductId === p.id ? "row-editing" : ""
                      }
                    >
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
                        <button
                          className="link-btn"
                          onClick={() => startEditProduct(p)}
                        >
                          Edit
                        </button>
                        <button
                          className="link-danger"
                          onClick={() => removeProduct(p)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: TOP PROMO BANNER ================= */}
      {activeTab === "topBanner" && (
        <div className="admin-tab-content">
          <div className="admin-panel-card">
            <h3>Top Promotional Banner Control</h3>
            <p className="muted">
              Configure the top full-width announcement strip (e.g. &quot;BACK TO
              SCHOOL&quot;, call to order number, &amp; shop now button).
            </p>

            {bannerMsg && <p className="form-success">{bannerMsg}</p>}

            {/* Live Preview Box */}
            <div className="admin-preview-section">
              <h4>Live Banner Preview:</h4>
              <div
                className="top-promo-banner"
                style={{
                  backgroundColor: topBannerDraft.bgColor || "#0062ff",
                  color: topBannerDraft.textColor || "#ffffff",
                  borderRadius: 8,
                }}
              >
                <div className="container top-promo-banner-inner">
                  <div className="top-promo-left">
                    <span className="top-promo-title">
                      {topBannerDraft.tagline || "BACK TO SCHOOL"}
                    </span>
                    {topBannerDraft.badge && (
                      <span className="top-promo-badge">
                        {topBannerDraft.badge}
                      </span>
                    )}
                  </div>

                  <div className="top-promo-right">
                    {topBannerDraft.phone && (
                      <div className="top-promo-call">
                        <span className="top-promo-call-label">
                          {topBannerDraft.phoneLabel || "CALL TO ORDER"}
                        </span>
                        <strong className="top-promo-call-number">
                          {topBannerDraft.phone}
                        </strong>
                      </div>
                    )}
                    {topBannerDraft.buttonText && (
                      <span className="top-promo-btn">
                        {topBannerDraft.buttonText}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={saveTopBanner} className="checkout-form" style={{ marginTop: 24 }}>
              <label className="checkbox-label" style={{ marginBottom: 16 }}>
                <input
                  type="checkbox"
                  checked={topBannerDraft.enabled}
                  onChange={(e) =>
                    updateTopBannerField("enabled", e.target.checked)
                  }
                />
                <strong>Enable Top Promotional Banner on storefront</strong>
              </label>

              <div className="form-row">
                <label>
                  Main Tagline / Title
                  <input
                    className="input"
                    value={topBannerDraft.tagline}
                    onChange={(e) =>
                      updateTopBannerField("tagline", e.target.value)
                    }
                    placeholder="e.g. BACK TO SCHOOL"
                  />
                </label>
                <label>
                  Discount / Offer Badge Pill
                  <input
                    className="input"
                    value={topBannerDraft.badge}
                    onChange={(e) =>
                      updateTopBannerField("badge", e.target.value)
                    }
                    placeholder="e.g. UP TO 60% OFF"
                  />
                </label>
              </div>

              <div className="form-row">
                <label>
                  Call To Order Label
                  <input
                    className="input"
                    value={topBannerDraft.phoneLabel}
                    onChange={(e) =>
                      updateTopBannerField("phoneLabel", e.target.value)
                    }
                    placeholder="e.g. CALL TO ORDER"
                  />
                </label>
                <label>
                  Phone Number
                  <input
                    className="input"
                    value={topBannerDraft.phone}
                    onChange={(e) =>
                      updateTopBannerField("phone", e.target.value)
                    }
                    placeholder="e.g. 030 274 0642"
                  />
                </label>
              </div>

              <div className="form-row">
                <label>
                  Button Text
                  <input
                    className="input"
                    value={topBannerDraft.buttonText}
                    onChange={(e) =>
                      updateTopBannerField("buttonText", e.target.value)
                    }
                    placeholder="e.g. SHOP NOW"
                  />
                </label>
                <label>
                  Button Link Target
                  <input
                    className="input"
                    value={topBannerDraft.buttonLink}
                    onChange={(e) =>
                      updateTopBannerField("buttonLink", e.target.value)
                    }
                    placeholder="e.g. /#products or /?c=Fashion"
                  />
                </label>
              </div>

              <div className="form-row">
                <label>
                  Background Color
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <input
                      type="color"
                      value={topBannerDraft.bgColor || "#0062ff"}
                      onChange={(e) =>
                        updateTopBannerField("bgColor", e.target.value)
                      }
                      style={{
                        width: 48,
                        height: 38,
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    />
                    <input
                      className="input"
                      value={topBannerDraft.bgColor || "#0062ff"}
                      onChange={(e) =>
                        updateTopBannerField("bgColor", e.target.value)
                      }
                      placeholder="#0062ff"
                    />
                  </div>
                </label>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: 10 }}>
                Save Top Banner Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= TAB 3: HERO CAROUSEL BANNERS ================= */}
      {activeTab === "heroSlides" && (
        <div className="admin-tab-content">
          <div className="admin-panel-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h3>Hero Carousel Slides &amp; Banners</h3>
                <p className="muted">
                  Control the large interactive banner carousel on the homepage.
                </p>
              </div>
              {!editingSlide && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={startAddSlide}
                >
                  <PlusIcon size={16} /> Add New Slide
                </button>
              )}
            </div>

            {slideMsg && <p className="form-success">{slideMsg}</p>}

            {/* Slide Editor Form */}
            {editingSlide && (
              <form onSubmit={saveSlide} className="checkout-form admin-slide-form">
                <h4>
                  {editingSlide === "new" ? "Create New Hero Slide" : "Edit Hero Slide"}
                </h4>

                <label className="checkbox-label" style={{ marginBottom: 12 }}>
                  <input
                    type="checkbox"
                    checked={slideForm.active !== false}
                    onChange={(e) =>
                      setSlideForm((f) => ({ ...f, active: e.target.checked }))
                    }
                  />
                  <span>Active (visible on storefront)</span>
                </label>

                <div className="form-row">
                  <label>
                    Badge / Tagline
                    <input
                      className="input"
                      required
                      value={slideForm.badge}
                      onChange={(e) =>
                        setSlideForm((f) => ({ ...f, badge: e.target.value }))
                      }
                      placeholder="e.g. KAMGEORGE BACK TO SCHOOL"
                    />
                  </label>
                  <label>
                    Color Theme
                    <select
                      className="input"
                      value={slideForm.theme || "blue"}
                      onChange={(e) =>
                        setSlideForm((f) => ({ ...f, theme: e.target.value }))
                      }
                    >
                      {THEME_OPTIONS.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label>
                  Headline (Big Title)
                  <input
                    className="input"
                    required
                    value={slideForm.title}
                    onChange={(e) =>
                      setSlideForm((f) => ({ ...f, title: e.target.value }))
                    }
                    placeholder="e.g. Smart Essentials for Less"
                  />
                </label>

                <label>
                  Subtitle / Promo Text
                  <input
                    className="input"
                    value={slideForm.subtitle}
                    onChange={(e) =>
                      setSlideForm((f) => ({ ...f, subtitle: e.target.value }))
                    }
                    placeholder="e.g. Up to 60% off · Limited quantity"
                  />
                </label>

                <div className="form-row">
                  <label>
                    Button Text
                    <input
                      className="input"
                      value={slideForm.buttonText}
                      onChange={(e) =>
                        setSlideForm((f) => ({ ...f, buttonText: e.target.value }))
                      }
                      placeholder="e.g. Shop Now →"
                    />
                  </label>
                  <label>
                    Button Link Target
                    <input
                      className="input"
                      value={slideForm.buttonLink}
                      onChange={(e) =>
                        setSlideForm((f) => ({ ...f, buttonLink: e.target.value }))
                      }
                      placeholder="e.g. /#products or /?c=Electronics"
                    />
                  </label>
                </div>

                <label>
                  Disclaimer / Fine Print
                  <input
                    className="input"
                    value={slideForm.disclaimer}
                    onChange={(e) =>
                      setSlideForm((f) => ({ ...f, disclaimer: e.target.value }))
                    }
                    placeholder="e.g. T&amp;Cs apply"
                  />
                </label>

                <label>
                  Hero Image
                  <div className="file-input-wrap">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() =>
                        slideFileRef.current && slideFileRef.current.click()
                      }
                      disabled={slideUploading}
                    >
                      {slideUploading ? "Processing…" : "Upload banner photo"}
                    </button>
                    <input
                      ref={slideFileRef}
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleSlideFile}
                    />
                  </div>
                  <input
                    className="input"
                    value={slideForm.image}
                    onChange={(e) =>
                      setSlideForm((f) => ({ ...f, image: e.target.value }))
                    }
                    placeholder="…or paste image URL (https://…)"
                  />
                </label>

                {slideForm.image && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={slideForm.image}
                    alt="Hero preview"
                    className="form-preview"
                    style={{ maxHeight: 180 }}
                  />
                )}

                <div className="form-row" style={{ marginTop: 14 }}>
                  <button type="submit" className="btn btn-primary">
                    Save Slide
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cancelSlideEdit}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Slides List Grid */}
            <div className="admin-slides-grid">
              {slidesDraft.map((s, index) => (
                <div
                  key={s.id || index}
                  className={`admin-slide-card ${s.active === false ? "inactive" : ""}`}
                >
                  <div className="admin-slide-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} alt="" />
                    <span className={`admin-slide-tag theme-${s.theme || "blue"}`}>
                      {s.badge}
                    </span>
                  </div>
                  <div className="admin-slide-info">
                    <h4>{s.title}</h4>
                    <p className="muted">{s.subtitle}</p>
                    <div className="admin-slide-meta">
                      <span>Button: {s.buttonText}</span>
                      <span>Target: {s.buttonLink}</span>
                    </div>
                  </div>
                  <div className="admin-slide-actions">
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => toggleSlideActive(s.id)}
                    >
                      {s.active !== false ? "✓ Active" : "Hidden"}
                    </button>
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => startEditSlide(s)}
                    >
                      <EditIcon size={14} /> Edit
                    </button>
                    <button
                      type="button"
                      className="link-danger"
                      onClick={() => deleteSlide(s.id)}
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: CATEGORY STRIP ================= */}
      {activeTab === "categories" && (
        <div className="admin-tab-content">
          <div className="admin-panel-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <h3>Horizontal Category Strip Management</h3>
                <p className="muted">
                  Manage the categories and icons shown below the search bar and in the filter list.
                </p>
              </div>
              {!editingCatId && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={startAddCategory}
                >
                  <PlusIcon size={16} /> Add Category
                </button>
              )}
            </div>

            {catMsg && <p className="form-success">{catMsg}</p>}

            {/* Category Form */}
            {editingCatId && (
              <form onSubmit={saveCategory} className="checkout-form" style={{ marginBottom: 20 }}>
                <h4>
                  {editingCatId === "new" ? "Add New Category" : "Edit Category"}
                </h4>

                <div className="form-row">
                  <label>
                    Category Name (Filter Value)
                    <input
                      className="input"
                      required
                      value={catForm.name}
                      onChange={(e) =>
                        setCatForm((f) => ({ ...f, name: e.target.value }))
                      }
                      placeholder="e.g. Phones &amp; Tablets"
                    />
                  </label>
                  <label>
                    Display Label (Nav Text)
                    <input
                      className="input"
                      value={catForm.label}
                      onChange={(e) =>
                        setCatForm((f) => ({ ...f, label: e.target.value }))
                      }
                      placeholder="e.g. Phones &amp; Tablets"
                    />
                  </label>
                </div>

                <label>
                  Icon
                  <select
                    className="input"
                    value={catForm.icon || "store"}
                    onChange={(e) =>
                      setCatForm((f) => ({ ...f, icon: e.target.value }))
                    }
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="form-row" style={{ marginTop: 12 }}>
                  <button type="submit" className="btn btn-primary">
                    Save Category
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cancelCatEdit}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Category List */}
            <div className="admin-categories-grid">
              {categoriesDraft.map((cat) => (
                <div key={cat.id || cat.name} className="admin-category-card">
                  <div className="admin-category-icon-box">
                    <RenderCategoryIcon iconKey={cat.icon} size={22} />
                  </div>
                  <div className="admin-category-details">
                    <strong>{cat.label || cat.name}</strong>
                    <span className="muted">Filter: {cat.name}</span>
                  </div>
                  <div className="admin-category-actions">
                    <button
                      type="button"
                      className="link-btn"
                      onClick={() => startEditCategory(cat)}
                    >
                      <EditIcon size={14} />
                    </button>
                    <button
                      type="button"
                      className="link-danger"
                      onClick={() => deleteCategory(cat.id || cat.name)}
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: GENERAL SETTINGS ================= */}
      {activeTab === "settings" && (
        <div className="admin-tab-content">
          <div className="admin-layout">
            {/* Store & Contact Settings */}
            <form className="checkout-form" onSubmit={saveStoreSettings}>
              <h3>Store &amp; Customer Support Details</h3>
              <p className="muted">
                These contact details appear in the header Help dropdown, mobile drawer, and footer.
              </p>

              {settingsErr && <p className="form-error">{settingsErr}</p>}
              {settingsMsg && <p className="form-success">{settingsMsg}</p>}

              <label className="checkbox-label" style={{ margin: "12px 0" }}>
                <input
                  type="checkbox"
                  checked={subHeaderDraft.enabled !== false}
                  onChange={(e) =>
                    setSubHeaderDraft((s) => ({ ...s, enabled: e.target.checked }))
                  }
                />
                <span>Enable &quot;Sell on Store&quot; sub-bar strip</span>
              </label>

              <div className="form-row">
                <label>
                  &quot;Sell on Store&quot; Text
                  <input
                    className="input"
                    value={subHeaderDraft.sellText || "Sell on KamGeorge"}
                    onChange={(e) =>
                      setSubHeaderDraft((s) => ({ ...s, sellText: e.target.value }))
                    }
                  />
                </label>
                <label>
                  &quot;Sell on Store&quot; Link
                  <input
                    className="input"
                    value={subHeaderDraft.sellLink || "/register"}
                    onChange={(e) =>
                      setSubHeaderDraft((s) => ({ ...s, sellLink: e.target.value }))
                    }
                  />
                </label>
              </div>

              <div className="form-row">
                <label>
                  Support Phone Number
                  <input
                    className="input"
                    value={helpDraft.phone || "030 274 0642"}
                    onChange={(e) =>
                      setHelpDraft((h) => ({ ...h, phone: e.target.value }))
                    }
                  />
                </label>
                <label>
                  Support Email
                  <input
                    className="input"
                    value={helpDraft.email || "hello@kamgeorge.com"}
                    onChange={(e) =>
                      setHelpDraft((h) => ({ ...h, email: e.target.value }))
                    }
                  />
                </label>
              </div>

              <label>
                Operating Hours
                <input
                  className="input"
                  value={helpDraft.hours || "Mon - Sun: 8am - 8pm"}
                  onChange={(e) =>
                    setHelpDraft((h) => ({ ...h, hours: e.target.value }))
                  }
                />
              </label>

              <h4 style={{ marginTop: 24, marginBottom: 8 }}>Footer Support Lines</h4>
              {supportDraft.map((line, i) => (
                <div className="support-row" key={i}>
                  <input
                    className="input"
                    value={line}
                    onChange={(e) => updateSupportLine(i, e.target.value)}
                    placeholder="e.g. Delivery in 1–3 days"
                    maxLength={80}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => removeSupportLine(i)}
                    disabled={supportDraft.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="form-row" style={{ marginTop: 12 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={addSupportLine}
                >
                  + Add line
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Store Settings
                </button>
              </div>
            </form>

            {/* Manager Login Credentials */}
            <form className="checkout-form" onSubmit={submitLogin}>
              <h3>Manager Login Credentials</h3>
              <p className="muted">
                Change the email address and password used to sign in to this management portal.
              </p>

              {loginErr && <p className="form-error">{loginErr}</p>}
              {loginMsg && <p className="form-success">{loginMsg}</p>}

              <label>
                Current Manager Password
                <input
                  className="input"
                  type="password"
                  required
                  value={loginForm.currentPassword}
                  onChange={(e) =>
                    setLoginForm((f) => ({
                      ...f,
                      currentPassword: e.target.value,
                    }))
                  }
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />
              </label>

              <label>
                Manager Email
                <input
                  className="input"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm((f) => ({ ...f, email: e.target.value }))
                  }
                  placeholder={adminEmail}
                  autoComplete="username"
                />
              </label>

              <div className="form-row">
                <label>
                  New Password (optional)
                  <input
                    className="input"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm((f) => ({
                        ...f,
                        password: e.target.value,
                      }))
                    }
                    placeholder="Leave blank to keep current"
                    autoComplete="new-password"
                  />
                </label>
                <label>
                  Confirm New Password
                  <input
                    className="input"
                    type="password"
                    value={loginForm.confirm}
                    onChange={(e) =>
                      setLoginForm((f) => ({ ...f, confirm: e.target.value }))
                    }
                    placeholder="Repeat new password"
                    autoComplete="new-password"
                  />
                </label>
              </div>

              <button type="submit" className="btn btn-primary">
                Update Manager Credentials
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
