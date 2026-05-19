const fs = require("fs");
const path = require("path");

try {
  const mdPath = path.join(__dirname, "dij.md");
  const jsonPath = path.join(__dirname, "dij.json");

  const md = fs.readFileSync(mdPath, "utf8");
  console.log("Successfully read dij.md, length:", md.length);

  const jsonRaw = fs.readFileSync(jsonPath, "utf8");
  console.log("Successfully read dij.json, length:", jsonRaw.length);

  const metaStart = jsonRaw.indexOf('"meta":');
  if (metaStart === -1) {
    throw new Error('Could not find "meta" key in dij.json');
  }

  const metaEnd = jsonRaw.lastIndexOf("}");
  let metaStr = jsonRaw.substring(metaStart + 7, metaEnd).trim();
  if (metaStr.endsWith("}")) {
    // keeping the outer structure
  } else {
    // If it extracted more or less, search for the closing brace of the meta object
    const openBrace = metaStr.indexOf("{");
    let braceCount = 0;
    let endIdx = -1;
    for (let i = openBrace; i < metaStr.length; i++) {
      if (metaStr[i] === "{") braceCount++;
      else if (metaStr[i] === "}") {
        braceCount--;
        if (braceCount === 0) {
          endIdx = i;
          break;
        }
      }
    }
    if (endIdx !== -1) {
      metaStr = metaStr.substring(0, endIdx + 1);
    }
  }

  console.log("Extracted meta string:", metaStr);
  const meta = JSON.parse(metaStr);
  console.log("Successfully parsed meta:", meta);

  const newJson = {
    title: "Trie — Árvores de Prefixos e Busca Textual Eficiente",
    slug: "trie-prefix-tree",
    body: md,
    meta: meta,
  };

  fs.writeFileSync(jsonPath, JSON.stringify(newJson, null, 2), "utf8");
  console.log("Successfully wrote updated trie.json!");
} catch (err) {
  console.error("Error during update execution:", err);
  process.exit(1);
}
