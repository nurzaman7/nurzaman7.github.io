import type { Metadata } from "next";
import {
  bookChapters,
  books,
  conferencePublications,
  journalArticles,
  patents,
  PublicationRecord,
  theses,
} from "../publications-data";

export const metadata: Metadata = {
  title: "Publications, Books & Patents",
  description:
    "The complete publication archive of Nurzaman Ahmed, including journal articles, conference papers, books, chapters, patents, and doctoral research.",
  alternates: {
    canonical: "/papers/",
  },
};

const sections: {
  id: string;
  title: string;
  description: string;
  records: PublicationRecord[];
}[] = [
  {
    id: "books",
    title: "Books",
    description: "# Edited scholarly books.",
    records: books,
  },
  {
    id: "chapters",
    title: "Book chapters",
    description: "# Contributions to edited research volumes.",
    records: bookChapters,
  },
  {
    id: "journals",
    title: "Journal articles",
    description: "# Peer-reviewed journals and research articles.",
    records: journalArticles,
  },
  {
    id: "conferences",
    title: "Conference publications",
    description: "# Peer-reviewed conference and workshop papers.",
    records: conferencePublications,
  },
  {
    id: "patents",
    title: "Patents",
    description: "# Granted and filed intellectual property.",
    records: patents,
  },
  {
    id: "thesis",
    title: "Doctoral thesis",
    description: "# Research foundation in scalable IEEE 802.11ah networks.",
    records: theses,
  },
];

function ArchiveList({ records }: { records: PublicationRecord[] }) {
  return (
    <div className="archive-list">
      {records.map((record, index) => (
        <article
          className="archive-entry"
          key={`${record.year}-${record.citation}`}
        >
          <span>{record.year}</span>
          <p>
            <small>{String(index + 1).padStart(2, "0")}</small>
            {record.citation}
          </p>
          {record.href ? (
            <a
              href={record.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open publication ${index + 1}`}
            >
              ↗
            </a>
          ) : (
            <i aria-hidden="true">—</i>
          )}
        </article>
      ))}
    </div>
  );
}

export default function PapersPage() {
  const scholarlyWorks =
    journalArticles.length + conferencePublications.length;
  const bookWorks = books.length + bookChapters.length;
  const currentYear = new Date().getFullYear();

  return (
    <main id="top">
      <header className="topbar">
        <div className="topbar-inner">
          <nav aria-label="Main navigation">
            <a href="/#overview">Overview</a>
            <a href="/#systems">Systems</a>
            <a href="/#research">Research</a>
            <a className="active" href="/papers/">
              Papers
            </a>
            <a href="/#contact">Contact</a>
          </nav>
        </div>
      </header>

      <div className="terminal-container archive-container">
        <section className="terminal-intro archive-intro">
          <p className="archive-back">
            <a href="/">← return to overview</a>
          </p>
          <h1>Publications, books &amp; patents</h1>
          <p>
            # Complete research archive, now integrated into this portfolio.
          </p>
        </section>

        <section className="stat-grid archive-stats" aria-label="Archive totals">
          <div className="stat-card">
            <strong>{scholarlyWorks}</strong>
            <span>:: Journal &amp; conference works</span>
          </div>
          <div className="stat-card">
            <strong>{bookWorks}</strong>
            <span>:: Books &amp; chapters</span>
          </div>
          <div className="stat-card">
            <strong>{patents.length}</strong>
            <span>:: Patents granted or filed</span>
          </div>
          <div className="stat-card">
            <strong>2014—26</strong>
            <span>:: Archive range</span>
          </div>
        </section>

        <nav className="archive-jump" aria-label="Publication sections">
          <span>jump_to</span>
          {sections.map((section) => (
            <a href={`#${section.id}`} key={section.id}>
              {section.title}
            </a>
          ))}
        </nav>

        {sections.map((section) => (
          <section className="panel archive-panel" id={section.id} key={section.id}>
            <div className="panel-heading">
              <div>
                <h2>{section.title}</h2>
                <p className="panel-subtitle">{section.description}</p>
              </div>
              <span className="archive-count">
                {String(section.records.length).padStart(2, "0")} entries
              </span>
            </div>
            <ArchiveList records={section.records} />
          </section>
        ))}

        <section className="panel archive-verification">
          <h2>Research profiles</h2>
          <p>
            # External indexes are retained only as verification sources. The
            archive itself lives on this website.
          </p>
          <div className="command-links">
            <a
              href="https://scholar.google.com/citations?user=wUFC3VMAAAAJ&hl=en"
              target="_blank"
              rel="noreferrer"
            >
              Google Scholar
            </a>
            <a
              href="https://orcid.org/0000-0003-2597-6483"
              target="_blank"
              rel="noreferrer"
            >
              ORCID
            </a>
          </div>
        </section>

        <footer>
          <span>Nurzaman Ahmed · © {currentYear}</span>
          <a href="#top">return to top ↑</a>
        </footer>
      </div>
    </main>
  );
}
