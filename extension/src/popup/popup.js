const BACKEND_URL = "http://127.0.0.1:8001/api/v1";

async function checkStatus() {
  try {
    // 1. Get active tab
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs && tabs.length > 0) {
      document.getElementById("active-tab").textContent = tabs[0].title || "Unknown";
    }

    // 2. Query backend to verify status
    const res = await fetch(`${BACKEND_URL}/extension/notifications`);
    if (res.ok) {
      document.getElementById("backend-status").textContent = "Connected (8001)";
      document.getElementById("backend-status").className = "value status-ok";
    } else {
      document.getElementById("backend-status").textContent = "Error";
      document.getElementById("backend-status").className = "value status-err";
    }
  } catch (e) {
    document.getElementById("backend-status").textContent = "Offline";
    document.getElementById("backend-status").className = "value status-err";
  }
}

// Initial status check
checkStatus();
