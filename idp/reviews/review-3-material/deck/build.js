// Builds the KinSync Review III deck.
// Usage: npm run build            (writes ../KinSync_Review_III.pptx)
//        node build.js <output.pptx>
const fs = require("fs/promises");
const path = require("path");
const JSZip = require("jszip");
const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");

const OUTPUT = process.argv[2] || path.join(__dirname, "..", "KinSync_Review_III.pptx");

const THEME = {
  name: "KinSync",
  headFontFace: "Cambria",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "1D2B2E",
    lt1: "FFFFFF",
    dk2: "0E4D57",
    lt2: "EAF2F1",
    accent1: "1A7F86",
    accent2: "D9682B",
    accent3: "3F8F5E",
    accent4: "7D8A92",
    accent5: "2F6690",
    accent6: "9C4668",
    hlink: "1A7F86",
    folHlink: "0E4D57",
  },
};

// Hex copies of the theme colors, for icons rendered to PNG.
const HEX = {
  white: "FFFFFF",
  deep: THEME.colors.dk2,
  teal: THEME.colors.accent1,
  amber: THEME.colors.accent2,
  green: THEME.colors.accent3,
  grey: THEME.colors.accent4,
  blue: THEME.colors.accent5,
  berry: THEME.colors.accent6,
};

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5 in
pres.title = "KinSync - Review III";
pres.subject = "BACSE291 Innovative Design Project, Review III";
pres.author = "Nithin Vinayagamoorthy, Sri Hasini Chowdhary G";
pres.company = "VIT Chennai";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };

const C = pres.SchemeColor;
const COLOR = {
  text: C.text1,
  deep: C.text2,
  white: C.background1,
  tint: C.background2,
  teal: C.accent1,
  amber: C.accent2,
  green: C.accent3,
  grey: C.accent4,
  blue: C.accent5,
  berry: C.accent6,
};

const SLIDE_W = 13.333;
const MARGIN = 0.6;
const CONTENT_W = SLIDE_W - 2 * MARGIN;

// ---------- Layouts ----------

pres.defineSlideMaster({
  title: "KS_DARK",
  background: { color: COLOR.deep },
  objects: [
    {
      placeholder: {
        options: {
          name: "title", type: "title", x: MARGIN, y: 2.2, w: 8.2, h: 1.3,
          fontSize: 54, bold: true, color: COLOR.white, valign: "bottom", align: "left", margin: 0,
        },
        text: "",
      },
    },
    {
      placeholder: {
        options: {
          name: "body", type: "body", x: MARGIN, y: 3.6, w: 8.2, h: 1.1,
          fontSize: 22, color: COLOR.tint, valign: "top", align: "left", margin: 0,
        },
        text: "",
      },
    },
  ],
});

pres.defineSlideMaster({
  title: "KS_CONTENT",
  background: { color: COLOR.white },
  margin: [0.4, MARGIN, 0.7, MARGIN],
  slideNumber: { x: 12.2, y: 6.98, w: 0.55, h: 0.3, fontSize: 10, color: COLOR.grey, align: "right" },
  objects: [
    {
      text: {
        text: "KinSync · Review III · October 2026",
        options: { x: MARGIN, y: 6.98, w: 6, h: 0.3, fontSize: 10, color: COLOR.grey, margin: 0 },
      },
    },
    {
      placeholder: {
        options: {
          name: "title", type: "title", x: MARGIN, y: 0.35, w: CONTENT_W, h: 0.8,
          fontSize: 36, bold: true, color: COLOR.deep, valign: "middle", align: "left", margin: 0,
        },
        text: "",
      },
    },
  ],
});

// ---------- Theme ----------

const THEME_COLOR_SLOTS = [
  "dk1", "lt1", "dk2", "lt2",
  "accent1", "accent2", "accent3", "accent4", "accent5", "accent6",
  "hlink", "folHlink",
];

function escapeXml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Writes the theme's colours and name into every theme part of the saved deck.
 * pptxgenjs writes only the theme fonts, so without this the scheme colours used on the
 * slides would fall back to Office's default palette.
 */
async function applyThemeColors(fileName, theme) {
  const zip = await JSZip.loadAsync(await fs.readFile(fileName));
  const themeParts = Object.keys(zip.files).filter((name) => /^ppt\/theme\/theme\d+\.xml$/.test(name));
  if (themeParts.length === 0) {
    throw new Error(`No theme part found in ${fileName}`);
  }
  const name = escapeXml(theme.name);
  for (const part of themeParts) {
    let xml = await zip.file(part).async("string");
    for (const slot of THEME_COLOR_SLOTS) {
      const pattern = new RegExp(`<a:${slot}>[\\s\\S]*?</a:${slot}>`);
      if (!pattern.test(xml)) {
        throw new Error(`Theme colour ${slot} not found in ${part}`);
      }
      xml = xml.replace(pattern, `<a:${slot}><a:srgbClr val="${theme.colors[slot]}"/></a:${slot}>`);
    }
    xml = xml.replace(/<a:theme([^>]*?) name="[^"]*"/, `<a:theme$1 name="${name}"`);
    xml = xml.replace(/<a:clrScheme name="[^"]*"/, `<a:clrScheme name="${name}"`);
    xml = xml.replace(/<a:fontScheme name="[^"]*"/, `<a:fontScheme name="${name}"`);
    zip.file(part, xml);
  }
  const output = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  await fs.writeFile(fileName, output);
}

// ---------- Helpers ----------

const iconCache = new Map();

async function renderIcon(name, hex) {
  const key = `${name}:${hex}`;
  if (iconCache.has(key)) {
    return iconCache.get(key);
  }
  const component = fa[name];
  if (!component) {
    throw new Error(`Unknown icon ${name}`);
  }
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(component, { color: `#${hex}`, size: 256 }),
  );
  const png = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer();
  const data = "image/png;base64," + png.toString("base64");
  iconCache.set(key, data);
  return data;
}

