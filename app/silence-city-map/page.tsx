"use client";

import { useMemo, useState } from "react";

type DistrictStatus = "Stable" | "Strained" | "Critical" | "Locked";
type ScreenState = "decision" | "result";

type District = {
  id: string;
  name: string;
  icon: string;
  status: DistrictStatus;
  crisis: string;
  detail: string;
  recommendedRoles: string[];
  actions: string[];
  x: number;
  y: number;
  points: string;
};

const version = "2.1.1";

const roles = [
  { name: "Engineering", icon: "🛠️" },
  { name: "Exploration", icon: "🥾" },
  { name: "AI Systems", icon: "🧠" },
  { name: "Logistics", icon: "📦" },
  { name: "Negotiation", icon: "🤝" },
  { name: "Security", icon: "🛡️" },
  { name: "Medicine", icon: "🩺" },
  { name: "Archivist", icon: "📚" },
  { name: "Merchant", icon: "⚖️" },
  { name: "Planner", icon: "🗺️" },
];

const startingDistricts: District[] = [
  {
    id: "power-hub",
    name: "Power Hub",
    icon: "⚡",
    status: "Strained",
    crisis: "Power output is unstable.",
    detail: "The district can survive one more day, but the grid is close to failing.",
    recommendedRoles: ["Engineering", "Logistics", "AI Systems"],
    actions: ["Stabilize Power", "Inspect Relay Yard", "Route Spare Cells"],
    x: 22,
    y: 48,
    points: "10,38 28,34 34,49 25,60 9,56",
  },
  {
    id: "old-market",
    name: "Old Market",
    icon: "🏚️",
    status: "Strained",
    crisis: "Trade routes are disorganized.",
    detail: "Useful materials exist here, but the market has no trusted exchange rules.",
    recommendedRoles: ["Merchant", "Negotiation", "Security"],
    actions: ["Open Civic Market", "Broker Supply Deal", "Secure Exchange Zone"],
    x: 34,
    y: 28,
    points: "22,17 43,13 48,29 34,38 18,31",
  },
  {
    id: "archive",
    name: "Archive",
    icon: "📚",
    status: "Critical",
    crisis: "Public records are fragmented.",
    detail: "A missing Data Fragment blocks the Route Gate readiness checklist.",
    recommendedRoles: ["Archivist", "AI Systems", "Exploration"],
    actions: ["Recover Data Fragment", "Index Broken Records", "Survey Old Files"],
    x: 52,
    y: 18,
    points: "48,10 69,12 75,28 62,38 47,29",
  },
  {
    id: "ai-core",
    name: "AI Core",
    icon: "🧠",
    status: "Stable",
    crisis: "The city AI is stable, but cautious.",
    detail: "The AI can help coordinate repairs if the district avoids overloading it.",
    recommendedRoles: ["AI Systems", "Planner", "Archivist"],
    actions: ["Run Diagnostic", "Optimize Civic Queue", "Verify Gate Logic"],
    x: 52,
    y: 47,
    points: "38,36 55,31 68,43 62,59 45,60 34,48",
  },
  {
    id: "clinic",
    name: "Clinic",
    icon: "🏥",
    status: "Strained",
    crisis: "Medical supply rotation is weak.",
    detail: "The clinic can treat minor incidents, but cannot handle a citywide shock.",
    recommendedRoles: ["Medicine", "Logistics", "Negotiation"],
    actions: ["Prepare Triage", "Move Medical Supplies", "Recruit Volunteers"],
    x: 74,
    y: 31,
    points: "72,30 91,34 94,51 80,61 66,50",
  },
  {
    id: "workshop",
    name: "Workshop",
    icon: "🛠️",
    status: "Stable",
    crisis: "Repair capacity is limited.",
    detail: "The workshop can produce Structural Parts if supplied with Scrap.",
    recommendedRoles: ["Engineering", "Logistics", "Planner"],
    actions: ["Fabricate Structural Part", "Repair Tools", "Organize Work Crews"],
    x: 30,
    y: 72,
    points: "15,62 36,58 43,74 30,88 12,79",
  },
  {
    id: "depot",
    name: "Depot",
    icon: "📦",
    status: "Strained",
    crisis: "Storage is poorly catalogued.",
    detail: "Resources exist, but the district does not know what is usable.",
    recommendedRoles: ["Logistics", "Exploration", "Merchant"],
    actions: ["Catalog Supplies", "Safe Salvage", "Move Public Stock"],
    x: 56,
    y: 72,
    points: "40,62 60,60 70,75 56,89 38,80",
  },
  {
    id: "housing",
    name: "Housing Block",
    icon: "🏘️",
    status: "Stable",
    crisis: "Resident trust is fragile.",
    detail: "People will cooperate if they see practical recovery progress.",
    recommendedRoles: ["Negotiation", "Medicine", "Security"],
    actions: ["Hold Civic Meeting", "Check Resident Needs", "Stabilize Patrol Routes"],
    x: 78,
    y: 60,
    points: "68,58 92,55 96,75 81,89 66,75",
  },
  {
    id: "route-gate",
    name: "Route Gate",
    icon: "🚪",
    status: "Locked",
    crisis: "The gate is not ready to open.",
    detail: "The city needs Power, resources, civic readiness, and verified gate logic.",
    recommendedRoles: ["Planner", "Engineering", "AI Systems"],
    actions: ["Inspect Gate", "Prioritize Gate Readiness", "Draft Opening Plan"],
    x: 52,
    y: 90,
    points: "39,84 61,84 72,97 28,97",
  },
];

