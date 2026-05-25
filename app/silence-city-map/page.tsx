"use client";

import { useMemo, useState } from "react";

type DistrictStatus = "Stable" | "Strained" | "Critical" | "Locked";
type ScreenState = "decision" | "result";

type CityResources = {
  Power: number;
  Supplies: number;
  Data: number;
  Structure: number;
  Trust: number;
  Gate: number;
};

type ResourceDelta = Partial<Record<keyof CityResources, number>>;

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

const version = "2.6.1";

const startingResources: CityResources = {
  Power: 34,
  Supplies: 3,
  Data: 0,
  Structure: 2,
  Trust: 1,
  Gate: 2,
};

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

const markerRingClass: Record<DistrictStatus, string> = {
  Stable: "stroke-emerald-400",
  Strained: "stroke-amber-400",
  Critical: "stroke-red-400",
  Locked: "stroke-slate-400",
};

function getActionDelta(action: string, resources: CityResources): ResourceDelta {
  const effects: Record<string, ResourceDelta> = {
    "Stabilize Relay Grid": { Power: 2 },
    "Inspect Power Lines": { Power: 1, Gate: resources.Power >= 35 ? 1 : 0 },
    "Route Spare Cells": { Power: 1, Supplies: -1 },

    "Recover Data Fragment": { Data: 1, Gate: 1 },
    "Index Broken Records": { Data: 1, Trust: 1 },
    "Restore Civic Memory": { Trust: 1, Gate: resources.Data >= 1 ? 1 : 0 },

    "Catalog Supplies": { Supplies: 2 },
    "Safe Salvage": { Supplies: 1 },
    "Move Public Stock": { Trust: 1, Supplies: 1 },

    "Fabricate Structural Part": { Structure: 1, Supplies: -1 },
    "Repair Tools": { Structure: 1 },
    "Organize Work Crews": { Trust: 1, Structure: 1 },

    "Open Civic Market": { Trust: 1, Supplies: 1 },
    "Broker Supply Deal": { Supplies: 2 },
    "Set Exchange Rules": { Trust: 2 },

    "Run Diagnostic": { Gate: 1 },
    "Optimize Civic Queue": { Trust: 1, Gate: 1 },
    "Verify Gate Logic": { Gate: 1, Data: 1 },

    "Prepare Triage": { Trust: 1 },
    "Move Medical Supplies": { Trust: 1, Supplies: -1 },
    "Recruit Volunteers": { Trust: 2 },

    "Hold Civic Meeting": { Trust: 2 },
    "Check Resident Needs": { Trust: 1 },
    "Stabilize Patrol Routes": { Trust: 1 },

    "Inspect Gate": { Gate: 1 },
    "Prioritize Gate Readiness": {
      Gate: resources.Power >= 35 && resources.Data >= 1 && resources.Structure >= 2 ? 2 : 1,
    },
    "Draft Opening Plan": { Trust: 1, Gate: 1 },
  };

  return effects[action] ?? {};
}

function applyDelta(resources: CityResources, delta: ResourceDelta): CityResources {
  return {
    Power: Math.max(0, resources.Power + (delta.Power ?? 0)),
    Supplies: Math.max(0, resources.Supplies + (delta.Supplies ?? 0)),
    Data: Math.max(0, resources.Data + (delta.Data ?? 0)),
    Structure: Math.max(0, resources.Structure + (delta.Structure ?? 0)),
    Trust: Math.max(0, resources.Trust + (delta.Trust ?? 0)),
    Gate: Math.min(7, Math.max(0, resources.Gate + (delta.Gate ?? 0))),
  };
}

function formatDelta(delta: ResourceDelta) {
  const entries = Object.entries(delta).filter(([, value]) => value !== 0);
  if (entries.length === 0) return ["No direct resource change."];

  return entries.map(([key, value]) => `${key} ${value && value > 0 ? "+" : ""}${value}`);
}

