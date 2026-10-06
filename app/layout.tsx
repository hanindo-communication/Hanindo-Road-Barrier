import type { Metadata } from "next";
import FloatingWhatsApp from "./FloatingWhatsApp";
import "./globals.css";
import "./journey.css";
import "./experience.css";
import "./modern.css";
import "./catalog.css";
import "./theme.css";
import "./floating-whatsapp.css";
import "./product-photo.css";

export const metadata: Metadata = {
  title: "Road Barrier Indonesia — Water Barrier & Traffic Safety Equipment",
  description: "Road barrier PE anti-UV, traffic cone, dan stick cone untuk proyek konstruksi, pengaturan lalu lintas, parkir, dan event.",
  icons: {
    icon: [{ url: "/logo-roadbarrier-official.png", type: "image/png" }],
    shortcut: "/logo-roadbarrier-official.png",
    apple: "/logo-roadbarrier-official.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
