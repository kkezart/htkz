from __future__ import annotations

import uuid
from typing import List

from app.data.mock_data import HOOKS, mock_clusters, mock_videos
from app.schemas import (
    PatternCluster,
    Platform,
    ScriptOutput,
    ScriptSegment,
    TrendResponse,
)


def build_script(topic: str, platform: Platform, language: str, clusters: List[PatternCluster]) -> ScriptOutput:
    storyboard = [
        ScriptSegment(
            start_second=0,
            end_second=2,
            camera_instruction="Hold phone close, direct eye contact, one bold hand gesture.",
            spoken_text=f"{HOOKS[0]} about {topic}.",
        ),
        ScriptSegment(
            start_second=2,
            end_second=6,
            camera_instruction="Cut to a quick example on screen.",
            spoken_text=f"Most creators lose viewers because they explain {topic} too slowly.",
        ),
        ScriptSegment(
            start_second=6,
            end_second=15,
            camera_instruction="Return to camera, show a 3-step list with captions.",
            spoken_text=(
                f"Here's the 3-step fix: one, show the end result first; two, name the key mistake; "
                f"three, give the fastest win you can deliver today."
            ),
        ),
        ScriptSegment(
            start_second=15,
            end_second=20,
            camera_instruction="Lean in and point to the follow button.",
            spoken_text=f"Save this and try it on your next {platform.value} post.",
        ),
    ]

    spoken_script = " ".join(segment.spoken_text for segment in storyboard)

    return ScriptOutput(
        title=f"{topic.title()} micro-win script",
        topic=topic,
        platform=platform,
        language=language,
        storyboard=storyboard,
        spoken_script=spoken_script,
        hook_options=[
            f"Stop scrolling if you're struggling with {topic}.",
            f"Here's the fastest way to fix {topic} today.",
            f"If I had to restart {topic}, I'd do this first.",
        ],
        patterns_used=[cluster.summary for cluster in clusters],
    )


def analyze_trends(topic: str, platform: Platform, language: str) -> TrendResponse:
    videos = mock_videos()
    clusters = mock_clusters()
    script = build_script(topic, platform, language, clusters)
    return TrendResponse(
        request_id=str(uuid.uuid4()),
        videos=videos,
        clusters=clusters,
        script=script,
    )


def analyze_account(account: str, platform: Platform, language: str) -> TrendResponse:
    videos = mock_videos()
    clusters = mock_clusters()
    script = build_script(account, platform, language, clusters)
    return TrendResponse(
        request_id=str(uuid.uuid4()),
        videos=videos,
        clusters=clusters,
        script=script,
    )
