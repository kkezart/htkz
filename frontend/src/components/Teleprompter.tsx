import React, { useEffect, useMemo, useState } from "react";

export type TeleprompterSegment = {
  start: number;
  end: number;
  label: string;
  line: string;
};

type TeleprompterProps = {
  segments: TeleprompterSegment[];
};

const Teleprompter: React.FC<TeleprompterProps> = ({ segments }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const totalTime = useMemo(
    () => Math.max(...segments.map((segment) => segment.end), 0),
    [segments]
  );

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev >= totalTime) {
          clearInterval(interval);
          return totalTime;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, totalTime]);

  const activeSegment = segments.find(
    (segment) => elapsed >= segment.start && elapsed <= segment.end
  );

  return (
    <div className="card teleprompter">
      <div className="teleprompter-header">
        <h3>Camera mode</h3>
        <div className="teleprompter-controls">
          <button
            className="button"
            onClick={() => setIsPlaying((prev) => !prev)}
          >
            {isPlaying ? "Pause" : "Start"}
          </button>
          <button className="button ghost" onClick={() => setElapsed(0)}>
            Reset
          </button>
        </div>
      </div>
      <p className="teleprompter-timer">
        {elapsed}s / {totalTime}s
      </p>
      <div className="teleprompter-segment">
        <p className="teleprompter-label">{activeSegment?.label}</p>
        <p className="teleprompter-line">{activeSegment?.line}</p>
      </div>
      <div className="teleprompter-list">
        {segments.map((segment) => (
          <div
            key={segment.label}
            className={`teleprompter-row ${
              elapsed >= segment.start && elapsed <= segment.end
                ? "active"
                : ""
            }`}
          >
            <span>{segment.start}-{segment.end}s</span>
            <span>{segment.line}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teleprompter;
