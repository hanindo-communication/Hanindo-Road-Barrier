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
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-612122797" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-612122797');`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `function gtag_report_conversion(url) {
  var navigated = false;
  var callback = function () {
    if (typeof url !== 'undefined' && !navigated) {
      navigated = true;
      window.location = url;
    }
  };
  gtag('event', 'conversion', {
    'send_to': 'AW-612122797/Bm1LCODQ3f8CEK2B8aMC',
    'event_callback': callback,
    'event_timeout': 1500
  });
  if (typeof url !== 'undefined') setTimeout(callback, 1500);
  return false;
}
document.addEventListener('click', function (event) {
  var target = event.target;
  if (!(target instanceof Element)) return;
  var control = target.closest('a, button');
  if (!control) return;
  var link = control instanceof HTMLAnchorElement ? control : null;
  var host = link ? new URL(link.href, window.location.href).hostname.toLowerCase() : '';
  var isWhatsApp = host === 'wa.me' || host === 'wa.link' || host === 'api.whatsapp.com' || host === 'web.whatsapp.com';
  var label = (control.textContent || '') + ' ' + (control.getAttribute('aria-label') || '');
  if (!isWhatsApp && !/minta penawaran/i.test(label)) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    gtag_report_conversion();
    return;
  }
  if (isWhatsApp && link && link.target.toLowerCase() !== '_blank') {
    event.preventDefault();
    gtag_report_conversion(link.href);
  } else {
    gtag_report_conversion();
  }
}, true);`,
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
