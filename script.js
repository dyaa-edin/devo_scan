function startScan() {
    document.getElementById('mainScreen').classList.add('hidden');
    document.getElementById('scanResults').classList.remove('hidden');
}

function toggleNote(noteId) {
    let note = document.getElementById(noteId);
    note.style.display = (note.style.display === "none" || note.style.display === "") ? "block" : "none";
}

// معلومات الجهاز
function fetchDeviceInfo() {
    let info = `المتصفح: ${navigator.userAgent}\nنظام التشغيل: ${navigator.platform}`;
    updateStatus("deviceInfo", info, "safe");
}

// فحص عنوان IP وكشف VPN
async function fetchIPInfo() {
    let res = await fetch("https://ipinfo.io/json?token=b80dd7723dbc9b");
    let data = await res.json();
    updateStatus("ipInfo", `عنوان IP: ${data.ip}\nالموقع: ${data.city}, ${data.country}\nمزود الخدمة: ${data.org}`, "warning");
}
// اختبار سرعة الإنترنت
function testInternetSpeed() {
    let start = new Date().getTime();
    fetch("https://speed.hetzner.de/10MB.bin").then(() => {
        let end = new Date().getTime();
        let speed = (10 / ((end - start) / 1000)).toFixed(2);
        updateStatus("speedResult", `السرعة: ${speed} MB/s`, speed > 10 ? "safe" : "warning");
    }).catch(() => {
        updateStatus("speedResult", "❌ فشل في الاختبار", "danger");
    });
}
// إذن الموقع الجغرافي
async function checkLocationPermission() {
    let status = await navigator.permissions.query({ name: "geolocation" });
    let translatedState = status.state === "granted" ? "مسموح" : status.state === "denied" ? "مرفوض" : "غير محدد";
    let riskLevel = status.state === "granted" ? "تحذير" : "آمن";
    
    updateStatus("locationStatus", `الحالة: ${translatedState}`, riskLevel);
}
// إذن الكاميرا والميكروفون
async function checkCameraMicPermissions() {
    try {
        let camera = await navigator.permissions.query({ name: "camera" });
        let mic = await navigator.permissions.query({ name: "microphone" });

        if (camera.state === "granted" || mic.state === "granted") {
            updateStatus("cameraMicStatus", "⚠️ الكاميرا/الميكروفون مفعّلين", "warning");
        } else {
            updateStatus("cameraMicStatus", "لا يمكن الوصول الى الكاميرا و الميكرفون", "safe");
        }
    } catch (error) {
        updateStatus("cameraMicStatus", "❌ فشل في التحقق من الإذن", "error");
    }
}

// تحديث حالة الاختبارات
function updateStatus(id, message, type) {
    let statusElement = document.getElementById(id);
    statusElement.innerText = message;
    statusElement.className = `status ${type}`;
}