const statusClass: Record<DistrictStatus, string> = {
  Stable: "border-emerald-300 bg-emerald-50 text-emerald-900",
  Strained: "border-amber-300 bg-amber-50 text-amber-900",
  Critical: "border-red-300 bg-red-50 text-red-900",
  Locked: "border-slate-400 bg-slate-100 text-slate-900",
};

const statusDot: Record<DistrictStatus, string> = {
  Stable: "bg-emerald-500",
  Strained: "bg-amber-500",
  Critical: "bg-red-500",
  Locked: "bg-slate-500",
};

function getRoleIcon(roleName: string) {
  return roles.find((role) => role.name === roleName)?.icon ?? "•";
}

export default function SilenceCityMapPage() {
  const [screen, setScreen] = useState<ScreenState>("decision");
  const [day, setDay] = useState(4);
  const [selectedDistrictId, setSelectedDistrictId] = useState("archive");
  const [selectedRole, setSelectedRole] = useState("Archivist");
  const [selectedAction, setSelectedAction] = useState("Recover Data Fragment");
  const [submitted, setSubmitted] = useState(false);
  const [districts, setDistricts] = useState(startingDistricts);
  const [timeline, setTimeline] = useState<string[]>([
    "Day 3: Housing Block stabilized resident cooperation.",
    "Day 2: Depot reported missing inventory records.",
    "Day 1: AI Core restored basic civic routing.",
  ]);

  const selectedDistrict = useMemo(
    () => districts.find((district) => district.id === selectedDistrictId) ?? districts[0],
    [districts, selectedDistrictId]
  );

  const gateReadyCount = useMemo(() => {
    let score = 2;
    if (districts.find((d) => d.id === "archive")?.status === "Stable") score += 1;
    if (districts.find((d) => d.id === "power-hub")?.status === "Stable") score += 1;
    if (districts.find((d) => d.id === "route-gate")?.status !== "Locked") score += 1;
    return Math.min(score, 7);
  }, [districts]);

  function selectDistrict(district: District) {
    if (screen === "result") return;
    setSelectedDistrictId(district.id);
    setSelectedRole(district.recommendedRoles[0]);
    setSelectedAction(district.actions[0]);
    setSubmitted(false);
  }

  function submitDecision() {
    setSubmitted(true);
  }

  function endDay() {
    if (!submitted) return;

    const nextDistricts = districts.map((district) => {
      if (district.id !== selectedDistrict.id) return district;

      if (district.status === "Critical") return { ...district, status: "Strained" as DistrictStatus };
      if (district.status === "Strained") return { ...district, status: "Stable" as DistrictStatus };
      if (district.status === "Locked" && selectedAction.includes("Gate")) {
        return { ...district, status: "Strained" as DistrictStatus };
      }
      return district;
    });

    setDistricts(nextDistricts);
    setTimeline((items) => [
      `Day ${day}: ${selectedRole} executed "${selectedAction}" in ${selectedDistrict.name}.`,
      ...items,
    ]);
    setScreen("result");
  }

  function continueToNextDay() {
    const nextDay = day + 1;
    setDay(nextDay);
    setSubmitted(false);
    setScreen("decision");

    const current = districts.find((district) => district.id === selectedDistrictId) ?? districts[0];
    setSelectedRole(current.recommendedRoles[0]);
    setSelectedAction(current.actions[0]);
  }

  const resultText =
    selectedDistrict.status === "Critical"
      ? `${selectedDistrict.name} is still unstable, but the response prevented a worse collapse.`
      : `${selectedDistrict.name} improved after the district response.`;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-5">
        <header className="mb-4 flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">
              Silence City — Map Command Prototype v{version}
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-4xl">
              Rebuild the city through daily missions.
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Choose a district, dispatch a role, resolve the day, and watch the city change.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2">
              <p className="text-xs text-slate-400">Day</p>
              <p className="text-lg font-black">{day}/14</p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2">
              <p className="text-xs text-slate-400">Gate</p>
              <p className="text-lg font-black">{gateReadyCount}/7</p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2">
              <p className="text-xs text-slate-400">Screen</p>
              <p className="text-sm font-black">{screen === "decision" ? "Decision" : "Result"}</p>
            </div>
          </div>
        </header>

        {screen === "decision" ? (
          <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">City Map</p>
                  <h2 className="mt-1 text-xl font-black text-white">Choose Target District</h2>
                </div>
                <p className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">
                  Recovery map
                </p>
              </div>

              <div className="relative min-h-[600px] overflow-hidden rounded-3xl border border-slate-700 bg-[#07111f] shadow-inner">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <radialGradient id="cityGlow" cx="50%" cy="45%" r="55%">
                      <stop offset="0%" stopColor="rgba(251,191,36,0.18)" />
                      <stop offset="45%" stopColor="rgba(15,23,42,0.15)" />
                      <stop offset="100%" stopColor="rgba(2,6,23,0.85)" />
                    </radialGradient>
                    <pattern id="smallGrid" width="6" height="6" patternUnits="userSpaceOnUse">
                      <path d="M 6 0 L 0 0 0 6" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="0.4" />
                    </pattern>
                  </defs>

                  {/* deep map background */}
                  <rect x="0" y="0" width="100" height="100" fill="url(#cityGlow)" />
                  <rect x="0" y="0" width="100" height="100" fill="url(#smallGrid)" opacity="0.28" />

                  {/* ruined city boundary */}
                  <path
                    d="M9 19 C19 7, 39 5, 58 9 C79 13, 94 30, 94 52 C94 75, 79 94, 54 97 C31 99, 12 86, 7 63 C3 44, 2 29, 9 19Z"
                    fill="rgba(15,23,42,0.55)"
                    stroke="rgba(226,232,240,0.25)"
                    strokeWidth="1.2"
                  />

                  {/* dead zone / collapsed district texture */}
                  <path
                    d="M4 4 L31 8 L22 26 L8 34 Z"
                    fill="rgba(127,29,29,0.22)"
                    stroke="rgba(248,113,113,0.18)"
                    strokeWidth="0.8"
                    strokeDasharray="2 2"
                  />
                  <text x="9" y="18" fill="rgba(248,113,113,0.28)" fontSize="3" fontWeight="800">DEAD ZONE</text>

                  {/* canal / broken waterline */}
                  <path
                    d="M4 72 C18 66, 31 62, 43 55 C59 45, 72 35, 96 24"
                    fill="none"
                    stroke="rgba(56,189,248,0.2)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="5 4"
                  />

                  {/* route gate corridor */}
                  <path
                    d="M50 44 C50 58, 51 72, 50 95"
                    fill="none"
                    stroke="rgba(251,191,36,0.16)"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />

                  {/* civic roads */}
                  <path d="M18 48 C31 45, 39 45, 50 44 C63 44, 73 50, 82 60" fill="none" stroke="rgba(226,232,240,0.11)" strokeWidth="2.6" strokeLinecap="round" />
                  <path d="M34 27 C42 22, 47 18, 58 20 C66 22, 73 28, 82 42" fill="none" stroke="rgba(226,232,240,0.09)" strokeWidth="2.1" strokeLinecap="round" />
                  <path d="M26 73 C39 69, 48 69, 56 73 C66 78, 75 72, 82 60" fill="none" stroke="rgba(226,232,240,0.09)" strokeWidth="2.1" strokeLinecap="round" />

                  {/* district map markers */}
                  {districts.map((district) => {
                    const selected = district.id === selectedDistrictId;
                    return (
                      <g
                        key={district.id}
                        onClick={() => selectDistrict(district)}
                        className="cursor-pointer transition"
                      >
                        {selected && (
                          <circle
                            cx={district.x}
                            cy={district.y}
                            r="8.2"
                            fill="rgba(251,191,36,0.18)"
                            stroke="rgba(251,191,36,0.48)"
                            strokeWidth="0.8"
                          />
                        )}

                        <circle
                          cx={district.x}
                          cy={district.y}
                          r={selected ? 5.3 : 4.6}
                          className={selected ? "fill-amber-200 stroke-slate-950" : "fill-slate-900/95 stroke-slate-300/70"}
                          strokeWidth="0.9"
                        />

                        <text
                          x={district.x}
                          y={district.y + 1.25}
                          textAnchor="middle"
                          fontSize="4.3"
                          className="select-none"
                        >
                          {district.icon}
                        </text>

                        <rect
                          x={district.x - 9}
                          y={district.y + 6}
                          width="18"
                          height="5.4"
                          rx="2.7"
                          fill={selected ? "rgba(251,191,36,0.92)" : "rgba(15,23,42,0.78)"}
                          stroke={selected ? "rgba(251,191,36,0.9)" : "rgba(148,163,184,0.22)"}
                          strokeWidth="0.5"
                        />

                        <text
                          x={district.x}
                          y={district.y + 9.7}
                          textAnchor="middle"
                          fontSize="2.35"
                          fontWeight="900"
                          fill={selected ? "rgba(15,23,42,1)" : "rgba(226,232,240,0.88)"}
                          className="select-none"
                        >
                          {district.name}
                        </text>

                        <circle
                          cx={district.x + 5.6}
                          cy={district.y - 5.2}
                          r="1.5"
                          className={district.status === "Stable" ? "fill-emerald-400" : district.status === "Strained" ? "fill-amber-400" : district.status === "Critical" ? "fill-red-400" : "fill-slate-400"}
                        />
                      </g>
                    );
                  })}

                  {/* map annotations */}
                  <text x="42" y="6" fill="rgba(226,232,240,0.18)" fontSize="3" fontWeight="800">NORTH RUINS</text>
                  <text x="36" y="99" fill="rgba(251,191,36,0.32)" fontSize="3" fontWeight="900">ROUTE GATE CORRIDOR</text>
                </svg>

                <div className="absolute bottom-3 left-3 rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-300 backdrop-blur">
                  <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />Stable
                  <span className="ml-3 mr-2 inline-block h-2 w-2 rounded-full bg-amber-400" />Strained
                  <span className="ml-3 mr-2 inline-block h-2 w-2 rounded-full bg-red-400" />Critical
                  <span className="ml-3 mr-2 inline-block h-2 w-2 rounded-full bg-slate-400" />Locked
                </div>
              </div>
            </div>

            <aside className="rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-xl">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">Mission Dispatch</p>
              <div className="mt-3 rounded-3xl border border-slate-700 bg-slate-800 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedDistrict.icon}</span>
                  <div>
                    <h2 className="text-2xl font-black text-white">{selectedDistrict.name}</h2>
                    <p className={`mt-1 inline-flex rounded-full border px-2 py-1 text-xs font-bold ${statusClass[selectedDistrict.status]}`}>
                      {selectedDistrict.status}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950 p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-red-300">Current Crisis</p>
                  <p className="mt-1 text-base font-bold text-white">{selectedDistrict.crisis}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{selectedDistrict.detail}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Send Unit</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {selectedDistrict.recommendedRoles.map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`rounded-2xl border px-3 py-3 text-sm font-bold transition ${
                        selectedRole === role
                          ? "border-amber-300 bg-amber-100 text-slate-950"
                          : "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                      }`}
                    >
                      <span className="mr-2">{getRoleIcon(role)}</span>
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Mission Action</p>
                <div className="mt-2 space-y-2">
                  {selectedDistrict.actions.map((action) => (
                    <button
                      key={action}
                      onClick={() => setSelectedAction(action)}
                      className={`w-full rounded-2xl border px-3 py-3 text-left text-sm font-bold transition ${
                        selectedAction === action
                          ? "border-sky-300 bg-sky-100 text-slate-950"
                          : "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
                      }`}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 grid gap-2">
                <button
                  onClick={submitDecision}
                  className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                    submitted
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-white text-slate-950 hover:bg-slate-200"
                  }`}
                >
                  {submitted ? "Mission Confirmed" : "Confirm Mission"}
                </button>

                <button
                  onClick={endDay}
                  disabled={!submitted}
                  className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                    submitted
                      ? "bg-amber-400 text-slate-950 hover:bg-amber-300"
                      : "cursor-not-allowed bg-slate-800 text-slate-500"
                  }`}
                >
                  Resolve Day
                </button>
              </div>
            </aside>
          </section>
        ) : (
          <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-3xl border border-amber-300 bg-amber-100 p-5 text-slate-950 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-700">Mission Report</p>
              <h2 className="mt-2 text-3xl font-black">Day {day} Result</h2>
              <p className="mt-3 text-lg font-bold">{resultText}</p>

              <div className="mt-4 rounded-2xl border border-amber-300 bg-white/70 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Decision</p>
                <p className="mt-1 font-black">
                  {getRoleIcon(selectedRole)} {selectedRole} → {selectedAction}
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  Target district: {selectedDistrict.icon} {selectedDistrict.name}
                </p>
              </div>

              <button
                onClick={continueToNextDay}
                className="mt-5 w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
              >
                Next Day
              </button>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">City Timeline</p>
              <h2 className="mt-1 text-xl font-black text-white">District Record</h2>
              <div className="mt-4 space-y-2">
                {timeline.map((item, index) => (
                  <div key={`${item}-${index}`} className="rounded-2xl border border-slate-700 bg-slate-800 p-3 text-sm text-slate-200">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
