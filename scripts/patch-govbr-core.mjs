// remove o "@charset" do core.min.css do GovBR-DS antes que ele
// seja embrulhado em @layer dsg pelo Tailwind/Turbopack.
// `@charset` só é válido no início do arquivo; dentro de uma
// @layer vira regra inválida e gera warnings de parse.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const target = join(
  __dirname,
  "..",
  "node_modules",
  "@govbr-ds",
  "core",
  "dist",
  "core.min.css",
);

const css = readFileSync(target, "utf8");
const patched = css.replace(/^@charset\s+["'][^"']*["']\s*;/, "");

if (patched !== css) {
  writeFileSync(target, patched);
  console.log("[patch-govbr-core] @charset removido de core.min.css");
} else {
  console.log("[patch-govbr-core] sem @charset para remover (já patcheado)");
}