// The deck's motif: a white icon in a coloured circle.
async function circleIcon(slide, name, x, y, diameter, fill, iconHex = HEX.white) {
  slide.addShape(pres.shapes.OVAL, {
    x, y, w: diameter, h: diameter, fill: { color: fill }, line: { type: "none" },
    objectName: `icon-circle-${name}`,
  });
  const inset = diameter * 0.24;
  slide.addImage({
    data: await renderIcon(name, iconHex),
    x: x + inset, y: y + inset, w: diameter - 2 * inset, h: diameter - 2 * inset,
    objectName: `icon-${name}`,
  });
}

function card(slide, x, y, w, h, fill = COLOR.tint, name = "card") {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, fill: { color: fill }, line: { type: "none" }, rectRadius: 0.1, objectName: name,
  });
}

function text(slide, value, options) {
  slide.addText(value, { isTextBox: true, margin: 0, valign: "top", color: COLOR.text, ...options });
}

function bullets(slide, items, options) {
  const runs = items.map((item, index) => ({
    text: item,
    options: { bullet: { indent: 16 }, breakLine: index < items.length - 1 },
  }));
  text(slide, runs, { fontSize: 15, paraSpaceAfter: 5, ...options });
}

function chip(slide, label, x, y, w, fill, color = COLOR.white) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h: 0.36, fill: { color: fill }, line: { type: "none" }, rectRadius: 0.18,
    objectName: `chip-${label}`,
  });
  text(slide, label, { x, y, w, h: 0.36, fontSize: 12, bold: true, color, align: "center", valign: "middle" });
}

function contentSlide(section, title) {
  const slide = pres.addSlide({ masterName: "KS_CONTENT", sectionTitle: section });
  slide.addText(title, { placeholder: "title" });
  return slide;
}

// ---------- Slides ----------

async function titleSlide() {
  pres.addSection({ title: "Opening" });
  const slide = pres.addSlide({ masterName: "KS_DARK", sectionTitle: "Opening" });
  slide.addText("KinSync", { placeholder: "title" });
  slide.addText("Review III · Phase 2: every signal collected on the phone, and shown", { placeholder: "body" });
  text(slide, "A quiet daily-rhythm monitor for elderly people living alone. Raw activity data never leaves the phone.", {
    x: MARGIN, y: 4.8, w: 8.2, h: 0.8, fontSize: 16, italic: true, color: COLOR.tint,
  });
  text(slide, [
    { text: "Nithin Vinayagamoorthy · Sri Hasini Chowdhary G", options: { bold: true, breakLine: true } },
    { text: "Guide: Kanchana Devi V", options: { breakLine: true } },
    { text: "BACSE291 Innovative Design Project · VIT Chennai · 12–16 Oct 2026" },
  ], { x: MARGIN, y: 5.85, w: 9, h: 1.0, fontSize: 14, color: COLOR.white, paraSpaceAfter: 2 });
  await circleIcon(slide, "FaHandHoldingHeart", 9.6, 1.9, 2.9, COLOR.teal);
  slide.addNotes(
    "Introduce KinSync in one sentence: it learns an elderly person's normal phone rhythm on their own phone and alerts family when that rhythm goes silent. " +
    "This review covers Phase 2: everything the phone collects is now built and visible in the app.",
  );
}

async function rubricSlide() {
  const slide = contentSlide("Opening", "How this review is covered");
  const items = [
    { icon: "FaComments", name: "Follow-up on Review II and progress", where: "Slides 3–4" },
    { icon: "FaSitemap", name: "Requirement analysis and design refinement", where: "Slides 7, 12" },
    { icon: "FaTools", name: "Component and tool selection, with reasons", where: "Slide 8" },
    { icon: "FaVial", name: "Prototype modules and early testing", where: "Slides 5, 6, 9" },
    { icon: "FaUsers", name: "Individual contribution and next-stage roles", where: "Slides 10, 13" },
  ];
  const gap = 0.3;
  const w = (CONTENT_W - gap * (items.length - 1)) / items.length;
  const y = 1.55;
  const h = 4.3;
  for (const [index, item] of items.entries()) {
    const x = MARGIN + index * (w + gap);
    card(slide, x, y, w, h, COLOR.tint, `rubric-card-${index + 1}`);
    await circleIcon(slide, item.icon, x + 0.3, y + 0.35, 0.9, COLOR.teal);
    text(slide, "2 marks", { x: x + 0.3, y: y + 1.5, w: w - 0.6, h: 0.35, fontSize: 14, bold: true, color: COLOR.amber });
    text(slide, item.name, { x: x + 0.3, y: y + 1.9, w: w - 0.6, h: 1.6, fontSize: 17, bold: true, color: COLOR.deep });
    text(slide, item.where, { x: x + 0.3, y: y + h - 0.6, w: w - 0.6, h: 0.35, fontSize: 12, color: COLOR.grey });
  }
  text(slide, "10 marks in all. A live demo on the real phone follows the slides.", {
    x: MARGIN, y: 6.15, w: CONTENT_W, h: 0.4, fontSize: 16, italic: true, color: COLOR.deep,
  });
  slide.addNotes("The deck follows the five Review III rubric parameters. Each card names the slides that answer it.");
}

