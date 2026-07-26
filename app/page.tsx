"use client";

import { FormEvent, useMemo, useRef, useState } from "react";

type AgentMessage = {
  role: "agent" | "visitor";
  text: string;
};

// Temporarily hide the portfolio agent while preserving it for a later release.
const AGENT_CHAT_ENABLED = false;

const projects = [
  {
    id: "sys-01",
    title: "OpenWrt ath9k 2C MAC",
    category: "Wi-Fi MAC / driver",
    status: "public",
    description:
      "A driver-level TDMA-style MAC implementation in Linux ath9k/mac80211, with modified C driver paths, raw-packet tools, and OpenWrt/Linux testbed evaluation.",
    href: "https://github.com/nurzaman7/openwrt-ath9k-2c-mac",
  },
  {
    id: "sys-02",
    title: "Agent Skills Interoperability Lab",
    category: "agent systems",
    status: "public",
    description:
      "Portable patterns for distributed task routing, MCP/OpenAPI tool use, tracing, evaluation, and prompt-injection resistance.",
    href: "https://github.com/nurzaman7/distributed-agent-skills-playground",
  },
  {
    id: "sys-03",
    title: "IoT Learning Game",
    category: "IoT education",
    status: "public",
    description:
      "A game-oriented IoT learning environment with real-time sensor data visualization and hands-on activities.",
    href: "https://github.com/nurzaman7/iot-learning-game-realtime-visualization",
  },
  {
    id: "sys-04",
    title: "Internet of Agents for Agriculture",
    category: "agentic IoT",
    status: "public",
    description:
      "A modular agriculture automation framework connecting AI agents, IoT devices, field observations, and action workflows.",
    href: "https://github.com/nurzaman7/internet-of-agents-agri-automation-skeleton",
  },
  {
    id: "sys-05",
    title: "SubterraAI",
    category: "root phenotyping",
    status: "public",
    description:
      "A human-in-the-loop platform for image-based root phenotyping, versioned model retraining, and GWAS-ready analysis.",
    href: "https://github.com/SubterraAI-Organization/subterra",
  },
  {
    id: "sys-06",
    title: "FieldDock",
    category: "digital agriculture",
    status: "deployed",
    description:
      "An integrated field platform linking sensing, edge computing, drone operations, APIs, and crop-breeding workflows.",
    href: "https://fielddock.org",
  },
];

const focusAreas = [
  {
    code: "focus.wifi-mac",
    title: "Wi-Fi MAC & embedded wireless",
    text: "IEEE 802.11 MAC and Wi-Fi HaLow architecture; QoS, scheduling, relay, and multi-hop design; Linux/OpenWrt mac80211 and ath9k driver work; packet-level debugging, BLE, and Zephyr RTOS.",
  },
  {
    code: "focus.ai",
    title: "Interoperable AI systems",
    text: "Agent workflows, tool contracts, observability, evaluation, and the infrastructure that makes model behavior inspectable.",
  },
  {
    code: "focus.edge",
    title: "Edge-to-cloud intelligence",
    text: "Reliable architectures that move computation across constrained devices, programmable networks, and cloud analytics.",
  },
  {
    code: "focus.agri",
    title: "Digital agriculture",
    text: "Field-ready sensing, UAV imaging, plant phenotyping, and decision systems for productive, climate-smart agriculture.",
  },
];

