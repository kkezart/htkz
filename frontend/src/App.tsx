import React, { useMemo, useState } from "react";
import Storyboard, { Storybeat } from "./components/Storyboard";
import Teleprompter, { TeleprompterSegment } from "./components/Teleprompter";

type ScriptSegment = {
  start_second: number;
  end_second: number;
  camera_instruction: string;
  spoken_text: string;
};

type ScriptOutput = {
  title: string;
  topic: string;
  platform: string;
  language: string;
  storyboard: ScriptSegment[];
  spoken_script: string;
  hook_options: string[];
  patterns_used: string[];
};

type TrendResponse = {
  request_id: string;
  script?: ScriptOutput | null;
};

const DEFAULT_STORYBOARD: Storybeat[] = [
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

const DEFAULT_TELEPROMPTER: TeleprompterSegment[] = [
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

const platformOptions = [
  { label: "TikTok", value: "tiktok" },
  { label: "Instagram Reels", value: "instagram" },
  { label: "YouTube Shorts", value: "youtube" },
];

const App: React.FC = () => {
  const [topic, setTopic] = useState("Fitness coaches");
  const [topicPlatform, setTopicPlatform] = useState("tiktok");
  const [topicRegion, setTopicRegion] = useState("en-US");
  const [account, setAccount] = useState("@creator");
  const [accountPlatform, setAccountPlatform] = useState("tiktok");
  const [accountRegion, setAccountRegion] = useState("en-US");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"success" | "error" | "info">("info");
  const [storyboard, setStoryboard] = useState<Storybeat[]>(DEFAULT_STORYBOARD);
  const [teleprompterSegments, setTeleprompterSegments] =
    useState<TeleprompterSegment[]>(DEFAULT_TELEPROMPTER);
  const [hooks, setHooks] = useState<string[]>([
    "Stop scrolling if your hooks aren't working.",
    "Here's the fastest fix for weak openers.",
    "If I had to restart, this is how I'd hook viewers.",
  ]);
  const [patterns, setPatterns] = useState<string[]>([
    "Pattern interrupt hooks",
    "Hook → problem → solution",
    "Caption emphasis on keywords",
    "15-20s duration",
  ]);

  const apiBase = useMemo(() => {
    const envBase = import.meta.env.VITE_API_BASE as string | undefined;
    if (envBase) {
      return envBase.replace(/\/$/, "");
    }
    if (typeof window !== "undefined") {
      return `${window.location.protocol}//${window.location.hostname}:8000`;
    }
    return "http://localhost:8000";
  }, []);

  const applyScript = (script?: ScriptOutput | null) => {
    if (!script) {
      return;
    }
    const beats: Storybeat[] = script.storyboard.map((segment, index) => ({
      time: `${segment.start_second}-${segment.end_second}s`,
      label: `Segment ${index + 1}`,
      instruction: segment.camera_instruction,
      script: segment.spoken_text,
    }));

    const prompter: TeleprompterSegment[] = script.storyboard.map((segment, index) => ({
      start: segment.start_second,
      end: segment.end_second,
      label: `Segment ${index + 1}`,
      line: segment.spoken_text,
    }));

    setStoryboard(beats);
    setTeleprompterSegments(prompter);
    setHooks(script.hook_options);
    setPatterns(script.patterns_used);
  };

  const requestTrends = async (endpoint: string, payload: Record<string, unknown>) => {
    setLoading(true);
    setStatus("Generating script from trends…");
    setStatusTone("info");

    try {
      const response = await fetch(`${apiBase}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const data = (await response.json()) as TrendResponse;
      applyScript(data.script);
      setStatus("Script generated from live API response.");
      setStatusTone("success");
    } catch (error) {
      setStatus("Could not reach the API. Check backend connection and try again.");
      setStatusTone("error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicSubmit = () => {
    if (!topic.trim()) {
      setStatus("Please enter a topic before generating.");
      setStatusTone("error");
      return;
    }
    requestTrends("/api/v1/trends/by-topic", {
      topic,
      platform: topicPlatform,
      region: topicRegion,
      days: 14,
    });
  };

  const handleAccountSubmit = () => {
    if (!account.trim()) {
      setStatus("Please enter an account handle or URL.");
      setStatusTone("error");
      return;
    }
    requestTrends("/api/v1/trends/by-account", {
      account,
      platform: accountPlatform,
      region: accountRegion,
      days: 14,
    });
  };

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
              <input
                type="text"
                placeholder="e.g. Fitness coaches"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
              />
            </label>
            <label>
              Platform
              <select
                value={topicPlatform}
                onChange={(event) => setTopicPlatform(event.target.value)}
              >
                {platformOptions.map((platform) => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Language / region
              <input
                type="text"
                placeholder="e.g. English (US)"
                value={topicRegion}
                onChange={(event) => setTopicRegion(event.target.value)}
              />
            </label>
            <button className="button" type="button" onClick={handleTopicSubmit} disabled={loading}>
              {loading ? "Generating..." : "Generate script"}
            </button>
          </form>
        </div>
        <div className="card">
          <h3>Flow B — By account</h3>
          <p>Analyze a creator, then pull similar accounts and their top performers.</p>
          <form className="form">
            <label>
              Account handle or URL
              <input
                type="text"
                placeholder="@creator or https://"
                value={account}
                onChange={(event) => setAccount(event.target.value)}
              />
            </label>
            <label>
              Platform
              <select
                value={accountPlatform}
                onChange={(event) => setAccountPlatform(event.target.value)}
              >
                {platformOptions.map((platform) => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Language / region
              <input
                type="text"
                placeholder="e.g. Spanish (MX)"
                value={accountRegion}
                onChange={(event) => setAccountRegion(event.target.value)}
              />
            </label>
            <button
              className="button"
              type="button"
              onClick={handleAccountSubmit}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate script"}
            </button>
          </form>
        </div>
      </section>

      {status && <div className={`status ${statusTone}`}>{status}</div>}

      <section className="output">
        <div className="card">
          <h3>Winning patterns detected</h3>
          <div className="pill-row">
            {patterns.map((pattern) => (
              <span className="pill" key={pattern}>
                {pattern}
              </span>
            ))}
          </div>
          <h4>Hook options</h4>
          <ul className="hooks">
            {hooks.map((hook) => (
              <li key={hook}>{hook}</li>
            ))}
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
