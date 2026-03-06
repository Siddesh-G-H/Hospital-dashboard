import { useState, useEffect } from "react";

// ─── Demo Credentials ─────────────────────────────────────────────────────────
const USERS = {
  "admin@apollo.com": { 
    password: "admin123", 
    role: "Admin", 
    name: "Dr. Rajesh Kumar", 
    department: "Hospital Administration",
    hospital: "Apollo Hospital",
    location: "Bengaluru, Karnataka"
  },
  "doctor@apollo.com": { 
    password: "doctor123", 
    role: "Doctor", 
    name: "Dr. Priya Sharma", 
    department: "Emergency Medicine",
    hospital: "Apollo Hospital",
    location: "Bengaluru, Karnataka"
  },
  "reception@apollo.com": { 
    password: "reception123", 
    role: "Receptionist", 
    name: "Amit Patel", 
    department: "Front Desk",
    hospital: "Apollo Hospital",
    location: "Bengaluru, Karnataka"
  },
  // Different hospital examples
  "admin@fortis.com": { 
    password: "fortis123", 
    role: "Admin", 
    name: "Dr. Suresh Reddy", 
    department: "Hospital Administration",
    hospital: "Fortis Hospital",
    location: "Mumbai, Maharashtra"
  },
  "doctor@manipal.com": { 
    password: "manipal123", 
    role: "Doctor", 
    name: "Dr. Anjali Verma", 
    department: "Cardiology",
    hospital: "Manipal Hospital",
    location: "Bangalore, Karnataka"
  },
};

// ─── Demo Patient Data (starts empty) ────────────────────────────────────────
const INITIAL_PATIENTS = [];

