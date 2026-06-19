import { useState, useEffect, useRef } from "react";

// ========== DESIGN TOKENS ==========
const C = {
  gold: "#A17136",
  goldLight: "#C4924A",
  goldDark: "#7A5628",
  goldGlow: "#A1713620",
  bg: "#F4EFE6",
  bgCard: "#FDFAF5",
  bgDark: "#0F1A12",
  bgDarkCard: "#162019",
  green: "#1A6B3A",
  greenLight: "#2D9955",
  greenMuted: "#1A6B3A22",
  text: "#1C1412",
  textMuted: "#6B5E4E",
  textLight: "#9B8E7E",
  border: "#E8DFD0",
  borderDark: "#2A3F2E",
  white: "#FFFFFF",
  danger: "#C0392B",
  warning: "#E67E22",
  safe: "#27AE60",
};

const PAGES = ["home","register","journey","assistant","risks","dashboard","accessibility","digital-twin","team"];

// ========== MOCK DATA ==========
const mockPilgrim = {
  name: "أحمد محمد الغامدي",
  age: 62,
  nationality: "سعودي",
  disability: "إعاقة حركية - كرسي متحرك",
  condition: "ضغط الدم / السكري",
  risk: "متوسط",
  riskLevel: 65,
  companion: "فاطمة الغامدي (زوجة)",
};

const nearbyServices = [
  { icon: "🏥", label: "مركز صحي الشميسي", dist: "٢٣٠م", color: C.green },
  { icon: "🚻", label: "دورة مياه مهيأة", dist: "٨٠م", color: C.gold },
  { icon: "🚑", label: "نقطة إسعاف طوارئ", dist: "١٥٠م", color: C.danger },
  { icon: "☕", label: "نقطة استراحة مكيفة", dist: "١٢٠م", color: C.goldLight },
  { icon: "♿", label: "عربة تنقل متاحة", dist: "٥٠م", color: C.green },
];

const riskData = [
  { label: "إجهاد حراري", value: 72, color: C.warning, icon: "🌡️" },
  { label: "ازدحام", value: 45, color: C.gold, icon: "👥" },
  { label: "فقدان المرافق", value: 20, color: C.safe, icon: "👤" },
  { label: "الإرهاق البدني", value: 60, color: C.warning, icon: "💪" },
];

const kpiData = [
  { label: "إجمالي الزوار", value: "١٢,٤٥٠", icon: "👥", delta: "+١٢%" },
  { label: "التنبيهات الوقائية", value: "٣,٢٧١", icon: "🔔", delta: "+٨%" },
  { label: "الخدمات المطلوبة", value: "٨,٩٠٠", icon: "🛎️", delta: "+٢٣%" },
  { label: "البلاغات المحلولة", value: "٩٨٪", icon: "✅", delta: "+٢%" },
];

const disabilityDist = [
  { label: "حركية", pct: 38, color: C.gold },
  { label: "بصرية", pct: 22, color: C.green },
  { label: "سمعية", pct: 18, color: C.goldLight },
  { label: "مزمنة", pct: 14, color: C.warning },
  { label: "أخرى", pct: 8, color: C.textLight },
];

const accessScores = [
  { label: "سهولة الوصول", score: 82, color: C.green },
  { label: "جودة التنقل", score: 74, color: C.gold },
  { label: "الخدمات الصحية", score: 91, color: C.greenLight },
  { label: "مستوى الأمان", score: 88, color: C.green },
];

const chatMessages = [
  { role: "assistant", text: "مرحبًا! أنا رفيق، مساعدك الصحي الذكي. كيف أستطيع مساعدتك اليوم؟ 🌙" },
];

// ========== HELPERS ==========
function GaugeChart({ value, color, size = 120 }) {
  const r = 46, cx = 60, cy = 60;
  const circ = 2 * Math.PI * r;
  const arc = (value / 100) * circ * 0.75;
  const offset = circ * 0.125;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 120 90" style={{ overflow: "visible" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth="10"
        strokeDasharray={`${circ * 0.75} ${circ * 0.25}`}
        strokeDashoffset={-offset} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
        strokeDasharray={`${arc} ${circ - arc}`}
        strokeDashoffset={-offset} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1.5s ease" }} />
      <text x={cx} y={cy + 6} textAnchor="middle" fill={color} fontSize="18" fontWeight="700"
        fontFamily="system-ui">{value}%</text>
    </svg>
  );
}

function ProgressBar({ value, color, label }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{label}</span>
        <span style={{ color, fontSize: 13, fontWeight: 700 }}>{value}%</span>
      </div>
      <div style={{ background: C.border, borderRadius: 99, height: 8 }}>
        <div style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 99, height: 8, transition: "width 1.5s ease" }} />
      </div>
    </div>
  );
}

function Card({ children, style = {}, glass = false }) {
  return (
    <div style={{
      background: glass ? "rgba(253,250,245,0.85)" : C.bgCard,
      backdropFilter: glass ? "blur(12px)" : "none",
      borderRadius: 20, border: `1px solid ${C.border}`,
      padding: 24, boxShadow: "0 4px 24px rgba(161,113,54,0.08)",
      ...style
    }}>{children}</div>
  );
}

function Badge({ color, children }) {
  return (
    <span style={{ background: color + "18", color, border: `1px solid ${color}44`,
      borderRadius: 99, padding: "3px 12px", fontSize: 12, fontWeight: 700 }}>
      {children}
    </span>
  );
}

function NavBtn({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: active ? C.gold : "transparent",
      color: active ? C.white : C.textMuted,
      border: `1px solid ${active ? C.gold : C.border}`,
      borderRadius: 10, padding: "6px 14px", fontSize: 13,
      cursor: "pointer", fontFamily: "inherit", fontWeight: active ? 700 : 500,
      transition: "all 0.2s",
    }}>{label}</button>
  );
}

// ========== ANIMATED LOGO ==========
function AdudLogo({ size = 52 }) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 1800);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 52 52">
        <defs>
          <radialGradient id="lg1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.goldLight} />
            <stop offset="100%" stopColor={C.goldDark} />
          </radialGradient>
        </defs>
        {/* Kaaba-inspired base */}
        <rect x="14" y="22" width="24" height="22" rx="3" fill="url(#lg1)" />
        {/* Arch / dome - medical + mosque */}
        <path d="M14 24 Q26 8 38 24" fill="none" stroke={C.goldLight} strokeWidth="2.5" strokeLinecap="round" />
        {/* Cross medical */}
        <rect x="23.5" y="27" width="5" height="12" rx="1.5" fill="white" opacity="0.9" />
        <rect x="19" y="31" width="14" height="5" rx="1.5" fill="white" opacity="0.9" />
        {/* Crescent */}
        <path d="M36 10 Q40 13 36 16 Q39 13 36 10Z" fill={C.goldLight} />
        {/* Pulse ring */}
        <circle cx="26" cy="26" r="24" fill="none" stroke={C.gold}
          strokeWidth="1.5" opacity={pulse ? 0.6 : 0}
          style={{ transition: "opacity 0.9s ease", transformOrigin: "center" }} />
      </svg>
    </div>
  );
}

