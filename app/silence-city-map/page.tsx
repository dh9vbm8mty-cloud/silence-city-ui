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

const version = "2.2.3";

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
    name: "Power Relay Yard",
    icon: "⚡",
    status: "Strained",
    crisis: "The relay grid is losing rhythm.",
    detail: "The city still has power, but repeated surges are weakening the recovery network.",
    recommendedRoles: ["Engineering", "Logistics", "AI Systems"],
    actions: ["Stabilize Relay Grid", "Inspect Power Lines", "Route Spare Cells"],
    x: 22,
    y: 48,
    points: "10,38 28,34 34,49 25,60 9,56",
  },
  {
    id: "old-market",
    name: "Old Market",
    icon: "🏚️",
    status: "Strained",
    crisis: "Trade has returned, but trust has not.",
    detail: "Materials are moving through the ruins, but citizens do not agree on fair exchange rules.",
    recommendedRoles: ["Merchant", "Negotiation", "Security"],
    actions: ["Open Civic Market", "Broker Supply Deal", "Set Exchange Rules"],
    x: 34,
    y: 28,
    points: "22,17 43,13 48,29 34,38 18,31",
  },
  {
    id: "archive",
    name: "Civic Archive",
    icon: "📚",
    status: "Critical",
    crisis: "The city memory is incomplete.",
    detail: "Broken records and missing fragments prevent the district from proving what it has rebuilt.",
    recommendedRoles: ["Archivist", "AI Systems", "Exploration"],
    actions: ["Recover Data Fragment", "Index Broken Records", "Restore Civic Memory"],
    x: 52,
    y: 18,
    points: "48,10 69,12 75,28 62,38 47,29",
  },
  {
    id: "ai-core",
    name: "Civic AI Core",
    icon: "🧠",
    status: "Stable",
    crisis: "The city AI is stable, but withholding trust.",
    detail: "The AI can coordinate recovery, but it will not approve risky operations without clearer civic signals.",
    recommendedRoles: ["AI Systems", "Planner", "Archivist"],
    actions: ["Run Diagnostic", "Optimize Civic Queue", "Verify Gate Logic"],
    x: 52,
    y: 47,
    points: "38,36 55,31 68,43 62,59 45,60 34,48",
  },
  {
    id: "clinic",
    name: "Field Clinic",
    icon: "🏥",
    status: "Strained",
    crisis: "The clinic can treat wounds, not panic.",
    detail: "The medical shelter is functioning, but a serious event could exhaust staff and volunteers.",
    recommendedRoles: ["Medicine", "Logistics", "Negotiation"],
    actions: ["Prepare Triage", "Move Medical Supplies", "Recruit Volunteers"],
    x: 74,
    y: 31,
    points: "72,30 91,34 94,51 80,61 66,50",
  },
  {
    id: "workshop",
    name: "Fabrication Yard",
    icon: "🛠️",
    status: "Stable",
    crisis: "The city can repair parts, but not fast enough.",
    detail: "Tools, scrap, and skilled hands are present, but production still lacks coordination.",
    recommendedRoles: ["Engineering", "Logistics", "Planner"],
    actions: ["Fabricate Structural Part", "Repair Tools", "Organize Work Crews"],
    x: 30,
    y: 72,
    points: "15,62 36,58 43,74 30,88 12,79",
  },
  {
    id: "depot",
    name: "Supply Depot",
    icon: "📦",
    status: "Strained",
    crisis: "The district owns supplies it cannot find.",
    detail: "Crates, spare cells, and components are scattered through storage without a reliable inventory.",
    recommendedRoles: ["Logistics", "Exploration", "Merchant"],
    actions: ["Catalog Supplies", "Safe Salvage", "Move Public Stock"],
    x: 56,
    y: 72,
    points: "40,62 60,60 70,75 56,89 38,80",
  },
  {
    id: "housing",
    name: "Residential Ring",
    icon: "🏘️",
    status: "Stable",
    crisis: "People are cooperating, but only barely.",
    detail: "Residents will support recovery if missions show visible progress and reduce daily uncertainty.",
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
    crisis: "The city exit remains sealed.",
    detail: "Opening the gate requires power stability, public supplies, verified records, and coordinated approval.",
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

const markerRingClass: Record<DistrictStatus, string> = {
  Stable: "stroke-emerald-400",
  Strained: "stroke-amber-400",
  Critical: "stroke-red-400",
  Locked: "stroke-slate-400",
};

function getRoleIcon(roleName: string) {
  return roles.find((role) => role.name === roleName)?.icon ?? "•";
}

function getMarkerRadius(status: DistrictStatus, selected: boolean) {
  if (selected) return 5.35;
  if (status === "Critical") return 5.05;
  if (status === "Locked") return 4.9;
  if (status === "Strained") return 4.7;
  return 4.45;
}

function getMarkerOpacity(status: DistrictStatus, selected: boolean) {
  if (selected) return "1";
  if (status === "Stable") return "0.72";
  return "0.94";
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

  const missionPreview = `${getRoleIcon(selectedRole)} ${selectedRole} will perform "${selectedAction}" in ${selectedDistrict.name}.`;

  const missionRisk =
    selectedDistrict.status === "Critical"
      ? "High-risk district. A successful mission may reduce collapse pressure."
      : selectedDistrict.status === "Strained"
        ? "Moderate-risk district. A successful mission may stabilize local conditions."
        : selectedDistrict.status === "Locked"
          ? "Locked objective. Gate-related actions may begin opening preparation."
          : "Stable district. Mission may improve long-term readiness.";

  const nextRecommendedDistrict =
    districts.find((district) => district.status === "Critical" && district.id !== selectedDistrict.id) ??
    districts.find((district) => district.status === "Strained" && district.id !== selectedDistrict.id) ??
    districts.find((district) => district.status === "Locked" && district.id !== selectedDistrict.id) ??
    districts.find((district) => district.id !== selectedDistrict.id) ??
    selectedDistrict;

  const targetStatusHint =
    selectedDistrict.status === "Locked"
      ? "Locked objective. You can inspect it, but full opening requires preparation."
      : selectedDistrict.status === "Critical"
        ? "Critical pressure. This district should be handled soon."
        : selectedDistrict.status === "Strained"
          ? "Strained but recoverable. A mission can stabilize this area."
          : "Stable area. Useful for preparation and long-term readiness.";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-5">
        <header className="mb-4 flex flex-col gap-3 rounded-3xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">
              Silence City — Map Command Prototype v{version}
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-4xl">
              Stabilize the city through daily missions.
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Select a district, dispatch a role, execute the mission, and watch the city change.
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
                  <h2 className="mt-1 text-xl font-black text-white">Select Target District</h2>
                </div>
                <p className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">
                  Recovery map
                </p>
              </div>

                            <div className="relative min-h-[620px] overflow-hidden rounded-3xl border border-slate-700 bg-[#050b14] shadow-inner">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <radialGradient id="cityGlow" cx="50%" cy="44%" r="58%">
                      <stop offset="0%" stopColor="rgba(251,191,36,0.16)" />
                      <stop offset="44%" stopColor="rgba(15,23,42,0.18)" />
                      <stop offset="100%" stopColor="rgba(2,6,23,0.9)" />
                    </radialGradient>
                    <pattern id="smallGrid" width="7" height="7" patternUnits="userSpaceOnUse">
                      <path d="M 7 0 L 0 0 0 7" fill="none" stroke="rgba(148,163,184,0.055)" strokeWidth="0.35" />
                    </pattern>
                  </defs>

                  <rect x="0" y="0" width="100" height="100" fill="url(#cityGlow)" />
                  <rect x="0" y="0" width="100" height="100" fill="url(#smallGrid)" opacity="0.22" />

                  {/* city silhouette boundary */}
                  <path
                    d="M9 19 C19 7, 39 5, 58 9 C79 13, 94 30, 94 52 C94 75, 79 94, 54 97 C31 99, 12 86, 7 63 C3 44, 2 29, 9 19Z"
                    fill="rgba(15,23,42,0.54)"
                    stroke="rgba(226,232,240,0.22)"
                    strokeWidth="1"
                  />

                  {/* ruined dead zone */}
                  <path
                    d="M4 4 L31 8 L22 26 L8 34 Z"
                    fill="rgba(127,29,29,0.18)"
                    stroke="rgba(248,113,113,0.13)"
                    strokeWidth="0.75"
                    strokeDasharray="2 2"
                  />
                  <text x="9" y="18" fill="rgba(248,113,113,0.24)" fontSize="3" fontWeight="800">DEAD ZONE</text>

                  {/* old city blocks / silhouettes */}
                  <g fill="rgba(148,163,184,0.08)" stroke="rgba(148,163,184,0.08)" strokeWidth="0.4">
                    <rect x="16" y="36" width="9" height="5" rx="1" />
                    <rect x="27" y="20" width="10" height="6" rx="1" />
                    <rect x="47" y="12" width="12" height="5" rx="1" />
                    <rect x="68" y="25" width="12" height="6" rx="1" />
                    <rect x="72" y="54" width="13" height="7" rx="1" />
                    <rect x="22" y="66" width="12" height="7" rx="1" />
                    <rect x="47" y="66" width="13" height="7" rx="1" />
                  </g>

                  {/* canal / broken waterline */}
                  <path
                    d="M4 72 C18 66, 31 62, 43 55 C59 45, 72 35, 96 24"
                    fill="none"
                    stroke="rgba(56,189,248,0.17)"
                    strokeWidth="2.7"
                    strokeLinecap="round"
                    strokeDasharray="5 4"
                  />

                  {/* route gate corridor */}
                  <path
                    d="M52 45 C51 58, 53 72, 52 95"
                    fill="none"
                    stroke="rgba(251,191,36,0.15)"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />

                  {/* civic roads aligned to districts */}
                  <path d="M22 48 C34 46, 43 45, 52 45 C63 45, 70 52, 78 60" fill="none" stroke="rgba(226,232,240,0.115)" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M31 27 C39 22, 45 18, 52 18 C62 19, 68 24, 75 30" fill="none" stroke="rgba(226,232,240,0.095)" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M27 72 C38 69, 45 70, 53 72 C64 76, 72 69, 78 60" fill="none" stroke="rgba(226,232,240,0.095)" strokeWidth="2.2" strokeLinecap="round" />
                  <path d="M52 18 C52 28, 52 36, 52 45" fill="none" stroke="rgba(226,232,240,0.08)" strokeWidth="2" strokeLinecap="round" />

                  {/* civic core ring */}
                  <circle cx="52" cy="45" r="15" fill="rgba(251,191,36,0.045)" stroke="rgba(251,191,36,0.11)" strokeWidth="0.8" />

                  {/* route gate symbol */}
                  <path d="M42 97 L42 88 C42 83, 47 80, 52 80 C57 80, 62 83, 62 88 L62 97" fill="none" stroke="rgba(251,191,36,0.24)" strokeWidth="1" />
                  <text x="52" y="86" textAnchor="middle" fill="rgba(251,191,36,0.32)" fontSize="3" fontWeight="900">GATE</text>

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
                          <>
                            <circle
                              cx={district.x}
                              cy={district.y}
                              r="7.8"
                              fill="rgba(251,191,36,0.15)"
                              stroke="rgba(251,191,36,0.42)"
                              strokeWidth="0.55"
                            />
                            <rect
                              x={district.x - 7.2}
                              y={district.y - 13.8}
                              width="14.4"
                              height="4.2"
                              rx="2.1"
                              fill="rgba(251,191,36,0.92)"
                            />
                            <text
                              x={district.x}
                              y={district.y - 10.8}
                              textAnchor="middle"
                              fontSize="2.4"
                              fontWeight="900"
                              fill="rgba(15,23,42,1)"
                              className="select-none"
                            >
                              TARGET
                            </text>
                          </>
                        )}

                        {district.status === "Critical" && !selected && (
                          <circle
                            cx={district.x}
                            cy={district.y}
                            r="7.2"
                            fill="rgba(248,113,113,0.08)"
                            stroke="rgba(248,113,113,0.24)"
                            strokeWidth="0.45"
                          />
                        )}

                        <circle
                          cx={district.x}
                          cy={district.y}
                          r={getMarkerRadius(district.status, selected)}
                          opacity={getMarkerOpacity(district.status, selected)}
                          className={`${selected ? "fill-amber-200" : "fill-slate-900/95"} ${markerRingClass[district.status]}`}
                          strokeWidth={selected ? "1.05" : district.status === "Critical" ? "1.05" : "0.75"}
                        />

                        <text
                          x={district.x}
                          y={district.y + 1.25}
                          textAnchor="middle"
                          fontSize="4.05"
                          className="select-none"
                        >
                          {district.icon}
                        </text>

                        <rect
                          x={district.x - 10.8}
                          y={district.y + 6}
                          width="21.6"
                          height="5.4"
                          rx="2.7"
                          opacity={district.status === "Stable" && !selected ? "0.72" : "1"}
                          fill={selected ? "rgba(251,191,36,0.84)" : "rgba(15,23,42,0.68)"}
                          stroke={selected ? "rgba(251,191,36,0.72)" : "rgba(148,163,184,0.16)"}
                          strokeWidth="0.5"
                        />

                        <text
                          x={district.x}
                          y={district.y + 9.7}
                          textAnchor="middle"
                          fontSize="2.2"
                          fontWeight="900"
                          fill={selected ? "rgba(15,23,42,1)" : "rgba(226,232,240,0.88)"}
                          className="select-none"
                        >
                          {district.name}
                        </text>
                      </g>
                    );
                  })}

                  <text x="39" y="6" fill="rgba(226,232,240,0.16)" fontSize="3" fontWeight="800">NORTHERN RUINS</text>
                  <text x="34" y="99" fill="rgba(251,191,36,0.28)" fontSize="3" fontWeight="900">ROUTE GATE CORRIDOR</text>
                </svg>

                <div className="absolute bottom-3 left-3 rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-300 backdrop-blur">
                  <span className="mr-2 inline-block h-3 w-3 rounded-full border border-emerald-400" />Stable
                  <span className="ml-3 mr-2 inline-block h-3 w-3 rounded-full border border-amber-400" />Strained
                  <span className="ml-3 mr-2 inline-block h-3 w-3 rounded-full border border-red-400" />Critical
                  <span className="ml-3 mr-2 inline-block h-3 w-3 rounded-full border border-slate-400" />Locked
                </div>
              </div>
            </div>

            <aside className="rounded-3xl border border-slate-800 bg-slate-900 p-3.5 shadow-xl">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">Dispatch Order</p>
              <div className="mt-3 rounded-3xl border border-slate-700 bg-slate-800 p-3.5">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{selectedDistrict.icon}</span>
                  <div>
                    <h2 className="text-2xl font-black text-white">{selectedDistrict.name}</h2>
                    <p className={`mt-1 inline-flex rounded-full border px-2.5 py-1 text-xs font-black ${statusClass[selectedDistrict.status]}`}>
                      {selectedDistrict.status}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950 p-3">
                  <p className="text-xs font-black uppercase tracking-wide text-red-300">Local Crisis</p>
                  <p className="mt-1 text-base font-bold text-white">{selectedDistrict.crisis}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{selectedDistrict.detail}</p>
                  <p className="mt-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold leading-5 text-slate-300">
                    <span className="font-black text-amber-300">Target Status:</span> {targetStatusHint}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Dispatch Unit</p>
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
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Order Action</p>
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

              <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950 p-3">
                <p className="text-xs font-black uppercase tracking-wide text-sky-300">Dispatch Preview</p>
                <p className="mt-1 text-sm font-bold text-white">{missionPreview}</p>
                <p className="mt-2 text-xs leading-5 text-slate-400">{missionRisk}</p>
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
                  {submitted ? "Order Confirmed ✓" : "Confirm Order"}
                </button>

                <button
                  onClick={endDay}
                  disabled={!submitted}
                  className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                    submitted
                      ? "bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/20 hover:bg-amber-200"
                      : "cursor-not-allowed bg-slate-800 text-slate-500"
                  }`}
                >
                  Execute Mission
                </button>
                <p className="text-center text-xs text-slate-500">
                  {submitted ? "Order confirmed. Execute when ready." : "Confirm the order before execution."}
                </p>
              </div>
            </aside>
          </section>
        ) : (
          <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl border border-amber-300 bg-amber-100 p-5 text-slate-950 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-700">End-of-Day Report</p>
              <h2 className="mt-2 text-3xl font-black">Day {day} Resolved</h2>

              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-300 bg-white/70 p-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-3xl">
                  {selectedDistrict.icon}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Resolved District</p>
                  <p className="text-xl font-black">{selectedDistrict.name}</p>
                  <p className="text-sm font-bold text-slate-700">{selectedDistrict.status}</p>
                </div>
              </div>

              <p className="mt-4 text-lg font-bold">{resultText}</p>

              <div className="mt-4 rounded-2xl border border-amber-300 bg-white/70 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Decision</p>
                <p className="mt-1 font-black">
                  {getRoleIcon(selectedRole)} {selectedRole} → {selectedAction}
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  Target district: {selectedDistrict.icon} {selectedDistrict.name}
                </p>
              </div>

              <div className="mt-3 rounded-2xl border border-amber-300 bg-white/70 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">District Status Updated</p>
                <p className="mt-1 text-sm font-bold text-slate-800">
                  The selected district now reflects the mission result on the city map.
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Continue to the next day and choose the next district pressure to address.
                </p>
              </div>

              <div className="mt-3 rounded-2xl border border-amber-300 bg-white/70 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Next Pressure Point</p>
                <p className="mt-1 text-base font-black">
                  {nextRecommendedDistrict.icon} {nextRecommendedDistrict.name}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  Status: <span className="font-bold">{nextRecommendedDistrict.status}</span>
                </p>
                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Next day, target another unstable district or continue preparing the Route Gate.
                </p>
              </div>

              <button
                onClick={continueToNextDay}
                className="mt-5 w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
              >
                Continue
              </button>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">City Timeline</p>
              <h2 className="mt-1 text-xl font-black text-white">City Timeline</h2>
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