async function followUpSlide() {
  pres.addSection({ title: "Review II follow-up" });
  const slide = contentSlide("Review II follow-up", "Review II asked: which features will be built?");
  // Left: the observation.
  card(slide, MARGIN, 1.5, 4.2, 3.2, COLOR.deep, "observation-card");
  await circleIcon(slide, "FaComments", MARGIN + 0.35, 1.8, 0.7, COLOR.amber);
  text(slide, "Review II panel, 23 Sep 2026", { x: MARGIN + 1.25, y: 1.95, w: 2.8, h: 0.4, fontSize: 13, bold: true, color: COLOR.tint });
  text(slide, "“Not clear which features are going to be implemented.”", {
    x: MARGIN + 0.35, y: 2.75, w: 3.5, h: 1.3, fontSize: 21, italic: true, color: COLOR.white,
  });
  text(slide, "Otherwise the panel was satisfied with the demo.", {
    x: MARGIN + 0.35, y: 4.1, w: 3.5, h: 0.4, fontSize: 12, color: COLOR.tint,
  });
  // Middle arrow.
  slide.addImage({ data: await renderIcon("FaArrowRight", HEX.amber), x: 5.05, y: 2.85, w: 0.5, h: 0.5, objectName: "arrow" });
  // Right: what we did.
  const actions = [
    { icon: "FaMap", head: "A feature map for the panel", body: "Every feature, its phase, its priority and its status, across all six reviews." },
    { icon: "FaMobileAlt", head: "Phase 2 re-scoped to be visible", body: "Every signal the phone collects is built and shown in the app, not hidden in a server." },
    { icon: "FaClipboardCheck", head: "A step-by-step plan", body: "8 must-have and 5 nice-to-have steps, approved by the team on 8 Oct 2026." },
  ];
  for (const [index, action] of actions.entries()) {
    const y = 1.5 + index * 1.1;
    await circleIcon(slide, action.icon, 5.95, y + 0.05, 0.7, COLOR.teal);
    text(slide, action.head, { x: 6.9, y, w: 5.8, h: 0.4, fontSize: 17, bold: true, color: COLOR.deep });
    text(slide, action.body, { x: 6.9, y: y + 0.4, w: 5.8, h: 0.6, fontSize: 14 });
  }
  // Bottom: stats.
  const stats = [
    { value: "17", label: "features built in Phase 1 (Review II)" },
    { value: "8 / 8", label: "Phase 2 must-haves built and on the demo phone" },
    { value: "29", label: "features planned for Reviews IV to VI" },
  ];
  const statW = (CONTENT_W - 0.6) / 3;
  for (const [index, stat] of stats.entries()) {
    const x = MARGIN + index * (statW + 0.3);
    card(slide, x, 5.0, statW, 1.65, COLOR.tint, `stat-${index + 1}`);
    text(slide, stat.value, { x: x + 0.3, y: 5.1, w: statW - 0.6, h: 0.85, fontSize: 44, bold: true, color: COLOR.amber, fontFace: THEME.headFontFace });
    text(slide, stat.label, { x: x + 0.3, y: 5.95, w: statW - 0.6, h: 0.55, fontSize: 14, color: COLOR.deep });
  }
  slide.addNotes(
    "Review II's only observation was that it was not clear which features would be built. " +
    "We answered it three ways: a feature map, a Phase 2 that makes every collected signal visible, and a step plan the team approved on 8 October. " +
    "The five nice-to-haves were moved to Phase 3 on 9 October so the review build stays stable on the phone.",
  );
}

async function progressSlide() {
  const slide = contentSlide("Review II follow-up", "Progress across the reviews");
  const reviews = [
    { name: "Review I", date: "17–21 Aug 2026", target: "Problem, objectives, survey", marks: "5 marks", state: "done" },
    { name: "Review II", date: "21–25 Sep 2026", target: "Design + first prototype", marks: "20 marks", state: "done" },
    { name: "Review III", date: "12–16 Oct 2026", target: "Phase 2: collect + show", marks: "10 marks", state: "now" },
    { name: "Review IV", date: "25–29 Jan 2027", target: "Phase 3: core logic + first alert", marks: "15 marks", state: "next" },
    { name: "Review V", date: "8–12 Mar 2027", target: "Phase 4: caregiver side", marks: "25 marks", state: "next" },
    { name: "Review VI", date: "29 Mar–2 Apr 2027", target: "Open House, 100%", marks: "15 marks", state: "next" },
    { name: "Report", date: "2 Apr 2027", target: "Final report", marks: "10 marks", state: "next" },
  ];
  const style = {
    done: { fill: COLOR.green, icon: "FaCheckCircle", word: "Done" },
    now: { fill: COLOR.amber, icon: "FaFlagCheckered", word: "Now: built" },
    next: { fill: COLOR.grey, icon: "FaClock", word: "Planned" },
  };
  const step = CONTENT_W / reviews.length;
  const nodeD = 0.75;
  const lineY = 3.35;
  slide.addShape(pres.shapes.LINE, {
    x: MARGIN + step / 2, y: lineY, w: CONTENT_W - step, h: 0,
    line: { color: COLOR.grey, width: 2 }, objectName: "timeline-line",
  });
  for (const [index, review] of reviews.entries()) {
    const centre = MARGIN + step * index + step / 2;
    const s = style[review.state];
    text(slide, review.name, { x: centre - step / 2 + 0.05, y: 1.75, w: step - 0.1, h: 0.4, fontSize: 16, bold: true, color: COLOR.deep, align: "center" });
    text(slide, review.date, { x: centre - step / 2 + 0.05, y: 2.15, w: step - 0.1, h: 0.35, fontSize: 12, color: COLOR.grey, align: "center" });
    await circleIcon(slide, s.icon, centre - nodeD / 2, lineY - nodeD / 2, nodeD, s.fill);
    text(slide, s.word, { x: centre - step / 2 + 0.05, y: 3.9, w: step - 0.1, h: 0.35, fontSize: 13, bold: true, color: s.fill, align: "center" });
    text(slide, review.target, { x: centre - step / 2 + 0.1, y: 4.25, w: step - 0.2, h: 0.75, fontSize: 13, align: "center" });
    text(slide, review.marks, { x: centre - step / 2 + 0.05, y: 5.0, w: step - 0.1, h: 0.3, fontSize: 12, color: COLOR.grey, align: "center" });
  }
  card(slide, MARGIN, 5.6, CONTENT_W, 1.05, COLOR.tint, "where-we-are");
  await circleIcon(slide, "FaMobileAlt", MARGIN + 0.3, 5.75, 0.75, COLOR.teal);
  text(slide, [
    { text: "Where we are: about 30%, as planned. ", options: { bold: true, color: COLOR.deep } },
    { text: "Phases 0, 1 and 2 are done. The demo phone has collected real data every day since 14 Sep 2026, and the Review III build (v0.2.0-phase2) has run on it since 9 Oct." },
  ], { x: MARGIN + 1.3, y: 5.72, w: CONTENT_W - 1.6, h: 0.85, fontSize: 15, valign: "middle" });
  slide.addNotes("Reviews I and II are done. Phase 2 is built and on the phone. Phases 3 to 5 follow the same plan as the feature map.");
}