const publications = [
  {
    year: "2026",
    shortVenue: "Frontiers Plant Sci.",
    title:
      "Modeling grain biochemical composition traits of commercial sorghum hybrids under diverse management practices",
    href: "https://doi.org/10.3389/fpls.2026.1768456",
  },
  {
    year: "2026",
    shortVenue: "Springer · Book",
    title:
      "Edge-Enabled 6G Networking: Foundations, Technologies, and Applications",
    href: "https://doi.org/10.1007/978-3-032-19042-0",
  },
  {
    year: "2026",
    shortVenue: "Springer · Chapter",
    title:
      "Agronomics: A Sustainable Economics for Consumer Electronics in Agriculture",
    href: "https://doi.org/10.1007/978-981-95-0599-9_10",
  },
  {
    year: "2025",
    shortVenue: "Smart Ag. Technology",
    title:
      "Advancing agriculture through IoT, Big Data, and AI: A review of smart technologies enabling sustainability",
    href: "https://doi.org/10.1016/j.atech.2025.100848",
  },
  {
    year: "2024",
    shortVenue: "Ad Hoc Networks",
    title:
      "Analyzing the suitability of IEEE 802.11ah for next generation Internet of Things: A comparative study",
    href: "https://doi.org/10.1016/j.adhoc.2024.103437",
  },
  {
    year: "2024",
    shortVenue: "Plant Phenome J.",
    title:
      "Drone-based imaging sensors, techniques, and applications in plant phenotyping for crop breeding",
    href: "https://doi.org/10.1002/ppj2.20100",
  },
  {
    year: "2024",
    shortVenue: "IEEE TSC",
    title:
      "OptiFog: Predicting resource availability for task offloading in cooperative fog networks",
    href: "https://doi.org/10.1109/TSC.2024.3414371",
  },
  {
    year: "2024",
    shortVenue: "IEEE ISEC",
    title:
      "Bridging IoT Education Through Activities: A game-oriented approach with real-time data visualization",
    href: "https://doi.org/10.1109/ISEC61299.2024.10665136",
  },
  {
    year: "2023",
    shortVenue: "IEEE GLOBECOM",
    title:
      "Programming Edge-Based 6TiSCH Networks for Control-Loop Communication",
    href: "https://doi.org/10.1109/GLOBECOM54140.2023.10437380",
  },
  {
    year: "2018",
    shortVenue: "IEEE IoT Journal",
    title:
      "Internet of Things (IoT) for smart precision agriculture and farming in rural areas",
    href: "https://doi.org/10.1109/JIOT.2018.2879579",
  },
];

const positions = [
  {
    period: "2022—now",
    role: "Engineering Research Scientist",
    place: "Donald Danforth Plant Science Center · Saint Louis",
  },
  {
    period: "2022",
    role: "Postdoctoral Scholar",
    place: "Dartmouth College · Computer Science",
  },
  {
    period: "2021",
    role: "Postdoctoral Fellow",
    place: "Indian Institute of Science · ECE",
  },
  {
    period: "2019—21",
    role: "Research Associate",
    place: "Indian Institute of Technology Kharagpur · CSE",
  },
  {
    period: "2020",
    role: "Ph.D. in Information Technology",
    place: "North-Eastern Hill University",
  },
];

const quickQuestions = [
  "current research",
  "Wi-Fi MAC and driver work",
  "agent systems work",
  "recommended papers",
  "collaboration",
];

function localAgentReply(message: string) {
  const value = message.toLowerCase();

  if (
    value.includes("wi-fi") ||
    value.includes("wifi") ||
    value.includes("mac") ||
    value.includes("driver") ||
    value.includes("ath9k") ||
    value.includes("openwrt")
  ) {
    return "Nurzaman's core wireless work spans IEEE 802.11 MAC and Wi-Fi HaLow architecture, including QoS, scheduling, relay, and multi-hop design. His implementation experience includes Linux/OpenWrt mac80211 and ath9k driver paths, C-based MAC changes, raw-packet tools, and packet-level testbed debugging.";
  }

  if (
    value.includes("agent") ||
    value.includes("llm") ||
    value.includes("inference")
  ) {
    return "Start with Agent Skills Interoperability Lab and Internet of Agents for Agriculture. Together they show the current direction: portable agent-tool contracts, connected field devices, observable workflows, and safer distributed AI systems.";
  }

  if (
    value.includes("publication") ||
    value.includes("paper") ||
    value.includes("read")
  ) {
    return "A useful reading path is the 2025 review on IoT, Big Data, and AI for sustainable agriculture; the 2024 IEEE 802.11ah comparative study; and the 2026 Edge-Enabled 6G Networking book. The internal Papers page contains the complete archive.";
  }

  if (
    value.includes("collaborat") ||
    value.includes("contact") ||
    value.includes("work together")
  ) {
    return "Nurzaman is open to research and engineering collaborations across Wi-Fi MAC and embedded wireless systems, agentic and interoperable AI infrastructure, edge computing, IoT, and digital agriculture. The contact panel has direct email and LinkedIn links.";
  }

  if (
    value.includes("research") ||
    value.includes("now") ||
    value.includes("focus")
  ) {
    return "The current research program connects Wi-Fi MAC and embedded wireless systems with interoperable AI, edge-to-cloud intelligence, and digital agriculture—building reliable paths from real-world data to observable decisions.";
  }

  return "Available topics: Wi-Fi MAC and driver work, current research, agent infrastructure, selected systems, publication recommendations, and collaboration.";
}