// ========== DIGITAL TWIN AVATAR ==========
function DigitalTwinAvatar({ fatigue, heat, crowd }) {
  const [anim, setAnim] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setAnim(a => (a + 1) % 3), 800);
    return () => clearInterval(t);
  }, []);
  const bodyColor = fatigue > 70 ? "#e74c3c" : fatigue > 40 ? "#e67e22" : "#2ecc71";
  return (
    <svg width="160" height="260" viewBox="0 0 160 260">
      <defs>
        <radialGradient id="halo" cx="50%" cy="40%" r="40%">
          <stop offset="0%" stopColor={bodyColor} stopOpacity="0.25" />
          <stop offset="100%" stopColor={bodyColor} stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Halo */}
      <ellipse cx="80" cy="100" rx="55" ry="80" fill="url(#halo)" />
      {/* Body wireframe */}
      {/* Head */}
      <circle cx="80" cy="55" r="28" fill="none" stroke={bodyColor} strokeWidth="2.5" filter="url(#glow)" />
      <circle cx="72" cy="50" r="4" fill={bodyColor} opacity="0.7" />
      <circle cx="88" cy="50" r="4" fill={bodyColor} opacity="0.7" />
      <path d="M72 65 Q80 72 88 65" fill="none" stroke={bodyColor} strokeWidth="2" strokeLinecap="round" />
      {/* Torso */}
      <rect x="55" y="85" width="50" height="70" rx="12" fill="none" stroke={bodyColor} strokeWidth="2.5" filter="url(#glow)" />
      {/* Heart beat line */}
      <polyline points="60,120 65,120 68,108 71,132 74,120 80,120 83,112 86,128 89,120 100,120"
        fill="none" stroke={bodyColor} strokeWidth="2"
        strokeDasharray={anim === 0 ? "0,200" : anim === 1 ? "100,200" : "200,0"}
        style={{ transition: "stroke-dasharray 0.4s" }} />
      {/* Arms */}
      <line x1="55" y1="95" x2="28" y2="140" stroke={bodyColor} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="105" y1="95" x2="132" y2="140" stroke={bodyColor} strokeWidth="2.5" strokeLinecap="round" />
      {/* Legs */}
      <line x1="70" y1="155" x2="60" y2="230" stroke={bodyColor} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="90" y1="155" x2="100" y2="230" stroke={bodyColor} strokeWidth="2.5" strokeLinecap="round" />
      {/* Data dots */}
      {[...Array(6)].map((_, i) => (
        <circle key={i} cx={55 + i * 10} cy={88 + (i % 2) * 8} r="2" fill={bodyColor}
          opacity={anim === i % 3 ? 1 : 0.3} style={{ transition: "opacity 0.4s" }} />
      ))}
      {/* Wheelchair symbol if needed */}
      <circle cx="80" cy="248" r="8" fill="none" stroke={bodyColor} strokeWidth="2" opacity="0.5" />
      <circle cx="80" cy="248" r="3" fill={bodyColor} opacity="0.5" />
    </svg>
  );
}

// ========== HEAT MAP MOCK ==========
function HeatMap() {
  const cells = [];
  const levels = [0.1,0.3,0.5,0.7,0.9,0.6,0.4,0.8,0.3,0.2,0.9,0.7,0.5,0.4,0.6,
    0.8,0.2,0.1,0.5,0.9,0.3,0.7,0.4,0.6,0.2];
  for (let i = 0; i < 25; i++) {
    const v = levels[i];
    const r = Math.round(200 + v * 55);
    const g = Math.round(200 - v * 180);
    const b = 50;
    cells.push(
      <div key={i} style={{
        background: `rgba(${r},${g},${b},${0.4 + v * 0.6})`,
        borderRadius: 4, height: 32,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 10, color: "white", fontWeight: 700, cursor: "pointer",
        transition: "transform 0.2s",
      }}
        onMouseEnter={e => e.target.style.transform = "scale(1.15)"}
        onMouseLeave={e => e.target.style.transform = "scale(1)"}
      >{Math.round(v * 100)}%</div>
    );
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 4 }}>
      {cells}
    </div>
  );
}

// ========== PAGES ==========

