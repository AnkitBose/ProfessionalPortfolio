import { promises as fs } from "node:fs";
import path from "node:path";

const contentRoot = path.resolve("src/content");
const tagPattern = /<\s*\/?\s*[a-zA-Z][^>]*>/;

async function collectMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const resolved = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return collectMarkdownFiles(resolved);
      }
      return resolved.endsWith(".md") ? [resolved] : [];
    })
  );

  return files.flat();
}

function stripFrontmatter(content) {
  if (!content.startsWith("---")) {
    return content;
  }

  const end = content.indexOf("\n---", 3);
  if (end === -1) {
    return content;
  }

  return content.slice(end + 4);
}

async function main() {
  const markdownFiles = await collectMarkdownFiles(contentRoot);
  const violations = [];

  for (const file of markdownFiles) {
    const raw = await fs.readFile(file, "utf8");
    const body = stripFrontmatter(raw);
    if (tagPattern.test(body)) {
      violations.push(path.relative(process.cwd(), file));
    }
  }

  if (violations.length > 0) {
    console.error("Raw HTML is not allowed in content markdown:");
    for (const file of violations) {
      console.error(`- ${file}`);
    }
    process.exitCode = 1;
    return;
  }

  process.stdout.write(`Validated ${markdownFiles.length} markdown files: no raw HTML tags found.\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});


