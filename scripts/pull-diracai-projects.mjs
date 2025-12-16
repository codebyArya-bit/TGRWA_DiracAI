import { chromium } from "playwright";
import fs from "fs";

const SOURCE_URL = "https://diracai.com/projects";

// Known titles from the page (useful anchors if selectors change)
const TITLES = [
    "DashoApp Mobile App",
    "No-Code Trading Platform",
    "Invoice Builder",
    "Nijje Self-Learning App",
    "HelloToppers",
    "DashoApp Web Platform",
];

function slugify(s) {
    return s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

(async () => {
    console.log("Launching browser...");
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    console.log(`Navigating to ${SOURCE_URL}...`);
    await page.goto(SOURCE_URL, { waitUntil: "networkidle" });

    // IMPORTANT:
    // We don’t know your exact DOM structure, so we extract cards by finding each title text,
    // then walking up to a reasonable “card container”, and reading nearby text + links + image.
    const projects = await page.evaluate(({ TITLES }) => {
        const uniq = (arr) => Array.from(new Set(arr)).filter(Boolean);

        const getCardRoot = (el) => {
            // climb up until it feels like a "card" (has image or multiple lines or link)
            let cur = el;
            for (let i = 0; i < 8 && cur; i++) {
                const hasImg = cur.querySelector?.("img");
                const hasLink = cur.querySelector?.("a[href]");
                const txt = (cur.innerText || "").trim().split("\n").filter(Boolean);
                if ((hasImg || hasLink) && txt.length >= 2) return cur;
                cur = cur.parentElement;
            }
            return el.parentElement || el;
        };

        const byTitle = (title) => {
            const match = Array.from(document.querySelectorAll("*"))
                .find((n) => (n.textContent || "").trim() === title);
            if (!match) return null;

            const root = getCardRoot(match);
            const textLines = (root.innerText || "")
                .split("\n")
                .map((s) => s.trim())
                .filter(Boolean);

            const links = uniq(
                Array.from(root.querySelectorAll("a[href]"))
                    .map((a) => a.getAttribute("href"))
            );

            const img =
                root.querySelector("img")?.getAttribute("src") ||
                root.querySelector("img")?.getAttribute("data-src") ||
                null;

            // Heuristic fields:
            // title = exact match
            // subtitle/description = next meaningful line(s)
            const titleIdx = textLines.indexOf(title);
            const after = titleIdx >= 0 ? textLines.slice(titleIdx + 1) : textLines;

            return {
                title,
                // join first 1–2 lines after title as a description; adjust later if you want richer fields
                description: after.slice(0, 2).join(" "),
                bullets: after.slice(2, 8), // leftover lines that might be tech stack/features
                links,
                imageUrl: img,
            };
        };

        return TITLES.map(byTitle).filter(Boolean);
    }, { TITLES });

    const normalized = projects.map((p) => ({
        ...p,
        slug: slugify(p.title),
        // optional: split tech tags from bullets if you want
        tech: [],
        isActive: true,
    }));

    if (!fs.existsSync("seed")) fs.mkdirSync("seed");
    fs.writeFileSync("seed/projects.json", JSON.stringify(normalized, null, 2));
    console.log(`✅ Extracted ${normalized.length} projects -> seed/projects.json`);

    await browser.close();
})();
