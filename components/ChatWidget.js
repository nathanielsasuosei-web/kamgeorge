"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import { useCart } from "@/components/CartContext";
import { useProducts } from "@/components/ProductsContext";
import { formatPrice } from "@/lib/products";
import { SUGGESTIONS, getAssistantReply } from "@/lib/assistant";

export default function ChatWidget() {
  const { products } = useProducts();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hi there! 👋 I'm Little George, your KamGeorge shopping assistant.\nAsk me about products, prices, delivery, payments or tracking your order!",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  const send = (rawText) => {
    const text = (rawText ?? input).trim();
    if (!text || typing) return;
    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setTyping(true);
    const reply = getAssistantReply(text, { products, user });
    const delay = 500 + Math.min(reply.text.length * 5, 1400);
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", ...reply }]);
      setTyping(false);
    }, delay);
  };

  const handleAdd = (product) => {
    addItem(product.id);
    setMessages((prev) => [
      ...prev,
      {
        from: "bot",
        text: `Added “${product.name}” to your cart! 🛒`,
        links: [{ label: "View cart", href: "/cart" }],
      },
    ]);
  };

  return (
    <>
      {open && (
        <div
          className="chat-panel"
          role="dialog"
          aria-label="Chat with Little George"
        >
          <div className="chat-header">
            <div className="chat-avatar">LG</div>
            <div className="chat-identity">
              <strong>Little George</strong>
              <span className="chat-status">
                <span className="chat-dot" /> Online · replies instantly
              </span>
            </div>
            <button
              className="chat-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.from === "user" ? "msg-row msg-user-row" : "msg-row"}
              >
                {m.from === "bot" && (
                  <div className="chat-avatar chat-avatar-sm">LG</div>
                )}
                <div className="msg-col">
                  <div
                    className={
                      m.from === "user" ? "bubble bubble-user" : "bubble bubble-bot"
                    }
                  >
                    {m.text}
                  </div>
                  {m.products && m.products.length > 0 && (
                    <div className="chat-products">
                      {m.products.map((p) => (
                        <div key={p.id} className="chat-product">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.image} alt="" />
                          <div className="chat-product-info">
                            <Link
                              href={`/products/${p.id}`}
                              onClick={() => setOpen(false)}
                            >
                              {p.name}
                            </Link>
                            <span>{formatPrice(p.price)}</span>
                          </div>
                          <button
                            className="chat-add"
                            onClick={() => handleAdd(p)}
                            aria-label={`Add ${p.name} to cart`}
                          >
                            +
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {m.links && m.links.length > 0 && (
                    <div className="chat-links">
                      {m.links.map((l) => (
                        <Link
                          key={l.href + l.label}
                          href={l.href}
                          className="chat-link"
                          onClick={() => setOpen(false)}
                        >
                          {l.label} →
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="msg-row">
                <div className="chat-avatar chat-avatar-sm">LG</div>
                <div className="bubble bubble-bot typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chat-suggest">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} disabled={typing}>
                {s}
              </button>
            ))}
          </div>

          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Little George…"
              aria-label="Message Little George"
            />
            <button
              type="submit"
              aria-label="Send message"
              disabled={typing || !input.trim()}
            >
              ➤
            </button>
          </form>
        </div>
      )}
      <button
        className="chat-fab"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Chat with Little George"}
      >
        {open ? "✕ Close" : "💬 Little George"}
      </button>
    </>
  );
}
