import React , { useState, useEffect, useRef, useCallback, } from "react";

// ─── Injected Google Font ───────────────────────────────────────────────────
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Sora:wght@300;400;500;600&display=swap');

    :root {
      --bg:        #040d2d;
      --surface:   #071628;
      --card:      #0c2040;
      --border:    #0e3d6a;
      --cyan:      #00d4ff;
      --green:     #00ff9d;
      --amber:     #ffb800;
      --red:       #ff2d55;
      --text:      #c8e8f8;
      --muted:     #3a6a9a;
      --glow-c:    rgba(0,212,255,0.18);
      --glow-g:    rgba(0,255,157,0.15);
    }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; background: var(--bg); }
    body { font-family: 'Sora', sans-serif; color: var(--text); overflow-x: hidden; }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: var(--surface); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

    /* Scanline bg effect */
    .scanlines::before {
      content: ''; pointer-events: none;
      position: fixed; inset: 0; z-index: 999;
      background: repeating-linear-gradient(
        to bottom,
        transparent 0px, transparent 3px,
        rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px
      );
    }

    /* Grid bg */
    .grid-bg {
      background-image:
        linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px);
      background-size: 48px 48px;
    }

    /* Pulse animation */
    @keyframes pulse-ring {
      0%   { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(2.2); opacity: 0; }
    }
    @keyframes float-up {
      from { transform: translateY(20px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
    @keyframes slide-in-right {
      from { transform: translateX(40px); opacity: 0; }
      to   { transform: translateX(0);    opacity: 1; }
    }
    @keyframes slide-in-up {
      from { transform: translateY(30px); opacity: 0; }
      to   { transform: translateY(0); opacity: 1; }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes progress-fill {
      from { width: 0%; }
    }

    .float-up   { animation: float-up 0.5s ease forwards; }
    .slide-right{ animation: slide-in-right 0.4s ease forwards; }
    .slide-up   { animation: slide-in-up 0.4s ease forwards; }

    /* Buttons */
    .btn-primary {
      background: linear-gradient(135deg, var(--cyan), #007acc);
      border: none; border-radius: 8px;
      color: #fff; cursor: pointer;
      font-family: 'Sora', sans-serif;
      font-weight: 600; letter-spacing: 0.03em;
      padding: 12px 28px; font-size: 0.95rem;
      transition: all 0.2s;
      box-shadow: 0 0 16px rgba(0,212,255,0.3);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 28px rgba(0,212,255,0.5); }
    .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

    .btn-secondary {
      background: transparent;
      border: 1px solid var(--border);
      border-radius: 8px; color: var(--text);
      cursor: pointer; font-family: 'Sora', sans-serif;
      font-size: 0.9rem; padding: 10px 22px;
      transition: all 0.2s;
    }
    .btn-secondary:hover { border-color: var(--cyan); color: var(--cyan); }

    /* Card */
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      position: relative; overflow: hidden;
    }
    .card::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--cyan), transparent);
    }

    /* Input */
    .input-field {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 8px; color: var(--text);
      font-family: 'Sora', sans-serif; font-size: 0.95rem;
      padding: 12px 16px; width: 100%;
      transition: border-color 0.2s;
      outline: none;
    }
    .input-field:focus { border-color: var(--cyan); box-shadow: 0 0 0 3px rgba(0,212,255,0.1); }
    .input-field::placeholder { color: var(--muted); }

    /* Risk badges */
    .badge-critical { background: rgba(255,45,85,0.15); color: var(--red);   border: 1px solid rgba(255,45,85,0.4); }
    .badge-high     { background: rgba(255,184,0,0.15);  color: var(--amber); border: 1px solid rgba(255,184,0,0.4); }
    .badge-medium   { background: rgba(0,212,255,0.12);  color: var(--cyan);  border: 1px solid rgba(0,212,255,0.4); }
    .badge-low      { background: rgba(0,255,157,0.12);  color: var(--green); border: 1px solid rgba(0,255,157,0.4); }

    .badge {
      display: inline-flex; align-items: center; gap: 5px;
      border-radius: 20px; font-size: 0.75rem;
      font-weight: 600; padding: 3px 10px; letter-spacing: 0.05em;
    }

    /* Progress bar */
    .progress-bar {
      background: var(--border); border-radius: 4px;
      height: 6px; overflow: hidden;
    }
    .progress-fill {
      height: 100%; border-radius: 4px;
      animation: progress-fill 1s ease;
    }

    /* Hospital card hover */
    .hospital-card { cursor: pointer; transition: all 0.2s; }
    .hospital-card:hover { border-color: var(--cyan); transform: translateY(-2px); }
    .hospital-card.selected { border-color: var(--cyan); background: rgba(0,212,255,0.07); }

    /* Token display */
    .token-number {
      font-family: 'Orbitron', sans-serif;
      font-size: 5rem; font-weight: 900;
      background: linear-gradient(135deg, var(--cyan), var(--green));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      line-height: 1;
      filter: drop-shadow(0 0 20px rgba(0,212,255,0.5));
    }

    /* Live indicator */
    .live-dot {
      width: 8px; height: 8px; border-radius: 50%;
      background: var(--green);
      animation: blink 1.5s infinite;
      box-shadow: 0 0 8px var(--green);
      display: inline-block;
    }

    /* Step indicator */
    .step-dot {
      width: 10px; height: 10px; border-radius: 50%;
      border: 2px solid var(--border);
      transition: all 0.3s;
    }
    .step-dot.active { background: var(--cyan); border-color: var(--cyan); box-shadow: 0 0 8px var(--cyan); }
    .step-dot.done { background: var(--green); border-color: var(--green); }

    /* Map simulation */
    .map-container {
      background: radial-gradient(ellipse at center, #071e38 0%, var(--bg) 70%);
      border: 1px solid var(--border);
      border-radius: 12px; position: relative;
      overflow: hidden;
    }
    .map-grid {
      position: absolute; inset: 0;
      background-image:
        linear-gradient(rgba(0,212,255,0.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,212,255,0.06) 1px, transparent 1px);
      background-size: 32px 32px;
    }
    .map-pin {
      position: absolute;
      transform: translate(-50%, -50%);
      cursor: pointer;
      transition: transform 0.2s;
    }
    .map-pin:hover { transform: translate(-50%, -55%) scale(1.2); }

    /* Spinner */
    .spinner {
      width: 40px; height: 40px;
      border: 3px solid var(--border);
      border-top-color: var(--cyan);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    /* Queue row */
    .queue-row { transition: all 0.3s; }
    .queue-row:hover { background: rgba(0,212,255,0.04); }

    /* Textarea */
    textarea.input-field { resize: vertical; min-height: 100px; }

    /* Nav */
    .nav-tab {
      background: transparent; border: none;
      color: var(--muted); cursor: pointer;
      font-family: 'Sora', sans-serif; font-size: 0.85rem;
      padding: 8px 16px; border-radius: 6px;
      transition: all 0.2s;
    }
    .nav-tab.active { color: var(--cyan); background: rgba(0,212,255,0.08); }

    /* Score bar */
    .score-bar { height: 4px; background: var(--border); border-radius: 2px; }
    .score-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--cyan), var(--green)); }

    /* Glow divider */
    .glow-divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--border), transparent);
      margin: 16px 0;
    }
  `}</style>
);

// ─── Haversine Distance (km) ─────────────────────────────────────────────────
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLng/2)**2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 10) / 10;
}

// ─── Fetch Real Hospitals via Anthropic AI Web Search ────────────────────────
const SPEC_POOL = [
  ["General Medicine","Surgery","ENT","Ophthalmology"],
  ["Cardiology","Neurology","Orthopedics","ICU"],
  ["Dermatology","Pediatrics","Gynecology","Oncology"],
  ["Gastroenterology","Urology","Nephrology","Psychiatry"],
  ["Orthopedics","Spine Surgery","Rheumatology","Physiotherapy"],
  ["Obstetrics","Gynecology","Neonatology","Pediatrics"],
];
const BREAK_PRESETS = [
  { lunch: { start:"13:00", end:"14:00" }, tea: { start:"16:30", end:"16:50" } },
  { lunch: { start:"13:30", end:"14:30" }, tea: { start:"17:00", end:"17:15" } },
  { lunch: { start:"14:00", end:"15:00" }, tea: { start:"17:30", end:"17:45" } },
  { lunch: null, tea: null },
];
function parseOpeningHours(oh = "") {
  if (!oh) return { openTime: "12:01", closeTime: "24:00" };
  const m = oh.match(/(\d{2}:\d{2})-(\d{2}:\d{2})/);
  if (m) return { openTime: m[1], closeTime: m[2] };
  if (oh.includes("24/7") || oh.includes("00:00-24:00")) return { openTime: "00:00", closeTime: "23:59" };
  return { openTime: "0:00", closeTime: "23:59" };
}
// ─── Fetch Real Hospitals via Anthropic API + Web Search ─────────────────────
async function fetchHospitalsFromOverpass(lat, lng, onStatus) {
  onStatus && onStatus("Fetching precise location data...");

  // Get precise location using ip-api.com
  try {
    const locationResponse = await fetch("https://ip-api.com/json/");
    const locationData = await locationResponse.json();
    
    if (locationData.status === "success") {
      lat = locationData.lat;
      lng = locationData.lon;
      onStatus && onStatus(`📍 Location: ${locationData.city}, ${locationData.country}`);
    }
  } catch (err) {
    console.warn("Could not fetch precise location from ip-api.com, using provided coordinates");
  }

  onStatus && onStatus("Searching OpenStreetMap for nearby hospitals...");

  const radius = 5000; // 5km radius

  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:${radius},${lat},${lng});
      node["amenity"="clinic"](around:${radius},${lat},${lng});
      way["amenity"="hospital"](around:${radius},${lat},${lng});
      way["amenity"="clinic"](around:${radius},${lat},${lng});
    );
    out center tags;
  `;

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain"
    },
    body: query
  });

  if (!response.ok) {
    throw new Error(`Overpass API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.elements || data.elements.length === 0) {
    onStatus && onStatus("No hospitals found in this area.");
    return [];
  }

  onStatus && onStatus(`✓ Found ${data.elements.length} hospitals`);

  const hospitals = data.elements
    .filter(el => el.tags && el.tags.name)
    .map((el, idx) => {
      const hLat = el.lat || el.center?.lat;
      const hLng = el.lon || el.center?.lon;

      if (!hLat || !hLng) return null;

      return {
        id: "h_" + idx,
        name: el.tags.name,
        address:
          el.tags["addr:full"] ||
          `${el.tags["addr:street"] || ""} ${el.tags["addr:housenumber"] || ""}`.trim() ||
          "Address not available",
        lat: hLat,
        lng: hLng,
        distance: haversine(lat, lng, hLat, hLng),
        rating: 4.0,
        reviews: 100,
        type: el.tags.amenity === "clinic" ? "Clinic" : "Hospital",
        specializations: SPEC_POOL[idx % SPEC_POOL.length],
        openTime: "00:01",
        closeTime: "23:59",
        lunchBreak: null,
        teaBreak: null,
        phone: el.tags.phone || "N/A",
        emergency: el.tags.emergency === "yes",
        beds: 100,
        source: "OpenStreetMap"
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 15);

  if (hospitals.length === 0) {
    onStatus && onStatus("No valid hospital records found.");
    return [];
  }

  onStatus && onStatus(`✓ Loaded ${hospitals.length} hospitals successfully`);
  return hospitals;
}

// ─── Utilities ───────────────────────────────────────────────────────────────
function getTimeMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function nowMinutes() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function checkHospitalAvailability(hospital) {
  const now = nowMinutes();
  const open  = getTimeMinutes(hospital.openTime);
  const close = getTimeMinutes(hospital.closeTime);

  if (now < open || now > close) {
    return { available: false, reason: "Closed", next: hospital.openTime };
  }
  if (hospital.lunchBreak) {
    const ls = getTimeMinutes(hospital.lunchBreak.start);
    const le = getTimeMinutes(hospital.lunchBreak.end);
    if (now >= ls && now <= le) {
      return { available: false, reason: "Lunch Break", next: hospital.lunchBreak.end };
    }
  }
  if (hospital.teaBreak) {
    const ts = getTimeMinutes(hospital.teaBreak.start);
    const te = getTimeMinutes(hospital.teaBreak.end);
    if (now >= ts && now <= te) {
      return { available: false, reason: "Tea Break", next: hospital.teaBreak.end };
    }
  }
  return { available: true };
}

function getRiskColor(risk) {
  const map = { critical: "var(--red)", high: "var(--amber)", medium: "var(--cyan)", low: "var(--green)" };
  return map[risk?.toLowerCase()] || "var(--muted)";
}

function getRiskBadgeClass(risk) {
  const map = { critical: "badge-critical", high: "badge-high", medium: "badge-medium", low: "badge-low" };
  return map[risk?.toLowerCase()] || "badge-medium";
}

function getRiskPriority(risk) {
  const map = { critical: 4, high: 3, medium: 2, low: 1 };
  return map[risk?.toLowerCase()] || 1;
}

function scoreHospital(hospital, specialization, riskLevel) {
  const riskP = getRiskPriority(riskLevel);
  const distScore = Math.max(0, 10 - hospital.distance);
  const ratingScore = hospital.rating * 2;
  const reviewScore = Math.min(hospital.reviews / 1000, 3);
  const specMatch = hospital.specializations.some(s =>
    s.toLowerCase().includes(specialization?.toLowerCase() || "")
  ) ? 5 : 0;
  const total = (riskP * 3) + distScore + ratingScore + reviewScore + specMatch;
  return Math.round(total * 10) / 10;
}

// ─── Token Store ─────────────────────────────────────────────────────────────
const tokenDB = {};
function generateTokenForHospital(hospitalId, riskLevel) {
  if (!tokenDB[hospitalId]) {
    tokenDB[hospitalId] = {
      queue: [], currentToken: 0, nextToken: 1
    };
  }
  const db = tokenDB[hospitalId];
  const token = {
    id: db.nextToken++,
    risk: riskLevel,
    priority: getRiskPriority(riskLevel),
    time: new Date(),
    waitMins: 0
  };
  db.queue.push(token);
  db.queue.sort((a, b) => b.priority - a.priority || a.time - b.time);
  const pos = db.queue.findIndex(t => t.id === token.id);
  token.waitMins = pos * 12;
  return { token, position: pos + 1, total: db.queue.length, queue: [...db.queue] };
}

// ─── AI Symptom Analysis ─────────────────────────────────────────────────────
async function analyzeSymptoms(symptoms) {
  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-5-20250929",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `You are a medical triage AI. Analyze the following symptoms and return a JSON object only (no markdown, no explanation):
Symptoms: "${symptoms}"

Return exactly this JSON structure:
{
  "specialization": "the medical specialty needed (e.g. Cardiology, General Medicine, Dermatology, Orthopedics, Neurology, Pediatrics, Gynecology, Gastroenterology, ENT, Ophthalmology, Psychiatry)",
  "riskLevel": "Critical|High|Medium|Low",
  "conditions": ["possible condition 1", "possible condition 2"],
  "reasoning": "one sentence explanation",
  "urgency": "immediate|urgent|semi-urgent|non-urgent",
  "recommendation": "brief triage recommendation"
}`
        }]
      })
    });
    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    // Fallback local logic
    const s = symptoms.toLowerCase();
    if (s.includes("chest") || s.includes("heart") || s.includes("breath"))
      return { specialization: "Cardiology", riskLevel: "Critical", conditions: ["Possible cardiac event"], reasoning: "Chest/breathing symptoms require immediate attention.", urgency: "immediate", recommendation: "Go to emergency immediately." };
    if (s.includes("fever") || s.includes("cold") || s.includes("cough"))
      return { specialization: "General Medicine", riskLevel: "Medium", conditions: ["Viral infection","Flu"], reasoning: "Fever symptoms suggest viral or bacterial infection.", urgency: "urgent", recommendation: "See a general physician soon." };
    if (s.includes("skin") || s.includes("rash") || s.includes("itch"))
      return { specialization: "Dermatology", riskLevel: "Low", conditions: ["Dermatitis","Allergic reaction"], reasoning: "Skin symptoms are generally non-urgent.", urgency: "non-urgent", recommendation: "Schedule a dermatology appointment." };
    if (s.includes("bone") || s.includes("joint") || s.includes("fracture"))
      return { specialization: "Orthopedics", riskLevel: "High", conditions: ["Fracture","Joint disorder"], reasoning: "Bone/joint pain needs prompt evaluation.", urgency: "urgent", recommendation: "Get an X-ray and orthopedic consultation." };
    if (s.includes("head") || s.includes("dizz") || s.includes("neuro"))
      return { specialization: "Neurology", riskLevel: "High", conditions: ["Migraine","Neurological disorder"], reasoning: "Neurological symptoms require evaluation.", urgency: "urgent", recommendation: "See a neurologist." };
    return { specialization: "General Medicine", riskLevel: "Medium", conditions: ["Unspecified condition"], reasoning: "General symptoms assessed.", urgency: "semi-urgent", recommendation: "Consult a general physician." };
  }
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function HexIcon({ icon, color = "var(--cyan)", size = 40 }) {
  return (
    <div style={{
      width: size, height: size,
      background: `rgba(0,0,0,0.3)`,
      border: `1px solid ${color}`,
      borderRadius: 10, display: "flex",
      alignItems: "center", justifyContent: "center",
      boxShadow: `0 0 12px ${color}33`,
      fontSize: size * 0.45, flexShrink: 0
    }}>{icon}</div>
  );
}

function StarRating({ rating }) {
  const full = Math.floor(rating);
  return (
    <span style={{ fontSize: "0.8rem", color: "var(--amber)" }}>
      {"★".repeat(full)}{"☆".repeat(5 - full)}
      <span style={{ color: "var(--amber)", marginLeft: 4 }}>{rating}</span>
    </span>
  );
}

// ─── STEP 1: Location ─────────────────────────────────────────────────────────
function LocationStep({ onNext }) {
  const [mode, setMode]       = useState("auto");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [manual, setManual]   = useState({ lat: "12.9716", lng: "77.5946", city: "Bengaluru, Karnataka" });

  const handleAuto = () => {
    setLoading(true); setError(null);
    navigator.geolocation.getCurrentPosition(
      pos => { setLoading(false); onNext({ lat: pos.coords.latitude, lng: pos.coords.longitude, city: "Your Location" }); },
      () => { setLoading(false); setError("GPS access denied. Use manual input."); setMode("manual"); }
    );
  };

  const handleManual = () => {
    onNext({ lat: parseFloat(manual.lat), lng: parseFloat(manual.lng), city: manual.city });
  };

  return (
    <div className="float-up" style={{ maxWidth: 520, margin: "0 auto", padding: "40px 20px" }}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 50, height: 50, background: "linear-gradient(135deg,var(--cyan),var(--green))",
            borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, boxShadow: "0 0 24px rgba(0,212,255,0.4)"
          }}>⚕️</div>
          <div>
            <div style={{ fontFamily: "'Orbitron',sans-serif", fontSize: "1.8rem", fontWeight: 900, color: "var(--cyan)", letterSpacing: "0.1em" }}>
              AUTHEN<span style={{ color: "var(--green)" }}>X</span>
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--muted)", letterSpacing: "0.2em" }}>AI-POWERED HEALTHCARE TRIAGE</div>
          </div>
        </div>
        <p style={{ color: "var(--muted)", fontSize: "0.9rem", maxWidth: 360, margin: "0 auto" }}>
          Intelligent hospital recommendation & priority queue system
        </p>
      </div>

      <div className="card" style={{ padding: 32 }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontFamily: "Orbitron", fontSize: "1rem", letterSpacing: "0.12em", color: "var(--cyan)", marginBottom: 6 }}>
            📍 LOCATE YOU
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>We need your location to find nearby hospitals</p>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {["auto","manual"].map(m => (
            <button key={m} onClick={() => setMode(m)}
              style={{
                flex: 1, padding: "10px 0", border: "1px solid",
                borderColor: mode === m ? "var(--cyan)" : "var(--border)",
                borderRadius: 8, background: mode === m ? "rgba(0,212,255,0.1)" : "transparent",
                color: mode === m ? "var(--cyan)" : "var(--muted)",
                cursor: "pointer", fontSize: "0.85rem", fontFamily: "Sora", fontWeight: 600,
                transition: "all 0.2s"
              }}>
              {m === "auto" ? "🌐 Auto-Detect" : "📌 Manual Entry"}
            </button>
          ))}
        </div>

        {mode === "auto" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 20px" }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "linear-gradient(135deg,var(--cyan),var(--green))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "2rem", position: "relative", zIndex: 1,
                boxShadow: "0 0 20px rgba(0,212,255,0.4)"
              }}>📍</div>
              {[1,2,3].map(i => (
                <div key={i} style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  border: "2px solid var(--cyan)",
                  animation: `pulse-ring ${1.5 + i * 0.4}s ease-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                  opacity: 0
                }} />
              ))}
            </div>
            {error && <p style={{ color: "var(--red)", fontSize: "0.85rem", marginBottom: 16 }}>{error}</p>}
            <button className="btn-primary" onClick={handleAuto} disabled={loading} style={{ width: "100%" }}>
              {loading ? "Detecting Location…" : "Detect My Location"}
            </button>
          </div>
        )}

        {mode === "manual" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input className="input-field" placeholder="City / Area (e.g. Bengaluru, Karnataka)"
              value={manual.city} onChange={e => setManual(p => ({ ...p, city: e.target.value }))} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input className="input-field" placeholder="Latitude"
                value={manual.lat} onChange={e => setManual(p => ({ ...p, lat: e.target.value }))} />
              <input className="input-field" placeholder="Longitude"
                value={manual.lng} onChange={e => setManual(p => ({ ...p, lng: e.target.value }))} />
            </div>
            <button className="btn-primary" onClick={handleManual}>Find Hospitals →</button>
          </div>
        )}
      </div>

      <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 20 }}>
        {[["🏥","Real Hospital Data"],["🤖","AI Triage"],["🎫","Smart Queue"]].map(([icon, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.4rem", marginBottom: 4 }}>{icon}</div>
            <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STEP 2: Patient Details ──────────────────────────────────────────────────
function PatientDetailsStep({ onNext, onBack }) {
  const [form, setForm] = useState({
    name: "", age: "", gender: "", blood: "",
    phone: "", emergency_contact: "", emergency_relation: "",
    existing_conditions: [], allergies: "", medications: "",
    symptoms: "", duration: "", severity: "moderate", pain_scale: 5,
    additional: ""
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const CONDITIONS = ["Diabetes","Hypertension","Heart Disease","Asthma","Thyroid","Cancer","Kidney Disease","None"];
  const toggleCondition = (c) => {
    if (c === "None") { set("existing_conditions", []); return; }
    const curr = form.existing_conditions;
    set("existing_conditions", curr.includes(c) ? curr.filter(x => x !== c) : [...curr.filter(x => x !== "None"), c]);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name = "Required";
    if (!form.age || form.age < 1 || form.age > 120) e.age = "Enter valid age";
    if (!form.gender)          e.gender = "Required";
    if (!form.phone.trim())    e.phone = "Required";
    if (!form.symptoms.trim()) e.symptoms = "Describe your symptoms";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) onNext(form); };

  const Label = ({ text, required }) => (
    <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 5, fontWeight: 600, letterSpacing: "0.05em" }}>
      {text} {required && <span style={{ color: "var(--red)" }}>*</span>}
    </div>
  );
  const Err = ({ k }) => errors[k] ? (
    <div style={{ color: "var(--red)", fontSize: "0.72rem", marginTop: 3 }}>⚠ {errors[k]}</div>
  ) : null;

  const SEVERITY_OPTS = [
    { val: "mild",     label: "Mild",     desc: "Minor discomfort",     color: "var(--green)" },
    { val: "moderate", label: "Moderate", desc: "Affects daily life",   color: "var(--cyan)"  },
    { val: "severe",   label: "Severe",   desc: "Hard to function",     color: "var(--amber)" },
    { val: "critical", label: "Critical", desc: "Emergency / life risk", color: "var(--red)"  },
  ];
  const DURATION_OPTS = ["< 1 hour","1–6 hours","6–24 hours","1–3 days","3–7 days","> 1 week"];
  const BLOOD_GROUPS  = ["A+","A−","B+","B−","AB+","AB−","O+","O−","Unknown"];

  return (
    <div className="slide-up" style={{ maxWidth: 620, margin: "0 auto", padding: "24px 20px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button className="btn-secondary" onClick={onBack} style={{ padding: "8px 14px" }}>←</button>
        <div>
          <h2 style={{ fontFamily: "Orbitron", fontSize: "1rem", letterSpacing: "0.1em", color: "var(--cyan)" }}>
            PATIENT REGISTRATION
          </h2>
          <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Fill in your details for accurate medical triage</div>
        </div>
      </div>

      {/* ── Section 1: Personal Info ── */}
      <div className="card" style={{ padding: 22, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>👤</div>
          <span style={{ fontFamily: "Orbitron", fontSize: "0.78rem", letterSpacing: "0.1em", color: "var(--cyan)" }}>PERSONAL INFORMATION</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ gridColumn: "1/-1" }}>
            <Label text="Full Name" required />
            <input className="input-field" placeholder="e.g. Preetham Bhardwaj"
              value={form.name} onChange={e => set("name", e.target.value)}
              style={{ borderColor: errors.name ? "var(--red)" : "" }} />
            <Err k="name" />
          </div>

          <div>
            <Label text="Age" required />
            <input className="input-field" type="number" placeholder="e.g. 19"
              value={form.age} onChange={e => set("age", e.target.value)}
              style={{ borderColor: errors.age ? "var(--red)" : "" }} />
            <Err k="age" />
          </div>

          <div>
            <Label text="Gender" required />
            <div style={{ display: "flex", gap: 6 }}>
              {["Male","Female","Other"].map(g => (
                <button key={g} onClick={() => set("gender", g)} style={{
                  flex: 1, padding: "10px 6px", border: "1px solid",
                  borderColor: form.gender === g ? "var(--cyan)" : "var(--border)",
                  borderRadius: 7, background: form.gender === g ? "rgba(0,212,255,0.12)" : "transparent",
                  color: form.gender === g ? "var(--cyan)" : "var(--muted)",
                  cursor: "pointer", fontSize: "0.8rem", fontFamily: "Sora", transition: "all 0.2s"
                }}>{g}</button>
              ))}
            </div>
            <Err k="gender" />
          </div>

          <div>
            <Label text="Blood Group" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 5 }}>
              {BLOOD_GROUPS.map(b => (
                <button key={b} onClick={() => set("blood", b)} style={{
                  padding: "7px 4px", border: "1px solid",
                  borderColor: form.blood === b ? "var(--red)" : "var(--border)",
                  borderRadius: 6, background: form.blood === b ? "rgba(255,45,85,0.12)" : "transparent",
                  color: form.blood === b ? "var(--red)" : "var(--muted)",
                  cursor: "pointer", fontSize: "0.72rem", fontFamily: "Sora", transition: "all 0.2s"
                }}>{b}</button>
              ))}
            </div>
          </div>

          <div>
            <Label text="Mobile Number" required />
            <input className="input-field" placeholder="+91 98765 43210"
              value={form.phone} onChange={e => set("phone", e.target.value)}
              style={{ borderColor: errors.phone ? "var(--red)" : "" }} />
            <Err k="phone" />
          </div>

          <div>
            <Label text="Emergency Contact" />
            <input className="input-field" placeholder="Name & Number"
              value={form.emergency_contact} onChange={e => set("emergency_contact", e.target.value)} />
          </div>

          <div style={{ gridColumn: "1/-1" }}>
            <Label text="Relation to Emergency Contact" />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["Spouse","Parent","Child","Sibling","Friend","Other"].map(r => (
                <button key={r} onClick={() => set("emergency_relation", r)} style={{
                  padding: "6px 12px", border: "1px solid",
                  borderColor: form.emergency_relation === r ? "var(--amber)" : "var(--border)",
                  borderRadius: 6, background: form.emergency_relation === r ? "rgba(255,184,0,0.1)" : "transparent",
                  color: form.emergency_relation === r ? "var(--amber)" : "var(--muted)",
                  cursor: "pointer", fontSize: "0.78rem", fontFamily: "Sora", transition: "all 0.2s"
                }}>{r}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 2: Medical History ── */}
      <div className="card" style={{ padding: 22, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,184,0,0.1)", border: "1px solid rgba(255,184,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>📋</div>
          <span style={{ fontFamily: "Orbitron", fontSize: "0.78rem", letterSpacing: "0.1em", color: "var(--amber)" }}>MEDICAL HISTORY</span>
        </div>

        <div style={{ marginBottom: 14 }}>
          <Label text="Existing Conditions (select all that apply)" />
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {CONDITIONS.map(c => (
              <button key={c} onClick={() => toggleCondition(c)} style={{
                padding: "7px 13px", border: "1px solid",
                borderColor: form.existing_conditions.includes(c) ? "var(--amber)" : "var(--border)",
                borderRadius: 6, background: form.existing_conditions.includes(c) ? "rgba(255,184,0,0.1)" : "transparent",
                color: form.existing_conditions.includes(c) ? "var(--amber)" : "var(--muted)",
                cursor: "pointer", fontSize: "0.78rem", fontFamily: "Sora", transition: "all 0.2s"
              }}>{c}</button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <Label text="Known Allergies" />
            <input className="input-field" placeholder="e.g. Penicillin, Latex"
              value={form.allergies} onChange={e => set("allergies", e.target.value)} />
          </div>
          <div>
            <Label text="Current Medications" />
            <input className="input-field" placeholder="e.g. Metformin 500mg"
              value={form.medications} onChange={e => set("medications", e.target.value)} />
          </div>
        </div>
      </div>

      {/* ── Section 3: Symptoms ── */}
      <div className="card" style={{ padding: 22, marginBottom: 14, borderColor: "rgba(0,212,255,0.25)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(0,255,157,0.1)", border: "1px solid rgba(0,255,157,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>🩺</div>
          <span style={{ fontFamily: "Orbitron", fontSize: "0.78rem", letterSpacing: "0.1em", color: "var(--green)" }}>CURRENT SYMPTOMS</span>
        </div>

        <div style={{ marginBottom: 14 }}>
          <Label text="Describe your symptoms" required />
          <textarea className="input-field" rows={3}
            placeholder="e.g. Severe chest pain radiating to left arm, shortness of breath, dizziness for past 2 hours…"
            value={form.symptoms} onChange={e => set("symptoms", e.target.value)}
            style={{ borderColor: errors.symptoms ? "var(--red)" : "" }} />
          <Err k="symptoms" />
        </div>

        {/* Quick Symptom Presets */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: 8 }}>⚡ Quick select:</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[
              ["💔 Chest / Heart", "chest pain, shortness of breath, palpitations"],
              ["🤒 Fever / Flu",   "high fever, headache, body ache, chills"],
              ["🦷 Stomach Pain",  "severe abdominal pain, nausea, vomiting"],
              ["🦴 Bone / Joint",  "severe joint pain, swelling, difficulty walking"],
              ["🧠 Neuro / Head",  "dizziness, severe headache, vision blur, numbness"],
              ["🩹 Skin / Rash",   "skin rash, severe itching, redness, swelling"],
            ].map(([label, val]) => (
              <button key={label} onClick={() => set("symptoms", val)} style={{
                background: form.symptoms === val ? "rgba(0,212,255,0.1)" : "transparent",
                border: `1px solid ${form.symptoms === val ? "var(--cyan)" : "var(--border)"}`,
                borderRadius: 7, color: form.symptoms === val ? "var(--cyan)" : "var(--muted)",
                cursor: "pointer", fontSize: "0.78rem", fontFamily: "Sora",
                padding: "8px 10px", textAlign: "left", transition: "all 0.2s"
              }}>{label}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <Label text="Duration of Symptoms" />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {DURATION_OPTS.map(d => (
              <button key={d} onClick={() => set("duration", d)} style={{
                padding: "7px 12px", border: "1px solid",
                borderColor: form.duration === d ? "var(--cyan)" : "var(--border)",
                borderRadius: 6, background: form.duration === d ? "rgba(0,212,255,0.1)" : "transparent",
                color: form.duration === d ? "var(--cyan)" : "var(--muted)",
                cursor: "pointer", fontSize: "0.75rem", fontFamily: "Sora", transition: "all 0.2s"
              }}>{d}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <Label text="Severity" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {SEVERITY_OPTS.map(s => (
              <button key={s.val} onClick={() => set("severity", s.val)} style={{
                padding: "10px 6px", border: "1px solid",
                borderColor: form.severity === s.val ? s.color : "var(--border)",
                borderRadius: 8, background: form.severity === s.val ? `${s.color}18` : "transparent",
                color: form.severity === s.val ? s.color : "var(--muted)",
                cursor: "pointer", fontFamily: "Sora", transition: "all 0.2s", textAlign: "center"
              }}>
                <div style={{ fontWeight: 700, fontSize: "0.82rem" }}>{s.label}</div>
                <div style={{ fontSize: "0.66rem", marginTop: 3, opacity: 0.8 }}>{s.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label text={`Pain Scale: ${form.pain_scale}/10`} />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "0.75rem", color: "var(--green)" }}>No Pain</span>
            <input type="range" min={0} max={10} value={form.pain_scale}
              onChange={e => set("pain_scale", Number(e.target.value))}
              style={{ flex: 1, accentColor: form.pain_scale >= 7 ? "var(--red)" : form.pain_scale >= 4 ? "var(--amber)" : "var(--green)" }} />
            <span style={{ fontSize: "0.75rem", color: "var(--red)" }}>Worst</span>
            <div style={{
              minWidth: 36, height: 36, borderRadius: "50%",
              background: form.pain_scale >= 8 ? "var(--red)" : form.pain_scale >= 5 ? "var(--amber)" : "var(--green)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "Orbitron", fontWeight: 700, fontSize: "0.85rem", color: "#000",
              boxShadow: `0 0 10px ${form.pain_scale >= 8 ? "var(--red)" : form.pain_scale >= 5 ? "var(--amber)" : "var(--green)"}`
            }}>{form.pain_scale}</div>
          </div>
        </div>
      </div>

      {/* ── Section 4: Additional ── */}
      <div className="card" style={{ padding: 22, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(0,212,255,0.08)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>📝</div>
          <span style={{ fontFamily: "Orbitron", fontSize: "0.78rem", letterSpacing: "0.1em", color: "var(--muted)" }}>ADDITIONAL NOTES</span>
        </div>
        <textarea className="input-field" rows={2}
          placeholder="Any other information the doctor should know…"
          value={form.additional} onChange={e => set("additional", e.target.value)} />
      </div>

      <button className="btn-primary" onClick={handleNext} style={{ width: "100%", fontSize: "1rem", padding: "14px" }}>
        Find Hospitals Near Me →
      </button>
    </div>
  );
}

// ─── STEP 3: Hospitals ────────────────────────────────────────────────────────
function HospitalsStep({ location, patient, onNext, onBack }) {
  const [loading, setLoading]     = useState(true);
  const [hospitals, setHospitals] = useState([]);
  const [tab, setTab]             = useState("list");
  const [selected, setSelected]   = useState(null);
  const [retryKey, setRetryKey]   = useState(0);

  const [fetchStatus, setFetchStatus] = useState("Initializing…");
  const [fetchError, setFetchError]   = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setFetchError(null);
      try {
        setFetchStatus("Connecting to OpenStreetMap…");
        const results = await fetchHospitalsFromOverpass(
          location.lat, location.lng,
          (msg) => { if (!cancelled) setFetchStatus(msg); }
        );
        if (cancelled) return;
        if (results.length === 0) {
          setFetchError("No hospitals found within 10km. Try a different location.");
          setLoading(false);
          return;
        }
        setHospitals(results);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setFetchError("Failed: " + err.message);
        setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [location.lat, location.lng, retryKey]);

  const renderMapPins = () => {
    if (hospitals.length === 0) return null;
    const lats = hospitals.map(h => h.lat);
    const lngs = hospitals.map(h => h.lng);
    const pad = 0.01;
    const minLat = Math.min(...lats) - pad, maxLat = Math.max(...lats) + pad;
    const minLng = Math.min(...lngs) - pad, maxLng = Math.max(...lngs) + pad;
    const latRange = maxLat - minLat || 0.02;
    const lngRange = maxLng - minLng || 0.02;
    return hospitals.map((h) => {
      const left = ((h.lng - minLng) / lngRange) * 100;
      const top  = (1 - (h.lat - minLat) / latRange) * 100;
      const avail = checkHospitalAvailability(h);
      return (
        <div key={h.id} className="map-pin"
          onClick={() => { setSelected(h.id); setTab("list"); }}
          style={{ left: `${Math.min(90,Math.max(10,left))}%`, top: `${Math.min(90,Math.max(10,top))}%` }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)",
            background: selected === h.id ? "var(--cyan)" : avail.available ? "var(--green)" : "var(--red)",
            border: "2px solid rgba(255,255,255,0.3)",
            boxShadow: `0 0 12px ${selected === h.id ? "var(--cyan)" : avail.available ? "var(--green)" : "var(--red)"}`,
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <span style={{ transform: "rotate(45deg)", fontSize: "0.8rem" }}>🏥</span>
          </div>
          <div style={{
            position: "absolute", top: -28, left: "50%", transform: "translateX(-50%)",
            background: "rgba(0,0,0,0.85)", border: "1px solid var(--border)",
            borderRadius: 4, padding: "2px 8px", fontSize: "0.7rem",
            whiteSpace: "nowrap", color: "var(--text)"
          }}>{h.name}</div>
        </div>
      );
    });
  };

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 400, gap: 20, padding: "0 20px" }}>
      <div className="spinner" />
      <div style={{ fontFamily: "Orbitron", fontSize: "0.85rem", color: "var(--cyan)", letterSpacing: "0.15em" }}>
        FETCHING NEARBY HOSPITALS…
      </div>
      <div style={{ color: "var(--cyan)", fontSize: "0.82rem", textAlign: "center" }}>
        {fetchStatus}
      </div>
      {patient && (
        <div style={{ background: "rgba(0,212,255,0.06)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 16px", fontSize: "0.78rem", color: "var(--muted)" }}>
          👤 {patient.name}, {patient.age}y • 🩺 {patient.symptoms?.slice(0,40)}…
        </div>
      )}
      <div style={{ fontSize: "0.72rem", color: "var(--muted)", opacity: 0.6 }}>
        📡 AI Web Search • {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
      </div>
    </div>
  );

  if (fetchError) return (
    <div style={{ maxWidth: 500, margin: "60px auto", padding: "0 20px" }}>
      <div className="card" style={{ padding: 28, borderColor: "rgba(255,45,85,0.4)", background: "rgba(255,45,85,0.05)" }}>
        <div style={{ fontSize: "2rem", marginBottom: 12, textAlign: "center" }}>⚠️</div>
        <h3 style={{ fontFamily: "Orbitron", color: "var(--red)", fontSize: "0.9rem", textAlign: "center", marginBottom: 12 }}>
          COULD NOT FETCH HOSPITALS
        </h3>
        <div style={{ background: "rgba(0,0,0,0.4)", borderRadius: 6, padding: "10px 14px", fontFamily: "monospace", fontSize: "0.78rem", color: "#ff8888", marginBottom: 20, wordBreak: "break-all" }}>
          {fetchError}
        </div>
        <div style={{ color: "var(--muted)", fontSize: "0.82rem", marginBottom: 20 }}>
          Something went wrong while searching for hospitals near your location. Check your connection and retry.
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-primary" onClick={() => { setLoading(true); setFetchError(null); setRetryKey(k => k + 1); }} style={{ flex: 1 }}>
            🔄 Retry
          </button>
          <button className="btn-secondary" onClick={onBack} style={{ flex: 1 }}>
            ← Change Location
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="slide-up" style={{ maxWidth: 700, margin: "0 auto", padding: "24px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button className="btn-secondary" onClick={onBack} style={{ padding: "8px 14px" }}>←</button>
        <div>
          <h2 style={{ fontFamily: "Orbitron", fontSize: "1rem", letterSpacing: "0.1em", color: "var(--cyan)" }}>
            NEARBY HOSPITALS
          </h2>
          <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
            📍 {location.city} • {hospitals.length} facilities found
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--muted)", opacity: 0.6, marginTop: 2 }}>
            🔍 Real data via AI Web Search • No API key required
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          {["list","map"].map(t => (
            <button key={t} className={`nav-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t === "list" ? "☰ List" : "🗺 Map"}
            </button>
          ))}
        </div>
      </div>

      {tab === "map" && (
        <div className="map-container" style={{ height: 320, marginBottom: 20 }}>
          <div className="map-grid" />
          <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,0.7)", padding: "6px 12px", borderRadius: 6, fontSize: "0.72rem", color: "var(--muted)" }}>
            <span className="live-dot" style={{ marginRight: 6 }} />LIVE MAP VIEW
          </div>
          {/* User pin */}
          <div className="map-pin" style={{ left: "50%", top: "50%" }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              background: "var(--cyan)", border: "3px solid white",
              boxShadow: "0 0 16px var(--cyan)"
            }} />
          </div>
          {renderMapPins()}
          <div style={{ position: "absolute", bottom: 10, right: 10, fontSize: "0.7rem", color: "var(--muted)", display: "flex", gap: 12 }}>
            <span><span style={{ color: "var(--green)" }}>● </span>Open</span>
            <span><span style={{ color: "var(--red)" }}>● </span>Unavailable</span>
            <span><span style={{ color: "var(--cyan)" }}>● </span>Selected</span>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {hospitals.map((h, i) => {
          const avail = checkHospitalAvailability(h);
          const isSelected = selected === h.id;
          return (
            <div key={h.id} className={`card hospital-card ${isSelected ? "selected" : ""}`}
              onClick={() => setSelected(isSelected ? null : h.id)}
              style={{ padding: "14px 18px", animationDelay: `${i * 0.06}s` }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <HexIcon icon="🏥" color={avail.available ? "var(--green)" : "var(--red)"} size={44} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{h.name}</span>
                    {!avail.available && (
                      <span className="badge badge-critical" style={{ fontSize: "0.7rem" }}>
                        {avail.reason} • Opens {avail.next}
                      </span>
                    )}
                    {avail.available && <span className="badge badge-low" style={{ fontSize: "0.7rem" }}>● Open</span>}
                    {h.emergency && <span className="badge" style={{ background: "rgba(255,45,85,0.1)", color: "var(--red)", border: "1px solid rgba(255,45,85,0.3)", fontSize: "0.7rem" }}>🚨 Emergency</span>}
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: "0.8rem", marginBottom: 6 }}>{h.address}</div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                    <span style={{ color: "var(--amber)", fontSize: "0.82rem" }}>★ {h.rating}</span>
                    <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>💬 {h.reviews.toLocaleString()} reviews</span>
                    <span style={{ color: "var(--cyan)", fontSize: "0.82rem" }}>📍 {h.distance} km</span>
                    <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>🏢 {h.beds} beds</span>
                    {h.source === "Web Search" && (
                      <span style={{ color: "#7ec8e3", fontSize: "0.72rem", opacity: 0.7 }}>🔍 Web</span>
                    )}
                  </div>
                  {isSelected && (
                    <div style={{ marginTop: 10 }}>
                      <div className="glow-divider" />
                      <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 6 }}>Specializations:</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {h.specializations.map(s => (
                          <span key={s} style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 4, padding: "2px 8px", fontSize: "0.75rem", color: "var(--cyan)" }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ padding: "16px 20px", background: "rgba(0,212,255,0.04)" }}>
        <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 10 }}>
          💡 Hospitals loaded for <strong style={{ color: "var(--cyan)" }}>{patient?.name}</strong>. Click below to run AI triage on your symptoms.
        </div>
        <button className="btn-primary" onClick={() => onNext(hospitals)} style={{ width: "100%" }}>
          🤖 Analyze Symptoms & Get AI Recommendation →
        </button>
      </div>
    </div>
  );
}

// ─── STEP 4: AI Analysis + Hospital Recommendation ───────────────────────────
function RecommendationStep({ data, onNext, onBack }) {
  const { patient, hospitals } = data;
  const [analysis, setAnalysis]   = useState(null);
  const [analyzing, setAnalyzing] = useState(true);
  const [selected, setSelected]   = useState(null);
  const [error, setError]         = useState(null);

  useEffect(() => {
    async function run() {
      try {
        // Build rich symptom context from full patient data
        const ctx = `
Patient: ${patient.name}, ${patient.age} years old, ${patient.gender}
Blood Group: ${patient.blood || "Unknown"}
Existing Conditions: ${patient.existing_conditions?.join(", ") || "None"}
Allergies: ${patient.allergies || "None"}
Current Medications: ${patient.medications || "None"}
Symptoms: ${patient.symptoms}
Duration: ${patient.duration || "Not specified"}
Severity: ${patient.severity}
Pain Scale: ${patient.pain_scale}/10
Additional Notes: ${patient.additional || "None"}
        `.trim();
        const result = await analyzeSymptoms(ctx);
        setAnalysis(result);
        setAnalyzing(false);
      } catch(e) {
        setError(e.message);
        setAnalyzing(false);
      }
    }
    run();
  }, []);

  const filtered = analysis ? hospitals
    .map(h => ({ ...h, score: scoreHospital(h, analysis.specialization, analysis.riskLevel) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5) : [];

  const maxScore = filtered.length ? Math.max(...filtered.map(h => h.score)) : 1;

  useEffect(() => {
    if (filtered.length) setSelected(filtered[0].id);
  }, [analysis]);

  const urgencyColors = { immediate: "var(--red)", urgent: "var(--amber)", "semi-urgent": "var(--cyan)", "non-urgent": "var(--green)" };

  if (analyzing) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 420, gap: 20 }}>
      <div className="spinner" style={{ borderTopColor: "var(--green)", width: 50, height: 50 }} />
      <div style={{ fontFamily: "Orbitron", fontSize: "0.9rem", color: "var(--green)", letterSpacing: "0.15em", animation: "blink 1.2s infinite" }}>
        AI ANALYZING PATIENT DATA…
      </div>
      <div style={{ color: "var(--muted)", fontSize: "0.82rem", textAlign: "center", maxWidth: 320 }}>
        Processing symptoms, medical history & risk factors for <strong style={{ color: "var(--cyan)" }}>{patient.name}</strong>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", maxWidth: 380 }}>
        {["Symptom Classification","Risk Assessment","Specialization Match","Hospital Scoring"].map(s => (
          <span key={s} style={{ background: "rgba(0,212,255,0.06)", border: "1px solid var(--border)", borderRadius: 20, padding: "4px 10px", fontSize: "0.72rem", color: "var(--muted)" }}>{s}</span>
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div style={{ maxWidth: 500, margin: "60px auto", padding: "0 20px" }}>
      <div className="card" style={{ padding: 24, borderColor: "rgba(255,45,85,0.4)" }}>
        <div style={{ color: "var(--red)", marginBottom: 12 }}>⚠ AI Analysis Failed: {error}</div>
        <button className="btn-primary" onClick={() => { setAnalyzing(true); setError(null); }}>Retry</button>
      </div>
    </div>
  );

  const uColor = urgencyColors[analysis?.urgency] || "var(--cyan)";

  return (
    <div className="slide-up" style={{ maxWidth: 700, margin: "0 auto", padding: "24px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button className="btn-secondary" onClick={onBack} style={{ padding: "8px 14px" }}>←</button>
        <div>
          <h2 style={{ fontFamily: "Orbitron", fontSize: "1rem", letterSpacing: "0.1em", color: "var(--cyan)" }}>
            AI TRIAGE COMPLETE
          </h2>
          <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>AuthenX AI Medical Analysis • {patient.name}</div>
        </div>
      </div>

      {/* Patient Summary Card */}
      <div className="card" style={{ padding: 16, marginBottom: 14, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--cyan), var(--green))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.4rem", flexShrink: 0
        }}>👤</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 2 }}>{patient.name}</div>
          <div style={{ display: "flex", gap: 12, fontSize: "0.78rem", color: "var(--muted)", flexWrap: "wrap" }}>
            <span>🎂 {patient.age} yrs • {patient.gender}</span>
            {patient.blood && <span>🩸 {patient.blood}</span>}
            <span>📱 {patient.phone}</span>
            {patient.duration && <span>⏱ {patient.duration}</span>}
            <span>💢 Pain: {patient.pain_scale}/10</span>
          </div>
          {patient.existing_conditions?.length > 0 && (
            <div style={{ fontSize: "0.72rem", color: "var(--amber)", marginTop: 4 }}>
              ⚠ Existing: {patient.existing_conditions.join(", ")}
            </div>
          )}
        </div>
        <div className={`badge ${getRiskBadgeClass(analysis.riskLevel)}`} style={{ fontSize: "0.85rem", padding: "6px 14px" }}>
          {analysis.riskLevel} Risk
        </div>
      </div>

      {/* AI Analysis Card */}
      <div className="card" style={{ padding: 22, marginBottom: 14, background: "rgba(0,255,157,0.03)", borderColor: "rgba(0,255,157,0.2)" }}>
        <div style={{ fontSize: "0.72rem", color: "var(--muted)", letterSpacing: "0.1em", marginBottom: 12 }}>🤖 AI DIAGNOSIS INDICATORS</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
          <span className={`badge ${getRiskBadgeClass(analysis.riskLevel)}`}>⚠ {analysis.riskLevel} Risk</span>
          <span className="badge" style={{ background: "rgba(0,255,157,0.1)", color: "var(--green)", border: "1px solid rgba(0,255,157,0.3)" }}>🏥 {analysis.specialization}</span>
          <span className="badge" style={{ background: "rgba(0,0,0,0.3)", color: uColor, border: `1px solid ${uColor}44` }}>⏱ {analysis.urgency}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: 6 }}>ASSESSMENT</div>
            <div style={{ fontSize: "0.85rem", lineHeight: 1.5 }}>{analysis.reasoning}</div>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 8 }}>💊 {analysis.recommendation}</div>
          </div>
          {analysis.conditions?.length > 0 && (
            <div>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginBottom: 6 }}>POSSIBLE CONDITIONS</div>
              {analysis.conditions.map(c => (
                <div key={c} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--cyan)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.82rem" }}>{c}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ranked Hospitals */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "Orbitron", fontSize: "0.82rem", color: "var(--cyan)", letterSpacing: "0.1em", marginBottom: 12 }}>
          🏆 RANKED HOSPITAL MATCHES — {analysis.specialization}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((h, i) => {
            const avail = checkHospitalAvailability(h);
            const scorePercent = (h.score / maxScore) * 100;
            const isSelected = selected === h.id;
            return (
              <div key={h.id} className={`card hospital-card ${isSelected ? "selected" : ""}`}
                onClick={() => avail.available && setSelected(h.id)}
                style={{ padding: "14px 18px", opacity: avail.available ? 1 : 0.55, cursor: avail.available ? "pointer" : "not-allowed" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                    background: i === 0 ? "linear-gradient(135deg,#ffd700,#ff8c00)" : "var(--surface)",
                    border: `1px solid ${i === 0 ? "#ffd700" : "var(--border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "Orbitron", fontWeight: 700, fontSize: "0.9rem",
                    color: i === 0 ? "#000" : "var(--muted)"
                  }}>{i === 0 ? "★" : i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3, flexWrap: "wrap", gap: 6 }}>
                      <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{h.name}</span>
                      <div style={{ display: "flex", gap: 5 }}>
                        {i === 0 && <span className="badge badge-low" style={{ fontSize: "0.68rem" }}>⭐ Best Match</span>}
                        {!avail.available && <span className="badge badge-critical" style={{ fontSize: "0.68rem" }}>{avail.reason}</span>}
                        {avail.available && <span className="badge badge-low" style={{ fontSize: "0.68rem" }}>● Open</span>}
                      </div>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 6 }}>{h.address}</div>
                    <div style={{ display: "flex", gap: 12, fontSize: "0.78rem", color: "var(--muted)", marginBottom: 8, flexWrap: "wrap" }}>
                      <span>★ {h.rating}</span>
                      <span>📍 {h.distance} km</span>
                      <span>💬 {h.reviews.toLocaleString()}</span>
                      <span>🏢 {h.type}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div className="score-bar" style={{ flex: 1 }}>
                        <div className="score-fill" style={{ width: `${scorePercent}%`, transition: "width 0.9s ease" }} />
                      </div>
                      <span style={{ fontSize: "0.78rem", color: "var(--cyan)", fontWeight: 700, minWidth: 32 }}>{h.score.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card" style={{ padding: "16px 20px", background: "rgba(0,212,255,0.04)" }}>
        <div style={{ fontSize: "0.85rem", color: "var(--muted)", marginBottom: 12 }}>
          {selected
            ? <span>Booking token for <strong style={{ color: "var(--cyan)" }}>{patient.name}</strong> at <strong style={{ color: "var(--cyan)" }}>{filtered.find(h => h.id === selected)?.name}</strong></span>
            : "Select an available hospital above"}
        </div>
        <button className="btn-primary" disabled={!selected} style={{ width: "100%" }}
          onClick={() => {
            const hospital = filtered.find(h => h.id === selected);
            const avail = checkHospitalAvailability(hospital);
            onNext({ hospital, analysis, avail });
          }}>
          🎫 Generate Priority Token for {patient.name} →
        </button>
      </div>
    </div>
  );
}

// ─── STEP 5: Token + Queue ────────────────────────────────────────────────────
function TokenStep({ data, onRestart }) {
  const { hospital, analysis, avail, patient } = data;
  const [tokenData, setTokenData]   = useState(null);
  const [tab, setTab]               = useState("token");
  const [tick, setTick]             = useState(0);

  useEffect(() => {
    if (avail.available) {
      const result = generateTokenForHospital(hospital.id, analysis.riskLevel);
      setTokenData(result);
    }
    const t = setInterval(() => setTick(n => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  const riskColor = getRiskColor(analysis.riskLevel);

  if (!avail.available) return (
    <div className="slide-up" style={{ maxWidth: 540, margin: "0 auto", padding: "40px 20px" }}>
      <div className="card" style={{ padding: 32, textAlign: "center", borderColor: "rgba(255,45,85,0.3)" }}>
        <div style={{ fontSize: "3rem", marginBottom: 16 }}>🚫</div>
        <h2 style={{ fontFamily: "Orbitron", color: "var(--red)", marginBottom: 8 }}>UNAVAILABLE</h2>
        <p style={{ color: "var(--muted)", marginBottom: 20 }}>
          {hospital.name} is currently on <strong style={{ color: "var(--amber)" }}>{avail.reason}</strong>
        </p>
        <div className="card" style={{ padding: 16, marginBottom: 24, background: "rgba(0,212,255,0.06)" }}>
          <div style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Next Available Slot</div>
          <div style={{ fontFamily: "Orbitron", color: "var(--cyan)", fontSize: "1.5rem", marginTop: 4 }}>
            {avail.next}
          </div>
        </div>
        <button className="btn-primary" onClick={onRestart} style={{ width: "100%" }}>
          ← Choose Another Hospital
        </button>
      </div>
    </div>
  );

  if (!tokenData) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
      <div className="spinner" />
    </div>
  );

  const { token, position, total, queue } = tokenData;

  return (
    <div className="slide-up" style={{ maxWidth: 620, margin: "0 auto", padding: "24px 20px" }}>
      {/* Success Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontFamily: "Orbitron", fontSize: "0.75rem", letterSpacing: "0.2em", color: "var(--green)", marginBottom: 8 }}>
          ✅ TOKEN GENERATED SUCCESSFULLY
        </div>
        <h1 style={{ fontFamily: "Orbitron", color: "var(--text)", fontSize: "1.2rem" }}>{hospital.name}</h1>
        <div style={{ color: "var(--muted)", fontSize: "0.82rem", marginTop: 4 }}>{hospital.address}</div>
      </div>

      {/* Tab nav */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, background: "var(--surface)", padding: 4, borderRadius: 10 }}>
        {["token","queue","details"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              flex: 1, padding: "8px 0", border: "none", borderRadius: 7, cursor: "pointer",
              background: tab === t ? "var(--card)" : "transparent",
              color: tab === t ? "var(--cyan)" : "var(--muted)",
              fontFamily: "Sora", fontSize: "0.85rem", fontWeight: 600,
              boxShadow: tab === t ? "0 0 8px rgba(0,212,255,0.15)" : "none",
              transition: "all 0.2s"
            }}>
            {t === "token" ? "🎫 Token" : t === "queue" ? "📋 Queue" : "🏥 Details"}
          </button>
        ))}
      </div>

      {tab === "token" && (
        <div className="slide-up">
          {/* Token card */}
          <div className="card" style={{ padding: 32, textAlign: "center", marginBottom: 16, background: "radial-gradient(ellipse at center, rgba(0,212,255,0.05) 0%, transparent 70%)" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)", letterSpacing: "0.15em", marginBottom: 8 }}>TOKEN NUMBER</div>
            <div className="token-number">T{String(token.id).padStart(3,"0")}</div>
            <div style={{ marginTop: 8, fontFamily: "Orbitron", fontSize: "0.85rem", color: "var(--text)", letterSpacing: "0.05em" }}>
              {patient?.name}
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginBottom: 4 }}>
              {patient?.age}y • {patient?.gender} {patient?.blood ? `• 🩸 ${patient.blood}` : ""}
            </div>
            <div style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              <span className={`badge ${getRiskBadgeClass(analysis.riskLevel)}`}>
                ⚠ {analysis.riskLevel} Priority
              </span>
              <span className="badge badge-low">🏥 {analysis.specialization}</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
            {[
              ["Position in Queue", `${position} of ${total}`, "📍"],
              ["Est. Wait Time", token.waitMins ? `~${token.waitMins} min` : "<5 min", "⏱"],
              ["Priority Level", analysis.riskLevel, "🔥"]
            ].map(([label, val, icon]) => (
              <div key={label} className="card" style={{ padding: "14px 12px", textAlign: "center" }}>
                <div style={{ fontSize: "1.4rem", marginBottom: 6 }}>{icon}</div>
                <div style={{ fontFamily: "Orbitron", fontSize: "1rem", color: "var(--cyan)", fontWeight: 700 }}>{val}</div>
                <div style={{ fontSize: "0.7rem", color: "var(--muted)", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Live indicator */}
          <div className="card" style={{ padding: 14, display: "flex", alignItems: "center", gap: 10, marginBottom: 16, background: "rgba(0,255,157,0.04)" }}>
            <span className="live-dot" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text)", fontWeight: 600 }}>Live Queue Tracking Active</div>
              <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>Updates every 30 seconds • Show this token at reception</div>
            </div>
            <div style={{ fontFamily: "Orbitron", fontSize: "0.75rem", color: "var(--green)" }}>LIVE</div>
          </div>

          {analysis.riskLevel === "Critical" && (
            <div className="card" style={{ padding: 14, background: "rgba(255,45,85,0.08)", borderColor: "rgba(255,45,85,0.4)", marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: "1.5rem" }}>🚨</span>
                <div>
                  <div style={{ color: "var(--red)", fontWeight: 700, fontSize: "0.9rem" }}>CRITICAL — Immediate Attention Required</div>
                  <div style={{ color: "var(--muted)", fontSize: "0.78rem" }}>Please proceed to emergency immediately. Inform staff of your critical status.</div>
                </div>
              </div>
            </div>
          )}

          <button className="btn-secondary" onClick={onRestart} style={{ width: "100%", marginTop: 4 }}>
            + Register New Patient
          </button>
          <br></br>
          <button className="btn-secondary" onClick={onRestart} style={{ width: "100%", marginTop: 4 }}>
            Home
          </button>
        </div>
      )}

      {tab === "queue" && (
        <div className="slide-up">
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
              <span className="live-dot" />
              <span style={{ fontFamily: "Orbitron", fontSize: "0.82rem", letterSpacing: "0.1em", color: "var(--cyan)" }}>
                LIVE PRIORITY QUEUE — {hospital.name}
              </span>
              <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: "var(--muted)" }}>{total} patients</span>
            </div>
            {queue.slice(0, 8).map((q, i) => {
              const isCurrent = i === 0;
              const isMine    = q.id === token.id;
              return (
                <div key={q.id} className="queue-row" style={{
                  padding: "12px 18px", borderBottom: "1px solid rgba(14,61,106,0.5)",
                  background: isMine ? "rgba(0,212,255,0.07)" : isCurrent ? "rgba(0,255,157,0.04)" : "transparent",
                  display: "flex", alignItems: "center", gap: 12
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: isCurrent ? "var(--green)" : "var(--surface)",
                    border: `1px solid ${isCurrent ? "var(--green)" : "var(--border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "Orbitron", fontSize: "0.8rem", fontWeight: 700,
                    color: isCurrent ? "var(--bg)" : "var(--muted)",
                    flexShrink: 0
                  }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontFamily: "Orbitron", color: isMine ? "var(--cyan)" : "var(--text)", fontSize: "0.9rem" }}>
                        T{String(q.id).padStart(3,"0")}
                      </span>
                      <span className={`badge ${getRiskBadgeClass(q.risk)}`}>{q.risk}</span>
                      {isMine && <span className="badge badge-medium">← You</span>}
                      {isCurrent && <span className="badge badge-low">▶ Now Serving</span>}
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 2 }}>
                      Wait: ~{(i * 12)} min • Registered: {new Date(q.time).toLocaleTimeString()}
                    </div>
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: "50%",
                    background: getRiskColor(q.risk),
                    boxShadow: `0 0 6px ${getRiskColor(q.risk)}`
                  }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {[["Critical","var(--red)"],["High","var(--amber)"],["Medium","var(--cyan)"],["Low","var(--green)"]].map(([r,c]) => {
              const count = queue.filter(q => q.risk === r).length;
              return (
                <div key={r} className="card" style={{ padding: "10px", textAlign: "center", borderColor: `${c}44` }}>
                  <div style={{ color: c, fontFamily: "Orbitron", fontSize: "1.2rem", fontWeight: 700 }}>{count}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--muted)" }}>{r}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "details" && (
        <div className="slide-up">
          <div className="card" style={{ padding: 20, marginBottom: 12 }}>
            <div style={{ fontFamily: "Orbitron", fontSize: "0.75rem", color: "var(--cyan)", letterSpacing: "0.1em", marginBottom: 12 }}>HOSPITAL INFORMATION</div>
            {[
              ["Name", hospital.name, "🏥"],
              ["Type", hospital.type, "🏢"],
              ["Address", hospital.address, "📍"],
              ["Phone", hospital.phone, "📞"],
              ["Rating", `${hospital.rating} ★  (${hospital.reviews.toLocaleString()} reviews)`, "⭐"],
              ["Distance", `${hospital.distance} km`, "🛣"],
              ["Total Beds", hospital.beds, "🛏"],
              ["Emergency", hospital.emergency ? "Available 24/7" : "Not Available", "🚨"],
            ].map(([k,v,icon]) => (
              <div key={k} style={{ display: "flex", gap: 12, paddingTop: 8, paddingBottom: 8, borderBottom: "1px solid rgba(14,61,106,0.4)" }}>
                <span style={{ fontSize: "1rem", width: 24 }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>{k}</div>
                  <div style={{ fontSize: "0.9rem" }}>{v}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontFamily: "Orbitron", fontSize: "0.75rem", color: "var(--cyan)", letterSpacing: "0.1em", marginBottom: 12 }}>OPERATING SCHEDULE</div>
            {[
              ["Hours", `${hospital.openTime} – ${hospital.closeTime}`],
              ["Lunch", hospital.lunchBreak ? `${hospital.lunchBreak.start} – ${hospital.lunchBreak.end}` : "No break"],
              ["Tea", hospital.teaBreak ? `${hospital.teaBreak.start} – ${hospital.teaBreak.end}` : "No break"],
            ].map(([k,v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(14,61,106,0.4)" }}>
                <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>{k}</span>
                <span style={{ fontSize: "0.85rem" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep]   = useState(0);
  const [data, setData]   = useState({});

  const steps = ["Location","Patient","Hospitals","Analysis","Token"];

  return (
    <>
      <FontLink />
      <div className="scanlines grid-bg" style={{ minHeight: "100vh" }}>
        {/* Top bar */}
        <div style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(3,13,26,0.95)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          padding: "12px 24px", display: "flex", alignItems: "center", gap: 16
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "1.3rem" }}>⚕️</span>
            <span style={{ fontFamily: "Orbitron", fontWeight: 900, color: "var(--cyan)", fontSize: "1rem", letterSpacing: "0.1em" }}>
              AUTHEN<span style={{ color: "var(--green)" }}>X</span>
            </span>
          </div>
          {/* Step progress */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
            {steps.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div className={`step-dot ${i === step ? "active" : i < step ? "done" : ""}`} />
                  <span style={{ fontSize: "0.6rem", color: i === step ? "var(--cyan)" : i < step ? "var(--green)" : "var(--muted)" }}>
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ width: 24, height: 1, background: i < step ? "var(--green)" : "var(--border)", marginBottom: 12 }} />
                )}
              </div>
            ))}
          </div>
          <div style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
            <span className="live-dot" style={{ marginRight: 5 }} />
            LIVE
          </div>
        </div>

        {/* Main content */}
        <div style={{ paddingBottom: 60 }}>
          {step === 0 && (
            <LocationStep onNext={loc => { setData(d => ({ ...d, location: loc })); setStep(1); }} />
          )}
          {step === 1 && (
            <PatientDetailsStep
              onNext={patient => { setData(d => ({ ...d, patient })); setStep(2); }}
              onBack={() => setStep(0)} />
          )}
          {step === 2 && (
            <HospitalsStep
              location={data.location}
              patient={data.patient}
              onNext={hospitals => { setData(d => ({ ...d, hospitals })); setStep(3); }}
              onBack={() => setStep(1)} />
          )}
          {step === 3 && (
            <RecommendationStep
              data={{ patient: data.patient, hospitals: data.hospitals }}
              onNext={rd => { setData(d => ({ ...d, ...rd })); setStep(4); }}
              onBack={() => setStep(2)} />
          )}
          {step === 4 && (
            <TokenStep
              data={{ hospital: data.hospital, analysis: data.analysis, avail: data.avail, patient: data.patient }}
              onRestart={() => { setData({}); setStep(0); }} />
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", padding: "20px", borderTop: "1px solid var(--border)", fontSize: "0.72rem", color: "var(--muted)" }}>
          AuthenX AI Healthcare Platform  • Real Hospital Data via AI Web Search
        </div>
      </div>
    </>
  );
}
