/* Portfolio interactions. No packages, services, or backend required. */
"use strict";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

// A quiet reading indicator and navigation state, updated once per frame.
let readingFrame = 0;
function updateReadingPosition() {
  const range = document.documentElement.scrollHeight - innerHeight;
  const progress = range > 0 ? Math.min(1, Math.max(0, scrollY / range)) : 0;
  $("#reading-progress").style.transform = `scaleX(${progress})`;
  let current = "";
  $$("main section[id]").forEach(section => {
    if (section.getBoundingClientRect().top <= innerHeight * 0.35) current = section.id;
  });
  $$(".nav a[href^='#']").forEach(link => {
    if (link.getAttribute("href") === `#${current}`) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
  readingFrame = 0;
}
function queueReadingPosition() {
  if (!readingFrame) readingFrame = requestAnimationFrame(updateReadingPosition);
}
window.addEventListener("scroll", queueReadingPosition, { passive: true });
window.addEventListener("resize", queueReadingPosition);
window.addEventListener("load", queueReadingPosition);
queueReadingPosition();

// Mobile navigation
const menu = $(".menu-toggle");
const nav = $(".nav");
function closeMenu() {
  nav.classList.remove("open");
  menu.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-label", "Open menu");
}
menu.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});
nav.addEventListener("click", event => { if (event.target.closest("a")) closeMenu(); });
document.addEventListener("click", event => { if (!event.target.closest(".header")) closeMenu(); });
document.addEventListener("keydown", event => { if (event.key === "Escape") { closeMenu(); finishBoot(); } });

// Short, skippable first-visit introduction. Session storage is optional.
const overlay = $("#boot-overlay");
const shell = $(".site-shell");
let bootTimer;
let bootTrigger;
const bootLines = [
  "PS C:\\Users\\Dagim> ./portfolio --initialize",
  "[ OK ] Loading identity: Software Engineer",
  "[ OK ] Mounting AWS / Linux / Node.js / PostgreSQL",
  "[ OK ] Connecting projects, systems, and ideas",
  "[ OK ] Access granted. Welcome to my corner of the internet."
];
function finishBoot() {
  if (overlay.hidden) return;
  clearTimeout(bootTimer);
  overlay.hidden = true;
  shell.inert = false;
  document.body.style.overflow = "";
  try { sessionStorage.setItem("portfolio-booted", "yes"); } catch {}
  if (bootTrigger) bootTrigger.focus({ preventScroll: true });
  else $(".wordmark").focus({ preventScroll: true });
}
function startBoot(trigger) {
  bootTrigger = trigger;
  overlay.hidden = false;
  shell.inert = true;
  document.body.style.overflow = "hidden";
  $("#boot-output").replaceChildren();
  $("[data-skip-boot]").focus({ preventScroll: true });
  let index = 0;
  function next() {
    const row = document.createElement("p");
    row.textContent = bootLines[index];
    row.className = index ? "boot-success" : "";
    $("#boot-output").append(row);
    $("#boot-progress").style.width = `${(++index / bootLines.length) * 100}%`;
    bootTimer = setTimeout(index < bootLines.length ? next : finishBoot, index < bootLines.length ? 420 : 700);
  }
  next();
}
$$('[data-skip-boot]').forEach(button => button.addEventListener("click", finishBoot));
$("footer button").addEventListener("click", event => startBoot(event.currentTarget));
let seen = false;
try { seen = sessionStorage.getItem("portfolio-booted") === "yes"; } catch {}
if (!seen && !reducedMotion.matches) startBoot();