function getResourceIcon(key: keyof CityResources) {
  if (key === "Power") return "⚡";
  if (key === "Supplies") return "📦";
  if (key === "Data") return "💾";
  if (key === "Structure") return "🧱";
  if (key === "Trust") return "👥";
  if (key === "Gate") return "🚪";
  return "•";
}

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
  const [resources, setResources] = useState<CityResources>(startingResources);
  const [lastDelta, setLastDelta] = useState<ResourceDelta>({});
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

  const currentDelta = getActionDelta(selectedAction, resources);
  const currentDeltaText = formatDelta(currentDelta);

  const gateReadyCount = resources.Gate;

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

    const missionDelta = getActionDelta(selectedAction, resources);
    const nextResources = applyDelta(resources, missionDelta);

    const nextDistricts = districts.map((district) => {
      if (district.id !== selectedDistrict.id) return district;

      if (district.status === "Critical") return { ...district, status: "Strained" as DistrictStatus };
      if (district.status === "Strained") return { ...district, status: "Stable" as DistrictStatus };
      if (district.status === "Locked" && selectedAction.includes("Gate")) {
        return { ...district, status: "Strained" as DistrictStatus };
      }
      return district;
    });

    setResources(nextResources);
    setLastDelta(missionDelta);
    setDistricts(nextDistricts);
    setTimeline((items) => [
      `Day ${day}: ${selectedRole} executed "${selectedAction}" in ${selectedDistrict.name}. ${formatDelta(missionDelta).join(" · ")}`,
      ...items,
    ]);
    setScreen("result");
  }

  function continueToNextDay() {
    const nextDay = day + 1;
    setDay(nextDay);
    setSubmitted(false);
    setLastDelta({});
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

          <div className="grid grid-cols-3 gap-2 text-center sm:grid-cols-7">
            <div className="rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2">
              <p className="text-xs text-slate-400">Day</p>
              <p className="text-lg font-black">{day}/14</p>
            </div>
            {(Object.keys(resources) as Array<keyof CityResources>).map((key) => (
              <div key={key} className="rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2">
                <p className="text-xs text-slate-400">{getResourceIcon(key)} {key}</p>
                <p className="text-lg font-black">{key === "Gate" ? `${resources[key]}/7` : resources[key]}</p>
              </div>
            ))}
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

                                                        <div className="relative min-h-[620px] overflow-hidden rounded-3xl border border-slate-700 bg-[#040914] shadow-inner">
                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <radialGradient id="commandMapGlow" cx="50%" cy="45%" r="65%">
                      <stop offset="0%" stopColor="rgba(251,191,36,0.075)" />
                      <stop offset="48%" stopColor="rgba(15,23,42,0.04)" />
                      <stop offset="100%" stopColor="rgba(2,6,23,0.94)" />
                    </radialGradient>

                    <radialGradient id="northBlob" cx="50%" cy="50%" r="55%">
                      <stop offset="0%" stopColor="rgba(100,116,139,0.16)" />
                      <stop offset="100%" stopColor="rgba(100,116,139,0)" />
                    </radialGradient>

                    <radialGradient id="eastBlob" cx="50%" cy="50%" r="55%">
                      <stop offset="0%" stopColor="rgba(56,189,248,0.10)" />
                      <stop offset="100%" stopColor="rgba(56,189,248,0)" />
                    </radialGradient>

                    <radialGradient id="gateBlob" cx="50%" cy="50%" r="60%">
                      <stop offset="0%" stopColor="rgba(251,191,36,0.12)" />
                      <stop offset="100%" stopColor="rgba(251,191,36,0)" />
                    </radialGradient>

                    <filter id="softGlow">
                      <feGaussianBlur stdDeviation="1.4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* clean command-map base */}
                  <rect x="0" y="0" width="100" height="100" fill="#040914" />
                  <rect x="0" y="0" width="100" height="100" fill="url(#commandMapGlow)" />

                  {/* abstract zone atmosphere only, not roads */}
                  <ellipse cx="48" cy="19" rx="34" ry="17" fill="url(#northBlob)" opacity="0.48" />
                  <ellipse cx="74" cy="55" rx="23" ry="25" fill="url(#eastBlob)" opacity="0.38" />
                  <ellipse cx="50" cy="91" rx="28" ry="15" fill="url(#gateBlob)" opacity="0.50" />

                  {/* irregular ruined city zones, background only */}
                  <g fill="rgba(30,41,59,0.105)" stroke="rgba(148,163,184,0.085)" strokeWidth="0.38" strokeDasharray="1.4 2.6">
                    <path d="M15 11 C23 8, 34 9, 43 13 C48 16, 47 24, 41 28 C32 33, 18 31, 11 25 C7 21, 9 14, 15 11Z" />
                    <path d="M57 11 C67 8, 82 10, 88 17 C93 23, 88 30, 78 32 C67 35, 56 31, 52 24 C49 18, 51 13, 57 11Z" />
                    <path d="M13 36 C23 32, 38 34, 45 41 C50 47, 45 54, 33 56 C21 58, 10 54, 8 47 C6 42, 8 38, 13 36Z" />
                    <path d="M55 35 C68 31, 83 34, 91 43 C96 49, 91 57, 79 59 C66 61, 51 56, 48 48 C45 42, 49 37, 55 35Z" />
                    <path d="M14 63 C25 59, 39 61, 47 69 C52 75, 47 82, 35 84 C23 86, 10 81, 8 73 C7 68, 9 65, 14 63Z" />
                    <path d="M56 63 C68 60, 84 62, 91 70 C96 76, 90 84, 77 85 C65 87, 51 82, 48 74 C46 69, 50 65, 56 63Z" />
                  </g>

                  {/* faint gate corridor terrain */}
                  <path
                    d="M39 84 C44 82, 56 82, 61 84 C66 88, 70 94, 72 97 H28 C30 94, 34 88, 39 84Z"
                    fill="rgba(251,191,36,0.026)"
                    stroke="rgba(251,191,36,0.07)"
                    strokeWidth="0.36"
                    strokeDasharray="1.5 2.7"
                  />

                  {/* outer command boundary */}
                  <path
                    d="M9 15 C18 6, 38 6, 51 8 C70 9, 88 18, 92 35 C96 54, 91 80, 77 91 C63 102, 35 99, 20 91 C8 84, 4 62, 6 42 C7 29, 4 21, 9 15Z"
                    fill="none"
                    stroke="rgba(148,163,184,0.055)"
                    strokeWidth="0.42"
                    strokeDasharray="2 4"
                  />

                  {/* subtle civic core radius */}
                  <circle
                    cx="50"
                    cy="42"
                    r="16"
                    fill="none"
                    stroke="rgba(251,191,36,0.08)"
                    strokeWidth="0.7"
                    strokeDasharray="2.5 4"
                  />

                  {/* route gate destination glow */}
                  <circle
                    cx="50"
                    cy="90"
                    r="10"
                    fill="rgba(251,191,36,0.045)"
                    stroke="rgba(251,191,36,0.14)"
                    strokeWidth="0.55"
                  />
                  <path
                    d="M44 98 L44 89 C44 84, 47 82, 50 82 C53 82, 56 84, 56 89 L56 98"
                    fill="none"
                    stroke="rgba(251,191,36,0.20)"
                    strokeWidth="0.6"
                  />
                  <text
                    x="50"
                    y="83.5"
                    textAnchor="middle"
                    fill="rgba(251,191,36,0.30)"
                    fontSize="2.7"
                    fontWeight="900"
                  >
                    GATE
                  </text>

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
                              r="8"
                              fill="rgba(251,191,36,0.16)"
                              stroke="rgba(251,191,36,0.44)"
                              strokeWidth="0.55"
                              filter="url(#softGlow)"
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
                          x={district.x - 11.8}
                          y={district.y + 6}
                          width="23.6"
                          height="5.4"
                          rx="2.7"
                          opacity={district.status === "Stable" && !selected ? "0.72" : "1"}
                          fill={selected ? "rgba(251,191,36,0.84)" : "rgba(15,23,42,0.76)"}
                          stroke={selected ? "rgba(251,191,36,0.72)" : "rgba(148,163,184,0.13)"}
                          strokeWidth="0.5"
                        />

                        <text
                          x={district.x}
                          y={district.y + 9.7}
                          textAnchor="middle"
                          fontSize="2.04"
                          fontWeight="900"
                          fill={selected ? "rgba(15,23,42,1)" : "rgba(226,232,240,0.88)"}
                          className="select-none"
                        >
                          {district.name}
                        </text>
                      </g>
                    );
                  })}
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
                <div className="mt-3 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2">
                  <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">Expected Effects</p>
                  <p className="mt-1 text-xs font-bold text-slate-200">{currentDeltaText.join(" · ")}</p>
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
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Resource Changes</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formatDelta(lastDelta).map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-black text-slate-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
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
