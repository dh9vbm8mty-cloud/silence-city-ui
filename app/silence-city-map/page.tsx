"use client";

import { useMemo, useState } from "react";

type DistrictStatus = "Stable" | "Strained" | "Critical" | "Locked";
type ScreenState = "decision" | "result" | "victory" | "failure";

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

const version = "3.0.10";

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
    x: 18,
    y: 50,
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
    x: 82,
    y: 22,
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
    x: 18,
    y: 22,
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
    x: 50,
    y: 22,
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
    x: 82,
    y: 50,
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
    x: 18,
    y: 78,
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
    x: 50,
    y: 78,
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
    x: 82,
    y: 78,
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
    x: 50,
    y: 50,
    points: "39,84 61,84 72,97 28,97",
  },
];

const statusClass: Record<DistrictStatus, string> = {
  Stable: "border-emerald-300 bg-emerald-50 text-emerald-900",
  Strained: "border-amber-300 bg-amber-50 text-amber-900",
  Critical: "border-red-300 bg-red-50 text-red-900",
  Locked: "border-slate-400 bg-slate-100 text-slate-900",
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

function canAffordDelta(resources: CityResources, delta: ResourceDelta) {
  return (Object.keys(delta) as Array<keyof CityResources>).every((key) => {
    const value = delta[key] ?? 0;
    if (value >= 0) return true;
    return resources[key] + value >= 0;
  });
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

function getDistrictRingColor(status: DistrictStatus) {
  if (status === "Stable") return "rgba(52,211,153,0.62)";
  if (status === "Strained") return "rgba(251,191,36,0.62)";
  if (status === "Critical") return "rgba(248,113,113,0.72)";
  return "rgba(148,163,184,0.52)";
}

function getDistrictFill(status: DistrictStatus, selected: boolean) {
  if (selected) return "rgba(14,165,233,0.12)";
  if (status === "Critical") return "rgba(248,113,113,0.10)";
  if (status === "Strained") return "rgba(251,191,36,0.08)";
  return "rgba(15,23,42,0.54)";
}

function getDistrictShortName(district: District) {
  const names: Record<string, string> = {
    "power-hub": "Power Relay",
    "old-market": "Old Market",
    archive: "Civic Archive",
    "ai-core": "AI Core",
    clinic: "Field Clinic",
    workshop: "Fabrication",
    depot: "Supply Depot",
    housing: "Residential",
    "route-gate": "Route Gate",
  };

  return names[district.id] ?? district.name;
}

function describeResourceDelta(key: keyof CityResources, value: number) {
  const direction = value > 0 ? "gains" : "spends";
  const amount = Math.abs(value);

  if (key === "Power") return `${direction} ${amount} Power — improves city energy stability.`;
  if (key === "Supplies") return `${direction} ${amount} Supplies — changes stored materials.`;
  if (key === "Data") return `${direction} ${amount} Data — restores records needed for gate logic.`;
  if (key === "Structure") return `${direction} ${amount} Structure — improves physical repair capacity.`;
  if (key === "Trust") return `${direction} ${amount} Trust — improves civic cooperation.`;
  if (key === "Gate") return `${direction} ${amount} Gate — advances Route Gate readiness.`;
  return `${direction} ${amount} ${key}.`;
}

function getDeltaEntries(delta: ResourceDelta) {
  return Object.entries(delta).filter(([, value]) => value !== 0) as Array<[keyof CityResources, number]>;
}

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
  const [routeGateOpened, setRouteGateOpened] = useState(false);
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
  const currentCanAfford = canAffordDelta(resources, currentDelta);
  const canOpenRouteGate = resources.Gate >= 7 && resources.Power >= 35 && resources.Data >= 1 && resources.Structure >= 2 && resources.Trust >= 2;
  const routeGateStatusText = routeGateOpened ? "Opened" : canOpenRouteGate ? "Ready" : "Sealed";
  const selectedIsRouteGate = selectedDistrict.id === "route-gate";
  const missingGateRequirements = [
    resources.Gate >= 7 ? null : `Gate readiness ${resources.Gate}/7`,
    resources.Power >= 35 ? null : `Power ${resources.Power}/35`,
    resources.Data >= 1 ? null : `Data ${resources.Data}/1`,
    resources.Structure >= 2 ? null : `Structure ${resources.Structure}/2`,
    resources.Trust >= 2 ? null : `Trust ${resources.Trust}/2`,
  ].filter(Boolean) as string[];

  const recommendedNextMove =
    resources.Data < 1
      ? {
          districtId: "archive",
          title: "Recover Data Fragment",
          reason: "Data is required before the Route Gate can be opened.",
        }
      : resources.Power < 35
        ? {
            districtId: "power-hub",
            title: "Stabilize Relay Grid",
            reason: "Power must reach 35+ for Route Gate opening.",
          }
        : resources.Trust < 2
          ? {
              districtId: "housing",
              title: "Hold Civic Meeting",
              reason: "Trust must reach 2+ to keep the opening politically stable.",
            }
          : resources.Gate < 7
            ? {
                districtId: "route-gate",
                title: "Prepare Route Gate",
                reason: "Gate readiness must reach 7/7.",
              }
            : {
                districtId: "route-gate",
                title: "Open Route Gate",
                reason: "All core requirements are ready.",
              };

  const recommendedDistrict = districts.find((district) => district.id === recommendedNextMove.districtId);

  const commandResourceStatus = [
    { label: "Day", value: day, target: 14, ready: day <= 14, display: `${day}/14` },
    { label: "Gate", value: resources.Gate, target: 7, ready: resources.Gate >= 7, display: `${resources.Gate}/7` },
    { label: "Power", value: resources.Power, target: 35, ready: resources.Power >= 35, display: `${resources.Power}/35` },
    { label: "Supplies", value: resources.Supplies, target: null, ready: resources.Supplies > 0, display: `${resources.Supplies}` },
    { label: "Data", value: resources.Data, target: 1, ready: resources.Data >= 1, display: `${resources.Data}/1` },
    { label: "Structure", value: resources.Structure, target: 2, ready: resources.Structure >= 2, display: `${resources.Structure}/2` },
    { label: "Trust", value: resources.Trust, target: 2, ready: resources.Trust >= 2, display: `${resources.Trust}/2` },
    { label: "Gate Status", value: canOpenRouteGate ? 1 : 0, target: 1, ready: canOpenRouteGate, display: routeGateStatusText },
  ];


  function selectDistrict(district: District) {
    if (screen === "result") return;
    setSelectedDistrictId(district.id);
    setSelectedRole(district.recommendedRoles[0]);
    setSelectedAction(district.actions[0]);
    setSubmitted(false);
    setLastDelta({});
  }

  function openRouteGate() {
    if (!canOpenRouteGate) return;
    setRouteGateOpened(true);
    setScreen("victory");
  }

  function submitDecision() {
    if (selectedIsRouteGate) return;
    if (!currentCanAfford) return;
    setSubmitted(true);
  }

  function endDay() {
    if (selectedIsRouteGate) return;
    if (!submitted) return;
    if (!canAffordDelta(resources, getActionDelta(selectedAction, resources))) return;

    const missionDelta = getActionDelta(selectedAction, resources);
    const nextResources = applyDelta(resources, missionDelta);
    const missionCanOpenGate =
      nextResources.Gate >= 7 &&
      nextResources.Power >= 35 &&
      nextResources.Data >= 1 &&
      nextResources.Structure >= 2 &&
      nextResources.Trust >= 2;

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
    if (missionCanOpenGate) {
      setRouteGateOpened(true);
      setScreen("victory");
      return;
    }

    setScreen("result");
  }

  function continueToNextDay() {
    const nextDay = day + 1;
    setDay(nextDay);
    setSubmitted(false);
    setLastDelta({});

    if (nextDay > 14 && !routeGateOpened) {
      setScreen("failure");
      return;
    }

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
        <header className="mb-3 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-4 shadow-lg">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">
              Silence City — Map Command Prototype v{version}
            </p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-4xl">
              Stabilize the city through daily missions.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Choose daily missions to restore the city. Build the required resources and open the Route Gate before Day 14 ends.
            </p>
          </div>

        </header>

        <section className="mb-4 rounded-3xl border border-slate-800/70 bg-slate-900/70 p-3 shadow-lg">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-300">Command Brief</p>
              <h2 className="mt-1 text-lg font-black text-white">Open the Route Gate before Day 14 ends.</h2>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Select a pressured district → dispatch a role → execute missions to complete the gate requirements.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 xl:justify-end">
              {commandResourceStatus.map((item) => (
                <span
                  key={item.label}
                  className={`rounded-full border px-3 py-1 text-xs font-black ${
                    item.ready
                      ? "border-emerald-400/60 bg-emerald-950/30 text-emerald-200"
                      : "border-slate-700/60 bg-slate-950/40 text-slate-300"
                  }`}
                >
                  {item.ready ? "✓" : "•"} {item.label} {item.display}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-slate-800/70 bg-slate-950/40 px-3 py-2">
            <p className="text-xs leading-5 text-slate-400">
              <span className="font-black uppercase tracking-wide text-sky-300">Recommended:</span>{" "}
              <span className="font-bold text-white">
                {recommendedDistrict ? `${recommendedDistrict.icon} ${recommendedDistrict.name}` : "Route Gate"} — {recommendedNextMove.title}
              </span>{" "}
              {recommendedNextMove.reason}
            </p>
          </div>
        </section>

        {screen === "decision" ? (
          <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">City Map</p>
                  <h2 className="mt-1 text-xl font-black text-white">Select Target District</h2>
                </div>
                <p className="rounded-full border border-slate-700/70 bg-slate-800/70 px-3 py-1 text-xs font-bold text-slate-300">
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

                  {/* irregular ruined city zones, background only */}
                  <g fill="rgba(30,41,59,0.105)" stroke="rgba(148,163,184,0.085)" strokeWidth="0.38" strokeDasharray="1.4 2.6">
                  </g>

                  {/* faint gate corridor terrain */}

                  {/* outer command boundary */}

                  {/* subtle civic core radius */}

                  {/* route gate destination glow */}

                  {/* district map markers */}
                  {districts.map((district) => {
                    const selected = district.id === selectedDistrictId;
                    const isRouteGate = district.id === "route-gate";
                    const markerRadius = isRouteGate ? 5.2 : 4.8;
                    const labelY = district.y + 8.8;
                    const statusY = district.y + 12.5;

                    return (
                      <g
                        key={district.id}
                        onClick={() => selectDistrict(district)}
                        className="cursor-pointer transition"
                      >
                        <circle
                          cx={district.x}
                          cy={district.y}
                          r={selected ? markerRadius + 0.55 : markerRadius}
                          fill={getDistrictFill(district.status, selected)}
                          stroke={getDistrictRingColor(district.status)}
                          strokeWidth={selected ? "1.05" : "0.58"}
                          filter={selected ? "url(#softGlow)" : undefined}
                        />

                        <text
                          x={district.x}
                          y={district.y + 1.35}
                          textAnchor="middle"
                          fontSize={isRouteGate ? "4.1" : "3.9"}
                          className="select-none"
                        >
                          {district.icon}
                        </text>

                        <text
                          x={district.x}
                          y={labelY}
                          textAnchor="middle"
                          fontSize="2.25"
                          fontWeight="900"
                          fill="rgba(226,232,240,0.92)"
                          className="select-none"
                        >
                          {getDistrictShortName(district)}
                        </text>

                        <text
                          x={district.x}
                          y={statusY}
                          textAnchor="middle"
                          fontSize="1.75"
                          fontWeight="800"
                          fill={
                            district.status === "Critical"
                              ? "rgba(252,165,165,0.95)"
                              : district.status === "Strained"
                                ? "rgba(252,211,77,0.92)"
                                : district.status === "Locked"
                                  ? "rgba(203,213,225,0.70)"
                                  : "rgba(167,243,208,0.86)"
                          }
                          className="select-none"
                        >
                          {isRouteGate ? routeGateStatusText : district.status}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div className="absolute bottom-3 left-3 max-w-[92%] rounded-full border border-slate-800/80 bg-slate-950/70 px-3 py-1.5 text-[11px] font-bold text-slate-400 backdrop-blur">
                  <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full border border-emerald-400 align-[-1px]" />Stable
                  <span className="ml-2.5 mr-1.5 inline-block h-2.5 w-2.5 rounded-full border border-amber-400 align-[-1px]" />Strained
                  <span className="ml-2.5 mr-1.5 inline-block h-2.5 w-2.5 rounded-full border border-red-400 align-[-1px]" />Critical
                  <span className="ml-2.5 mr-1.5 inline-block h-2.5 w-2.5 rounded-full border border-slate-400 align-[-1px]" />Locked
                </div>
              </div>
            </div>

            <aside className="rounded-3xl border border-slate-800 bg-slate-900 p-3.5 shadow-xl">
              <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-300">Dispatch Order</p>
              <div className="mt-3 rounded-3xl border border-slate-700/70 bg-slate-800/70 p-3.5">
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
                  <p className="mt-2 rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-xs font-semibold leading-5 text-slate-300">
                    <span className="font-black text-amber-300">Target Status:</span> {targetStatusHint}
                  </p>
                </div>
              </div>

              {selectedIsRouteGate ? (
                <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-100 p-4 text-slate-950">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-700">Route Gate Objective</p>
                  <h3 className="mt-2 text-xl font-black">
                    {canOpenRouteGate ? "Gate is ready to open." : "Gate is still sealed."}
                  </h3>
                  <p className="mt-2 text-sm font-bold leading-6 text-slate-700">
                    The Route Gate is the final campaign objective. It does not use normal district dispatch actions.
                  </p>

                  {!canOpenRouteGate && (
                    <div className="mt-4 rounded-2xl border border-amber-300 bg-white/70 p-3">
                      <p className="text-xs font-black uppercase tracking-wide text-slate-500">Missing Requirements</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {missingGateRequirements.map((item) => (
                          <span key={item} className="rounded-full border border-amber-300 bg-white px-3 py-1 text-xs font-black text-slate-800">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={openRouteGate}
                    disabled={!canOpenRouteGate}
                    className={`mt-4 w-full rounded-2xl px-4 py-3 text-sm font-black transition ${
                      canOpenRouteGate
                        ? "bg-slate-950 text-white hover:bg-slate-800"
                        : "cursor-not-allowed bg-slate-300 text-slate-500"
                    }`}
                  >
                    {canOpenRouteGate ? "Open Route Gate" : "Route Gate Not Ready"}
                  </button>
                </div>
              ) : (
                <>
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
                          : "border-slate-700/70 bg-slate-800/70 text-slate-200 hover:bg-slate-700/80"
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
                          ? "border-sky-300/80 bg-sky-950/70 text-sky-100"
                          : "border-slate-700/70 bg-slate-800/70 text-slate-200 hover:bg-slate-700/80"
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
                <div className="mt-3 rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2">
                  <p className="text-[11px] font-black uppercase tracking-wide text-slate-500">Expected Effects</p>
                  <div className="mt-2 space-y-1">
                    {getDeltaEntries(currentDelta).length > 0 ? (
                      getDeltaEntries(currentDelta).map(([key, value]) => (
                        <p key={key} className="text-xs font-bold leading-5 text-slate-200">
                          {getResourceIcon(key)} {value > 0 ? "+" : ""}{value} {key}
                          <span className="font-medium text-slate-400"> — {describeResourceDelta(key, value).split(" — ")[1]}</span>
                        </p>
                      ))
                    ) : (
                      <p className="text-xs font-bold text-slate-200">{currentDeltaText.join(" · ")}</p>
                    )}
                  </div>
                  {!currentCanAfford && (
                    <p className="mt-2 text-xs font-black text-red-300">
                      Insufficient resources for this order.
                    </p>
                  )}
                </div>

                <div className={`mt-2 rounded-xl border px-3 py-2 ${canOpenRouteGate ? "border-amber-300 bg-amber-100 text-slate-950" : "border-slate-700 bg-slate-900 text-slate-300"}`}>
                  <p className={`text-[11px] font-black uppercase tracking-wide ${canOpenRouteGate ? "text-amber-800" : "text-slate-500"}`}>
                    Route Gate Status
                  </p>
                  <p className="mt-1 text-xs font-bold">
                    {canOpenRouteGate ? "Ready to open after execution." : "Not ready: build Gate 7/7, Power 35+, Data 1+, Structure 2+, Trust 2+."}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-2">
                <button
                  onClick={submitDecision}
                  disabled={!currentCanAfford}
                  className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                    !currentCanAfford
                      ? "cursor-not-allowed bg-slate-900/70 text-slate-500"
                      : submitted
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-white text-slate-950 hover:bg-slate-200"
                  }`}
                >
                  {!currentCanAfford ? "Insufficient Resources" : submitted ? "Order Confirmed ✓" : "Confirm Order"}
                </button>

                <button
                  onClick={endDay}
                  disabled={!submitted}
                  className={`rounded-2xl px-4 py-3 text-sm font-black transition ${
                    submitted
                      ? "bg-sky-300 text-slate-950 shadow-lg shadow-amber-400/20 hover:bg-amber-200"
                      : "cursor-not-allowed bg-slate-900/70 text-slate-500"
                  }`}
                >
                  Execute Mission
                </button>
                <p className="text-center text-xs text-slate-500">
                  {!currentCanAfford
                    ? "Choose another action or gain more resources first."
                    : submitted
                      ? "Order confirmed. Execute when ready."
                      : "Confirm the order before execution."}
                </p>
              </div>

                </>
              )}
            </aside>
          </section>
        ) : screen === "result" ? (
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
                  <div key={`${item}-${index}`} className="rounded-2xl border border-slate-700/70 bg-slate-800/70 p-3 text-sm text-slate-200">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : screen === "victory" ? (
          <section className="rounded-3xl border border-amber-300 bg-amber-100 p-6 text-slate-950 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-700">Route Gate Opened</p>
            <h2 className="mt-2 text-4xl font-black">The district has opened the Route Gate.</h2>
            <p className="mt-4 max-w-3xl text-lg font-bold leading-8">
              After {day} days of civic recovery, the city has enough power, records, structure, trust, and gate readiness to reconnect with the outside route.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {(Object.keys(resources) as Array<keyof CityResources>).map((key) => (
                <div key={key} className="rounded-2xl border border-amber-300 bg-white/70 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{getResourceIcon(key)} {key}</p>
                  <p className="mt-1 text-2xl font-black">{key === "Gate" ? `${resources[key]}/7` : resources[key]}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-amber-300 bg-white/70 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Final Mission</p>
              <p className="mt-1 font-black">{getRoleIcon(selectedRole)} {selectedRole} → {selectedAction}</p>
              <p className="mt-2 text-sm font-bold text-slate-700">Target district: {selectedDistrict.icon} {selectedDistrict.name}</p>
            </div>

            <button
              onClick={() => {
                setRouteGateOpened(false);
                setScreen("decision");
              }}
              className="mt-5 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
            >
              Continue Sandbox
            </button>
          </section>
        ) : (
          <section className="rounded-3xl border border-red-300 bg-red-100 p-6 text-slate-950 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-red-700">Route Gate Failed</p>
            <h2 className="mt-2 text-4xl font-black">The city missed the Day 14 opening window.</h2>
            <p className="mt-4 max-w-3xl text-lg font-bold leading-8">
              The district survived, but it did not assemble enough gate readiness before the campaign clock expired.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {(Object.keys(resources) as Array<keyof CityResources>).map((key) => (
                <div key={key} className="rounded-2xl border border-red-300 bg-white/70 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{getResourceIcon(key)} {key}</p>
                  <p className="mt-1 text-2xl font-black">{key === "Gate" ? `${resources[key]}/7` : resources[key]}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl border border-red-300 bg-white/70 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Missing Requirement</p>
              <p className="mt-1 text-sm font-bold text-slate-700">
                Required: Gate 7/7, Power 35+, Data 1+, Structure 2+, Trust 2+ before Day 14 ends.
              </p>
            </div>
            <div className="mt-2 rounded-2xl border border-slate-800/70 bg-slate-950/35 px-3 py-2" data-note="Map Footer Status">
              <div className="flex flex-col gap-1.5 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  <span className="font-black uppercase tracking-wide text-slate-300">Selected:</span>{" "}
                  {selectedDistrict.icon} {selectedDistrict.name} / {selectedDistrict.status}
                </p>
                <p>
                  <span className="font-black uppercase tracking-wide text-slate-300">Next:</span>{" "}
                  {recommendedDistrict ? `${recommendedDistrict.icon} ${recommendedDistrict.name}` : "Route Gate"} — {recommendedNextMove.title}
                </p>
              </div>
            </div>


            <button
              onClick={() => {
                setScreen("decision");
              }}
              className="mt-5 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
            >
              Continue Sandbox
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