// HOME
function PageHome({ nav }) {
  const [count, setCount] = useState({ visitors: 0, alerts: 0, score: 0, services: 0 });
  useEffect(() => {
    const targets = { visitors: 12450, alerts: 3271, score: 94, services: 48 };
    const dur = 2000, steps = 60;
    let step = 0;
    const t = setInterval(() => {
      step++;
      const p = step / steps;
      setCount({
        visitors: Math.round(targets.visitors * p),
        alerts: Math.round(targets.alerts * p),
        score: Math.round(targets.score * p),
        services: Math.round(targets.services * p),
      });
      if (step >= steps) clearInterval(t);
    }, dur / steps);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {/* HERO */}
      <div style={{
        background: `linear-gradient(135deg, ${C.bgDark} 0%, #0A1F10 40%, #162B18 100%)`,
        padding: "80px 32px 60px", textAlign: "center", position: "relative", overflow: "hidden",
        borderRadius: "0 0 40px 40px",
      }}>
        {/* Decorative circles */}
        {[200,350,500].map((s,i) => (
          <div key={i} style={{
            position:"absolute", width:s, height:s, borderRadius:"50%",
            border:`1px solid ${C.gold}${i===0?"40":"18"}`,
            top:"50%", left:"50%", transform:"translate(-50%,-50%)",
            animation:`pulse ${2+i}s ease-in-out infinite alternate`,
          }} />
        ))}
        <style>{`@keyframes pulse{from{opacity:0.3;transform:translate(-50%,-50%) scale(0.97)}to{opacity:1;transform:translate(-50%,-50%) scale(1.03)}}`}</style>
        <div style={{ position:"relative", zIndex:2 }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
            <AdudLogo size={80} />
          </div>
          <div style={{ fontSize:38, fontWeight:900, color:C.white, marginBottom:8, lineHeight:1.2,
            background:`linear-gradient(90deg, ${C.goldLight}, ${C.white}, ${C.green})`,
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            عضُد AI
          </div>
          <div style={{ color:C.gold, fontSize:14, letterSpacing:2, marginBottom:32 }}>Adud AI • ذكاء اصطناعي للحج والعمرة</div>
          <h1 style={{ fontSize:26, fontWeight:800, color:C.white, maxWidth:580, margin:"0 auto 20px",
            lineHeight:1.5 }}>
            رحلة صحية أكثر أمانًا وراحة للحجاج والمعتمرين من ذوي الإعاقة
          </h1>
          <p style={{ color:"#9DB5A0", fontSize:15, maxWidth:480, margin:"0 auto 40px", lineHeight:1.8 }}>
            منصة ذكاء اصطناعي متكاملة تضمن سلامة وراحة كل زائر لبيت الله الحرام
          </p>
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={() => nav("register")} style={{
              background:`linear-gradient(135deg, ${C.gold}, ${C.goldDark})`,
              color:C.white, border:"none", borderRadius:14, padding:"14px 32px",
              fontSize:16, fontWeight:700, cursor:"pointer", boxShadow:`0 8px 24px ${C.goldGlow}`,
              fontFamily:"inherit",
            }}>ابدأ رحلتك ✦</button>
            <button onClick={() => nav("dashboard")} style={{
              background:"rgba(255,255,255,0.08)", color:C.white,
              border:`1px solid rgba(255,255,255,0.2)`, borderRadius:14, padding:"14px 32px",
              fontSize:16, fontWeight:600, cursor:"pointer", backdropFilter:"blur(8px)",
              fontFamily:"inherit",
            }}>عرض لوحة التحكم</button>
          </div>
        </div>
      </div>

      {/* INTRO VIDEO PLACEHOLDER */}
      <div style={{ padding:"32px 24px 0" }}>
        <Card style={{ background:`linear-gradient(135deg, ${C.bgDark}, #162B18)`,
          border:`1px solid ${C.gold}33`, textAlign:"center", padding:0, overflow:"hidden" }}>
          <div style={{ padding:"40px 24px", position:"relative" }}>
            <div style={{ fontSize:48, marginBottom:12 }}>▶</div>
            <div style={{ color:C.white, fontSize:17, fontWeight:700, marginBottom:8 }}>
              فيديو تعريفي بمنصة عضُد AI
            </div>
            <div style={{ color:C.gold, fontSize:13 }}>شاهد كيف نُحوّل تجربة الحج والعمرة</div>
            <div style={{ position:"absolute", top:12, left:12 }}>
              <Badge color={C.danger}>LIVE</Badge>
            </div>
          </div>
          <div style={{ height:4, background:`linear-gradient(90deg, ${C.gold}, ${C.greenLight}, ${C.gold})`,
            animation:"shimmer 2s linear infinite" }} />
          <style>{`@keyframes shimmer{0%{background-position:0%}100%{background-position:200%}}`}</style>
        </Card>
      </div>

      {/* PROBLEM */}
      <div style={{ padding:"40px 24px 0" }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <Badge color={C.danger}>التحديات</Badge>
          <h2 style={{ fontSize:22, fontWeight:800, color:C.text, marginTop:10 }}>ما يواجهه ذوو الإعاقة أثناء الحج</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
          {[
            { icon:"♿", t:"صعوبة التنقل", d:"مسالك غير مهيأة" },
            { icon:"🏥", t:"الوصول للخدمات", d:"نقص نقاط الرعاية" },
            { icon:"👥", t:"الازدحام الشديد", d:"خطر على الحالات الحرجة" },
            { icon:"📋", t:"نقص المعلومات", d:"غياب التوجيه المخصص" },
          ].map((p,i) => (
            <Card key={i} style={{ textAlign:"center", padding:16 }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{p.icon}</div>
              <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:4 }}>{p.t}</div>
              <div style={{ fontSize:11, color:C.textMuted }}>{p.d}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* SOLUTIONS */}
      <div style={{ padding:"40px 24px 0" }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <Badge color={C.green}>الحلول</Badge>
          <h2 style={{ fontSize:22, fontWeight:800, color:C.text, marginTop:10 }}>ما تقدمه منصة عضُد AI</h2>
        </div>
        {[
          { icon:"🤖", t:"مساعد رفيق الذكي", d:"دعم نصي وصوتي بعدة لغات على مدار الساعة", color:C.gold },
          { icon:"🗺️", t:"تنقل ذكي ومهيأ", d:"خرائط تفاعلية مخصصة لذوي الإعاقة", color:C.green },
          { icon:"⚠️", t:"تنبؤ بالمخاطر", d:"ذكاء اصطناعي يتوقع المخاطر قبل وقوعها", color:C.warning },
          { icon:"💊", t:"خدمات صحية مخصصة", d:"توصيات طبية فورية حسب حالتك", color:C.goldLight },
          { icon:"📊", t:"تحليل البيانات الحي", d:"لوحات تحكم للجهات الحكومية", color:C.greenLight },
        ].map((s,i) => (
          <Card key={i} style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:12, padding:16 }}>
            <div style={{ width:48, height:48, borderRadius:14, background:s.color+"18",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:4 }}>{s.t}</div>
              <div style={{ fontSize:13, color:C.textMuted, lineHeight:1.6 }}>{s.d}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* IMPACT COUNTERS */}
      <div style={{ padding:"40px 24px 60px" }}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <Badge color={C.gold}>الأثر</Badge>
          <h2 style={{ fontSize:22, fontWeight:800, color:C.text, marginTop:10 }}>أرقام تُحدث فارقًا</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
          {[
            { label:"مستفيد", val:count.visitors.toLocaleString("ar"), icon:"👥", color:C.gold },
            { label:"تنبيه وقائي", val:count.alerts.toLocaleString("ar"), icon:"🛡️", color:C.green },
            { label:"تحسين التجربة", val:`${count.score}٪`, icon:"⭐", color:C.goldLight },
            { label:"خدمة مهيأة", val:count.services.toString(), icon:"🛎️", color:C.greenLight },
          ].map((k,i) => (
            <Card key={i} style={{ textAlign:"center", padding:20 }}>
              <div style={{ fontSize:26 }}>{k.icon}</div>
              <div style={{ fontSize:28, fontWeight:900, color:k.color, margin:"8px 0 4px" }}>{k.val}</div>
              <div style={{ fontSize:12, color:C.textMuted }}>{k.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// REGISTER
function PageRegister({ nav }) {
  const [form, setForm] = useState({
    name:"", age:"", gender:"ذكر", nationality:"سعودي",
    language:"العربية", disability:"", chronic:"", companion:""
  });
  const set = (k,v) => setForm(f => ({...f,[k]:v}));
  const fields = [
    { key:"name", label:"الاسم الكامل", type:"text", ph:"أحمد محمد الغامدي" },
    { key:"age", label:"العمر", type:"number", ph:"٦٢" },
    { key:"disability", label:"نوع الإعاقة", type:"text", ph:"إعاقة حركية - بصرية - سمعية..." },
    { key:"chronic", label:"الأمراض المزمنة", type:"text", ph:"السكري، الضغط، القلب..." },
    { key:"companion", label:"اسم المرافق وصلته", type:"text", ph:"فاطمة الغامدي - زوجة" },
  ];
  return (
    <div style={{ padding:"24px 20px 60px" }}>
      <div style={{ textAlign:"center", marginBottom:28 }}>
        <AdudLogo size={56} />
        <h1 style={{ fontSize:22, fontWeight:800, color:C.text, marginTop:12 }}>تسجيل الزائر</h1>
        <p style={{ color:C.textMuted, fontSize:14 }}>أدخل بياناتك لإنشاء رحلتك الصحية الذكية</p>
      </div>
      {fields.map(f => (
        <div key={f.key} style={{ marginBottom:16 }}>
          <label style={{ display:"block", fontSize:13, fontWeight:600, color:C.textMuted, marginBottom:6 }}>{f.label}</label>
          <input type={f.type} placeholder={f.ph} value={form[f.key]}
            onChange={e => set(f.key, e.target.value)}
            style={{ width:"100%", padding:"13px 16px", borderRadius:12, border:`1.5px solid ${C.border}`,
              background:C.bgCard, fontSize:14, color:C.text, fontFamily:"inherit",
              outline:"none", boxSizing:"border-box",
            }} />
        </div>
      ))}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        {[
          { key:"gender", label:"الجنس", opts:["ذكر","أنثى"] },
          { key:"language", label:"اللغة", opts:["العربية","English","اردو","বাংলা"] },
        ].map(s => (
          <div key={s.key}>
            <label style={{ display:"block", fontSize:13, fontWeight:600, color:C.textMuted, marginBottom:6 }}>{s.label}</label>
            <select value={form[s.key]} onChange={e => set(s.key,e.target.value)}
              style={{ width:"100%", padding:"13px 12px", borderRadius:12, border:`1.5px solid ${C.border}`,
                background:C.bgCard, fontSize:14, color:C.text, fontFamily:"inherit" }}>
              {s.opts.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>
      <button onClick={() => nav("journey")} style={{
        width:"100%", padding:"16px", background:`linear-gradient(135deg,${C.gold},${C.goldDark})`,
        color:C.white, border:"none", borderRadius:14, fontSize:17, fontWeight:700,
        cursor:"pointer", fontFamily:"inherit", marginTop:8,
        boxShadow:`0 8px 24px ${C.goldGlow}`,
      }}>إنشاء الرحلة الصحية ✦</button>
    </div>
  );
}

// JOURNEY
function PageJourney() {
  return (
    <div style={{ padding:"20px 20px 60px" }}>
      <h1 style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:4 }}>رحلتك الصحية الذكية</h1>
      <p style={{ color:C.textMuted, fontSize:13, marginBottom:20 }}>مخصصة لحالتك الصحية • مكة المكرمة</p>

      {/* Pilgrim Card */}
      <Card style={{ background:`linear-gradient(135deg,${C.bgDark},#162B18)`, marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ color:C.gold, fontSize:11, fontWeight:700, marginBottom:6 }}>ملف الزائر</div>
            <div style={{ color:C.white, fontSize:17, fontWeight:700 }}>{mockPilgrim.name}</div>
            <div style={{ color:"#9DB5A0", fontSize:12, marginTop:4 }}>{mockPilgrim.disability}</div>
            <div style={{ color:"#9DB5A0", fontSize:12 }}>{mockPilgrim.condition}</div>
          </div>
          <div style={{ textAlign:"center" }}>
            <GaugeChart value={mockPilgrim.riskLevel} color={C.warning} size={80} />
            <div style={{ color:C.warning, fontSize:10, fontWeight:700 }}>مستوى الخطورة</div>
          </div>
        </div>
        <div style={{ marginTop:12, display:"flex", gap:8 }}>
          <Badge color={C.warning}>{mockPilgrim.risk}</Badge>
          <Badge color={C.greenLight}>{mockPilgrim.companion}</Badge>
        </div>
      </Card>

      {/* Map */}
      <Card style={{ marginBottom:16, padding:0, overflow:"hidden" }}>
        <div style={{ background:`linear-gradient(135deg,#1a2f1e,#0d1f11)`, padding:"20px 20px 0",
          height:200, position:"relative" }}>
          <div style={{ color:C.gold, fontSize:12, fontWeight:700, marginBottom:8 }}>
            🗺️ خريطة تفاعلية • مكة المكرمة
          </div>
          {/* Mock map grid */}
          <div style={{ position:"absolute", inset:0, opacity:0.2 }}>
            {[...Array(8)].map((_,i) => (
              <div key={i} style={{ position:"absolute", width:"100%", height:1,
                background:C.green, top:`${i*14+5}%` }} />
            ))}
            {[...Array(8)].map((_,i) => (
              <div key={i} style={{ position:"absolute", height:"100%", width:1,
                background:C.green, left:`${i*14+5}%` }} />
            ))}
          </div>
          {/* Location dots */}
          <div style={{ position:"absolute", top:"35%", left:"48%", width:14, height:14,
            borderRadius:"50%", background:C.gold, border:"3px solid white",
            boxShadow:"0 0 12px "+C.gold }} title="موقعك" />
          {[{top:"20%",left:"30%",c:C.green},{top:"55%",left:"65%",c:C.danger},
            {top:"70%",left:"25%",c:C.goldLight}].map((d,i) => (
            <div key={i} style={{ position:"absolute", ...d, width:10, height:10,
              borderRadius:"50%", background:d.c, border:"2px solid white" }} />
          ))}
          <div style={{ position:"absolute", bottom:12, left:12 }}>
            <Badge color={C.gold}>موقعك الحالي</Badge>
          </div>
        </div>
      </Card>

      {/* Nearby Services */}
      <div style={{ marginBottom:16 }}>
        <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:12 }}>أقرب الخدمات إليك</div>
        {nearbyServices.map((s,i) => (
          <Card key={i} style={{ display:"flex", alignItems:"center", gap:14, marginBottom:10, padding:14 }}>
            <div style={{ fontSize:24 }}>{s.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{s.label}</div>
            </div>
            <Badge color={s.color}>{s.dist}</Badge>
          </Card>
        ))}
      </div>

      {/* AI Recommendations */}
      <Card style={{ background:`linear-gradient(135deg,${C.greenMuted},${C.goldGlow})` }}>
        <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:14 }}>
          🤖 توصيات الذكاء الاصطناعي
        </div>
        {[
          { icon:"💧", text:"اشرب ٢٥٠مل ماء كل ٢٠ دقيقة لتجنب الجفاف" },
          { icon:"🕐", text:"خذ استراحة لا تقل عن ١٥ دقيقة كل ساعة" },
          { icon:"⏰", text:"أفضل وقت للتنقل: ٨-١١ صباحًا و٨ مساءً فأكثر" },
          { icon:"♿", text:"مسار الكرسي المتحرك متاح عبر البوابة الغربية" },
        ].map((r,i) => (
          <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:12 }}>
            <span style={{ fontSize:18 }}>{r.icon}</span>
            <span style={{ fontSize:13, color:C.text, lineHeight:1.6 }}>{r.text}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ASSISTANT
function PageAssistant() {
  const [msgs, setMsgs] = useState(chatMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const suggestions = ["أشعر بالإرهاق","أنا كفيف وأحتاج أقرب خدمة","أين أقرب مركز صحي؟","كيف أصل للمسعى؟"];

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    const newMsgs = [...msgs, { role:"user", text:msg }];
    setMsgs(newMsgs);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
          model:"claude-sonnet-4-6", max_tokens:400,
          system:`أنت "رفيق" - المساعد الذكي لمنصة عضُد AI للحجاج والمعتمرين من ذوي الإعاقة في مكة المكرمة. 
          أجب بالعربية بشكل ودود ومفيد وموجز. قدم نصائح صحية عملية ومعلومات عن الخدمات المتاحة.
          استخدم الرموز التعبيرية المناسبة.`,
          messages:[...newMsgs.map(m => ({ role:m.role==="assistant"?"assistant":"user", content:m.text }))]
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "أعتذر، حدث خطأ. حاول مرة أخرى.";
      setMsgs(m => [...m, { role:"assistant", text:reply }]);
    } catch {
      setMsgs(m => [...m, { role:"assistant", text:"أعتذر، حدث خطأ في الاتصال. يرجى المحاولة مجددًا." }]);
    }
    setLoading(false);
  };

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, loading]);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"calc(100vh - 120px)" }}>
      {/* Header */}
      <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`,
        background:C.bgCard, display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:44, height:44, borderRadius:"50%",
          background:`linear-gradient(135deg,${C.gold},${C.goldDark})`,
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>🤖</div>
        <div>
          <div style={{ fontSize:16, fontWeight:700, color:C.text }}>رفيق</div>
          <div style={{ fontSize:12, color:C.green }}>● متصل الآن • يدعم العربية والإنجليزية والأردية</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"16px 20px" }}>
        {msgs.map((m,i) => (
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-start":"flex-end",
            marginBottom:14 }}>
            <div style={{
              maxWidth:"78%", padding:"12px 16px", borderRadius:m.role==="user"?"18px 18px 18px 4px":"18px 18px 4px 18px",
              background:m.role==="user" ? `linear-gradient(135deg,${C.gold},${C.goldDark})` : C.bgCard,
              color:m.role==="user" ? C.white : C.text,
              border:m.role==="assistant" ? `1px solid ${C.border}` : "none",
              fontSize:14, lineHeight:1.7, boxShadow:"0 2px 8px rgba(0,0,0,0.08)",
            }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:14 }}>
            <div style={{ padding:"12px 20px", borderRadius:"18px 18px 4px 18px",
              background:C.bgCard, border:`1px solid ${C.border}`, color:C.textMuted, fontSize:14 }}>
              رفيق يفكر...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      <div style={{ padding:"8px 20px 0", display:"flex", gap:8, overflowX:"auto" }}>
        {suggestions.map((s,i) => (
          <button key={i} onClick={() => send(s)} style={{
            whiteSpace:"nowrap", padding:"7px 14px", borderRadius:99,
            border:`1px solid ${C.gold}44`, background:C.bgCard,
            color:C.gold, fontSize:12, cursor:"pointer", fontFamily:"inherit", fontWeight:600,
          }}>{s}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{ padding:"12px 20px 20px", display:"flex", gap:10 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==="Enter" && send()}
          placeholder="اكتب سؤالك هنا..."
          style={{ flex:1, padding:"13px 16px", borderRadius:14, border:`1.5px solid ${C.border}`,
            background:C.bgCard, fontSize:14, color:C.text, fontFamily:"inherit", outline:"none" }} />
        <button onClick={() => send()} style={{
          width:48, height:48, borderRadius:14, background:`linear-gradient(135deg,${C.gold},${C.goldDark})`,
          border:"none", cursor:"pointer", fontSize:20, display:"flex", alignItems:"center", justifyContent:"center",
        }}>➤</button>
      </div>
    </div>
  );
}

// RISKS
function PageRisks() {
  return (
    <div style={{ padding:"20px 20px 60px" }}>
      <h1 style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:4 }}>التنبؤ بالمخاطر</h1>
      <p style={{ color:C.textMuted, fontSize:13, marginBottom:20 }}>تحليل لحظي مدعوم بالذكاء الاصطناعي</p>

      {/* Overall Risk */}
      <Card style={{ textAlign:"center", marginBottom:16,
        background:`linear-gradient(135deg,${C.bgDark},#1A1A0E)` }}>
        <div style={{ color:C.gold, fontSize:12, fontWeight:700, marginBottom:8 }}>مؤشر الخطر اللحظي</div>
        <GaugeChart value={62} color={C.warning} size={140} />
        <div style={{ color:C.white, fontSize:18, fontWeight:800, marginTop:8 }}>خطر متوسط</div>
        <div style={{ color:"#9DB5A0", fontSize:12, marginTop:4 }}>التحديث كل ٣٠ ثانية</div>
        <div style={{ display:"flex", gap:8, justifyContent:"center", marginTop:12 }}>
          <Badge color={C.safe}>آمن &lt;40%</Badge>
          <Badge color={C.warning}>متوسط 40-70%</Badge>
          <Badge color={C.danger}>عالي &gt;70%</Badge>
        </div>
      </Card>

      {/* Risk Cards */}
      {riskData.map((r,i) => (
        <Card key={i} style={{ marginBottom:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
            <span style={{ fontSize:24 }}>{r.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{r.label}</div>
            </div>
            <Badge color={r.color}>{r.value}%</Badge>
          </div>
          <ProgressBar value={r.value} color={r.color} label="" />
        </Card>
      ))}

      {/* Timeline Forecast */}
      <Card style={{ marginTop:8 }}>
        <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:14 }}>
          📈 توقعات الساعات القادمة
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
          {[
            { t:"الآن", v:62, c:C.warning },
            { t:"+١س", v:71, c:C.danger },
            { t:"+٢س", v:58, c:C.warning },
            { t:"+٣س", v:40, c:C.safe },
          ].map((f,i) => (
            <div key={i} style={{ textAlign:"center", padding:"12px 8px", borderRadius:12,
              background:f.c+"12", border:`1px solid ${f.c}33` }}>
              <div style={{ fontSize:11, color:C.textMuted, marginBottom:4 }}>{f.t}</div>
              <div style={{ fontSize:20, fontWeight:800, color:f.c }}>{f.v}%</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// DASHBOARD
function PageDashboard() {
  return (
    <div style={{ padding:"20px 20px 60px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div>
          <h1 style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:2 }}>لوحة التحكم</h1>
          <p style={{ color:C.textMuted, fontSize:12 }}>الجهات الحكومية • بيانات حية</p>
        </div>
        <Badge color={C.green}>🟢 مباشر</Badge>
      </div>

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
        {kpiData.map((k,i) => (
          <Card key={i} style={{ padding:16 }}>
            <div style={{ fontSize:22 }}>{k.icon}</div>
            <div style={{ fontSize:22, fontWeight:900, color:C.gold, margin:"6px 0 2px" }}>{k.value}</div>
            <div style={{ fontSize:11, color:C.textMuted, marginBottom:4 }}>{k.label}</div>
            <Badge color={C.green}>{k.delta}</Badge>
          </Card>
        ))}
      </div>

      {/* Disability Distribution */}
      <Card style={{ marginBottom:16 }}>
        <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:14 }}>توزيع أنواع الإعاقات</div>
        {disabilityDist.map((d,i) => (
          <ProgressBar key={i} value={d.pct} color={d.color} label={d.label} />
        ))}
      </Card>

      {/* Services Usage */}
      <Card style={{ marginBottom:16 }}>
        <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:14 }}>أكثر الخدمات استخدامًا</div>
        {[
          { label:"المساعد الذكي رفيق", val:4821, pct:89 },
          { label:"خرائط التنقل", val:3902, pct:72 },
          { label:"التنبيهات الصحية", val:2640, pct:49 },
          { label:"طلب المساعدة", val:1780, pct:33 },
        ].map((s,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:C.gold+"18",
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>
              {["🤖","🗺️","🔔","🆘"][i]}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight:600, color:C.text, marginBottom:3 }}>{s.label}</div>
              <div style={{ background:C.border, borderRadius:99, height:6 }}>
                <div style={{ width:`${s.pct}%`, height:6, borderRadius:99,
                  background:`linear-gradient(90deg,${C.gold}88,${C.gold})` }} />
              </div>
            </div>
            <div style={{ fontSize:13, fontWeight:700, color:C.gold, flexShrink:0 }}>
              {s.val.toLocaleString("ar")}
            </div>
          </div>
        ))}
      </Card>

      {/* Heat Map */}
      <Card>
        <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:8 }}>
          🗺️ خريطة الحرارة • الازدحام
        </div>
        <div style={{ fontSize:11, color:C.textMuted, marginBottom:12 }}>المسجد الحرام وما حوله</div>
        <HeatMap />
        <div style={{ display:"flex", gap:8, marginTop:12, justifyContent:"center" }}>
          <Badge color={C.safe}>منخفض</Badge>
          <Badge color={C.warning}>متوسط</Badge>
          <Badge color={C.danger}>مرتفع</Badge>
        </div>
      </Card>
    </div>
  );
}

// ACCESSIBILITY SCORE
function PageAccessibility() {
  return (
    <div style={{ padding:"20px 20px 60px" }}>
      <h1 style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:4 }}>مؤشر الإتاحة</h1>
      <p style={{ color:C.textMuted, fontSize:13, marginBottom:20 }}>جاهزية المواقع والخدمات لذوي الإعاقة</p>

      {/* Overall Score */}
      <Card style={{ textAlign:"center", marginBottom:20,
        background:`linear-gradient(135deg,${C.green}0A,${C.goldGlow})` }}>
        <div style={{ fontSize:13, fontWeight:700, color:C.textMuted, marginBottom:4 }}>المؤشر العام</div>
        <div style={{ fontSize:64, fontWeight:900, color:C.green, lineHeight:1 }}>٨٣</div>
        <div style={{ fontSize:18, color:C.textMuted }}>/١٠٠</div>
        <div style={{ margin:"12px 0" }}><Badge color={C.green}>ممتاز</Badge></div>
        <div style={{ color:C.textMuted, fontSize:13 }}>بناءً على تقييم ٤ معايير رئيسية</div>
      </Card>

      {/* Score Details */}
      {accessScores.map((s,i) => (
        <Card key={i} style={{ marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{s.label}</div>
            <div style={{ fontSize:22, fontWeight:900, color:s.color }}>{s.score}</div>
          </div>
          <ProgressBar value={s.score} color={s.color} label="" />
        </Card>
      ))}

      {/* Location Scores */}
      <Card>
        <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:14 }}>تقييم المواقع</div>
        {[
          { loc:"المسجد الحرام", score:92, badge:"ممتاز" },
          { loc:"السعي المشاة", score:78, badge:"جيد جدًا" },
          { loc:"منى", score:65, badge:"جيد" },
          { loc:"عرفات", score:71, badge:"جيد" },
          { loc:"مزدلفة", score:58, badge:"متوسط" },
        ].map((l,i) => (
          <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
            paddingBottom:12, marginBottom:12,
            borderBottom: i<4 ? `1px solid ${C.border}` : "none" }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{l.loc}</div>
              <div style={{ fontSize:11, color:C.textMuted, marginTop:2 }}>تحديث اليوم</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ fontSize:18, fontWeight:800,
                color:l.score>80?C.green:l.score>65?C.warning:C.danger }}>{l.score}%</div>
              <Badge color={l.score>80?C.green:l.score>65?C.warning:C.danger}>{l.badge}</Badge>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// DIGITAL TWIN
function PageDigitalTwin() {
  const [fatigue, setFatigue] = useState(58);
  const [heat, setHeat] = useState(72);
  const [crowd, setCrowd] = useState(45);

  useEffect(() => {
    const t = setInterval(() => {
      setFatigue(f => Math.min(100, Math.max(20, f + (Math.random()-0.5)*4)));
      setHeat(h => Math.min(100, Math.max(30, h + (Math.random()-0.5)*3)));
      setCrowd(c => Math.min(100, Math.max(10, c + (Math.random()-0.5)*5)));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const riskColor = fatigue > 70 ? C.danger : fatigue > 40 ? C.warning : C.safe;

  return (
    <div style={{ padding:"20px 20px 60px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
        <h1 style={{ fontSize:20, fontWeight:800, color:C.text }}>التوأم الرقمي للحاج</h1>
        <Badge color={C.green}>AI</Badge>
      </div>
      <p style={{ color:C.textMuted, fontSize:13, marginBottom:20 }}>مجسم رقمي حي يعكس حالتك الصحية اللحظية</p>

      {/* Twin Display */}
      <Card style={{ background:`linear-gradient(135deg,${C.bgDark},#0A1F10)`, marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <DigitalTwinAvatar fatigue={fatigue} heat={heat} crowd={crowd} />
          <div style={{ flex:1 }}>
            <div style={{ color:C.gold, fontSize:12, fontWeight:700, marginBottom:10 }}>
              {mockPilgrim.name}
            </div>
            <div style={{ marginBottom:14 }}>
              <div style={{ color:"#9DB5A0", fontSize:11, marginBottom:4 }}>مستوى الإرهاق</div>
              <ProgressBar value={Math.round(fatigue)} color={riskColor} label="" />
            </div>
            <div style={{ marginBottom:14 }}>
              <div style={{ color:"#9DB5A0", fontSize:11, marginBottom:4 }}>الإجهاد الحراري</div>
              <ProgressBar value={Math.round(heat)} color={C.warning} label="" />
            </div>
            <div>
              <div style={{ color:"#9DB5A0", fontSize:11, marginBottom:4 }}>الازدحام المحيط</div>
              <ProgressBar value={Math.round(crowd)} color={C.gold} label="" />
            </div>
          </div>
        </div>
      </Card>

      {/* Next Hour Predictions */}
      <Card style={{ marginBottom:16, background:`linear-gradient(135deg,#1A1A2E,#16213E)` }}>
        <div style={{ fontSize:14, fontWeight:700, color:C.white, marginBottom:14 }}>
          🔮 التوقعات خلال الساعة القادمة
        </div>
        {[
          { icon:"💓", label:"معدل القلب", now:"٨٨ ض/د", pred:"٩٤ ض/د", trend:"↑", c:C.warning },
          { icon:"🌡️", label:"درجة الحرارة", now:"٣٩.١°", pred:"٣٩.٤°", trend:"↑", c:C.danger },
          { icon:"😴", label:"مستوى النشاط", now:"٤٢٪", pred:"٣١٪", trend:"↓", c:C.gold },
          { icon:"📍", label:"الموقع", now:"الحرم", pred:"السعي", trend:"→", c:C.green },
        ].map((p,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12,
            paddingBottom:12, borderBottom: i<3 ? `1px solid rgba(255,255,255,0.08)` : "none" }}>
            <span style={{ fontSize:20 }}>{p.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, color:"#9DB5A0" }}>{p.label}</div>
              <div style={{ fontSize:13, color:"white", fontWeight:600 }}>{p.now}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:11, color:"#9DB5A0" }}>متوقع</div>
              <div style={{ fontSize:13, color:p.c, fontWeight:700 }}>{p.trend} {p.pred}</div>
            </div>
          </div>
        ))}
      </Card>

      {/* Preventive Alerts */}
      <Card>
        <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:14 }}>
          🛡️ التنبيهات الوقائية المقترحة
        </div>
        {[
          { priority:"عالية", text:"توقف للاستراحة خلال ١٥ دقيقة - مستوى الإرهاق مرتفع", color:C.danger, icon:"⚠️" },
          { priority:"متوسطة", text:"اشرب ماءً الآن - خطر جفاف محتمل", color:C.warning, icon:"💧" },
          { priority:"منخفضة", text:"تجنب مسار الشمال - ازدحام ٧٨٪", color:C.gold, icon:"🔀" },
        ].map((a,i) => (
          <div key={i} style={{ display:"flex", gap:12, padding:"12px 0",
            borderBottom: i<2 ? `1px solid ${C.border}` : "none" }}>
            <span style={{ fontSize:20 }}>{a.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, color:C.text, lineHeight:1.6 }}>{a.text}</div>
              <Badge color={a.color} style={{ marginTop:6, display:"inline-block" }}>{a.priority}</Badge>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// TEAM
function PageTeam() {
  return (
    <div style={{ padding:"20px 20px 60px" }}>
      <div style={{ textAlign:"center", marginBottom:32 }}>
        <AdudLogo size={64} />
        <h1 style={{ fontSize:24, fontWeight:900, color:C.text, marginTop:12 }}>فريق عضُد</h1>
        <p style={{ color:C.textMuted, fontSize:14, marginTop:6 }}>العقول المبدعة خلف المنصة</p>
      </div>

      {[
        {
          name:"بتول الزهراني",
          role:"مصممة تجربة وواجهة مستخدم UI/UX",
          emoji:"🎨",
          bio:"مصممة حاصدة على جوائز محلية ودولية في مجال تصميم تجربة المستخدم، متخصصة في بناء منتجات رقمية تُحدث أثرًا إنسانيًا حقيقيًا.",
          awards:["🏆 جائزة التميز في التصميم العربي", "🌍 جائزة أفضل تجربة مستخدم دولية"],
          skills:["UX Research","UI Design","Prototyping","Accessibility"],
          color:C.gold,
        },
        {
          name:"منال الفهمي",
          role:"أخصائية اجتماعية • رائدة أعمال ناشئة",
          emoji:"🌱",
          bio:"رائدة أعمال ناشئة وأخصائية اجتماعية حاصلة على جوائز في البحث والابتكار، تُوظّف خبرتها في خدمة ذوي الإعاقة لتمكينهم وتحقيق الشمولية الرقمية.",
          awards:["🏅 جائزة الابتكار الاجتماعي", "🔬 جائزة التميز البحثي"],
          skills:["Social Innovation","Research","Entrepreneurship","Accessibility Advocacy"],
          color:C.green,
        },
      ].map((m,i) => (
        <Card key={i} style={{ marginBottom:20, overflow:"hidden", padding:0 }}>
          <div style={{ height:80, background:`linear-gradient(135deg,${m.color}22,${m.color}44)`,
            display:"flex", alignItems:"flex-end", padding:"0 24px 0" }}>
            <div style={{ width:72, height:72, borderRadius:"50%",
              background:`linear-gradient(135deg,${m.color},${m.color}AA)`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:32, transform:"translateY(36px)",
              border:"4px solid white", boxShadow:`0 8px 24px ${m.color}44` }}>
              {m.emoji}
            </div>
          </div>
          <div style={{ padding:"48px 24px 24px" }}>
            <div style={{ fontSize:20, fontWeight:800, color:C.text, marginBottom:2 }}>{m.name}</div>
            <div style={{ color:m.color, fontSize:13, fontWeight:600, marginBottom:12 }}>{m.role}</div>
            <div style={{ fontSize:13, color:C.textMuted, lineHeight:1.8, marginBottom:16 }}>{m.bio}</div>
            <div style={{ marginBottom:14 }}>
              {m.awards.map((a,j) => (
                <div key={j} style={{ fontSize:13, color:C.text, padding:"8px 0",
                  borderBottom: j===0 ? `1px solid ${C.border}` : "none" }}>{a}</div>
              ))}
            </div>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {m.skills.map((s,j) => (
                <Badge key={j} color={m.color}>{s}</Badge>
              ))}
            </div>
          </div>
        </Card>
      ))}

      {/* Vision */}
      <Card style={{ background:`linear-gradient(135deg,${C.bgDark},#162B18)`, textAlign:"center" }}>
        <div style={{ fontSize:32, marginBottom:12 }}>🕌</div>
        <div style={{ color:C.gold, fontSize:16, fontWeight:700, marginBottom:8 }}>رسالتنا</div>
        <div style={{ color:"#9DB5A0", fontSize:14, lineHeight:1.9 }}>
          نؤمن بأن كل حاج ومعتمر من ذوي الإعاقة يستحق تجربة روحانية آمنة وكريمة. 
          عضُد AI ليس مجرد منصة، بل هو عهد بالرعاية والاحترام لكل إنسان.
        </div>
        <div style={{ color:C.gold, fontSize:22, marginTop:16 }}>✦ رؤية المملكة ٢٠٣٠ ✦</div>
      </Card>
    </div>
  );
}

// ========== NAV CONFIG ==========
const navItems = [
  { id:"home", label:"الرئيسية", icon:"🏠" },
  { id:"register", label:"تسجيل", icon:"📋" },
  { id:"journey", label:"رحلتي", icon:"🗺️" },
  { id:"assistant", label:"رفيق", icon:"🤖" },
  { id:"risks", label:"المخاطر", icon:"⚠️" },
  { id:"dashboard", label:"التحكم", icon:"📊" },
  { id:"accessibility", label:"الإتاحة", icon:"♿" },
  { id:"digital-twin", label:"التوأم", icon:"🔮" },
  { id:"team", label:"الفريق", icon:"👥" },
];

// ========== MAIN APP ==========
export default function AdudAI() {
  const [page, setPage] = useState("home");
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = (p) => { setPage(p); setMenuOpen(false); window.scrollTo(0,0); };

  const pageMap = {
    home: <PageHome nav={nav} />,
    register: <PageRegister nav={nav} />,
    journey: <PageJourney />,
    assistant: <PageAssistant />,
    risks: <PageRisks />,
    dashboard: <PageDashboard />,
    accessibility: <PageAccessibility />,
    "digital-twin": <PageDigitalTwin />,
    team: <PageTeam />,
  };

  const currentNav = navItems.find(n => n.id === page);

  return (
    <div dir="rtl" style={{
      fontFamily: "'Segoe UI', 'Cairo', Arial, sans-serif",
      background: dark ? C.bgDark : C.bg,
      minHeight: "100vh", maxWidth: 480, margin: "0 auto",
      position: "relative",
      color: dark ? C.white : C.text,
    }}>
      {/* TOP NAV */}
      <div style={{
        position:"sticky", top:0, zIndex:100,
        background: dark ? "rgba(15,26,18,0.95)" : "rgba(244,239,230,0.95)",
        backdropFilter:"blur(12px)",
        borderBottom:`1px solid ${dark ? C.borderDark : C.border}`,
        padding:"12px 20px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }} onClick={() => nav("home")}
          style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:10 }}>
          <AdudLogo size={36} />
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:C.gold }}>عضُد AI</div>
            <div style={{ fontSize:10, color:C.textMuted }}>Adud AI</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <button onClick={() => setDark(d => !d)} style={{
            background:"none", border:`1px solid ${C.border}`, borderRadius:8,
            padding:"6px 10px", cursor:"pointer", fontSize:16,
          }}>{dark ? "☀️" : "🌙"}</button>
          <button onClick={() => setMenuOpen(m => !m)} style={{
            background:C.gold, border:"none", borderRadius:8,
            padding:"6px 10px", cursor:"pointer", fontSize:16, color:C.white,
          }}>☰</button>
        </div>
      </div>

      {/* SLIDE MENU */}
      {menuOpen && (
        <div style={{
          position:"fixed", inset:0, zIndex:200,
          background:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)",
        }} onClick={() => setMenuOpen(false)}>
          <div style={{
            position:"absolute", top:0, right:0, bottom:0, width:260,
            background: dark ? C.bgDark : C.bgCard,
            padding:"24px 16px", overflowY:"auto",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:28 }}>
              <AdudLogo size={44} />
              <div style={{ fontSize:18, fontWeight:800, color:C.gold }}>عضُد AI</div>
            </div>
            {navItems.map(n => (
              <button key={n.id} onClick={() => nav(n.id)} style={{
                display:"flex", alignItems:"center", gap:12, width:"100%",
                padding:"13px 14px", borderRadius:12, marginBottom:6,
                background: page===n.id ? C.gold+"18" : "transparent",
                border: `1px solid ${page===n.id ? C.gold+"44" : "transparent"}`,
                color: page===n.id ? C.gold : dark ? C.white : C.text,
                fontSize:14, fontWeight: page===n.id ? 700 : 500,
                cursor:"pointer", fontFamily:"inherit", textAlign:"right",
              }}>
                <span style={{ fontSize:18 }}>{n.icon}</span>
                {n.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PAGE CONTENT */}
      <div style={{ paddingBottom:80 }}>
        {pageMap[page]}
      </div>

      {/* BOTTOM TAB BAR */}
      <div style={{
        position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:480, zIndex:100,
        background: dark ? "rgba(15,26,18,0.97)" : "rgba(244,239,230,0.97)",
        backdropFilter:"blur(12px)",
        borderTop:`1px solid ${dark ? C.borderDark : C.border}`,
        display:"flex", padding:"8px 0 12px",
      }}>
        {navItems.slice(0,5).map(n => (
          <button key={n.id} onClick={() => nav(n.id)} style={{
            flex:1, display:"flex", flexDirection:"column", alignItems:"center",
            gap:3, background:"none", border:"none", cursor:"pointer", padding:"4px 0",
          }}>
            <span style={{ fontSize:22 }}>{n.icon}</span>
            <span style={{ fontSize:9, color: page===n.id ? C.gold : C.textMuted,
              fontWeight: page===n.id ? 700 : 400 }}>{n.label}</span>
            {page===n.id && (
              <div style={{ width:20, height:3, borderRadius:99, background:C.gold, marginTop:1 }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