async function phaseOneSlide() {
  pres.addSection({ title: "What we built" });
  const slide = contentSlide("What we built", "Phase 1: proving both halves work");
  chip(slide, "Done · demoed 23 Sep 2026", 9.6, 0.57, 3.13, COLOR.green);
  // Android column.
  card(slide, MARGIN, 1.45, 6.6, 5.25, COLOR.tint, "phase1-android");
  await circleIcon(slide, "FaAndroid", MARGIN + 0.3, 1.65, 0.65, COLOR.teal);
  text(slide, "On the elder's phone", { x: MARGIN + 1.1, y: 1.75, w: 5, h: 0.45, fontSize: 19, bold: true, color: COLOR.deep });
  bullets(slide, [
    "Consent screen before anything is collected",
    "Usage-access permission with a plain-language reason",
    "Battery-optimisation exemption keeps collection alive",
    "Unlock and screen on/off capture in a foreground service",
    "Restarts after reboot, only if consent was given",
    "On-phone database: nothing is uploaded",
    "Live event list on a debug screen",
    "Stop monitoring: revokes consent and stops collection",
    "Backend reachability check over HTTPS",
    "Large-text theme for elderly users",
  ], { x: MARGIN + 0.35, y: 2.4, w: 6.0, h: 4.2 });
  // Backend column.
  const rightX = MARGIN + 6.9;
  const rightW = CONTENT_W - 6.9;
  card(slide, rightX, 1.45, rightW, 3.75, COLOR.tint, "phase1-backend");
  await circleIcon(slide, "FaServer", rightX + 0.3, 1.65, 0.65, COLOR.blue);
  text(slide, "On the server", { x: rightX + 1.1, y: 1.75, w: 3.8, h: 0.45, fontSize: 19, bold: true, color: COLOR.deep });
  bullets(slide, [
    "Hardened server: key-only SSH, firewall, fail2ban",
    "HTTPS with automatic certificates (Caddy)",
    "FastAPI service that restarts itself",
    "PostgreSQL reachable only from the server",
    "Live /health and /health/db",
    "Quality gate with at least 90% coverage",
  ], { x: rightX + 0.35, y: 2.4, w: rightW - 0.6, h: 2.7 });
  card(slide, rightX, 5.45, rightW, 1.25, COLOR.tint, "phase1-docs");
  await circleIcon(slide, "FaBook", rightX + 0.3, 5.75, 0.65, COLOR.berry);
  text(slide, [
    { text: "Documentation", options: { bold: true, color: COLOR.deep, breakLine: true } },
    { text: "Specs, design, plan, runbooks and a traceability matrix" },
  ], { x: rightX + 1.1, y: 5.6, w: rightW - 1.3, h: 1.0, fontSize: 15, valign: "middle" });
  slide.addNotes("Phase 1 retired the two biggest risks: does background collection work on a real phone, and does the self-hosted server work end to end. 17 features in all.");
}

async function phaseTwoSlide() {
  const slide = contentSlide("What we built", "Phase 2: every signal, shown");
  chip(slide, "8 of 8 must-haves", 10.0, 0.57, 2.73, COLOR.amber);
  const features = [
    { icon: "FaChartBar", head: "App-usage pattern", body: "Which apps were used and when, read every 15 minutes." },
    { icon: "FaWalking", head: "Last moved", body: "Low-power motion sensor. Stores only the time; no step counting." },
    { icon: "FaRunning", head: "Activity", body: "Still, walking or in a vehicle, with a plain-language permission screen." },
    { icon: "FaStream", head: "“My day” timeline", body: "All signals on one 24-hour view, with a day picker for earlier days." },
    { icon: "FaCalendarDay", head: "Daily summary", body: "First unlock, unlocks, screen time, top apps, last moved, time per activity." },
    { icon: "FaUserCheck", head: "Versioned consent", body: "Lists every signal and asks again when the list changes." },
  ];
  const gap = 0.3;
  const w = (CONTENT_W - 2 * gap) / 3;
  const h = 2.25;
  for (const [index, feature] of features.entries()) {
    const col = index % 3;
    const row = Math.floor(index / 3);
    const x = MARGIN + col * (w + gap);
    const y = 1.45 + row * (h + gap);
    card(slide, x, y, w, h, COLOR.tint, `phase2-${index + 1}`);
    await circleIcon(slide, feature.icon, x + 0.3, y + 0.3, 0.75, COLOR.teal);
    text(slide, feature.head, { x: x + 1.25, y: y + 0.3, w: w - 1.5, h: 0.75, fontSize: 19, bold: true, color: COLOR.deep, valign: "middle" });
    text(slide, feature.body, { x: x + 0.3, y: y + 1.25, w: w - 0.6, h: 0.9, fontSize: 15 });
  }
  text(slide, [
    { text: "Also done: ", options: { bold: true, color: COLOR.deep } },
    { text: "tests for every new collector (115 logic + 59 device tests) and the feature map. App v0.2.0-phase2, tag review-3, on the demo phone since 9 Oct." },
  ], { x: MARGIN, y: 6.33, w: CONTENT_W, h: 0.5, fontSize: 14 });
  slide.addNotes(
    "All six visible features run on the demo phone. The summary is the app's main screen; the timeline opens from it. " +
    "In the demo we lock and unlock the phone and walk with it, and the new session and movement appear.",
  );
}