// Skills explorer: examples illustrate the tools; no commands run on a machine.
const skills = {
  cloud: {
    file: "infrastructure / aws", kicker: "CLOUD & INFRASTRUCTURE", title: "Built to run in the cloud.",
    description: "AWS infrastructure is a core part of my work: compute, object storage, identity, networking, and relational databases.",
    tags: ["AWS EC2", "S3", "IAM", "VPC", "RDS", "Cloudflare", "Vercel"],
    code: "$ aws s3 ls s3://vehicle-uploads/\n# Object storage for vehicle verification media\n# IAM permissions keep access scoped",
    context: "In Kerodex: S3-backed uploads and vehicle verification. In distributed systems: AWS deployment and automated delivery. AWS Certified Cloud Practitioner, January 2026."
  },
  linux: {
    file: "systems / linux", kicker: "SYSTEMS & OPERATIONS", title: "Comfortable at the command line.",
    description: "Linux/Unix, reverse proxies, and process management connect application code to the environment where it runs. My toolkit includes NGINX, PM2, and Git.",
    tags: ["Linux / Unix", "NGINX", "PM2", "Git", "Shell", "CI/CD"],
    code: "$ uname -s\nLinux\n$ nginx -t\n# Validate reverse-proxy configuration\n$ pm2 status\n# Inspect application processes",
    context: "From server configuration and request routing to keeping Node.js processes running. Use the demo prompt below to explore a small, simulated terminal."
  },
  backend: {
    file: "backend / node.js", kicker: "BACKEND ENGINEERING", title: "Services with clear boundaries.",
    description: "Native Node.js HTTP and REST APIs for marketplace workflows and independently deployable services. Request routing, response headers, authentication, and failure handling are part of the design.",
    tags: ["Node.js", "node:http", "REST APIs", "OAuth 2.0", "OpenAI API", "Twilio Verify", "Jest"],
    code: "import { createServer } from 'node:http';\n\ncreateServer((req, res) => {\n  const ok = req.method === 'GET'\n    && req.url === '/health';\n  res.writeHead(ok ? 200 : 404, {\n    'Content-Type': 'application/json'\n  });\n  res.end(JSON.stringify(ok\n    ? { status: 'ok' }\n    : { error: 'not_found' }));\n}).listen(3000, '127.0.0.1');",
    context: "In Kerodex: listings, messaging, verification, and role-based administration. In the distributed order system: service ownership, HTTP communication, and fault isolation."
  },
  data: {
    file: "data / postgresql", kicker: "DATA & PERSISTENCE", title: "A foundation for reliable systems.",
    description: "Relational modeling and persistence using PostgreSQL, MySQL, and SQLite. Data structures support the workflows above them, from search to immutable audit history.",
    tags: ["PostgreSQL", "MySQL", "SQLite", "SQL", "Indexes", "Data modeling"],
    code: "-- Illustrative marketplace query\nSELECT id, make, model, price\nFROM listings\nWHERE status = 'active'\nORDER BY created_at DESC\nLIMIT 20;",
    context: "In Kerodex: 15+ runtime tables and 23+ database indexes spanning users, listings, conversations, verification, analytics, moderation, and audit logs."
  },
  languages: {
    file: "languages / engineering", kicker: "LANGUAGES & INTERFACES", title: "The right language for the problem.",
    description: "Python for data and research interfaces; C, C++, and ARM Assembly for systems foundations; JavaScript and TypeScript for full-stack applications.",
    tags: ["Python", "C", "C++", "Java", "JavaScript", "TypeScript", "ARM Assembly", "HTML / CSS", "React"],
    code: "# Python: turning data into an interface\nimport pandas as pd\n\nreadings = pd.DataFrame(sensor_data)\n# Research interfaces with Plotly Dash\n# Frontend applications with React + TypeScript",
    context: "Also familiar with Django REST Framework, TanStack Router, TanStack Query, NumPy, and Pandas. Coursework includes algorithms, computer organization, systems, networking, and robotics."
  }
};
function selectSkill(key) {
  const skill = skills[key];
  if (!skill) return;
  $$("[data-skill]").forEach(button => {
    const active = button.dataset.skill === key;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  ["file", "kicker", "title", "description", "code", "context"].forEach(field => { $(`#skill-${field}`).textContent = skill[field]; });
  $("#skill-tags").replaceChildren(...skill.tags.map(tag => {
    const element = document.createElement("span"); element.textContent = tag; return element;
  }));
}
$$('[data-skill]').forEach(button => button.addEventListener("click", () => selectSkill(button.dataset.skill)));
selectSkill("cloud");

const commandHistory = [];
let historyPosition = 0;
$("#terminal-form").addEventListener("submit", event => {
  event.preventDefault();
  const input = $("#terminal-input");
  const command = input.value.trim().toLowerCase().replace(/\s+/g, " ");
  if (!command) return;
  commandHistory.push(input.value.trim()); historyPosition = commandHistory.length;
  const responses = {
    help: "Available: help · ls · whoami · pwd · uname -a\ncat skills.txt · aws · linux · node · psql · python\nip addr · ss -tln · acl · curl localhost:3000/health · clear\nUse ↑ / ↓ for command history. This is a simulated portfolio terminal.",
    ls: "projects/   skills.txt   resume.pdf   infrastructure/",
    pwd: "/home/dagim/portfolio",
    whoami: "Dagim Tibebeselassie\nSoftware engineer · Georgia Tech CS · Founder of Kerodex\nAWS Certified Cloud Practitioner",
    "uname -a": "Linux / Unix — part of my systems & operations toolkit.\nSimulated output; no host system information is accessed.",
    "cat skills.txt": "Python · C · C++ · Java · JavaScript · TypeScript\nNode.js (native HTTP) · React · Django REST Framework\nPostgreSQL · MySQL · SQLite\nAWS: EC2 · S3 · IAM · VPC · RDS\nLinux / Unix · NGINX · PM2 · GitHub Actions · CI/CD",
    "ip addr": "lo    127.0.0.1/8    ::1/128\neth0  192.0.2.10/24  [example interface]\nLoopback + documentation-only addresses. Demo output.",
    "ss -tln": "STATE   LOCAL ADDRESS\nLISTEN  127.0.0.1:3000  [Node.js HTTP]\nLISTEN  127.0.0.1:5432  [PostgreSQL]\nLISTEN  0.0.0.0:443     [NGINX / TLS]\nIllustrative listeners; no ports are scanned.",
    acl: "010 ALLOW TCP :443  from any source\n020 ALLOW TCP :22   from 203.0.113.42/32\n *  DENY  ALL       default rule\nTry changing the source and port in Under the surface.",
    "curl localhost:3000/health": "HTTP/1.1 200 OK\nContent-Type: application/json\n\n{\"status\":\"ok\"}\nSimulated response from the native Node.js HTTP example.",
    "cat resume.pdf": "Use the Résumé link in the navigation to open the original PDF."
  };
  const aliases = { aws: "cloud", linux: "linux", node: "backend", "node.js": "backend", psql: "data", postgresql: "data", python: "languages" };
  let output;
  if (command === "clear") { $("#terminal-response").textContent = ""; input.value = ""; return; }
  if (aliases[command]) { selectSkill(aliases[command]); output = `Opened ${skills[aliases[command]].kicker.toLowerCase()}.`; }
  else output = responses[command] || `Command not available in this demo: ${input.value.trim()}\nType help to see the supported commands.`;
  $("#terminal-response").textContent = `$ ${input.value.trim()}\n${output}`;
  input.value = "";
});
$("#terminal-input").addEventListener("keydown", event => {
  if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
  event.preventDefault();
  historyPosition = Math.max(0, Math.min(commandHistory.length, historyPosition + (event.key === "ArrowUp" ? -1 : 1)));
  event.target.value = commandHistory[historyPosition] || "";
});

// Small network schematic: local, deterministic, and never sends traffic.
const networkLayers = {
  client: "Client / Example source IPs use documentation-only address ranges. The selected address is an input to the ACL demo, not your real IP.",
  proxy: "NGINX / In this schematic, the edge accepts HTTPS on port 443 and forwards application requests to a loopback HTTP service.",
  node: "Node.js / A native node:http server listens on 127.0.0.1:3000. The app handles routing, headers, and JSON responses directly.",
  db: "PostgreSQL / Port 5432 belongs behind the application boundary. The demo ACL denies direct inbound access to it."
};
$$('[data-network-node]').forEach(button => button.addEventListener("click", () => {
  $$('[data-network-node]').forEach(node => {
    const active = node === button;
    node.classList.toggle("active", active);
    node.setAttribute("aria-pressed", String(active));
  });
  $("#network-node-detail").textContent = networkLayers[button.dataset.networkNode];
}));
let packetTimer;
function resetPacket() {
  clearTimeout(packetTimer);
  const panel = $(".network-panel");
  panel.classList.remove("is-transmitting", "is-ssh");
  panel.removeAttribute("data-verdict");
  $$('[data-acl-rule]').forEach(row => row.classList.remove("matched"));
  $("[data-network-node='client'] code").textContent = $("#packet-source").value;
  $("#packet-result").textContent = "Ready. Trace this packet against the inbound rules.";
  $(".packet-send").disabled = false;
}
$("#packet-source").addEventListener("change", resetPacket);
$("#packet-port").addEventListener("change", resetPacket);
$("#packet-form").addEventListener("submit", event => {
  event.preventDefault();
  resetPacket();
  const port = $("#packet-port").value;
  const source = $("#packet-source").value;
  const rule = port === "443" ? "web" : port === "22" && source === "203.0.113.42" ? "ssh" : "deny";
  const allowed = rule !== "deny";
  const panel = $(".network-panel");
  panel.dataset.verdict = allowed ? "allow" : "deny";
  panel.classList.toggle("is-ssh", rule === "ssh");
  $(`[data-acl-rule='${rule}']`).classList.add("matched");
  $("#packet-result").textContent = rule === "web"
    ? "ALLOW / rule 010 — TCP 443 accepted at the edge."
    : rule === "ssh" ? "ALLOW / rule 020 — SSH accepted from the permitted /32 source."
    : `DENY / default rule — ${source} has no permission for TCP ${port}.`;
  if (!reducedMotion.matches) {
    panel.classList.add("is-transmitting");
    $(".packet-send").disabled = true;
    packetTimer = setTimeout(() => { panel.classList.remove("is-transmitting"); $(".packet-send").disabled = false; }, 950);
  }
});

// Accessible native project dialogs. Details are editable here.
const projects = {
  movies: { title: "GT Movies Store", category: "FRONTEND / FULL-STACK TEAM PROJECT · 2025", text: "Built a React and Django movie catalog and storefront managing 1,000+ titles through the TMDB API. Worked on frontend performance, rendering, asset loading, and responsiveness, and helped the team adopt Agile Scrum practices.", tags: ["React", "Django", "TMDB API", "Agile Scrum"], url: "https://github.com/tahasecond/Project-1-Rohan-1" },
  chat: { title: "MiniGPT", category: "AI EXPLORATION · 2024", text: "A chatbot experiment using TensorFlow and Keras for keyword detection and JSON-based responses. An exploration of neural network fundamentals and conversational interfaces.", tags: ["Python", "TensorFlow", "Keras"], url: "https://github.com/DagimTibebeselassie" },
  trade: { title: "PokéTrade", category: "FULL-STACK TEAM PROJECT · 2025", text: "Built a React/Vite and Django marketplace with MySQL for listing, trading, and transactions. Integrated PokeAPI, Pokémon TCG API, and OpenAI API for live data and generated content. Added CI/CD for testing and deployment, with hosting on Render.", tags: ["React / Vite", "Django", "MySQL", "OpenAI API", "CI/CD"], url: "https://github.com/tahasecond/PokeJackets" }
};
const projectDialog = $("#project-dialog");
let projectTrigger;
$$('[data-project]').forEach(button => button.addEventListener("click", () => {
  projectTrigger = button;
  const project = projects[button.dataset.project];
  $("#project-dialog-title").textContent = project.title;
  $("#project-dialog-category").textContent = project.category;
  $("#project-dialog-text").textContent = project.text;
  $("#project-dialog-link").href = project.url;
  $("#project-dialog-link").textContent = button.dataset.project === "chat" ? "Browse GitHub profile ↗" : "View source on GitHub ↗";
  $("#project-dialog-tags").replaceChildren(...project.tags.map(tag => { const span = document.createElement("span"); span.textContent = tag; return span; }));
  projectDialog.showModal(); document.body.style.overflow = "hidden";
}));
$("[data-close-dialog]").addEventListener("click", () => projectDialog.close());
projectDialog.addEventListener("click", event => { if (event.target === projectDialog) { const rect = projectDialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) projectDialog.close(); } });
projectDialog.addEventListener("close", () => { document.body.style.overflow = ""; projectTrigger?.focus({preventScroll:true}); });

const copyButton = $("[aria-label='Copy email']");
copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("DagimT2027@gmail.com");
    $(".copy-status").textContent = "Copied"; copyButton.setAttribute("aria-label", "Email copied");
    setTimeout(() => { $(".copy-status").textContent = ""; copyButton.setAttribute("aria-label", "Copy email"); }, 2200);
  } catch { $(".copy-status").textContent = "DagimT2027@gmail.com"; }
});

// Reveal only after JS is ready; the static page stays readable without JavaScript.
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
  }), {threshold: 0.06});
  $$(".section-heading, .featured, .project-card, .about-intro, .education-panel, .skills-explorer, .network-panel, .certification, .experience-row, .contact-section, .backend-case").forEach(element => { element.classList.add("scroll-reveal"); observer.observe(element); });
}
