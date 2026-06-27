"""
FastAPI route for Chrome Extension integration.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Optional
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

class ExtensionActivity(BaseModel):
    website: str
    active_tab: str
    idle: bool
    video_playing: bool

# Shared in-memory data store for extension state
latest_activity = {
    "website": "https://example.com",
    "active_tab": "Example Domain",
    "idle": False,
    "video_playing": False
}

pending_notifications = []

@router.post("/activity")
async def update_activity(activity: ExtensionActivity):
    global latest_activity
    latest_activity = activity.model_dump()
    logger.info(f"Extension state updated: {latest_activity}")
    return {"status": "success"}

@router.get("/notifications")
async def get_notifications():
    global pending_notifications
    notifs = list(pending_notifications)
    pending_notifications.clear()
    return {"notifications": notifs}

def queue_notification(title: str, message: str):
    global pending_notifications
    pending_notifications.append({"title": title, "message": message})
    logger.info(f"Notification queued for extension: {title} - {message}")