async function requirementsSlide() {
  pres.addSection({ title: "Design and tools" });
  const slide = contentSlide("Design and tools", "Requirements and design, refined");
  text(slide, "Requirements added or refined", { x: MARGIN, y: 1.4, w: 6.2, h: 0.4, fontSize: 19, bold: true, color: COLOR.deep });
  const reqs = [
    { id: "FR-2.7", tag: "New", fill: COLOR.amber, body: "Last moved: only the time is stored. No step counting, not fall detection." },
    { id: "FR-2.8", tag: "New", fill: COLOR.amber, body: "Charging and call activity, counts and times only. Planned for Phase 3." },
    { id: "FR-2.5", tag: "Refined", fill: COLOR.teal, body: "The elder sees what is collected: summary and timeline come first." },
    { id: "FR-7.1", tag: "Refined", fill: COLOR.teal, body: "Consent has a version; the elder is asked again when signals change." },
  ];
  for (const [index, req] of reqs.entries()) {
    const y = 1.95 + index * 1.05;
    card(slide, MARGIN, y, 6.2, 0.9, COLOR.tint, `req-${req.id}`);
    text(slide, req.id, { x: MARGIN + 0.25, y: y + 0.1, w: 1.2, h: 0.35, fontSize: 16, bold: true, color: COLOR.deep });
    chip(slide, req.tag, MARGIN + 0.2, y + 0.47, 1.0, req.fill);
    text(slide, req.body, { x: MARGIN + 1.5, y: y + 0.08, w: 4.55, h: 0.76, fontSize: 14, valign: "middle" });
  }
  text(slide, "Every requirement is tracked to its phase, commit and status in a traceability matrix.", {
    x: MARGIN, y: 6.2, w: 6.2, h: 0.55, fontSize: 13, italic: true, color: COLOR.grey,
  });
  // Right: on-phone database growth.
  const rx = 7.3;
  const rw = SLIDE_W - MARGIN - rx;
  text(slide, "On-phone database: 1 table to 4", { x: rx, y: 1.4, w: rw, h: 0.4, fontSize: 19, bold: true, color: COLOR.deep });
  const tables = [
    { v: "v1", name: "unlock_events", body: "Unlock, screen on and off times (Phase 1)" },
    { v: "v2", name: "app_usage_intervals", body: "App, start, end" },
    { v: "v3", name: "movement_events", body: "Time only" },
    { v: "v4", name: "activity_transitions", body: "Still / walking / vehicle, start and end" },
  ];
  for (const [index, table] of tables.entries()) {
    const y = 1.95 + index * 0.95;
    card(slide, rx, y, rw, 0.8, COLOR.tint, `table-${table.v}`);
    slide.addShape(pres.shapes.OVAL, { x: rx + 0.15, y: y + 0.1, w: 0.6, h: 0.6, fill: { color: COLOR.blue }, line: { type: "none" }, objectName: `version-${table.v}` });
    text(slide, table.v, { x: rx + 0.15, y: y + 0.1, w: 0.6, h: 0.6, fontSize: 14, bold: true, color: COLOR.white, align: "center", valign: "middle" });
    text(slide, [
      { text: table.name, options: { bold: true, color: COLOR.deep, breakLine: true } },
      { text: table.body, options: { fontSize: 13 } },
    ], { x: rx + 0.95, y: y + 0.06, w: rw - 1.1, h: 0.7, fontSize: 14, valign: "middle" });
  }
  card(slide, rx, 5.8, rw, 0.95, COLOR.deep, "design-notes");
  text(slide, "Each upgrade is a real migration that kept the demo phone's data. Summary and timeline only read these tables. The server still has no table for raw activity.", {
    x: rx + 0.25, y: 5.85, w: rw - 0.5, h: 0.85, fontSize: 13, color: COLOR.white, valign: "middle",
  });
  slide.addNotes("Two requirements were added after Review II and two were refined. On the phone, the database grew one table per collector, always through a migration that kept the existing data.");
}

async function componentsSlide() {
  const slide = contentSlide("Design and tools", "Components we chose, and why");
  const columns = [
    {
      head: "Android app", icon: "FaAndroid", fill: COLOR.teal, x: MARGIN,
      rows: [
        { icon: "FaLayerGroup", head: "Kotlin + Jetpack Compose", body: "Modern Android standard; large-text Material 3 theme." },
        { icon: "FaDatabase", head: "Room (on-phone SQLite)", body: "Raw data stays on the phone; migrations keep history." },
        { icon: "FaClock", head: "WorkManager", body: "Reliable 15-minute usage reads that survive restarts." },
        { icon: "FaWalking", head: "Significant-motion sensor", body: "One-shot hardware trigger: almost no battery, no step counting." },
        { icon: "FaRunning", head: "Activity Recognition API", body: "Still, walking or vehicle, without GPS or location permission." },
      ],
    },
    {
      head: "Backend server", icon: "FaServer", fill: COLOR.blue, x: MARGIN + CONTENT_W / 2 + 0.15,
      rows: [
        { icon: "FaCloud", head: "Self-hosted Hetzner VM", body: "We learn the whole stack, not a black-box service." },
        { icon: "FaPython", head: "FastAPI + PostgreSQL", body: "Async, automatic API docs, validation, relational data." },
        { icon: "FaLock", head: "Caddy", body: "Automatic HTTPS certificates from Let's Encrypt." },
        { icon: "FaCogs", head: "systemd services", body: "Simpler than Docker to run and debug on one server." },
        { icon: "FaBell", head: "FCM + APScheduler (Phase 3)", body: "Push relay only; timer for the dead-man's switch." },
      ],
    },
  ];
  const colW = CONTENT_W / 2 - 0.15;
  for (const column of columns) {
    card(slide, column.x, 1.4, colW, 4.95, COLOR.tint, `components-${column.head}`);
    await circleIcon(slide, column.icon, column.x + 0.3, 1.55, 0.6, column.fill);
    text(slide, column.head, { x: column.x + 1.05, y: 1.6, w: colW - 1.3, h: 0.5, fontSize: 19, bold: true, color: COLOR.deep, valign: "middle" });
    for (const [index, row] of column.rows.entries()) {
      const y = 2.35 + index * 0.78;
      await circleIcon(slide, row.icon, column.x + 0.35, y + 0.05, 0.5, column.fill);
      text(slide, [
        { text: row.head, options: { bold: true, color: COLOR.deep, breakLine: true } },
        { text: row.body },
      ], { x: column.x + 1.05, y, w: colW - 1.3, h: 0.72, fontSize: 14 });
    }
  }
  text(slide, "Each lasting choice is written down as an Architecture Decision Record with the alternatives considered (6 so far).", {
    x: MARGIN, y: 6.45, w: CONTENT_W, h: 0.4, fontSize: 14, italic: true, color: COLOR.grey,
  });
  slide.addNotes("The phone-side choices all follow from privacy and battery: keep raw data local, use the cheapest sensor that answers the question, never use GPS. The server is self-hosted on purpose, so the team learns how each part works.");
}

