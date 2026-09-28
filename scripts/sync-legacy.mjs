import { cp, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const source = path.join(process.cwd(), "legacy-mirror", "pages");
const destination = path.join(process.cwd(), "public", "pelajari-lebih-lanjut");

await cp(source, destination, { recursive: true, force: true });

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
  window.location.href = "https://wa.me/6281310697112?text=" + encodeURIComponent(text);
}, true);
</script></body>`);
await writeFile(contactPath, contact);

console.log("Arsip situs lama tersalin ke public/pelajari-lebih-lanjut");