export default function Home() {
  const [agentOpen, setAgentOpen] = useState(false);
  const [agentBusy, setAgentBusy] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      role: "agent",
      text: "Portfolio navigator ready. Ask about research, systems, publications, or collaboration.",
    },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const agentApiUrl = process.env.NEXT_PUBLIC_AGENT_API_URL;
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  async function askAgent(rawQuestion: string) {
    const question = rawQuestion.trim();
    if (!question || agentBusy) return;

    setInput("");
    setAgentBusy(true);
    setMessages((current) => [
      ...current,
      { role: "visitor", text: question },
    ]);

    let reply = localAgentReply(question);

    if (agentApiUrl) {
      try {
        const response = await fetch(agentApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: question,
            context: "nurzaman-ahmed-portfolio",
          }),
        });

        if (response.ok) {
          const data = (await response.json()) as { reply?: string };
          if (data.reply) reply = data.reply;
        }
      } catch {
        // The local navigator remains available when the remote API is offline.
      }
    }

    setMessages((current) => [...current, { role: "agent", text: reply }]);
    setAgentBusy(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void askAgent(input);
  }

  function openAgent() {
    setAgentOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 120);
  }

  return (
    <main id="top">
      <header className="topbar">
        <div className="topbar-inner">
          <nav aria-label="Main navigation">
            <a className="active" href="#overview">
              Overview
            </a>
            <a href="#systems">Systems</a>
            <a href="#research">Research</a>
            <a href="/papers/">Papers</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <div className="terminal-container">
        <section className="terminal-intro" id="overview">
          <h1>Nurzaman Ahmed</h1>
          <p>
            # Engineering research scientist spanning Wi-Fi MAC, embedded
            wireless systems, interoperable AI, IoT, edge-cloud, and digital
            agriculture.
          </p>
        </section>

        <section className="stat-grid" aria-label="Research profile statistics">
          <div className="stat-card">
            <strong>60+</strong>
            <span>:: Scholarly works &amp; chapters</span>
          </div>
          <div className="stat-card">
            <strong>13+ yrs</strong>
            <span>:: Connected systems research</span>
          </div>
          <div className="stat-card">
            <strong>3</strong>
            <span>:: Patents granted or filed</span>
          </div>
          <div className="stat-card">
            <strong>STL / USA</strong>
            <span>:: Current location</span>
          </div>
        </section>

        <section className="panel profile-panel">
          <h2>Profile</h2>
          <div className="profile-layout">
            <div className="profile-copy">
              <p className="profile-lead">
                I design wireless protocols and intelligent systems that turn
                real-world data into reliable infrastructure for discovery and
                action.
              </p>
              <p>
                My work moves from IEEE 802.11 MAC design and Linux wireless
                driver implementation to Wi-Fi HaLow field networks, edge
                intelligence, plant phenotyping, and interoperable agent
                systems. The constant is practical: research should survive
                real constraints and become something people can use.
              </p>
              <dl className="profile-meta">
                <div>
                  <dt>role</dt>
                  <dd>Engineering Research Scientist</dd>
                </div>
                <div>
                  <dt>organization</dt>
                  <dd>Donald Danforth Plant Science Center</dd>
                </div>
                <div>
                  <dt>focus</dt>
                  <dd>
                    IEEE 802.11 MAC · Wi-Fi HaLow · Linux drivers · AI systems ·
                    Edge
                  </dd>
                </div>
                <div>
                  <dt>origin</dt>
                  <dd>Assam, India</dd>
                </div>
              </dl>
              <div className="command-links">
                <a
                  href="https://github.com/nurzaman7"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
                <a
                  href="https://scholar.google.com/citations?user=wUFC3VMAAAAJ&hl=en"
                  target="_blank"
                  rel="noreferrer"
                >
                  Google Scholar
                </a>
                <a
                  href="https://www.linkedin.com/in/nurzaman-ahmed-phd"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              </div>
            </div>
            <figure className="profile-photo">
              <img
                src="https://avatars.githubusercontent.com/u/13857907?v=4"
                alt="Nurzaman Ahmed"
                width="440"
                height="440"
                referrerPolicy="no-referrer"
              />
            </figure>
          </div>
        </section>

        <section className="panel" id="systems">
          <div className="panel-heading">
            <h2>Selected systems</h2>
            <a
              href="https://github.com/nurzaman7?tab=repositories"
              target="_blank"
              rel="noreferrer"
            >
              view all repositories →
            </a>
          </div>
          <div className="table-wrap">
            <table className="systems-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Project</th>
                  <th>Domain</th>
                  <th>Status</th>
                  <th aria-label="Open" />
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="mono-muted">{project.id}</td>
                    <td>
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {project.title}
                      </a>
                      <small>{project.description}</small>
                    </td>
                    <td>{project.category}</td>
                    <td>
                      <span className="status">[{project.status}]</span>
                    </td>
                    <td>
                      <a
                        className="row-arrow"
                        href={project.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${project.title}`}
                      >
                        ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel" id="research">
          <h2>Research focus</h2>
          <p className="panel-subtitle">
            # One systems question at every scale: how do we make intelligence
            reliable, interoperable, and useful where data is born?
          </p>
          <div className="focus-grid">
            {focusAreas.map((focus) => (
              <article key={focus.code}>
                <span>{focus.code}</span>
                <h3>{focus.title}</h3>
                <p>{focus.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel" id="publications">
          <div className="panel-heading">
            <h2>Selected publications</h2>
            <a
              href="/papers/"
            >
              full archive →
            </a>
          </div>
          <div className="table-wrap">
            <table className="papers-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Publication</th>
                  <th>Venue</th>
                  <th aria-label="Open" />
                </tr>
              </thead>
              <tbody>
                {publications.map((publication) => (
                  <tr key={publication.title}>
                    <td className="mono-muted">{publication.year}</td>
                    <td>
                      <a
                        href={publication.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {publication.title}
                      </a>
                    </td>
                    <td>{publication.shortVenue}</td>
                    <td>
                      <a
                        className="row-arrow"
                        href={publication.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${publication.title}`}
                      >
                        ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel">
          <h2>Research trajectory</h2>
          <div className="trajectory-list">
            {positions.map((position) => (
              <article key={`${position.period}-${position.role}`}>
                <span>{position.period}</span>
                <strong>{position.role}</strong>
                <p>{position.place}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel contact-panel" id="contact">
          <div>
            <h2>Open channel</h2>
            <p>
              # Available for research conversations and engineering
              collaborations around Wi-Fi MAC, embedded wireless and driver
              systems, agentic and interoperable AI, edge computing, IoT, and
              digital agriculture.
            </p>
          </div>
          <div className="contact-commands">
            <a href="mailto:nahmed@danforthcenter.org">
              <span>email</span>
              nahmed@danforthcenter.org
            </a>
            <a
              href="https://www.linkedin.com/in/nurzaman-ahmed-phd"
              target="_blank"
              rel="noreferrer"
            >
              <span>network</span>
              linkedin/nurzaman-ahmed-phd
            </a>
            {AGENT_CHAT_ENABLED && (
              <button type="button" onClick={openAgent}>
                <span>agent</span>
                ask portfolio navigator
              </button>
            )}
          </div>
        </section>

        <footer>
          <span>Nurzaman Ahmed · © {currentYear}</span>
          <a href="#top">return to top ↑</a>
        </footer>
      </div>

      {AGENT_CHAT_ENABLED && (
        <button
          className={`agent-launcher ${agentOpen ? "agent-launcher-hidden" : ""}`}
          type="button"
          onClick={openAgent}
          aria-label="Open portfolio navigator"
        >
          [ ask portfolio agent ]
        </button>
      )}

      {AGENT_CHAT_ENABLED && (
        <aside
          className={`agent-panel ${agentOpen ? "agent-panel-open" : ""}`}
          aria-hidden={!agentOpen}
          aria-label="Portfolio navigator"
        >
          <div className="agent-header">
            <div>
              <strong>guest@portfolio-agent:~$</strong>
              <small>{agentApiUrl ? "[api connected]" : "[local guide]"}</small>
            </div>
            <button
              type="button"
              onClick={() => setAgentOpen(false)}
              aria-label="Close portfolio navigator"
            >
              [x]
            </button>
          </div>
          <div className="agent-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div
                className={`agent-message agent-message-${message.role}`}
                key={`${message.role}-${index}`}
              >
                <small>{message.role === "agent" ? "$ agent" : "> guest"}</small>
                <p>{message.text}</p>
              </div>
            ))}
            {agentBusy && <p className="agent-thinking">processing_</p>}
          </div>
          <div className="agent-questions">
            {quickQuestions.map((question) => (
              <button
                type="button"
                onClick={() => void askAgent(question)}
                key={question}
              >
                [{question}]
              </button>
            ))}
          </div>
          <form className="agent-form" onSubmit={handleSubmit}>
            <label htmlFor="agent-input">&gt;</label>
            <input
              id="agent-input"
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="type a question..."
              disabled={agentBusy}
            />
            <button
              type="submit"
              disabled={agentBusy || !input.trim()}
            >
              [send]
            </button>
          </form>
          <p className="agent-note">
            -- public portfolio guide · no personal data collected
          </p>
        </aside>
      )}

      {AGENT_CHAT_ENABLED && agentOpen && (
        <button
          className="agent-backdrop"
          type="button"
          onClick={() => setAgentOpen(false)}
          aria-label="Close portfolio navigator"
        />
      )}
    </main>
  );
}
