import React from "react";

export type Storybeat = {
  time: string;
  label: string;
  instruction: string;
  script: string;
};

type StoryboardProps = {
  beats: Storybeat[];
};

const Storyboard: React.FC<StoryboardProps> = ({ beats }) => {
  return (
    <div className="card">
      <h3>Video storyboard</h3>
      <div className="storyboard">
        {beats.map((beat) => (
          <div key={beat.time} className="storybeat">
            <div className="storybeat-time">{beat.time}</div>
            <div className="storybeat-body">
              <p className="storybeat-label">{beat.label}</p>
              <p className="storybeat-instruction">{beat.instruction}</p>
              <p className="storybeat-script">“{beat.script}”</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Storyboard;
