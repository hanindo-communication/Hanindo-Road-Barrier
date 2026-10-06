import { cp, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const source = path.join(process.cwd(), "legacy-mirror", "pages");
const destination = path.join(process.cwd(), "public", "pelajari-lebih-lanjut");

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

function removeGoogleTracking(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>\s*/gi, (script) => {
      const isGoogleTracking =
        /googletagmanager\.com\/(?:gtag\/js|gtm\.js)/i.test(script) ||
        /GTM-[A-Z0-9]+|gtag\s*\(\s*["'](?:config|event)["']|gtag_report_conversion|AW-\d+\/[A-Za-z0-9_-]+/i.test(script);
      return isGoogleTracking ? "" : script;
    })
    .replace(/<noscript\b[^>]*>\s*<iframe\b[^>]*googletagmanager\.com\/ns\.html[^>]*>[\s\S]*?<\/iframe>\s*<\/noscript>\s*/gi, "")
    .replace(/<!--\s*(?:Google Tag Manager(?: \(noscript\))?|End Google Tag Manager(?: \(noscript\))?|Google tag \(gtag\.js\)|Event snippet[^>]*)\s*-->\s*/gi, "");
}

async function cleanSourceArchive(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await cleanSourceArchive(filePath);
    } else if (entry.name.endsWith(".html")) {
      const original = await readFile(filePath, "utf8");
      const cleaned = removeGoogleTracking(original);
      if (cleaned !== original) await writeFile(filePath, cleaned);
    }
  }
}

if (process.argv.includes("--clean-source")) {
  await cleanSourceArchive(source);
}

await cp(source, destination, { recursive: true, force: true });

async function addTagManager(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await addTagManager(filePath);
    } else if (entry.name.endsWith(".html")) {
      let html = await readFile(filePath, "utf8");
      html = removeGoogleTracking(html);
      if (!/<head\b[^>]*>/i.test(html) || !/<body\b[^>]*>/i.test(html)) {
        throw new Error(`Missing head or body in ${filePath}`);
      }
      html = html
        .replace(/<head\b[^>]*>/i, (tag) => `${tag}\n${gtmHead}\n`)
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
  window.location.href = url;
}, true);
</script></body>`);
await writeFile(contactPath, contact);

console.log("Arsip situs lama tersalin ke public/pelajari-lebih-lanjut");
