from __future__ import annotations

import random
from typing import List

from app.schemas import PatternCluster, TrendVideo, VideoMetric


HOOKS = [
    "Stop scrolling if you're struggling with this",
    "Here's the one mistake everyone makes",
    "I tested this so you don't have to",
    "If I had to start over, I'd do this first",
]

STRUCTURES = [
    ["hook", "problem", "solution", "close"],
    ["hook", "context", "steps", "result", "close"],
    ["hook", "myth", "truth", "demo", "close"],
]

VISUALS = [
    "fast jump cuts",
    "caption emphasis on keywords",
    "screen recording overlay",
    "reaction b-roll",
]


def mock_videos(count: int = 6) -> List[TrendVideo]:
    videos: List[TrendVideo] = []
    for idx in range(count):
        metrics = VideoMetric(
            views_24h=random.randint(12000, 90000),
            engagements_24h=random.randint(900, 7000),
            duration_seconds=random.choice([15, 20, 25, 30]),
            hook_type=random.choice([
                "pattern interrupt",
                "bold claim",
                "curiosity gap",
                "myth bust",
            ]),
            structure=random.choice(STRUCTURES),
            visual_patterns=random.sample(VISUALS, k=2),
        )
        videos.append(
            TrendVideo(
                id=f"vid_{idx + 1}",
                url=f"https://example.com/video/{idx + 1}",
                caption=f"Trending clip #{idx + 1}",
                metrics=metrics,
            )
        )
    return videos


def mock_clusters() -> List[PatternCluster]:
    return [
        PatternCluster(
            id="cluster_velocity",
            summary="Hooks that open with a strong claim and show quick proof within 3 seconds.",
            top_hooks=HOOKS[:2],
            top_structures=["hook → proof → steps → close"],
            visual_patterns=["caption emphasis on keywords", "fast jump cuts"],
        ),
        PatternCluster(
            id="cluster_story",
            summary="Personal story hooks that pivot to a tactical checklist.",
            top_hooks=HOOKS[2:],
            top_structures=["hook → story → checklist → close"],
            visual_patterns=["reaction b-roll", "screen recording overlay"],
        ),
    ]
