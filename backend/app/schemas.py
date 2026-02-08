from enum import Enum
from typing import List, Optional

from pydantic import BaseModel, Field


class Platform(str, Enum):
    tiktok = "tiktok"
    instagram = "instagram"
    youtube = "youtube"


class TopicRequest(BaseModel):
    topic: str = Field(..., min_length=2)
    platform: Platform
    region: str = Field(..., description="Language or region")
    days: int = Field(14, ge=7, le=14)


class AccountRequest(BaseModel):
    account: str = Field(..., description="Username or URL")
    platform: Platform
    region: str
    days: int = Field(14, ge=7, le=14)


class VideoMetric(BaseModel):
    views_24h: int
    engagements_24h: int
    duration_seconds: int
    hook_type: str
    structure: List[str]
    visual_patterns: List[str]


class TrendVideo(BaseModel):
    id: str
    url: str
    caption: str
    metrics: VideoMetric


class PatternCluster(BaseModel):
    id: str
    summary: str
    top_hooks: List[str]
    top_structures: List[str]
    visual_patterns: List[str]


class ScriptSegment(BaseModel):
    start_second: int
    end_second: int
    camera_instruction: str
    spoken_text: str


class ScriptOutput(BaseModel):
    title: str
    topic: str
    platform: Platform
    language: str
    storyboard: List[ScriptSegment]
    spoken_script: str
    hook_options: List[str]
    patterns_used: List[str]


class TrendResponse(BaseModel):
    request_id: str
    videos: List[TrendVideo]
    clusters: List[PatternCluster]
    script: Optional[ScriptOutput]
