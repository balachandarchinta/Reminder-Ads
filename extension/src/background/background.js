const BACKEND_URL = "http://localhost:8001/api/v1";

// Push latest tab/activity state to backend
async function updateActivityState() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    let activeTab = { url: "https://example.com", title: "Example Domain" };
    if (tabs && tabs.length > 0 && tabs[0].url) {
      activeTab = {
        url: tabs[0].url,
        title: tabs[0].title || ""
      };
    }

    // Get idle state (threshold: 15 seconds)
    const idleState = await new Promise((resolve) => {
      chrome.idle.queryState(15, (state) => resolve(state));
    });

    const isYoutube = activeTab.url.includes("youtube.com") || activeTab.title.toLowerCase().includes("youtube");
    
    const payload = {
      website: activeTab.url,
      active_tab: activeTab.title,
      idle: idleState !== "active",
      video_playing: isYoutube || activeTab.title.toLowerCase().includes("video")
    };

    await fetch(`${BACKEND_URL}/extension/activity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    console.error("Error updating extension activity state:", error);
  }
}

// Fetch pending agent decisions and deliver real browser alerts
async function checkPendingNotifications() {
  try {
    const res = await fetch(`${BACKEND_URL}/extension/notifications`);
    if (!res.ok) return;
    const data = await res.json();
    if (data && data.notifications && data.notifications.length > 0) {
      for (const notif of data.notifications) {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "assets/icon.png",
          title: notif.title || "ReminderAds Alert",
          message: notif.message,
          priority: 2
        });
      }
    }
  } catch (error) {
    console.error("Error checking pending notifications:", error);
  }
}

// Bind event listeners
chrome.tabs.onActivated.addListener(() => updateActivityState());
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    updateActivityState();
  }
});

// Alarm for periodic pushes and polls
chrome.alarms.create("extension_pulse", { periodInMinutes: 0.05 }); // run every ~3 seconds (lowest alarm frequency allowed)
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "extension_pulse") {
    updateActivityState();
    checkPendingNotifications();
  }
});

// Run immediate checks on service worker start
updateActivityState();
checkPendingNotifications();
