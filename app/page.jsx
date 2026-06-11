"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "../config/site";

// Lines the hero terminal "types" — the product demoing itself.
const TERMINAL_LINES = [
  { cls: "t-cmd", text: "$ scout run --role 'VP Finance — CPG, PE-backed'" },
  { cls: "t-dim", text: "parsing role spec ............ done" },
  { cls: "t-dim", text: "scanning public sources ...... done" },
  { cls: "t-dim", text: "compiling brief .............. done (11m 42s)" },
  { cls: "", text: " " },
  { cls: "t-key", text: "CANDIDATE BRIEF — Candidate A" },
  { cls: "", text: "13 yrs progressive finance · PE-backed CPG" },
  { cls: "t-strong", text: "● Strong — PE scaling, FP&A build, board comms" },
  { cls: "t-probe", text: "● Probe — M&A integration led vs. observed" },
  { cls: "", text: "Comp target: ~$400–450K all-in · Notice: 30–60d" },
  { cls: "", text: " " },
  { cls: "t-cmd", text: "→ 5-page client-ready PDF exported" },
];

function Terminal() {
  const [visible, setVisible] = useState(0);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced.current) {
      setVisible(TERMINAL_LINES.length);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setVisible(i);
      if (i >= TERMINAL_LINES.length) clearInterval(id);
    }, 420);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="terminal" aria-label="Example of the agent producing a candidate brief">
      <div className="terminal-bar">
        <span className="dot dot--active" />
        <span className="dot" />
        <span className="dot" />
        <span className="terminal-title">scout — research agent</span>
      </div>
      <div className="terminal-body">
        {TERMINAL_LINES.slice(0, visible).map((l, idx) => (
          <div key={idx} className={l.cls}>
            {l.text}
          </div>
        ))}
        {visible < TERMINAL_LINES.length && <span className="cursor" />}
      </div>
    </div>
  );
}

function BuyButton({ children, ghost = false }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || "Could not start checkout");
      }
    } catch (e) {
      setError("Checkout couldn't start. Refresh and try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        className={`btn ${ghost ? "btn--ghost" : "btn--primary"}`}
        onClick={checkout}
        disabled={loading}
      >
        {loading ? "Opening secure checkout…" : children}
      </button>
      {error && (
        <p role="alert" style={{ color: "#ffc56e", fontSize: 14, marginTop: 10 }}>
          {error}
        </p>
      )}
    </>
  );
}

