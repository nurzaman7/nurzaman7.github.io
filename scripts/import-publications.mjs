import fs from "node:fs";
import path from "node:path";

const sourcePath = process.argv[2];
const outputPath = process.argv[3];

if (!sourcePath || !outputPath) {
  throw new Error(
    "Usage: node scripts/import-publications.mjs <source-html> <output-ts>",
  );
}

const rawHtml = fs.readFileSync(sourcePath, "utf8");
const html = rawHtml.replace(/<!--[\s\S]*?-->/g, "");

function decode(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ndash;/g, "-")
    .replace(/&mdash;/g, "-")
    .replace(/&nbsp;/g, " ");
}

function clean(value) {
  return decode(value.replace(/<[^>]+>/g, " "))
    .replace(
      /\s*\[\s*(?:Online|Link|Online Thesis|Presentation)\s*\]\s*/g,
      " ",
    )
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .trim();
}

function newestFirst(records) {
  return records.sort((left, right) => Number(right.year) - Number(left.year));
}

function section(heading) {
  const expression = new RegExp(
    `<h2[^>]*>${heading}</h2>([\\s\\S]*?)(?=<h2[^>]*>|</div>)`,
  );
  const match = html.match(expression);
  if (!match) throw new Error(`Missing section: ${heading}`);

  return [...match[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((item) => {
    const itemHtml = item[1];
    const citation = clean(itemHtml);
    const years = citation.match(/\b(?:19|20)\d{2}\b/g);
    const href = itemHtml.match(/href="([^"]+)"/)?.[1];

    return {
      year: years?.at(-1) ?? "—",
      citation,
      ...(href ? { href } : {}),
    };
  });
}

const journalArticles = newestFirst([
  {
    year: "2026",
    citation:
      'B. Gano, M. de Gracia Coquerel, J. Saxton, N. Eck, K. H. S. Peiris, S. R. Bean, J. Stanton, N. Ahmed, and N. Shakoor, "Modeling grain biochemical composition traits of commercial sorghum hybrids under diverse management practices," Frontiers in Plant Science, vol. 17, 1768456, 2026.',
    href: "https://doi.org/10.3389/fpls.2026.1768456",
  },
  {
    year: "2025",
    citation:
      'N. Ahmed and N. Shakoor, "Advancing agriculture through IoT, Big Data, and AI: A review of smart technologies enabling sustainability," Smart Agricultural Technology, vol. 10, 100848, 2025.',
    href: "https://doi.org/10.1016/j.atech.2025.100848",
  },
  ...section("Journal Articles"),
]);

const conferencePublications = newestFirst(section("Conference Publications"));

const books = [
  {
    year: "2026",
    citation:
      "T. Ojha, M. M. Hussain, S. Bera, N. Ahmed, and S. Misra (Eds.), Edge-Enabled 6G Networking: Foundations, Technologies, and Applications, Springer Cham, 2026.",
    href: "https://doi.org/10.1007/978-3-032-19042-0",
  },
];

const bookChapters = newestFirst([
  {
    year: "2026",
    citation:
      'N. Ahmed, T. Ojha, M. M. Hussain, and S. Bera, "Edge-Enabled 6G Networking: Transforming IoT for a Hyperconnected Future," in Edge-Enabled 6G Networking: Foundations, Technologies, and Applications, pp. 255-270, Springer Cham, 2026.',
    href: "https://doi.org/10.1007/978-3-032-19042-0_11",
  },
  {
    year: "2026",
    citation:
      'S. Sarkar, A. Sengupta, P. Dey, A. Das, D. De, and N. Ahmed, "Agronomics: A Sustainable Economics for Consumer Electronics in Agriculture," in Humanized Intelligence in Sustainable Finance and Economic Behaviours, pp. 193-215, Springer Singapore, 2026.',
    href: "https://doi.org/10.1007/978-981-95-0599-9_10",
  },
  ...section("Book Chapters"),
]);

const theses = section("Thesis");
const patents = newestFirst(section("Patents"));

const content = `export type PublicationRecord = {
  year: string;
  citation: string;
  href?: string;
};

export const journalArticles: PublicationRecord[] = ${JSON.stringify(
  journalArticles,
  null,
  2,
)};

export const conferencePublications: PublicationRecord[] = ${JSON.stringify(
  conferencePublications,
  null,
  2,
)};

export const books: PublicationRecord[] = ${JSON.stringify(books, null, 2)};

export const bookChapters: PublicationRecord[] = ${JSON.stringify(
  bookChapters,
  null,
  2,
)};

export const theses: PublicationRecord[] = ${JSON.stringify(theses, null, 2)};

export const patents: PublicationRecord[] = ${JSON.stringify(patents, null, 2)};
`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, content);