async function testingSlide() {
  pres.addSection({ title: "Testing" });
  const slide = contentSlide("Testing", "Early testing at every step");
  const stats = [
    { value: "115", label: "logic tests on the computer, all passing" },
    { value: "59", label: "database and screen tests on an emulator, all passing" },
    { value: "v1→v4", label: "database upgrades kept all earlier data" },
    { value: "22 = 22", label: "unlocks on screen matched a separate database count" },
  ];
  const gap = 0.3;
  const w = (CONTENT_W - 3 * gap) / 4;
  for (const [index, stat] of stats.entries()) {
    const x = MARGIN + index * (w + gap);
    card(slide, x, 1.45, w, 1.85, COLOR.tint, `test-stat-${index + 1}`);
    text(slide, stat.value, { x: x + 0.25, y: 1.55, w: w - 0.5, h: 0.85, fontSize: 40, bold: true, color: COLOR.amber, fontFace: THEME.headFontFace });
    text(slide, stat.label, { x: x + 0.25, y: 2.45, w: w - 0.5, h: 0.75, fontSize: 14, color: COLOR.deep });
  }
  text(slide, "How every step was accepted", { x: MARGIN, y: 3.55, w: CONTENT_W, h: 0.4, fontSize: 17, bold: true, color: COLOR.deep });
  const steps = [
    { icon: "FaCode", label: "Build one step" },
    { icon: "FaLaptopCode", label: "Logic tests" },
    { icon: "FaMobileAlt", label: "Emulator tests" },
    { icon: "FaHandHoldingHeart", label: "Check on the demo phone" },
    { icon: "FaCheckCircle", label: "Team approves, then commit" },
  ];
  const stepW = CONTENT_W / steps.length;
  for (const [index, s] of steps.entries()) {
    const x = MARGIN + index * stepW;
    await circleIcon(slide, s.icon, x + stepW / 2 - 0.35, 4.05, 0.7, index === steps.length - 1 ? COLOR.green : COLOR.teal);
    text(slide, s.label, { x: x + 0.1, y: 4.85, w: stepW - 0.2, h: 0.4, fontSize: 14, align: "center" });
    if (index < steps.length - 1) {
      slide.addImage({ data: await renderIcon("FaArrowRight", HEX.grey), x: x + stepW - 0.15, y: 4.27, w: 0.3, h: 0.26, objectName: `flow-arrow-${index + 1}` });
    }
  }
  const half = CONTENT_W / 2 - 0.15;
  card(slide, MARGIN, 5.5, half, 1.2, COLOR.tint, "backend-gate");
  await circleIcon(slide, "FaShieldAlt", MARGIN + 0.25, 5.75, 0.7, COLOR.blue);
  text(slide, [
    { text: "Backend quality gate", options: { bold: true, color: COLOR.deep, breakLine: true } },
    { text: "Lint, types, security scan, complexity limits, at least 90% coverage." },
  ], { x: MARGIN + 1.15, y: 5.58, w: half - 1.35, h: 1.05, fontSize: 14, valign: "middle" });
  const bx = MARGIN + half + 0.3;
  card(slide, bx, 5.5, half, 1.2, COLOR.tint, "known-issue");
  await circleIcon(slide, "FaBug", bx + 0.25, 5.75, 0.7, COLOR.amber);
  text(slide, [
    { text: "Found on the real phone", options: { bold: true, color: COLOR.deep, breakLine: true } },
    { text: "Xiaomi “Autostart” can block the restart after an update or reboot. For now: open the app once." },
  ], { x: bx + 1.15, y: 5.58, w: half - 1.35, h: 1.05, fontSize: 14, valign: "middle" });
  slide.addNotes("Each step was built, tested on the computer and the emulator, then checked on the real phone before the next step started. The phone check found the Xiaomi Autostart issue, which is documented with a workaround.");
}

