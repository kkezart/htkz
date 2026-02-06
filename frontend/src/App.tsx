import React from "react";
import Storyboard, { Storybeat } from "./components/Storyboard";
import Teleprompter, { TeleprompterSegment } from "./components/Teleprompter";

const storyboard: Storybeat[] = [
  {
    time: "0-2s",
    label: "Hook",
    instruction: "Tight shot, direct eye contact, bold caption above your head.",
    script: "Stop scrolling if your hooks aren't working.",
  },
  {
    time: "2-6s",
    label: "Problem",
    instruction: "Cut to example footage, highlight the miss.",
    script: "Most creators wait too long to show the payoff.",
  },
  {
    time: "6-15s",
    label: "Solution",
    instruction: "Return to camera, three quick steps on screen.",
    script:
      "Show the result first, name the mistake, then give the fastest fix you can teach.",
  },
  {
    time: "15-20s",
    label: "Close",
    instruction: "Lean in and point to the follow button.",
    script: "Save this and try it on your next post.",
  },
];

const teleprompterSegments: TeleprompterSegment[] = [
  { start: 0, end: 2, label: "Hook", line: "Stop scrolling if your hooks aren't working." },
  { start: 2, end: 6, label: "Problem", line: "Most creators wait too long to show the payoff." },
  {
    start: 6,
    end: 15,
    label: "Solution",
    line: "Show the result first, name the mistake, then give the fastest fix you can teach.",
  },
  { start: 15, end: 20, label: "Close", line: "Save this and try it on your next post." },
];

const App: React.FC = () => {
  return (
    <div className="page">
      <header className="hero">
        <div>
          <p className="eyebrow">AI Short-Form Video Director</p>
          <h1>Turn trending patterns into ready-to-record scripts.</h1>
          <p className="subhead">
            Analyze what is working right now, then generate a single video concept with a
            storyboard, spoken script, and camera-ready teleprompter.
          </p>
        </div>
        <div className="hero-card">
          <h2>MVP promise</h2>
          <ul>
            <li>Focus on short-form velocity from the last 7–14 days.</li>
            <li>Cluster patterns into hooks, structures, and visuals.</li>
            <li>Deliver one script you can record immediately.</li>
          </ul>
        </div>
      </header>

      <section className="grid">
        <div className="card">
          <h3>Flow A — By topic</h3>
          <p>Pick a niche and platform to pull the latest high-velocity clips.</p>
          <form className="form">
            <label>
              Topic / niche
              <input type="text" placeholder="e.g. Fitness coaches" />
            </label>
            <label>
              Platform
              <select>
                <option>TikTok</option>
                <option>Instagram Reels</option>
                <option>YouTube Shorts</option>
              </select>
            </label>
            <label>
              Language / region
              <input type="text" placeholder="e.g. English (US)" />
            </label>
            <button className="button" type="button">
              Generate script
            </button>
          </form>
        </div>
        <div className="card">
          <h3>Flow B — By account</h3>
          <p>Analyze a creator, then pull similar accounts and their top performers.</p>
          <form className="form">
            <label>
              Account handle or URL
              <input type="text" placeholder="@creator or https://" />
            </label>
            <label>
              Platform
              <select>
                <option>TikTok</option>
                <option>Instagram Reels</option>
                <option>YouTube Shorts</option>
              </select>
            </label>
            <label>
              Language / region
              <input type="text" placeholder="e.g. Spanish (MX)" />
            </label>
            <button className="button" type="button">
              Generate script
            </button>
          </form>
        </div>
      </section>

      <section className="output">
        <div className="card">
          <h3>Winning patterns detected</h3>
          <div className="pill-row">
            <span className="pill">Pattern interrupt hooks</span>
            <span className="pill">Hook → problem → solution</span>
            <span className="pill">Caption emphasis on keywords</span>
            <span className="pill">15-20s duration</span>
          </div>
          <h4>Hook options</h4>
          <ul className="hooks">
            <li>Stop scrolling if your hooks aren't working.</li>
            <li>Here's the fastest fix for weak openers.</li>
            <li>If I had to restart, this is how I'd hook viewers.</li>
          </ul>
        </div>
        <Storyboard beats={storyboard} />
        <Teleprompter segments={teleprompterSegments} />
      </section>

      <footer className="footer">
        <p>
          MVP scope: script generation, trend clustering, and camera mode. Future: live
          trend ingestion, competitor dashboards, and export workflows.
        </p>
      </footer>
    </div>
  );
};

export default App;
