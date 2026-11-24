"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";

const AUTO_INTERVAL = 5000;
const INTERACTION_DELAY = 8000;

function scrollToSlide(track: HTMLDivElement, index: number) {
  const slide = track.children[index] as HTMLElement | undefined;
  if (!slide) return;
  track.scrollTo({ left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
}

export default function InteractiveCarousel({ label, children }: { label: string; children: ReactNode }) {
  const slides = Children.toArray(children);
  const regionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; scroll: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pointerHeld, setPointerHeld] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [motionOverride, setMotionOverride] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(0);
  const motionBlocked = reducedMotion && !motionOverride;
  const autoEnabled = !userPaused && !motionBlocked && slides.length > 1;
  const autoRunning = autoEnabled && inView && pageVisible && !hovered && !focused && !pointerHeld;

  function noteInteraction() { setLastInteraction(Date.now()); }

  useEffect(() => {
    const region = regionRef.current;
    if (!region) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motion.matches);
    const updateVisibility = () => { setPageVisible(!document.hidden); setLastInteraction(Date.now()); };
    const releasePointer = () => { setPointerHeld(false); setLastInteraction(Date.now()); };
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= .25), { threshold: [0, .25] });
    observer.observe(region);
    updateMotion();
    setPageVisible(!document.hidden);
    motion.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    window.addEventListener("pointerup", releasePointer);
    window.addEventListener("pointercancel", releasePointer);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
      window.removeEventListener("pointerup", releasePointer);
      window.removeEventListener("pointercancel", releasePointer);
    };
  }, []);

  useEffect(() => {
    if (!autoRunning) return;
    const delay = Math.max(AUTO_INTERVAL, INTERACTION_DELAY - (Date.now() - lastInteraction));
    const timer = window.setTimeout(() => {
      if (trackRef.current) scrollToSlide(trackRef.current, (active + 1) % slides.length);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [autoRunning, active, lastInteraction, slides.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const update = () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      let nearest = 0, distance = Infinity;
      Array.from(track.children).forEach((slide, i) => {
        const node = slide as HTMLElement;
        const delta = Math.abs(node.offsetLeft + node.offsetWidth / 2 - center);
        if (delta < distance) { nearest = i; distance = delta; }
      });
      setActive(nearest);
    };
    track.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(track);
    update();
    return () => { track.removeEventListener("scroll", update); observer.disconnect(); };
  }, []);

  function goTo(index: number) {
    const track = trackRef.current;
    noteInteraction();
    if (track) scrollToSlide(track, index);
  }

  return (
    <div className="interactive-carousel" ref={regionRef} role="region" aria-roledescription="carousel" aria-label={label} data-autoplay={autoEnabled ? (autoRunning ? "running" : "paused") : "off"}
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
      onPointerLeave={(event) => { if (event.pointerType === "mouse") { setHovered(false); noteInteraction(); } }}
      onPointerDownCapture={() => { setPointerHeld(true); noteInteraction(); }}
      onFocusCapture={() => { setFocused(true); noteInteraction(); }}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) { setFocused(false); noteInteraction(); } }}
      onKeyDownCapture={noteInteraction} onWheelCapture={noteInteraction}>
      <div className="carousel-toolbar">
        <span className="carousel-hint"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 8-4 4 4 4m10-8 4 4-4 4M3 12h18" /></svg> Geser untuk jelajahi</span>
        <div className="carousel-arrows">
          <button type="button" className="carousel-playback" aria-label={`${label}: ${autoEnabled ? "jeda" : "mulai"} putar otomatis`} onClick={() => {
            if (userPaused || motionBlocked) { setUserPaused(false); setMotionOverride(true); } else setUserPaused(true);
          }}><svg viewBox="0 0 20 20" aria-hidden="true">{autoEnabled ? <path d="M7 5v10M13 5v10" /> : <path d="m7 4 9 6-9 6V4Z" />}</svg></button>
          <button type="button" aria-label={`${label}: slide sebelumnya`} disabled={active === 0} onClick={() => goTo(active - 1)}>←</button>
          <button type="button" aria-label={`${label}: slide berikutnya`} disabled={active === slides.length - 1} onClick={() => goTo(active + 1)}>→</button>
        </div>
      </div>
      <div className="carousel-track" ref={trackRef} tabIndex={0} aria-label={`Slide ${label}`} onKeyDown={(event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); goTo(Math.max(0, Math.min(slides.length - 1, active + (event.key === "ArrowRight" ? 1 : -1)))); }
        if (event.key === "Home" || event.key === "End") { event.preventDefault(); goTo(event.key === "Home" ? 0 : slides.length - 1); }
      }} onPointerDown={(event) => {
        if (event.pointerType !== "mouse" || event.button !== 0) return;
        suppressClick.current = false;
        drag.current = { x: event.clientX, scroll: event.currentTarget.scrollLeft, moved: false };
      }} onPointerMove={(event) => {
        const current = drag.current;
        if (!current) return;
        const delta = event.clientX - current.x;
        if (Math.abs(delta) > 6) { current.moved = true; event.currentTarget.dataset.dragging = "true"; event.currentTarget.setPointerCapture(event.pointerId); event.currentTarget.scrollLeft = current.scroll - delta; }
      }} onPointerUp={(event) => {
        suppressClick.current = drag.current?.moved ?? false;
        drag.current = null;
        delete event.currentTarget.dataset.dragging;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      }} onPointerCancel={(event) => { drag.current = null; delete event.currentTarget.dataset.dragging; }} onClickCapture={(event) => {
        if (suppressClick.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; }
      }} onFocusCapture={(event) => {
        const slide = (event.target as HTMLElement).closest<HTMLElement>(".carousel-slide");
        if (slide && trackRef.current) goTo(Array.from(trackRef.current.children).indexOf(slide));
      }}>
        {slides.map((child, i) => <div className={`carousel-slide${active === i ? " is-current" : ""}`} key={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} dari ${slides.length}`}>{child}</div>)}
      </div>
      <div className="carousel-footer">
        <div className="carousel-dots" aria-label={`Navigasi ${label}`}>{slides.map((_, i) => <button type="button" key={i} aria-label={`${label}: tampilkan slide ${i + 1}`} aria-current={active === i ? "true" : undefined} onClick={() => goTo(i)}><span /></button>)}</div>
        <span className="carousel-status">{autoEnabled ? (autoRunning ? "Otomatis" : "Dijeda") : "Manual"}</span>
        <span className="carousel-count" aria-live={autoRunning ? "off" : "polite"}><strong>{String(active + 1).padStart(2, "0")}</strong> / {String(slides.length).padStart(2, "0")}</span>
      </div>
    </div>
  );
}
