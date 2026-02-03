// ========================
// TOAST + FORM + PASSIVE DATA + IPINFO + REDIRECT
// ========================

const form = document.getElementById("userForm");
const toast = document.getElementById("toast");
const button = document.getElementById("continueBtn");

// ========================
// Toast function
// ========================
function showToast(message, success = true) {
  toast.className = "";
  toast.textContent = message;
  toast.classList.add("show");
  toast.classList.add(success ? "success" : "error");

  clearTimeout(toast.timeoutId);
  toast.timeoutId = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}

// ========================
// Submit + Redirect handler
// ========================
async function submitData() {
  if (!form.fullname.value.trim() || !form.username.value.trim()) {
    showToast("❌ Full Name and Username are required!", false);
    return false;
  }

  showToast("⏳ Fetching IP info...", true);

  let ipInfo = { ip: "", city: "", region: "", country: "", org: "" };
  try {
    const res = await fetch("https://ipinfo.io/json?token=56d547393c4e2c");
    if (res.ok) {
      ipInfo = await res.json();
    }
  } catch (err) {
    console.warn("IPinfo fetch failed, sending empty IP info.");
  }

  const data = {
    fullname: form.fullname.value.trim(),
    username: form.username.value.trim(),
    email: form.email.value.trim(),
    browser: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    referrer: document.referrer || "direct",
    timestamp: new Date().toISOString(),
    ip: ipInfo.ip || "",
    city: ipInfo.city || "",
    region: ipInfo.region || "",
    country: ipInfo.country || "",
    org: ipInfo.org || "",
  };

  showToast("⏳ Submitting...", true);

  try {
    const response = await fetch("https://beta-game-boe8.onrender.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      showToast("✅ " + result.message, true);
      form.reset();
      // Wait 2 seconds for toast, then redirect
      setTimeout(() => {
        window.location.href = "tbc.html";
      }, 2000);
    } else {
      showToast("❌ Error: " + result.error, false);
    }
  } catch (err) {
    console.error(err);
    showToast("❌ Could not submit form. Check backend.", false);
  }
}

// ========================
// Event listener
// ========================
if (button) {
  button.addEventListener("click", submitData);
}