export default function Page() {
  return (
    <>
      <div className="field" aria-hidden="true" />
      <div className="glow glow--violet" aria-hidden="true" />
      <div className="glow glow--cyan" aria-hidden="true" />

      <div className="wrap">
        <nav className="nav">
          <a className="logo" href="#">
            SCOUT<span>FILE</span>
          </a>
          <a className="btn btn--ghost" href="#pricing">
            Get the skill — ${site.priceUSD}
          </a>
        </nav>

        {/* ---------------- HERO ---------------- */}
        <header className="hero">
          <div>
            <p className="eyebrow">A Claude skill for recruiters</p>
            <h1>
              Candidate research in <em>12 minutes</em>, not 2 hours.
            </h1>
            <p className="lede">
              ScoutFile is an installable AI research skill that turns a role
              spec into a client-ready candidate brief — career trajectory,
              competency match, comp context, interview probes. Built by a
              recruiter-facing operator, not a software committee.
            </p>
            <div className="hero-ctas">
              <BuyButton>Buy &amp; download — ${site.priceUSD}</BuyButton>
              <a className="btn btn--ghost" href="#output">
                See the output
              </a>
            </div>
            <p className="hero-note">
              one-time purchase · instant download · works with your Claude
              account
            </p>
          </div>
          <Terminal />
        </header>

        {/* ---------------- PROOF ---------------- */}
        <div className="proof">
          <div className="proof-item">
            <div className="proof-num">15h → 5h</div>
            <div className="proof-label">
              weekly research load, peak season
            </div>
          </div>
          <div className="proof-item">
            <div className="proof-num">~12 min</div>
            <div className="proof-label">per client-ready candidate brief</div>
          </div>
          <div className="proof-item">
            <div className="proof-num">5 pages</div>
            <div className="proof-label">
              brief depth — trajectory to interview probes
            </div>
          </div>
        </div>

        {/* ---------------- WHAT'S INSIDE ---------------- */}
        <section id="inside">
          <div className="section-head">
            <h2>What's in the package</h2>
            <p className="section-sub">
              Everything you need to run deep candidate and company research
              from your own Claude account. No new tool to learn, no seat
              licenses, no data leaving your control.
            </p>
          </div>
          <div className="cards">
            <div className="card">
              <span className="card-tag">core</span>
              <h3>The research agent skill file</h3>
              <p>
                The full skill that drives the workflow: role-spec parsing,
                source strategy, candidate analysis, and the judgment layer
                that flags strengths honestly — including what to probe in
                interviews.
              </p>
            </div>
            <div className="card">
              <span className="card-tag">templates</span>
              <h3>Three brief templates</h3>
              <p>
                Candidate brief, company intel brief, and compensation context
                — the same structures used in live searches, formatted to hand
                straight to a client.
              </p>
            </div>
            <div className="card">
              <span className="card-tag">setup</span>
              <h3>15-minute install guide</h3>
              <p>
                Step-by-step setup for Claude, written for recruiters, not
                engineers. Install once, then run it on every role you work.
              </p>
            </div>
            <div className="card">
              <span className="card-tag">tuning</span>
              <h3>Customization playbook</h3>
              <p>
                How to tune the agent to your industries, your brief voice, and
                your sourcing philosophy — so the output reads like your desk
                produced it.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------- HOW IT WORKS ---------------- */}
        <section id="how">
          <div className="section-head">
            <h2>Install once. Run on every search.</h2>
          </div>
          <div className="steps">
            <div className="step">
              <h3>Buy &amp; download</h3>
              <p>
                Secure Stripe checkout. The full package downloads instantly —
                skill file, templates, and guides.
              </p>
            </div>
            <div className="step">
              <h3>Install in Claude</h3>
              <p>
                Follow the 15-minute guide to load the skill into your own
                Claude account. Your data stays yours.
              </p>
            </div>
            <div className="step">
              <h3>Drop in a role</h3>
              <p>
                Paste a role spec. Get back a structured, sourced,
                client-ready brief — then tune it to your voice.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------- OUTPUT PREVIEW ---------------- */}
        <section id="output">
          <div className="section-head">
            <h2>The output is the pitch</h2>
            <p className="section-sub">
              A slice of a real brief structure — competency match with honest
              confidence ratings. The agent tells you what's strong{" "}
              <em>and</em> what to probe. That honesty is what makes it usable
              in front of clients.
            </p>
          </div>
          <div className="matrix" role="table" aria-label="Sample competency matrix">
            <div className="matrix-row matrix-row--head" role="row">
              <div role="columnheader">Requirement</div>
              <div role="columnheader">Evidence</div>
              <div role="columnheader">Confidence</div>
            </div>
            <div className="matrix-row" role="row">
              <div className="matrix-req" role="cell">PE-backed scaling</div>
              <div className="matrix-ev" role="cell">
                6+ yrs across two PE-portfolio brands; led Series C financial
                workstream end-to-end
              </div>
              <div role="cell"><span className="pill pill--strong">● Strong</span></div>
            </div>
            <div className="matrix-row" role="row">
              <div className="matrix-req" role="cell">Board-level comms</div>
              <div className="matrix-ev" role="cell">
                Owns monthly board reporting; presented to PE sponsor 4x last
                year
              </div>
              <div role="cell"><span className="pill pill--strong">● Strong</span></div>
            </div>
            <div className="matrix-row" role="row">
              <div className="matrix-req" role="cell">M&amp;A leadership</div>
              <div className="matrix-ev" role="cell">
                Participated in two integrations, did not lead — surface early
                in interviews
              </div>
              <div role="cell"><span className="pill pill--probe">● Probe</span></div>
            </div>
            <div className="matrix-row" role="row">
              <div className="matrix-req" role="cell">Cultural fit</div>
              <div className="matrix-ev" role="cell">
                Lived the founder-led → professionalized transition at current
                company
              </div>
              <div role="cell"><span className="pill pill--strong">● Strong</span></div>
            </div>
          </div>
        </section>

        {/* ---------------- PRICING ---------------- */}
        <section id="pricing" className="pricing">
          <div className="price-card">
            <p className="eyebrow">One-time purchase</p>
            <div className="price-amount">${site.priceUSD}</div>
            <p className="price-meta">no subscription · instant download</p>
            <ul className="price-list">
              <li>The complete research agent skill file</li>
              <li>Candidate, company &amp; comp brief templates</li>
              <li>15-minute install guide for Claude</li>
              <li>Customization playbook for your desk</li>
              <li>Free updates to the v1 package</li>
            </ul>
            <BuyButton>Buy &amp; download — ${site.priceUSD}</BuyButton>
            <p className="price-foot">
              Want it custom-built, tuned, and supported for your whole firm?{" "}
              <a href={`mailto:${site.supportEmail}`}>
                Ask about white-glove setup →
              </a>
            </p>
          </div>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section>
          <div className="section-head">
            <h2>Questions recruiters ask</h2>
          </div>
          <div className="faq">
            <details>
              <summary>What exactly do I download?</summary>
              <p>
                A zip containing the skill file, three brief templates, the
                install guide, and the customization playbook. You load the
                skill into your own Claude account and run it from there.
              </p>
            </details>
            <details>
              <summary>Do I need a Claude subscription?</summary>
              <p>
                Yes — the skill runs inside your own Claude account, so you'll
                need an active plan. That also means your candidate data stays
                in your account, not on someone else's server.
              </p>
            </details>
            <details>
              <summary>Is this a sourcing tool?</summary>
              <p>
                No. ScoutFile is a research and briefing layer. It does deep
                work on candidates and companies you're already considering —
                it doesn't replace your network or your judgment.
              </p>
            </details>
            <details>
              <summary>What if it doesn't fit my workflow?</summary>
              <p>
                The customization playbook covers tuning it to your industries
                and brief style. If you're stuck, email support and you'll get
                a real reply from the person who built it.
              </p>
            </details>
            <details>
              <summary>Can my whole team use it?</summary>
              <p>
                The $299 license covers one recruiter. For team installs,
                custom configuration, and ongoing tuning, ask about the
                white-glove option.
              </p>
            </details>
          </div>
        </section>

        <footer>
          <span>
            {site.name} · built by a recruiter-facing operator in Brooklyn
          </span>
          <a href={`mailto:${site.supportEmail}`} style={{ color: "inherit" }}>
            {site.supportEmail}
          </a>
        </footer>
      </div>
    </>
  );
}