// ─── Styles ───────────────────────────────────────────────────────────────────
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

    :root {
      --bg: #f8fafc;
      --surface: #ffffff;
      --border: #e2e8f0;
      --text: #0f172a;
      --text-muted: #64748b;
      --primary: #0ea5e9;
      --primary-dark: #0284c7;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --purple: #8b5cf6;
      --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; }
    body { 
      font-family: 'DM Sans', sans-serif; 
      color: var(--text); 
      background: var(--bg);
      line-height: 1.6;
    }

    ::-webkit-scrollbar { width: 8px; height: 8px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      box-shadow: var(--shadow);
      transition: all 0.2s;
    }
    .card:hover { box-shadow: var(--shadow-lg); }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-primary {
      background: var(--primary);
      color: white;
    }
    .btn-primary:hover { background: var(--primary-dark); transform: translateY(-1px); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

    .btn-success { background: var(--success); color: white; }
    .btn-success:hover { background: #059669; transform: translateY(-1px); }

    .btn-ghost {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text);
    }
    .btn-ghost:hover { background: var(--bg); border-color: var(--primary); }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      font-family: 'JetBrains Mono', monospace;
    }
    .badge-critical { background: #fee2e2; color: #991b1b; }
    .badge-high { background: #fed7aa; color: #9a3412; }
    .badge-medium { background: #fef3c7; color: #92400e; }
    .badge-low { background: #d1fae5; color: #065f46; }

    .badge-waiting { background: #f1f5f9; color: #475569; }
    .badge-in_progress { background: #dbeafe; color: #1e40af; }
    .badge-completed { background: #d1fae5; color: #065f46; }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
    }
    .status-dot.critical { background: var(--danger); animation: pulse 2s infinite; }
    .status-dot.high { background: var(--warning); }
    .status-dot.medium { background: #fbbf24; }
    .status-dot.low { background: var(--success); }

    .slide-up { animation: slideUp 0.3s ease; }
    .fade-in { animation: fadeIn 0.3s ease; }

    input, select {
      padding: 10px 14px;
      border: 1px solid var(--border);
      border-radius: 8px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      transition: all 0.2s;
      outline: none;
    }
    input:focus, select:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }
    .modal {
      background: var(--surface);
      border-radius: 16px;
      max-width: 700px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
      animation: slideUp 0.3s ease;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--border);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
  `}</style>
);

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setError("");
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const user = USERS[email.toLowerCase()];
      
      if (!user) {
        setError("Invalid email address");
        setLoading(false);
        return;
      }
      
      if (user.password !== password) {
        setError("Incorrect password");
        setLoading(false);
        return;
      }

      // Login successful - pass user data
      const userData = { email, ...user };
      setLoading(false);
      onLogin(userData);
    }, 500);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(to br, #0ea5e9 0%, #06b6d4 100%)",
      padding: 20
    }}>
      <div className="card" style={{ maxWidth: 440, width: "100%", padding: 40 }}>
        {/* Logo & Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            background: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            margin: "0 auto 20px",
            boxShadow: "0 8px 24px rgba(14, 165, 233, 0.3)"
          }}>🏥</div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 8 }}>
            Hospital Command Center
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: "block",
              fontSize: "0.85rem",
              fontWeight: 600,
              marginBottom: 8,
              color: "var(--text)"
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@apollo.com"
              required
              disabled={loading}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: "block",
              fontSize: "0.85rem",
              fontWeight: 600,
              marginBottom: 8,
              color: "var(--text)"
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
              style={{ width: "100%" }}
            />
          </div>

          {error && (
            <div style={{
              background: "#fee2e2",
              border: "1px solid #fecaca",
              padding: "12px 16px",
              borderRadius: 8,
              marginBottom: 20,
              fontSize: "0.85rem",
              color: "#991b1b",
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}
          
          <button
            type="submit"
            onClick={(e) => { e.preventDefault(); handleSubmit(); }}
            className="btn btn-primary"
            disabled={loading}
            style={{ width: "100%", padding: "12px", fontSize: "1rem" }}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>

          <div style={{
            marginTop: 20,
            background: "#f1f5f9",
            padding: 16,
            borderRadius: 8,
            fontSize: "0.85rem"
          }}>
            <strong>Demo Login Credentials</strong>

            <div style={{marginTop:10}}>
              <div>Admin</div>
              <div>Email: admin@apollo.com</div>
              <div>Password: admin123</div>
              <div>Email:  admin@fortis.com</div>
              <div>Password: fortis123</div>
            </div>

            <div style={{marginTop:10}}>
              <div>Doctor</div>
              <div>Email: doctor@apollo.com</div>
              <div>Password: doctor123</div>
              <div>Email: doctor@manipal.com</div>
              <div>Password: manipal123</div>
            </div>

            <div style={{marginTop:10}}>
              <div>Receptionist</div>
              <div>Email: reception@apollo.com</div>
              <div>Password: reception123</div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
function Dashboard({ user, onLogout }) {
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [selectedPatient, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  //const [specializationFilter, setSpecializationFilter] = useState("all");

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sort patients by priority
  const sortedPatients = [...patients].sort((a, b) => {
    const priorityMap = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    const pA = priorityMap[a.riskLevel] || 1;
    const pB = priorityMap[b.riskLevel] || 1;
    if (pA !== pB) return pB - pA;
    return a.tokenNumber - b.tokenNumber;
  });

  // Filter patients
  const filteredPatients = sortedPatients.filter(p => {
    const matchesStatus = filter === "all" || p.status === filter;
    //const matchesSpecialization =  specializationFilter === "all" || p.specialization === specializationFilter;
    const matchesDepartment = user.role !== "Doctor" || p.specialization === user.department;
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tokenNumber.toString().includes(searchQuery) ||
      p.symptoms.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch && matchesDepartment;
  });

  // Autofiltering patients
  // function detectDepartment(symptoms) {
  //   const s = symptoms.toLowerCase();

  //   if (s.includes("chest") || s.includes("heart")) return "Cardiology";
  //   if (s.includes("brain") || s.includes("dizziness")) return "Neurology";
  //   if (s.includes("knee") || s.includes("bone")) return "Orthopedics";
  //   if (s.includes("skin") || s.includes("rash")) return "Dermatology";

  //   return "General Medicine";
  // }

  // Stats
  const stats = {
    waiting: patients.filter(p => p.status === "waiting").length,
    inProgress: patients.filter(p => p.status === "in_progress").length,
    completed: patients.filter(p => p.status === "completed").length,
    critical: patients.filter(p => p.riskLevel === "Critical" && p.status !== "completed").length,
  };

  // Update patient status
  const updateStatus = (patientId, newStatus) => {
    setPatients(prev => prev.map(p => 
      p.id === patientId ? { ...p, status: newStatus } : p
    ));
    if (selectedPatient?.id === patientId) {
      setSelected(prev => ({ ...prev, status: newStatus }));
    }
  };

  // Add demo patients
  const addDemoData = () => {
    const demoPatients = [
      {
        id: "p001",
        tokenNumber: 101,
        name: "Rajesh Kumar",
        age: 45,
        gender: "Male",
        blood: "B+",
        phone: "+91-98765-43210",
        symptoms: "Severe chest pain radiating to left arm, shortness of breath, cold sweats",
        riskLevel: "Critical",
        specialization: "Cardiology",
        status: "waiting",
        painScale: 9,
        duration: "1-2 hours",
        existingConditions: ["Diabetes Type 2", "Hypertension"],
        allergies: "Penicillin",
        medications: "Metformin 500mg, Lisinopril 10mg",
        registeredAt: Date.now() - 1800000
      },
      {
        id: "p002",
        tokenNumber: 102,
        name: "Priya Sharma",
        age: 28,
        gender: "Female",
        blood: "O+",
        phone: "+91-98765-11111",
        symptoms: "High fever (103°F), severe headache, body ache, vomiting",
        riskLevel: "High",
        specialization: "General Medicine",
        status: "waiting",
        painScale: 7,
        duration: "2 days",
        existingConditions: [],
        allergies: "None",
        medications: "Paracetamol 650mg",
        registeredAt: Date.now() - 3600000
      },
      {
        id: "p003",
        tokenNumber: 103,
        name: "Amit Patel",
        age: 35,
        gender: "Male",
        blood: "A+",
        phone: "+91-98765-22222",
        symptoms: "Severe knee pain after fall, swelling, difficulty walking",
        riskLevel: "High",
        specialization: "Orthopedics",
        status: "waiting",
        painScale: 8,
        duration: "6 hours",
        existingConditions: [],
        allergies: "Sulfa drugs",
        medications: "Ibuprofen 400mg",
        registeredAt: Date.now() - 2700000
      },
      {
        id: "p004",
        tokenNumber: 104,
        name: "Sneha Reddy",
        age: 52,
        gender: "Female",
        blood: "AB+",
        phone: "+91-98765-33333",
        symptoms: "Severe abdominal pain, nausea, bloating after meals",
        riskLevel: "Medium",
        specialization: "Gastroenterology",
        status: "waiting",
        painScale: 6,
        duration: "1 day",
        existingConditions: ["Thyroid"],
        allergies: "None",
        medications: "Thyroxine 100mcg",
        registeredAt: Date.now() - 1200000
      },
      {
        id: "p005",
        tokenNumber: 105,
        name: "Vikram Singh",
        age: 22,
        gender: "Male",
        blood: "O-",
        phone: "+91-98765-44444",
        symptoms: "Skin rash on arms and legs, itching, redness",
        riskLevel: "Low",
        specialization: "Dermatology",
        status: "waiting",
        painScale: 3,
        duration: "5 days",
        existingConditions: [],
        allergies: "Latex",
        medications: "None",
        registeredAt: Date.now() - 600000
      },
      {
        id: "p006",
        tokenNumber: 106,
        name: "Meera Iyer",
        age: 67,
        gender: "Female",
        blood: "A-",
        phone: "+91-98765-55555",
        symptoms: "Dizziness, blurred vision, numbness in right hand",
        riskLevel: "Critical",
        specialization: "Neurology",
        status: "waiting",
        painScale: 5,
        duration: "3 hours",
        existingConditions: ["Hypertension", "High Cholesterol"],
        allergies: "None",
        medications: "Atorvastatin 20mg, Amlodipine 5mg",
        registeredAt: Date.now() - 900000
      }
    ];
    setPatients(demoPatients);
  };

  const currentPatient = patients.find(p => p.status === "in_progress");

  const formatTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  };

  return (
    <>
      <Styles />
      <div style={{ minHeight: "100vh", background: "linear-gradient(to br, #f8fafc 0%, #e0f2fe 100%)" }}>
        {/* Header */}
        <div style={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--border)",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              boxShadow: "0 4px 12px rgba(14, 165, 233, 0.3)"
            }}>🏥</div>
            <div>
              <h1 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: 2 }}>
                {user.hospital} Command
              </h1>
              <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {user.location} • Emergency & Critical Care
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
              </div>
            </div>
            <div style={{
              width: 1,
              height: 40,
              background: "var(--border)"
            }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #8b5cf6, #a78bfa)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 700,
                color: "white"
              }}>
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                  {user.name}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {user.role} • {user.department}
                </div>
              </div>
            </div>
            {patients.length === 0 && (
              <button className="btn btn-primary" style={{ padding: "8px 16px" }} onClick={addDemoData}>
                + Add Demo Patients
              </button>
            )}
            <button className="btn btn-ghost" style={{ padding: "8px 14px" }} onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>

        <div style={{ padding: 32, maxWidth: 1600, margin: "0 auto" }}>
          
          {/* Stats Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
            marginBottom: 32
          }}>
            {[
              { label: "Waiting", value: stats.waiting, icon: "⏱️", color: "#64748b", bg: "#f1f5f9" },
              { label: "In Progress", value: stats.inProgress, icon: "🩺", color: "#0ea5e9", bg: "#dbeafe" },
              { label: "Completed", value: stats.completed, icon: "✓", color: "#10b981", bg: "#d1fae5" },
              { label: "Critical Queue", value: stats.critical, icon: "🚨", color: "#ef4444", bg: "#fee2e2" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="card slide-up"
                style={{
                  padding: 24,
                  animationDelay: `${i * 0.05}s`,
                  borderLeft: `4px solid ${stat.color}`
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: 12,
                    background: stat.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    flexShrink: 0
                  }}>{stat.icon}</div>
                  <div>
                    <div style={{
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      marginBottom: 4,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em"
                    }}>
                      {stat.label}
                    </div>
                    <div style={{
                      fontSize: "2rem",
                      fontWeight: 700,
                      fontFamily: "'JetBrains Mono', monospace",
                      color: stat.color
                    }}>
                      {stat.value}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Current Patient Banner */}
          {currentPatient && (
            <div className="card fade-in" style={{
              padding: 24,
              marginBottom: 32,
              background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
              borderColor: "var(--primary)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  flexShrink: 0,
                  boxShadow: "0 4px 12px rgba(14, 165, 233, 0.3)"
                }}>👨‍⚕️</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      color: "var(--primary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em"
                    }}>
                      NOW TREATING
                    </span>
                    <span className={`badge badge-${currentPatient.riskLevel.toLowerCase()}`}>
                      {currentPatient.riskLevel}
                    </span>
                  </div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 4 }}>
                    {currentPatient.name} • Token #{currentPatient.tokenNumber}
                  </div>
                  <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                    {currentPatient.specialization} • {currentPatient.symptoms.slice(0, 60)}...
                  </div>
                </div>
                <button
                  className="btn btn-success"
                  onClick={() => updateStatus(currentPatient.id, "completed")}
                >
                  ✓ Complete Treatment
                </button>
              </div>
            </div>
          )}

          {/* Controls */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
            flexWrap: "wrap"
          }}>
            
            <input
              type="text"
              placeholder="🔍 Search patients by name, token, or symptoms..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ flex: 1, minWidth: 300 }}
            />
            {/* <select
              value={specializationFilter}
              onChange={(e) => setSpecializationFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Gastroenterology">Gastroenterology</option>
              <option value="General Medicine">General Medicine</option>
            </select> */}
            <div style={{ display: "flex", gap: 8 }}>
              {["all", "waiting", "in_progress", "completed"].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid",
                    borderColor: filter === f ? "var(--primary)" : "var(--border)",
                    borderRadius: 8,
                    background: filter === f ? "var(--primary)" : "transparent",
                    color: filter === f ? "white" : "var(--text)",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    transition: "all 0.2s"
                  }}
                >
                  {f.replace("_", " ").toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Patient Queue */}
          {filteredPatients.length === 0 ? (
            <div className="card" style={{ padding: 60, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 8 }}>
                No patients found
              </div>
              <div style={{ color: "var(--text-muted)" }}>
                {searchQuery ? "Try adjusting your search" : `No patients in ${filter} status`}
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {filteredPatients.map((p, i) => (
                <div
                  key={p.id}
                  className={`card slide-up ${p.status === "in_progress" ? "border-primary" : ""}`}
                  style={{
                    padding: 20,
                    animationDelay: `${i * 0.03}s`,
                    cursor: "pointer",
                    borderLeft: p.status === "in_progress" ? "4px solid var(--primary)" : ""
                  }}
                  onClick={() => setSelected(p)}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
                    {/* Token Badge */}
                    <div style={{
                      width: 60,
                      height: 60,
                      borderRadius: 12,
                      background: p.status === "in_progress"
                        ? "linear-gradient(135deg, #0ea5e9, #06b6d4)"
                        : "var(--bg)",
                      border: "2px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}>
                      <div style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 700,
                        fontSize: "1.1rem",
                        color: p.status === "in_progress" ? "white" : "var(--text)"
                      }}>
                        #{p.tokenNumber}
                      </div>
                    </div>

                    {/* Patient Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                        <span className={`status-dot ${p.riskLevel.toLowerCase()}`} />
                        <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                          {p.name}
                        </span>
                        <span className={`badge badge-${p.riskLevel.toLowerCase()}`}>
                          {p.riskLevel}
                        </span>
                        <span className={`badge badge-${p.status}`}>
                          {p.status === "in_progress" ? "IN PROGRESS" : p.status.toUpperCase()}
                        </span>
                      </div>

                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: 12,
                        marginBottom: 10
                      }}>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                          👤 {p.age}y • {p.gender} • 🩸 {p.blood}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                          📞 {p.phone}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                          🏥 {p.specialization}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                          ⏱ {formatTime(p.registeredAt)}
                        </div>
                      </div>

                      <div style={{
                        fontSize: "0.9rem",
                        color: "var(--text-muted)",
                        marginBottom: 12,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden"
                      }}>
                        <strong>Symptoms:</strong> {p.symptoms}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                      <button
                        className="btn btn-ghost"
                        onClick={(e) => { e.stopPropagation(); setSelected(p); }}
                        style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                      >
                        View Details
                      </button>
                      {p.status === "waiting" && !currentPatient && (
                        <button
                          className="btn btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStatus(p.id, "in_progress");
                          }}
                          style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                        >
                          Start Treatment
                        </button>
                      )}
                      {p.status === "in_progress" && (
                        <button
                          className="btn btn-success"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStatus(p.id, "completed");
                          }}
                          style={{ padding: "8px 16px", fontSize: "0.85rem" }}
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Patient Detail Modal */}
        {selectedPatient && (
          <div className="modal-backdrop" onClick={() => setSelected(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div style={{ padding: 32 }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                      <h2 style={{ fontSize: "1.6rem", fontWeight: 700 }}>
                        {selectedPatient.name}
                      </h2>
                      <span className={`badge badge-${selectedPatient.riskLevel.toLowerCase()}`}>
                        {selectedPatient.riskLevel} Risk
                      </span>
                    </div>
                    <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                      Token #{selectedPatient.tokenNumber} • {formatTime(selectedPatient.registeredAt)}
                    </div>
                  </div>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setSelected(null)}
                    style={{ padding: "8px 12px" }}
                  >
                    ✕
                  </button>
                </div>

                {/* Patient Details Grid */}
                <div style={{ display: "grid", gap: 24 }}>
                  {/* Personal Info */}
                  <div>
                    <h3 style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: 12
                    }}>
                      Personal Information
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                      {[
                        ["Age", `${selectedPatient.age} years`],
                        ["Gender", selectedPatient.gender],
                        ["Blood Group", selectedPatient.blood],
                        ["Phone", selectedPatient.phone],
                      ].map(([label, value]) => (
                        <div key={label} style={{ background: "var(--bg)", padding: 12, borderRadius: 8 }}>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 4 }}>
                            {label}
                          </div>
                          <div style={{ fontSize: "0.95rem", fontWeight: 600 }}>
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Medical History */}
                  {selectedPatient.existingConditions.length > 0 && (
                    <div>
                      <h3 style={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: 12
                      }}>
                        Existing Conditions
                      </h3>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {selectedPatient.existingConditions.map(c => (
                          <span key={c} style={{
                            background: "#fed7aa",
                            color: "#9a3412",
                            padding: "6px 12px",
                            borderRadius: 8,
                            fontSize: "0.85rem",
                            fontWeight: 600
                          }}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedPatient.allergies !== "None" && (
                    <div>
                      <h3 style={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: 12
                      }}>
                        Allergies
                      </h3>
                      <div style={{
                        background: "#fee2e2",
                        border: "1px solid #fecaca",
                        padding: 12,
                        borderRadius: 8,
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: "#991b1b"
                      }}>
                        ⚠️ {selectedPatient.allergies}
                      </div>
                    </div>
                  )}

                  {/* Symptoms */}
                  <div>
                    <h3 style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: 12
                    }}>
                      Current Symptoms
                    </h3>
                    <div style={{
                      background: "var(--bg)",
                      padding: 16,
                      borderRadius: 8
                    }}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                        <span style={{
                          background: "white",
                          padding: "4px 10px",
                          borderRadius: 6,
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          fontFamily: "'JetBrains Mono', monospace"
                        }}>
                          🏥 {selectedPatient.specialization}
                        </span>
                        <span style={{
                          background: "white",
                          padding: "4px 10px",
                          borderRadius: 6,
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          fontFamily: "'JetBrains Mono', monospace"
                        }}>
                          💢 Pain: {selectedPatient.painScale}/10
                        </span>
                        <span style={{
                          background: "white",
                          padding: "4px 10px",
                          borderRadius: 6,
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          fontFamily: "'JetBrains Mono', monospace"
                        }}>
                          ⏱ Duration: {selectedPatient.duration}
                        </span>
                      </div>
                      <div style={{ fontSize: "0.95rem", lineHeight: 1.7 }}>
                        {selectedPatient.symptoms}
                      </div>
                    </div>
                  </div>

                  {/* Current Medications */}
                  {selectedPatient.medications !== "None" && (
                    <div>
                      <h3 style={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: 12
                      }}>
                        Current Medications
                      </h3>
                      <div style={{
                        background: "var(--bg)",
                        padding: 12,
                        borderRadius: 8,
                        fontSize: "0.9rem"
                      }}>
                        💊 {selectedPatient.medications}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                    {selectedPatient.status === "waiting" && !currentPatient && (
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          updateStatus(selectedPatient.id, "in_progress");
                          setSelected(null);
                        }}
                        style={{ flex: 1 }}
                      >
                        ▶ Start Treatment
                      </button>
                    )}
                    {selectedPatient.status === "in_progress" && (
                      <button
                        className="btn btn-success"
                        onClick={() => {
                          updateStatus(selectedPatient.id, "completed");
                          setSelected(null);
                        }}
                        style={{ flex: 1 }}
                      >
                        ✓ Complete Treatment
                      </button>
                    )}
                    <button
                      className="btn btn-ghost"
                      onClick={() => setSelected(null)}
                      style={{ flex: 1 }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Main App with Authentication ────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return (
      <>
        <Styles />
        <LoginScreen onLogin={setUser} />
      </>
    );
  }

  return (
    <>
      <Styles />
      <Dashboard user={user} onLogout={() => setUser(null)} />
    </>
  );
}