import { cp, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const source = path.join(process.cwd(), "legacy-mirror", "pages");
const destination = path.join(process.cwd(), "public", "pelajari-lebih-lanjut");

await cp(source, destination, { recursive: true, force: true });

const gtmHead = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N7W7P3KF');</script>
<!-- End Google Tag Manager -->`;
const gtmBody = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N7W7P3KF"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;
const googleAdsHead = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=AW-612122797"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'AW-612122797');
</script>`;
const conversionHead = `<!-- Event snippet for Page view conversion page -->
<script>
function gtag_report_conversion(url) {
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
}, true);
</script>`;

async function addTagManager(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await addTagManager(filePath);
    } else if (entry.name.endsWith(".html")) {
      let html = await readFile(filePath, "utf8");
      html = html
        .replace(/<!-- Google Tag Manager -->[\s\S]*?<!-- End Google Tag Manager -->\s*/g, "")
        .replace(/<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->\s*/g, "");
      if (!/<head\b[^>]*>/i.test(html) || !/<body\b[^>]*>/i.test(html)) {
        throw new Error(`Missing head or body in ${filePath}`);
      }
      const adsTag = html.includes("AW-612122797") ? "" : `${googleAdsHead}\n`;
      const conversionTag = html.includes("AW-612122797/Bm1LCODQ3f8CEK2B8aMC") ? "" : `${conversionHead}\n`;
      html = html
        .replace(/<head\b[^>]*>/i, (tag) => `${tag}\n${gtmHead}\n${adsTag}${conversionTag}`)
        .replace(/<body\b[^>]*>/i, (tag) => `${tag}\n${gtmBody}\n`);
      await writeFile(filePath, html);
    }
  }
}

await addTagManager(destination);

const contactPath = path.join(destination, "contact", "index.html");
let contact = await readFile(contactPath, "utf8");
contact = contact.replace(
  '<span class="elementor-button-text">Send</span>',
  '<span class="elementor-button-text">Kirim via WhatsApp</span>',
);
contact = contact.replace("</body>", `<script>
document.addEventListener("submit", function (event) {
  var form = event.target;
  if (!(form instanceof HTMLFormElement) || !form.matches(".elementor-form")) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  var name = form.querySelector("#form-field-name")?.value || "";
  var email = form.querySelector("#form-field-email")?.value || "";
  var message = form.querySelector("#form-field-message")?.value || "";
  var text = "Halo Road Barrier Indonesia, saya ingin bertanya.\\nNama: " + name + "\\nEmail: " + email + "\\nPesan: " + message;
  var url = "https://wa.me/6281310697112?text=" + encodeURIComponent(text);
  if (typeof gtag_report_conversion === "function") {
    gtag_report_conversion(url);
  } else {
    window.location.href = url;
  }
}, true);
</script></body>`);
await writeFile(contactPath, contact);

console.log("Arsip situs lama tersalin ke public/pelajari-lebih-lanjut");