async function phaseThreeSlide() {
  pres.addSection({ title: "What's next" });
  const slide = contentSlide("What's next", "Phase 3: core logic, first alert");
  chip(slide, "25–29 Jan 2027 · ~50%", 9.73, 0.57, 3.0, COLOR.grey);
  const columns = [
    {
      head: "On the phone", icon: "FaAndroid", fill: COLOR.teal, tag: "Must",
      items: [
        "Baseline: a rolling 14-day pattern, ready after 7 days",
        "Deviation check with an “Everything OK?” nudge",
        "Elder or caregiver role choice",
        "Pairing with a 6-digit code, up to 3 caregivers",
        "Heartbeat: only “I'm OK” + check-in window",
      ],
    },
    {
      head: "On the server", icon: "FaServer", fill: COLOR.blue, tag: "Must",
      items: [
        "Tables for elders, caregivers, pairings, heartbeats, alerts",
        "Device registration with secure tokens",
        "Dead-man's switch: alert when a heartbeat is missed",
        "Push alert to caregivers (Firebase)",
        "Nightly database backups",
      ],
    },
    {
      head: "Moved from Phase 2", icon: "FaRedo", fill: COLOR.grey, tag: "Nice",
      items: [
        "Phase 3 API design draft",
        "Charging: plugged and unplugged times",
        "Call activity: counts and times only",
        "30-day auto-delete on the phone",
        "First battery measurement",
      ],
    },
  ];
  const gap = 0.3;
  const w = (CONTENT_W - 2 * gap) / 3;
  for (const [index, column] of columns.entries()) {
    const x = MARGIN + index * (w + gap);
    card(slide, x, 1.45, w, 5.25, COLOR.tint, `phase3-${index + 1}`);
    await circleIcon(slide, column.icon, x + 0.3, 1.65, 0.65, column.fill);
    text(slide, column.head, { x: x + 1.1, y: 1.65, w: w - 1.3, h: 0.4, fontSize: 18, bold: true, color: COLOR.deep });
    text(slide, column.tag === "Must" ? "Must-have" : "Nice-to-have", { x: x + 1.1, y: 2.03, w: w - 1.3, h: 0.3, fontSize: 12, bold: true, color: column.tag === "Must" ? COLOR.amber : COLOR.grey });
    bullets(slide, column.items, { x: x + 0.3, y: 2.6, w: w - 0.55, h: 4.0, paraSpaceAfter: 9 });
  }
  slide.addNotes("Phase 3 turns the collected data into a baseline, a nudge and an alert to family. The server owns the decision to escalate, so a phone that is off or out of battery still raises an alert.");
}

async function laterPhasesSlide() {
  const slide = contentSlide("What's next", "Phases 4 and 5: caregivers, Open House");
  const columns = [
    {
      head: "Phase 4 · Review V", sub: "8–12 Mar 2027 · ~80%", icon: "FaUserFriends", fill: COLOR.teal,
      items: [
        "Caregiver dashboard: normal, nudged or escalated",
        "Acknowledge and resolve alerts",
        "Transparency screen: everything collected, in plain words",
        "Pause / travel mode",
        "View and remove caregivers; revoking consent unpairs all",
        "Pilot users and threshold tuning",
        "Battery target: under 5% extra a day",
        "Test plan and results",
        "Activity trend for caregivers, aggregated (nice-to-have)",
      ],
    },
    {
      head: "Phase 5 · Open House + report", sub: "29 Mar–2 Apr 2027 · 100%", icon: "FaRocket", fill: COLOR.amber,
      items: [
        "Polish and accessibility pass",
        "Performance evaluation: alert delay, false alarms, battery",
        "Open House demo kit: two phones, live alert, backup video",
        "Final report in the prescribed format (2 Apr 2027)",
        "SMS fallback for caregivers (nice-to-have)",
      ],
    },
  ];
  const w = CONTENT_W / 2 - 0.15;
  for (const [index, column] of columns.entries()) {
    const x = MARGIN + index * (w + 0.3);
    card(slide, x, 1.45, w, 5.25, COLOR.tint, `later-${index + 1}`);
    await circleIcon(slide, column.icon, x + 0.3, 1.65, 0.7, column.fill);
    text(slide, column.head, { x: x + 1.2, y: 1.65, w: w - 1.4, h: 0.4, fontSize: 19, bold: true, color: COLOR.deep });
    text(slide, column.sub, { x: x + 1.2, y: 2.05, w: w - 1.4, h: 0.3, fontSize: 13, color: COLOR.grey });
    bullets(slide, column.items, { x: x + 0.3, y: 2.6, w: w - 0.55, h: 4.0 });
  }
  slide.addNotes("Phase 4 adds the caregiver side and real pilot users; Phase 5 measures and demonstrates the whole system. Phase 3 and later are plans and may change after each review.");
}

async function privacySlide() {
  const slide = contentSlide("What's next", "The privacy promise, in every phase");
  const tiles = [
    { icon: "FaMobileAlt", head: "Raw data stays on the phone", body: "Unlocks, app names, motion and calls never leave it." },
    { icon: "FaHeartbeat", head: "Only a heartbeat is sent", body: "“I'm OK” and the expected check-in window. Nothing else." },
    { icon: "FaDatabase", head: "The server cannot hold it", body: "There is no server table that could store raw activity." },
    { icon: "FaBan", head: "No GPS, ever", body: "No location permission is asked for." },
  ];
  const gap = 0.3;
  const w = (CONTENT_W - 3 * gap) / 4;
  for (const [index, tile] of tiles.entries()) {
    const x = MARGIN + index * (w + gap);
    card(slide, x, 1.5, w, 3.6, COLOR.tint, `privacy-${index + 1}`);
    await circleIcon(slide, tile.icon, x + w / 2 - 0.55, 1.8, 1.1, COLOR.deep);
    text(slide, tile.head, { x: x + 0.25, y: 3.1, w: w - 0.5, h: 0.75, fontSize: 18, bold: true, color: COLOR.deep, align: "center" });
    text(slide, tile.body, { x: x + 0.25, y: 3.85, w: w - 0.5, h: 1.1, fontSize: 14, align: "center" });
  }
  card(slide, MARGIN, 5.4, CONTENT_W, 1.3, COLOR.white, "out-of-scope");
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: MARGIN, y: 5.4, w: CONTENT_W, h: 1.3, fill: { color: COLOR.white }, line: { color: COLOR.grey, width: 1 }, rectRadius: 0.1, objectName: "out-of-scope-frame",
  });
  text(slide, [
    { text: "Out of scope for version 1: ", options: { bold: true, color: COLOR.deep } },
    { text: "fall detection, medical diagnosis, step counting, GPS tracking, wearables, iOS, audio or video monitoring, multiple languages, more than 3 caregivers per elder." },
  ], { x: MARGIN + 0.3, y: 5.5, w: CONTENT_W - 0.6, h: 1.1, fontSize: 15, valign: "middle" });
  slide.addNotes("Privacy is by construction, not by policy: the server simply has nowhere to put raw activity. This is why Phase 2 could be built entirely on the phone.");
}

