"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSettings } from "@/components/SettingsContext";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

export default function HeroSlider() {
  const { settings } = useSettings();
  const rawSlides = settings.heroSlides || [];
  const slides = rawSlides.filter((s) => s.active !== false);

  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance slides every 5s if not hovered/paused
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  if (!slides || slides.length === 0) return null;

  // Safeguard index if slides changed in admin
  const activeIndex = current >= slides.length ? 0 : current;
  const slide = slides[activeIndex];

  const nextSlide = (e) => {
    e?.stopPropagation();
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = (e) => {
    e?.stopPropagation();
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const getThemeClass = (theme) => {
    switch (theme) {
      case "dark":
        return "hero-theme-dark";
      case "orange":
        return "hero-theme-orange";
      case "purple":
        return "hero-theme-purple";
      case "green":
        return "hero-theme-green";
      default:
        return "hero-theme-blue";
    }
  };

  return (
    <section
      className="hero-slider-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Promotions and Featured Deals"
    >
      <div
        className={`hero-slider-card ${getThemeClass(slide.theme)}`}
        style={
          slide.bgColor && !slide.theme
            ? { background: slide.bgColor }
            : {}
        }
      >
        {/* Notebook spiral / backdrop decoration */}
        <div className="hero-notebook-decor" aria-hidden="true">
          <div className="hero-spiral-dots">
            {Array.from({ length: 16 }).map((_, i) => (
              <span key={i} className="hero-spiral-ring" />
            ))}
          </div>
        </div>

        {/* Content Column */}
        <div className="hero-slide-body">
          {slide.badge && (
            <div className="hero-slide-badge">
              <span className="hero-badge-star">✪</span>
              <span>{slide.badge}</span>
            </div>
          )}

          <h1 className="hero-slide-title">{slide.title}</h1>

          {slide.subtitle && (
            <p className="hero-slide-sub">{slide.subtitle}</p>
          )}

          <div className="hero-slide-actions">
            {slide.buttonText && (
              <Link
                href={slide.buttonLink || "/#products"}
                className="hero-slide-btn"
              >
                {slide.buttonText}
              </Link>
            )}
            {slide.disclaimer && (
              <span className="hero-slide-disclaimer">{slide.disclaimer}</span>
            )}
          </div>
        </div>

        {/* Visual / Image Column */}
        <div className="hero-slide-media">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.image}
            alt={slide.title}
            className="hero-slide-img"
            loading="eager"
          />
        </div>

        {/* Prev / Next controls */}
        {slides.length > 1 && (
          <>
            <button
              className="hero-nav-arrow hero-nav-prev"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <ChevronLeftIcon size={20} />
            </button>
            <button
              className="hero-nav-arrow hero-nav-next"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <ChevronRightIcon size={20} />
            </button>
          </>
        )}

        {/* Pagination indicators / dots */}
        {slides.length > 1 && (
          <div className="hero-slider-pagination" role="tablist">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`hero-dot ${
                  idx === activeIndex ? "hero-dot-active" : ""
                }`}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                aria-selected={idx === activeIndex}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
