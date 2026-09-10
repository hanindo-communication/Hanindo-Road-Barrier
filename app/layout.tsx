import type { Metadata } from "next";
import "./globals.css";
import "./journey.css";
import "./experience.css";
import "./modern.css";
import "./catalog.css";

export const metadata: Metadata = {
  title: "Road Barrier Indonesia — Water Barrier & Traffic Safety Equipment",
  description: "Road barrier PE anti-UV, traffic cone, dan stick cone untuk proyek konstruksi, pengaturan lalu lintas, parkir, dan event. Diproduksi sejak 2008.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
