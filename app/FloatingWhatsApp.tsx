"use client";

import { useEffect, useRef, useState } from "react";

const contacts = [
  { name: "Budi", phone: "0877 7671 3715", whatsapp: "6287776713715" },
  { name: "Erwin", phone: "0813 1069 7112", whatsapp: "6281310697112" },
  { name: "Retno", phone: "0813 3200 200", whatsapp: "628133200200" },
];

export default function FloatingWhatsApp() {
  const [open, setOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    function closeOnOutsideClick(event: PointerEvent) {
      if (!widgetRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  return (
    <div className="floating-wa-widget" ref={widgetRef}>
      {open && (
        <div className="floating-wa-menu" id="floating-wa-contacts">
          <p>Pilih kontak WhatsApp</p>
          {contacts.map(({ name, phone, whatsapp }) => (
            <a
              key={name}
              href={"https://wa.me/" + whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              aria-label={"Chat dengan " + name + " melalui WhatsApp, " + phone}
            >
              <span className="floating-wa-avatar" aria-hidden="true">{name[0]}</span>
              <span className="floating-wa-contact"><strong>{name}</strong><small>{phone}</small></span>
              <span className="floating-wa-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      )}
      <button
        ref={buttonRef}
        type="button"
        className="floating-wa"
        aria-label={open ? "Tutup pilihan kontak WhatsApp" : "Pilih kontak WhatsApp"}
        aria-expanded={open}
        aria-controls="floating-wa-contacts"
        onClick={() => setOpen((current) => !current)}
      >
        <svg aria-hidden="true" viewBox="0 0 32 32" focusable="false">
          <path d="M16 .8C7.65.8.8 7.5.8 15.8c0 2.7.7 5.3 2.1 7.6L.7 31l7.8-2.1c2.2 1.2 4.8 1.9 7.5 1.9 8.3 0 15-6.7 15-15S24.3.8 16 .8Zm0 27.5c-2.4 0-4.8-.7-6.8-1.9l-.5-.3-4.6 1.2 1.2-4.5-.3-.5c-1.3-2.1-2-4.5-2-7 0-7 5.7-12.7 12.7-12.7 3.4 0 6.6 1.3 9 3.7 2.4 2.4 3.7 5.6 3.7 9s-1.3 6.6-3.7 9c-2.4 2.4-5.6 3.7-9 3.7Zm7-9.5c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2-.2.4-.9 1.2-1.1 1.4-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8l.6-.7c.2-.2.3-.4.4-.7.1-.2 0-.5 0-.7l-1.2-2.9c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1s1.4 3.5 1.6 3.7c.2.2 2.7 4.1 6.6 5.8.9.4 1.6.6 2.1.8.9.3 1.7.2 2.3.1.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.7.2-1.8-.1-.1-.3-.2-.7-.4Z" />
        </svg>
        <span>Chat sekarang</span>
      </button>
    </div>
  );
}