async function contributionsSlide() {
  pres.addSection({ title: "Team" });
  const slide = contentSlide("Team", "Who did what, and who does what next");
  const people = [
    {
      name: "Sri Hasini Chowdhary G", role: "Android app · kinsync-android", icon: "FaAndroid", fill: COLOR.teal,
      rows: [
        { label: "Phase 1", body: "Onboarding, permissions, unlock capture, debug screen, backend check." },
        { label: "Phase 2", body: "Versioned consent, app usage, last moved, activity, daily summary, “My day” timeline, migrations, tests." },
        { label: "Next: Phase 3", body: "Baseline, deviation check and nudge, role choice, pairing screen, heartbeat sender; charging, calls, auto-delete, battery." },
      ],
    },
    {
      name: "Nithin Vinayagamoorthy", role: "Backend, server and docs · kinsync-api, kinsync-docs", icon: "FaServer", fill: COLOR.blue,
      rows: [
        { label: "Phase 1", body: "Hardened server, HTTPS, PostgreSQL, FastAPI health endpoints, quality gate." },
        { label: "Phase 2", body: "Server kept running; Phase 2 plan, feature map, requirements, traceability, runbooks." },
        { label: "Next: Phase 3", body: "API design, server tables, pairing and tokens, heartbeat endpoint, dead-man's switch, push alerts, backups." },
      ],
    },
  ];
  const w = CONTENT_W / 2 - 0.15;
  for (const [index, person] of people.entries()) {
    const x = MARGIN + index * (w + 0.3);
    card(slide, x, 1.45, w, 5.25, COLOR.tint, `person-${index + 1}`);
    await circleIcon(slide, person.icon, x + 0.3, 1.65, 0.85, person.fill);
    text(slide, person.name, { x: x + 1.35, y: 1.7, w: w - 1.55, h: 0.42, fontSize: 20, bold: true, color: COLOR.deep });
    text(slide, person.role, { x: x + 1.35, y: 2.12, w: w - 1.55, h: 0.35, fontSize: 12, color: COLOR.grey });
    for (const [rowIndex, row] of person.rows.entries()) {
      const y = 2.8 + rowIndex * 1.27;
      text(slide, row.label, { x: x + 0.35, y, w: w - 0.7, h: 0.3, fontSize: 13, bold: true, color: rowIndex === 2 ? COLOR.amber : COLOR.teal });
      text(slide, row.body, { x: x + 0.35, y: y + 0.32, w: w - 0.7, h: 0.88, fontSize: 14 });
    }
  }
  slide.addNotes("Each member explains their own part in the demo and answers the technical questions on it. The Phase 3 split follows the same lines: phone logic on the Android side, the alert path on the server side.");
}

async function closingSlide() {
  pres.addSection({ title: "Close" });
  const slide = pres.addSlide({ masterName: "KS_DARK", sectionTitle: "Close" });
  text(slide, "Live demo, then questions", { x: MARGIN, y: 0.9, w: CONTENT_W, h: 1.0, fontSize: 44, bold: true, color: COLOR.white, fontFace: THEME.headFontFace, valign: "bottom" });
  text(slide, "On the demo phone, collecting since 14 Sep 2026", { x: MARGIN, y: 2.05, w: CONTENT_W, h: 0.5, fontSize: 20, color: COLOR.tint });
  const steps = [
    { icon: "FaCalendarDay", head: "Your day so far", body: "The daily summary" },
    { icon: "FaStream", head: "My day, hour by hour", body: "Timeline, then yesterday" },
    { icon: "FaWalking", head: "Live", body: "Unlock, lock, walk a few steps" },
    { icon: "FaEye", head: "Everything recorded", body: "Raw records and the server health check" },
  ];
  const gap = 0.3;
  const w = (CONTENT_W - 3 * gap) / 4;
  for (const [index, s] of steps.entries()) {
    const x = MARGIN + index * (w + gap);
    card(slide, x, 3.1, w, 2.6, COLOR.white, `demo-${index + 1}`);
    await circleIcon(slide, s.icon, x + 0.3, 3.35, 0.75, COLOR.teal);
    text(slide, String(index + 1), { x: x + w - 0.8, y: 3.35, w: 0.5, h: 0.75, fontSize: 32, bold: true, color: COLOR.amber, align: "right", fontFace: THEME.headFontFace });
    text(slide, s.head, { x: x + 0.3, y: 4.25, w: w - 0.6, h: 0.75, fontSize: 18, bold: true, color: COLOR.deep });
    text(slide, s.body, { x: x + 0.3, y: 5.0, w: w - 0.6, h: 0.6, fontSize: 14 });
  }
  text(slide, "Thank you", { x: MARGIN, y: 6.2, w: CONTENT_W, h: 0.6, fontSize: 24, bold: true, italic: true, color: COLOR.white, fontFace: THEME.headFontFace });
  slide.addNotes("Follow the demo script: summary, timeline and the day before, a live unlock and short walk, then the debug list and /health. If the phone or network fails, use the screen recording.");
}

async function main() {
  await titleSlide();
  await rubricSlide();
  await followUpSlide();
  await progressSlide();
  await phaseOneSlide();
  await phaseTwoSlide();
  await requirementsSlide();
  await componentsSlide();
  await testingSlide();
  await phaseThreeSlide();
  await laterPhasesSlide();
  await privacySlide();
  await contributionsSlide();
  await closingSlide();
  await pres.writeFile({ fileName: OUTPUT });
  await applyThemeColors(OUTPUT, THEME);
  console.log(`Wrote ${OUTPUT}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
