"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "../config/site";

// Lines the hero terminal "types" - the product demoing itself.
const TERMINAL_LINES = [
  { cls: "t-cmd", text: "$ scout run --role 'VP Finance, PE-backed CPG'" },
  { cls: "t-dim", text: "parsing role spec ............ done" },
  { cls: "t-dim", text: "scanning public sources ...... done" },
  { cls: "t-dim", text: "compiling brief .............. done (11m 42s)" },
  { cls: "", text: " " },
  { cls: "t-key", text: "CANDIDATE BRIEF" },
  { cls: "", text: "Two PE cycles, CFO #2. $40M->$180M, then $90M->$310M." },
  { cls: "t-strong", text: "● Strong - PE rhythm, FP&A build from zero, refi solo 2023" },
  { cls: "t-probe", text: "● Probe - resume claims 4 M&As led; on call described 2 as workstream-only" },
  { cls: "", text: "Comp floor: $400K all-in + 0.6% equity. NYC only. 30-60d notice." },
  { cls: "", text: " " },
  { cls: "t-cmd", text: "-> 5-page client-ready brief exported (PDF)" },
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
        <span className="terminal-title">scout - research agent</span>
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

function SampleGate() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/sample", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "sample-gate" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not send the sample.");
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ScoutFile-Sample-Brief.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setDone(true);
    } catch (e) {
      setError(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="gate gate--done" role="status">
        Brief downloading. If it doesn't open, check your downloads folder.
      </div>
    );
  }

  return (
    <form className="gate" onSubmit={submit}>
      <input
        type="email"
        required
        placeholder="you@yourfirm.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        aria-label="Your work email"
      />
      <button type="submit" className="btn btn--primary" disabled={loading}>
        {loading ? "Sending…" : "Send me the brief"}
      </button>
      {error && (
        <p role="alert" className="gate-err">
          {error}
        </p>
      )}
    </form>
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
            Get the skill - ${site.priceUSD}
          </a>
        </nav>

        {/* ---------------- HERO ---------------- */}
        <header className="hero">
          <div>
            <p className="eyebrow">A Claude skill for boutique recruiters</p>
            <h1>
              Client-ready candidate briefs in <em>12 minutes</em>.
            </h1>
            <p className="lede">
              ScoutFile is a Claude skill that turns a role spec into a 5-page
              candidate brief - trajectory, competency match, comp floor,
              interview probes. It tells you what to <em>probe</em>, not just
              what to pitch. That's the line that keeps a boutique partner from
              walking a half-vetted candidate into a client meeting.
            </p>
            <div className="hero-ctas">
              <BuyButton>Buy &amp; download - ${site.priceUSD}</BuyButton>
              <a className="btn btn--ghost" href="#sample">
                See a real brief
              </a>
            </div>
            <p className="hero-note">
              runs in your own Claude account · candidate data never leaves it ·
              instant download
            </p>
          </div>
          <Terminal />
        </header>

        {/* ---------------- PROOF ---------------- */}
        <div className="proof">
          <div className="proof-item">
            <div className="proof-num">~12 min</div>
            <div className="proof-label">per client-ready candidate brief</div>
          </div>
          <div className="proof-item">
            <div className="proof-num">15h → 5h</div>
            <div className="proof-label">weekly research load, peak search season</div>
          </div>
          <div className="proof-item">
            <div className="proof-num">$299 once</div>
            <div className="proof-label">vs ~$80K research analyst, vs ~$13K LinkedIn seat</div>
          </div>
        </div>

        {/* ---------------- SAMPLE GATE ---------------- */}
        <section id="sample" className="sample-section">
          <div className="sample-card">
            <p className="eyebrow">Sample · 5 pages · real format</p>
            <h2>See what comes out before you pay.</h2>
            <p className="section-sub">
              A real, redacted candidate brief in the exact format the agent
              produces. Trajectory, competency match with honest confidence
              flags, comp anchor, interview probes. Drop your work email and the
              PDF downloads on the spot.
            </p>
            <SampleGate />
            <p className="sample-foot">
              One email, one PDF. No drip sequence. You'll hear from me when v2
              ships and that's it.
            </p>
          </div>
        </section>

        {/* ---------------- WHAT'S INSIDE ---------------- */}
        <section id="inside">
          <div className="section-head">
            <h2>What's in the package</h2>
            <p className="section-sub">
              Everything you need to run deep candidate and company research
              from your own Claude account. No new tool to learn, no seat
              licenses, no candidate data leaving your control.
            </p>
          </div>
          <div className="cards">
            <div className="card">
              <span className="card-tag">core</span>
              <h3>The research agent skill file</h3>
              <p>
                The full skill that drives the workflow: role-spec parsing,
                source strategy, candidate analysis, and the judgment layer that
                flags strengths honestly and surfaces what to probe before the
                client interview.
              </p>
            </div>
            <div className="card">
              <span className="card-tag">templates</span>
              <h3>Three brief templates</h3>
              <p>
                Candidate brief, company intel brief, and comp landing-zone
                brief - the same structures used in live retained searches,
                formatted to hand straight to a client.
              </p>
            </div>
            <div className="card">
              <span className="card-tag">setup</span>
              <h3>15-minute install guide</h3>
              <p>
                Step-by-step setup for Claude, written for recruiters, not
                engineers. Install once, then run it on every search.
              </p>
            </div>
            <div className="card">
              <span className="card-tag">tuning</span>
              <h3>Customization playbook</h3>
              <p>
                How to tune the agent to your sector, your brief voice, and your
                sourcing philosophy - so the output reads like your desk
                produced it, not a templated AI dump.
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
                Secure Stripe checkout. The full package downloads instantly -
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
                Paste a role spec. Get back a structured, sourced, client-ready
                brief, then tune it to your voice.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------- OUTPUT PREVIEW ---------------- */}
        <section id="output">
          <div className="section-head">
            <h2>The output is the pitch.</h2>
            <p className="section-sub">
              A slice of a real candidate brief: VP Finance, PE-backed consumer.
              The agent flags what's load-bearing for the client AND the gap
              between resume and reality. That's what separates a brief you can
              walk into Monday from a brief you have to redo.
            </p>
          </div>
          <div className="matrix" role="table" aria-label="Sample candidate brief excerpt">
            <div className="matrix-row matrix-row--head" role="row">
              <div role="columnheader">What the client cares about</div>
              <div role="columnheader">What the agent found</div>
              <div role="columnheader">Read</div>
            </div>
            <div className="matrix-row" role="row">
              <div className="matrix-req" role="cell">Stage track record</div>
              <div className="matrix-ev" role="cell">
                Two PE cycles as CFO #2. Scaled FP&amp;A at $40M → $180M
                personal-care brand (sold 2023) and $90M → $310M functional
                beverage (sold 2025). Same playbook both times.
              </div>
              <div role="cell"><span className="pill pill--strong">● Strong</span></div>
            </div>
            <div className="matrix-row" role="row">
              <div className="matrix-req" role="cell">Why she's looking now</div>
              <div className="matrix-ev" role="cell">
                New sponsor 4 months in; equity refresh 18 months out. Open about
                wanting the next platform deal, not a steady-state seat. Use this
                in pitch, not against her.
              </div>
              <div role="cell"><span className="pill pill--strong">● Strong</span></div>
            </div>
            <div className="matrix-row" role="row">
              <div className="matrix-req" role="cell">M&amp;A claim vs reality</div>
              <div className="matrix-ev" role="cell">
                Resume says "led 4 acquisitions." On call she described 2 as
                workstream-only. Real lead count: 2. Surface in interview #1
                before the client does.
              </div>
              <div role="cell"><span className="pill pill--probe">● Probe</span></div>
            </div>
            <div className="matrix-row" role="row">
              <div className="matrix-req" role="cell">Board posture under pressure</div>
              <div className="matrix-ev" role="cell">
                Presented to sponsor 12x in 24 months; ran 2023 refi solo. Has
                not yet survived a contested vote or hostile diligence cycle.
              </div>
              <div role="cell"><span className="pill pill--probe">● Probe</span></div>
            </div>
            <div className="matrix-row" role="row">
              <div className="matrix-req" role="cell">Comp floor &amp; geography</div>
              <div className="matrix-ev" role="cell">
                Current $360K base + 0.4%. Target $400-450K all-in + 0.6%
                minimum. NYC only, 30-60d notice. Will walk if equity comes in
                under 0.5%.
              </div>
              <div role="cell"><span className="pill pill--strong">● Strong</span></div>
            </div>
          </div>
        </section>

        {/* ---------------- PRICING ---------------- */}
        <section id="pricing" className="pricing">
          <div className="price-card">
            <div className="scarcity">
              Founder pricing · first 100 licenses at ${site.priceUSD}, then $
              {site.priceCompareUSD}
            </div>
            <p className="eyebrow">One-time purchase · single recruiter license</p>
            <div className="price-amount">${site.priceUSD}</div>
            <p className="price-meta">no subscription · instant download · free v1 updates</p>

            <div className="anchor-stack">
              <div className="anchor-row">
                <span>Hire a research analyst</span>
                <span className="anchor-cost">~$80K / yr</span>
              </div>
              <div className="anchor-row">
                <span>LinkedIn Recruiter seat</span>
                <span className="anchor-cost">~$13K / yr</span>
              </div>
              <div className="anchor-row anchor-row--us">
                <span>ScoutFile</span>
                <span className="anchor-cost">$299 once</span>
              </div>
              <p className="anchor-foot">Pays for itself on search #1.</p>
            </div>

            <ul className="price-list">
              <li>The complete research agent skill file</li>
              <li>Candidate, company &amp; comp brief templates</li>
              <li>15-minute install guide for Claude</li>
              <li>Customization playbook for your desk</li>
              <li>Free updates to the v1 package</li>
            </ul>
            <BuyButton>Buy &amp; download - ${site.priceUSD}</BuyButton>
            <p className="guarantee">
              <strong>14-day no-questions refund.</strong> If your first brief
              isn't usable, email me and I'll send the $299 back same-day.
            </p>
            <p className="price-foot">
              Need it for a whole desk - team install, custom tuning, ongoing
              support?{" "}
              <a href={`mailto:${site.supportEmail}`}>
                Ask about white-glove setup →
              </a>
            </p>
          </div>
        </section>

        {/* ---------------- FOUNDER ---------------- */}
        <section id="founder" className="founder">
          <div className="founder-card">
            <img
              src="/jim.png"
              alt={`${site.founderName}, ${site.founderTitle}`}
              className="founder-photo"
              loading="lazy"
            />
            <div className="founder-body">
              <p className="eyebrow">Who built this</p>
              <h2>Hi - I'm Jim.</h2>
              <p>
                Brooklyn-based operator and founder. I built ScoutFile after
                watching recruiters I work with lose entire afternoons to
                research that Claude can now do in twelve minutes. It's the
                skill I'd hand a junior researcher on my own desk: it tells you
                what to probe, not just what to pitch.
              </p>
              <p>
                If it doesn't fit your workflow on the first brief, email me. I
                read every message myself, and I'll either tune it or refund
                you.
              </p>
              <p className="founder-sign">
                - {site.founderName}, {site.founderTitle} ·{" "}
                <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>
              </p>
            </div>
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
                A zip with the skill file, three brief templates, the install
                guide, and the customization playbook. You load the skill into
                your own Claude account and run it from there.
              </p>
            </details>
            <details>
              <summary>Do I need a Claude subscription?</summary>
              <p>
                Yes - the skill runs inside your own Claude account, so you'll
                need an active plan. That also means your candidate data stays
                in your account, not on a third-party server.
              </p>
            </details>
            <details>
              <summary>Is this a sourcing tool?</summary>
              <p>
                No. ScoutFile is a research and briefing layer. It does deep
                work on candidates and companies you're already considering. It
                doesn't replace your network or your judgment.
              </p>
            </details>
            <details>
              <summary>How is this different from just using Claude?</summary>
              <p>
                Claude on its own gives you a smart generalist. ScoutFile is a
                tuned skill: it knows the structure of a retained-search brief,
                the right sources to cross-check, the boutique-partner reading
                order, and where to flag confidence honestly. You stop
                re-prompting and start shipping.
              </p>
            </details>
            <details>
              <summary>What if it doesn't fit my workflow?</summary>
              <p>
                The customization playbook covers tuning it to your sector and
                brief style. If you're stuck, email me directly - real reply,
                same day. And the 14-day refund stands.
              </p>
            </details>
            <details>
              <summary>Can my whole desk use it?</summary>
              <p>
                The $299 license is per recruiter. For 3+ seats with team
                tuning, shared brief voice, and ongoing support, ask about
                white-glove setup.
              </p>
            </details>
          </div>
        </section>

        <footer>
          <span>
            {site.name} · built by {site.founderName} in Brooklyn
          </span>
          <a href={`mailto:${site.supportEmail}`} style={{ color: "inherit" }}>
            {site.supportEmail}
          </a>
        </footer>
      </div>
    </>
  );
}
