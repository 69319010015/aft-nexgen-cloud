"use client";

// ============================================
// Facebook Feed — Image Carousel/Slider
// Left (<) and Right (>) arrow navigation
// ============================================

import { useState, useCallback } from "react";

// Mock Facebook post data (will be replaced with real API data)
const FB_POSTS = [
  {
    id: 1,
    imageUrl: "https://placehold.co/800x400/0F172A/EAB308?text=อวท.+ประกาศผลการแข่งขัน&font=noto-sans-thai",
    title: "🏆 ประกาศผลการแข่งขันทักษะวิชาชีพ 2569",
    date: "15 กรกฎาคม 2569",
  },
  {
    id: 2,
    imageUrl: "https://placehold.co/800x400/3293ff/FFFFFF?text=รับสมัคร+นักศึกษาใหม่+ปีการศึกษา+2570&font=noto-sans-thai",
    title: "📢 เปิดรับสมัครนักศึกษาใหม่ ปีการศึกษา 2570",
    date: "10 กรกฎาคม 2569",
  },
  {
    id: 3,
    imageUrl: "https://placehold.co/800x400/0F172A/EAB308?text=โครงการอบรมคุณธรรม+จริยธรรม&font=noto-sans-thai",
    title: "📸 โครงการอบรมคุณธรรม จริยธรรม นักศึกษา อวท.",
    date: "5 กรกฎาคม 2569",
  },
  {
    id: 4,
    imageUrl: "https://placehold.co/800x400/3293ff/FFFFFF?text=ทัศนศึกษาดูงาน+สถานประกอบการ&font=noto-sans-thai",
    title: "🚌 ทัศนศึกษาดูงานสถานประกอบการชั้นนำ",
    date: "28 มิถุนายน 2569",
  },
  {
    id: 5,
    imageUrl: "https://placehold.co/800x400/0F172A/EAB308?text=แข่งขันกีฬาสี+ภายในวิทยาลัย&font=noto-sans-thai",
    title: "⚽ แข่งขันกีฬาสีภายใน วิทยาลัยเทคนิคอุดรธานี",
    date: "20 มิถุนายน 2569",
  },
];

export function FacebookFeed() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goPrev = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? FB_POSTS.length - 1 : prev - 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex(prev => (prev === FB_POSTS.length - 1 ? 0 : prev + 1));
  }, []);

  const post = FB_POSTS[currentIndex];

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3">
        <span className="text-lg">📱</span>
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
          Facebook Feed — อวท. วิทยาลัยเทคนิคอุดรธานี
        </h2>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Image */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: "2/1" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={post.id}
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-opacity duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/800x400/0F172A/666666?text=Image+Not+Available";
            }}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />

          {/* Title & date overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-sm font-semibold text-white drop-shadow-lg">{post.title}</p>
            <p className="text-xs text-white/70 mt-1">{post.date}</p>
          </div>
        </div>

        {/* Left Arrow */}
        <button
          onClick={goPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white transition-all duration-200 hover:bg-black/60 hover:scale-110 focus:outline-none"
          aria-label="Previous post"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Arrow */}
        <button
          onClick={goNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white transition-all duration-200 hover:bg-black/60 hover:scale-110 focus:outline-none"
          aria-label="Next post"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-2 right-4 z-10 flex gap-1.5">
          {FB_POSTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2 w-2 rounded-full transition-all duration-200 ${
                i === currentIndex ? "bg-yellow-400 w-4" : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to post ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-2 flex items-center justify-between">
        <p className="text-[10px] text-[var(--color-text-muted)]">
          อัปเดตข่าวสารล่าสุดจาก Facebook Page หลักของ อวท.
        </p>
        <p className="text-[10px] text-[var(--color-text-muted)]">
          {currentIndex + 1} / {FB_POSTS.length}
        </p>
      </div>
    </div>
  );
}