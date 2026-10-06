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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N7W7P3KF');`,
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N7W7P3KF"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
