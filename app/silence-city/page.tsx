/* eslint-disable react-hooks/set-state-in-effect, react-hooks/immutability, react-hooks/exhaustive-deps, @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";

const roles = {
  Engineering: {
    icon: "🛠️",
    identity: "Maintains power, repairs field systems, and keeps the district physically functional.",
    focus: "Best for stabilizing Power and Infrastructure before collapse pressure spreads.",
    risk: "Consumes public materials quickly if used without supply support.",
    pressure: "Power is unstable. Repeated manual stabilization may consume Scrap.",
    actions: ["Stabilize Power", "Repair Infrastructure", "Support Market Setup"],
  },
  Exploration: {
    icon: "🥾",
    identity: "Searches unsafe edges of the district for resources, signals, and usable routes.",
    focus: "Best for recovering Scrap, Data, and route knowledge.",
    risk: "Can expose the district to Security pressure when risks are pushed too hard.",
    pressure: "Public reserves depend on new supply. Data and Power Cell shortages matter.",
    actions: ["Safe Salvage", "Risk Salvage", "Route Survey"],
  },
  "AI Systems": {
    icon: "🧠",
    identity: "Interprets damaged protocols, broken records, and unstable machine guidance.",
    focus: "Best for reducing AI uncertainty and making hidden system pressure readable.",
    risk: "May reveal problems faster than the district can respond to them.",
    pressure: "Route protocols are not reliable. Public Data reserve is empty.",
    actions: ["AI Diagnostic", "Archive Lead", "System Warning Review"],
  },
  Logistics: {
    icon: "📦",
    identity: "Coordinates storage, delivery, and public movement across weak infrastructure.",
    focus: "Best for making public resources usable instead of merely collected.",
    risk: "Becomes fragile when Security and Infrastructure are both weak.",
    pressure: "Public transfers may soon matter. Route staging is not reliable.",
    actions: ["Storage Audit", "Public Delivery Support", "Security Route Check"],
  },
  Negotiation: {
    icon: "🤝",
    identity: "Turns private conflict into public agreements, pricing norms, and civic rules.",
    focus: "Best for Treasury, Charter, and legitimacy pressure.",
    risk: "Can create discussion without immediate material improvement.",
    pressure: "Public funds are weak. Market pricing may affect public trust.",
    actions: ["Create Public Treasury", "Charter Hearing", "Public Price Hearing"],
  },
  Security: {
    icon: "🛡️",
    identity: "Protects routes, deliveries, and public operations from instability and dispute.",
    focus: "Best for keeping public movement possible under risk.",
    risk: "Can stabilize routes without solving supply or governance bottlenecks.",
    pressure: "The district is not lawless, but routes and public transfers remain exposed.",
    actions: ["Patrol Route", "Escort Public Delivery", "Investigate Dispute"],
  },
  Medicine: {
    icon: "🩺",
    identity: "Keeps workers, shelters, and recovery teams functional under long-term strain.",
    focus: "Best for protecting civic capacity and reducing hidden fatigue pressure.",
    risk: "Its value may feel indirect until other systems begin failing.",
    pressure: "Worker fatigue, injury risk, and shelter stress can reduce civic capacity.",
    actions: ["Medical Triage", "Fatigue Check", "Shelter Health Review"],
  },
  Archivist: {
    icon: "📚",
    identity: "Recovers civic memory, old maps, damaged records, and contested truth.",
    focus: "Best for knowledge, Data, and long-term route interpretation.",
    risk: "Recovered records may create political or strategic tension.",
    pressure: "The city remembers fragments, but records are damaged and politically sensitive.",
    actions: ["Recover Civic Record", "Decode Old Map", "Verify Rumor"],
  },
  Merchant: {
    icon: "⚖️",
    identity: "Connects private exchange with public need through supply, price, and trust.",
    focus: "Best for Treasury, supply movement, and market stabilization.",
    risk: "Can damage public trust if private gain appears stronger than civic contribution.",
    pressure: "Private trade can stabilize supply, but unfair pricing can damage public trust.",
    actions: ["List Item on Market", "Sell at Civic Price", "Broker Supply Deal"],
  },
  Planner: {
    icon: "🗺️",
    identity: "Turns scattered effort into shared priorities, work crews, and Route Gate preparation.",
    focus: "Best for coordination, multi-system readiness, and strategic recovery.",
    risk: "Planning without resources can become symbolic instead of operational.",
    pressure: "The district needs shared priorities before public resources are committed.",
    actions: ["Draft Recovery Plan", "Coordinate Work Crews", "Prioritize Route Gate"],
  },
};
type RoleName = keyof typeof roles;

const initialDistrictStats = {
  Power: 34,
  Infrastructure: 39,
  Security: 37,
  "AI Stability": 56,
};

const initialPublicStorage = {
  Scrap: 3,
  "Power Cell": 1,
  "Data Fragment": 0,
  "Electronic Component": 1,
  "Structural Part": 2,
};

const dailyDecay = {
  Power: -2,
  Infrastructure: -1,
  Security: -1,
  "AI Stability": -1,
};

const decisionFrames = {
  Survival: {
    summary: "Keep the district physically alive before deeper planning.",
    examples: "Power, Infrastructure, medical strain, emergency stabilization.",
  },
  Supply: {
    summary: "Restore public materials and make basic repair possible.",
    examples: "Scrap, Power Cell, Structural Part, storage, delivery, market supply.",
  },
  Knowledge: {
    summary: "Recover information needed for routes, AI systems, and public memory.",
    examples: "Data Fragment, route survey, old maps, archive records, rumor verification.",
  },
  Security: {
    summary: "Make public movement, salvage, and delivery less risky.",
    examples: "Patrols, escort, route checks, dispute control, transfer safety.",
  },
  Coordination: {
    summary: "Turn scattered actions into public priorities and shared commitments.",
    examples: "Recovery plans, charter discussion, treasury use, Route Gate preparation.",
  },
};

type DecisionFrameName = keyof typeof decisionFrames;


const startingCityMemory = [
  "D created the first trusted Public Storage record.",
  "B recovered the first Power Cell.",
  "E advanced Charter toward public rule formation.",
];

const startingActionHistory = [
  "Day 3 — Negotiation — Charter Hearing — Charter advanced toward public rule formation.",
  "Day 2 — Exploration — Safe Salvage — Power Cell recovered for public reserve.",
  "Day 1 — Logistics — Storage Audit — First trusted Public Storage record created.",
];

function getActionEffectPreview(actionName: string) {
  if (actionName === "Stabilize Power") return "Expected: Power +3, Scrap -1, then end-of-day decay applies.";
  if (actionName === "Repair Infrastructure") return "Expected: Infrastructure +3, Scrap -1, then end-of-day decay applies.";
  if (actionName === "AI Diagnostic") return "Expected: AI Stability +2, then end-of-day decay applies.";
  if (actionName === "Risk Salvage") return "Expected: possible supply gain, but Security -1 before decay.";
  if (actionName === "Safe Salvage") return "Expected: if deposited, Scrap +1 and Data Fragment +1, then end-of-day decay applies.";
  if (actionName === "Security Route Check" || actionName === "Patrol Route" || actionName === "Escort Public Delivery") return "Expected: Security +2, then end-of-day decay applies.";
  if (actionName === "Medical Triage" || actionName === "Fatigue Check" || actionName === "Shelter Health Review") return "Expected: Infrastructure +1 through civic capacity support, then end-of-day decay applies.";
  if (actionName === "Recover Civic Record" || actionName === "Decode Old Map") return "Expected: AI Stability +1 and Data Fragment +1, then end-of-day decay applies.";
  if (actionName === "Verify Rumor") return "Expected: AI Stability +1 by reducing information uncertainty, then end-of-day decay applies.";
  if (actionName === "Route Survey") return "Expected: Data Fragment +1 through route knowledge, then end-of-day decay applies.";
  if (actionName === "Broker Supply Deal") return "Expected: Infrastructure +1, Scrap +1, Treasury +1, then end-of-day decay applies.";
  if (actionName === "Sell at Civic Price" || actionName === "List Item on Market") return "Expected: Infrastructure +1 and Treasury +1 through market stabilization, then end-of-day decay applies.";
  if (actionName === "Draft Recovery Plan" || actionName === "Prioritize Route Gate") return "Expected: Infrastructure +1, Security +1, Treasury +2, then end-of-day decay applies.";
  if (actionName === "Coordinate Work Crews") return "Expected: Infrastructure +1, Security +1, Scrap -1, Structural Part +1, then end-of-day decay applies.";
  if (actionName === "Create Public Treasury") return "Expected: Treasury +5, then end-of-day decay applies.";
  if (actionName === "Public Price Hearing") return "Expected: Treasury +1 and clearer civic pricing norms, then end-of-day decay applies.";
  return "Expected: narrative or moderator-resolved pressure shift. Numeric effect may be limited in this prototype.";
}

function getProposalFit(civicPriority: string, actionName: string) {
  if (civicPriority === "Emergency stabilization") {
    return actionName === "Stabilize Power" || actionName === "Repair Infrastructure" || actionName === "Medical Triage"
      ? "Strong fit"
      : "Indirect fit";
  }

  if (civicPriority === "Recover public knowledge") {
    return actionName === "Safe Salvage" || actionName === "Route Survey" || actionName === "AI Diagnostic" || actionName === "Recover Civic Record" || actionName === "Decode Old Map"
      ? "Strong fit"
      : "Indirect fit";
  }

  if (civicPriority === "Secure routes and transfers") {
    return actionName === "Security Route Check" || actionName === "Patrol Route" || actionName === "Escort Public Delivery" || actionName === "Storage Audit"
      ? "Strong fit"
      : "Indirect fit";
  }

  if (civicPriority === "Restore repair supply") {
    return actionName === "Safe Salvage" || actionName === "Risk Salvage" || actionName === "Broker Supply Deal"
      ? "Strong fit"
      : "Indirect fit";
  }

  if (civicPriority === "Attempt Route Gate") {
    return actionName === "Prioritize Route Gate" ? "Strong fit" : "Indirect fit";
  }

  return actionName === "Draft Recovery Plan" || actionName === "Coordinate Work Crews" || actionName === "Prioritize Route Gate" || actionName === "Charter Hearing"
    ? "Strong fit"
    : "Flexible fit";
}

type DistrictStats = typeof initialDistrictStats;
type PublicStorage = typeof initialPublicStorage;

function getStatNote(label: keyof DistrictStats, value: number) {
  if (label === "Power") return value < 35 ? "Unstable" : "Stable";
  if (label === "Infrastructure") return value < 35 ? "Strained" : "Functional";
  if (label === "Security") return value < 35 ? "Risky" : "Thin";
  if (label === "AI Stability") return value < 55 ? "Drifting" : "Stable";
  return "";
}

function getStorageNote(label: keyof PublicStorage, value: number) {
  if (label === "Data Fragment" && value === 0) return "empty";
  if (label === "Power Cell" && value < 2) return "below target";
  if (label === "Scrap" && value < 4) return "near target";
  if (value <= 1) return "thin";
  return "stable";
}

function getDistrictStatusTextClass(label: keyof DistrictStats, value: number) {
  if (label === "Power" && value < 30) return "text-rose-600";
  if (label === "Power" && value < 35) return "text-amber-600";
  if (label === "Infrastructure" && value < 35) return "text-amber-600";
  if (label === "Security" && value < 35) return "text-amber-600";
  if (label === "AI Stability" && value < 55) return "text-amber-600";
  return "text-emerald-600";
}

function getOutcomeChangeTextClass(item: string) {
  if (item.includes("→")) {
    const match = item.match(/(\d+)\s*→\s*(\d+)/);
    if (!match) return "text-slate-600";
    const before = Number(match[1]);
    const after = Number(match[2]);
    if (after > before) return "text-emerald-600";
    if (after < before) return "text-amber-600";
    return "text-slate-600";
  }

  if (item.includes("+")) return "text-emerald-600";
  if (item.includes("-")) return "text-amber-600";
  return "text-slate-600";
}

function getDistrictPressure(districtStats: DistrictStats, publicStorage: PublicStorage, treasury: number) {
  const pressure: string[] = [];

  if (districtStats.Power < 30) {
    pressure.push("Power is below emergency threshold. AI systems may degrade if this continues.");
  } else if (districtStats.Power < 35) {
    pressure.push("Power remains unstable. Engineering support should be considered before expansion.");
  } else {
    pressure.push("Power is currently stable enough for limited civic operations.");
  }

  if (publicStorage["Data Fragment"] === 0) {
    pressure.push("Public Data reserve is empty. Route Gate and AI planning may bottleneck.");
  } else if (publicStorage["Data Fragment"] < 2) {
    pressure.push("Public Data reserve has begun to recover, but knowledge remains thin.");
  } else {
    pressure.push("Public Data reserve is sufficient for basic route and archive planning.");
  }

  if (treasury < 25) {
    pressure.push("Treasury can fund one major purchase, not several mistakes.");
  } else if (treasury < 40) {
    pressure.push("Treasury is improving, but public purchasing power remains limited.");
  } else {
    pressure.push("Treasury is strong enough to support Route Gate preparation.");
  }

  if (publicStorage.Scrap < 3) {
    pressure.push("Repair supply is thin. Repeated maintenance may become difficult.");
  } else if (publicStorage.Scrap < 4) {
    pressure.push("Scrap reserve is near target but not yet comfortable for repeated repairs.");
  } else {
    pressure.push("Basic repair supply is available for civic maintenance.");
  }

  if (districtStats.Security < 35) {
    pressure.push("Routes and public transfers remain exposed to security risk.");
  } else {
    pressure.push("Routes are currently manageable, but public movement still needs oversight.");
  }

  return pressure;
}

function clampStat(value: number) {
  return Math.max(0, Math.min(100, value));
}

export default function SilenceCityPage() {
  const [day, setDay] = useState(4);
  const [districtStats, setDistrictStats] = useState(initialDistrictStats);
  const [publicStorage, setPublicStorage] = useState(initialPublicStorage);
  const [treasury, setTreasury] = useState(22);
  const [role, setRole] = useState<RoleName>("Exploration");
  const [action, setAction] = useState("Safe Salvage");
  const [disposition, setDisposition] = useState("Deposit to Public Storage");
  const [intent, setIntent] = useState("Help find Data without risking the district too much.");
  const [submitted, setSubmitted] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [cityMemory, setCityMemory] = useState(startingCityMemory);
  const [lastStateChange, setLastStateChange] = useState("No civic proposal has been resolved yet.");
  const [actionHistory, setActionHistory] = useState(startingActionHistory);
  const [lastResolvedDay, setLastResolvedDay] = useState<number | null>(null);
  const [lastEndOfDaySummary, setLastEndOfDaySummary] = useState("No day has been resolved yet.");
  const [lastNetStatChanges, setLastNetStatChanges] = useState<string[]>([]);
  const [certifiedPlayers, setCertifiedPlayers] = useState(1);
  const [moderatorApproval, setModeratorApproval] = useState(false);
  const [routeGateAttemptResult, setRouteGateAttemptResult] = useState("Route Gate has not been attempted yet.");
  const [moderatorLog, setModeratorLog] = useState<string[]>([]);
  const [playtestRecord, setPlaytestRecord] = useState<string[]>([]);
  const [copyStatus, setCopyStatus] = useState("Nothing copied yet.");
  const [submittedSnapshots, setSubmittedSnapshots] = useState<string[]>([]);
  const [autoSubmitOnResolve, setAutoSubmitOnResolve] = useState(true);
  const [lastAutoSubmittedSummary, setLastAutoSubmittedSummary] = useState("");
  const [sessionId, setSessionId] = useState("SC-PENDING");
  const [playerCode, setPlayerCode] = useState("Player-A");
  const [playtestGroup, setPlaytestGroup] = useState("Internal UI Test");
  const [viewMode, setViewMode] = useState<"player" | "moderator">("player");
  const [selectedWarningStatus, setSelectedWarningStatus] = useState<"all" | "critical" | "warning" | "resolved">("all");
  const [selectedDecisionFrame, setSelectedDecisionFrame] = useState<DecisionFrameName>("Knowledge");
  const [showModeratorData, setShowModeratorData] = useState(false);

  useEffect(() => {
    const savedRecord = window.localStorage.getItem("silence-city-playtest-record-v1");
    if (!savedRecord) return;

    try {
      const parsedRecord = JSON.parse(savedRecord);
      if (Array.isArray(parsedRecord)) {
        setPlaytestRecord(parsedRecord.filter((item) => typeof item === "string").slice(0, 20));
      }
    } catch {
      window.localStorage.removeItem("silence-city-playtest-record-v1");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("silence-city-playtest-record-v1", JSON.stringify(playtestRecord));
  }, [playtestRecord]);

  useEffect(() => {
    const savedSnapshots = window.localStorage.getItem("silence-city-submitted-snapshots-v1");
    if (!savedSnapshots) return;

    try {
      const parsedSnapshots = JSON.parse(savedSnapshots);
      if (Array.isArray(parsedSnapshots)) {
        setSubmittedSnapshots(parsedSnapshots.filter((item) => typeof item === "string").slice(0, 10));
      }
    } catch {
      window.localStorage.removeItem("silence-city-submitted-snapshots-v1");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("silence-city-submitted-snapshots-v1", JSON.stringify(submittedSnapshots));
  }, [submittedSnapshots]);

  useEffect(() => {
    const savedSessionId = window.localStorage.getItem("silence-city-session-id-v1");

    if (savedSessionId) {
      setSessionId(savedSessionId);
      return;
    }

    const generatedSessionId = `SC-${Date.now().toString(36).toUpperCase()}`;
    window.localStorage.setItem("silence-city-session-id-v1", generatedSessionId);
    setSessionId(generatedSessionId);
  }, []);

  const currentRole = roles[role];
  const dayProgress = Math.round((day / 14) * 100);
  const selectedActionEffectPreview = getActionEffectPreview(action);
  const proposalStatus = resolved ? "Resolved" : submitted ? "Submitted" : "Draft";
  const currentStepText = resolved
    ? "Start the next proposal"
    : submitted
      ? "End the day"
      : "Submit your proposal";

  const currentStepDetail = resolved
    ? "The district has moved forward. Start a new proposal for the current day."
    : submitted
      ? "Your proposal is submitted. End the day to make it permanent."
      : "Choose a role and action, then submit the proposal to council.";

  const districtStatRows = Object.entries(districtStats) as Array<[keyof DistrictStats, number]>;
  const publicStorageRows = Object.entries(publicStorage) as Array<[keyof PublicStorage, number]>;
  const districtPressure = getDistrictPressure(districtStats, publicStorage, treasury);
  const warningItems = [
    {
      label: "Power emergency",
      status: districtStats.Power < 30 ? "critical" : districtStats.Power < 35 ? "warning" : "resolved",
      message:
        districtStats.Power < 30
          ? "Power is below emergency threshold. Low Power penalty is active."
          : districtStats.Power < 35
            ? "Power is unstable. Engineering support may be needed."
            : "Power is currently above the unstable threshold.",
    },
    {
      label: "Security risk",
      status: districtStats.Security < 35 ? "warning" : "resolved",
      message:
        districtStats.Security < 35
          ? "Security is risky. Salvage and transfers may become dangerous."
          : "Security remains above the current risk threshold.",
    },
    {
      label: "AI Stability drift",
      status: districtStats["AI Stability"] < 55 ? "warning" : "resolved",
      message:
        districtStats["AI Stability"] < 55
          ? "AI Stability is drifting. AI Systems should review damaged protocols."
          : "AI Stability remains above the drift threshold.",
    },
    {
      label: "Public Data reserve",
      status: publicStorage["Data Fragment"] === 0 ? "warning" : "resolved",
      message:
        publicStorage["Data Fragment"] === 0
          ? "Public Data reserve is empty. Route Gate and AI progress may bottleneck."
          : "Public Data reserve is no longer empty.",
    },
    {
      label: "Scrap reserve",
      status: publicStorage.Scrap < 3 ? "warning" : "resolved",
      message:
        publicStorage.Scrap < 3
          ? "Scrap reserve is low. Repairs may become hard to sustain."
          : "Scrap reserve is currently sufficient for basic repair pressure.",
    },
  ];

  const activeWarnings = warningItems.filter((item) => item.status !== "resolved");
  const criticalWarningCount = warningItems.filter((item) => item.status === "critical").length;
  const normalWarningCount = warningItems.filter((item) => item.status === "warning").length;
  const resolvedWarningCount = warningItems.filter((item) => item.status === "resolved").length;
  const filteredWarningItems = selectedWarningStatus === "all"
    ? warningItems
    : warningItems.filter((item) => item.status === selectedWarningStatus);
  const suggestedResponses = activeWarnings.map((item) => {
    if (item.label === "Power emergency") return "Engineering pressure: stabilize Power before Low Power penalties cascade.";
    if (item.label === "Security risk") return "Logistics / Exploration pressure: reduce transfer and salvage risk before pushing routes.";
    if (item.label === "AI Stability drift") return "AI Systems pressure: review protocols before route or archive actions become unreliable.";
    if (item.label === "Public Data reserve") return "Exploration / AI Systems pressure: recover or generate Data before Route Gate planning.";
    if (item.label === "Scrap reserve") return "Exploration / Logistics pressure: restore basic repair supply before repeated maintenance.";
    return "General civic pressure: coordinate before committing public resources.";
  });

  const routeGateChecks = [
    { label: "Power ≥ 35", passed: districtStats.Power >= 35, current: districtStats.Power },
    { label: "Scrap ≥ 4", passed: publicStorage.Scrap >= 4, current: publicStorage.Scrap },
    { label: "Structural Part ≥ 2", passed: publicStorage["Structural Part"] >= 2, current: publicStorage["Structural Part"] },
    { label: "Power Cell ≥ 1", passed: publicStorage["Power Cell"] >= 1, current: publicStorage["Power Cell"] },
    { label: "Data Fragment ≥ 1", passed: publicStorage["Data Fragment"] >= 1, current: publicStorage["Data Fragment"] },
    { label: "Treasury ≥ 40", passed: treasury >= 40, current: treasury },
    { label: "Certified Players ≥ 2", passed: certifiedPlayers >= 2, current: certifiedPlayers },
    { label: "Moderator Approval", passed: moderatorApproval, current: moderatorApproval ? "approved" : "pending" },
  ];

  const routeGatePassedCount = routeGateChecks.filter((item) => item.passed).length;
  const routeGateReady = routeGatePassedCount === routeGateChecks.length;
  const visibleRouteGateChecks = viewMode === "moderator"
    ? routeGateChecks
    : routeGateChecks.filter((item) => item.label !== "Moderator Approval");
  const visibleRouteGatePassedCount = visibleRouteGateChecks.filter((item) => item.passed).length;
  const visibleRouteGateProgress = Math.round((visibleRouteGatePassedCount / visibleRouteGateChecks.length) * 100);

  const civicPriority =
    criticalWarningCount > 0
      ? "Emergency stabilization"
      : activeWarnings.some((item) => item.label === "Public Data reserve")
        ? "Recover public knowledge"
        : activeWarnings.some((item) => item.label === "Security risk")
          ? "Secure routes and transfers"
          : activeWarnings.some((item) => item.label === "Scrap reserve")
            ? "Restore repair supply"
            : routeGateReady
              ? "Attempt Route Gate"
              : "Coordinate toward Route Gate";

  const civicPriorityReason =
    civicPriority === "Emergency stabilization"
      ? "At least one system is below emergency threshold. The district should avoid cascading failure before expanding public plans."
      : civicPriority === "Recover public knowledge"
        ? "Public Data reserve is empty. Recover Data or route knowledge before Route Gate planning can become reliable."
        : civicPriority === "Secure routes and transfers"
          ? "Routes and public transfers remain exposed. Security or Logistics support can reduce movement risk."
          : civicPriority === "Restore repair supply"
            ? "Repair supply is thin. The district needs more Scrap or supply coordination before repeated maintenance."
            : civicPriority === "Attempt Route Gate"
              ? "All full Route Gate requirements are ready. Moderator may attempt the Route Gate."
              : "No urgent warning dominates, but Route Gate requirements are not complete yet.";

  const proposalFit = getProposalFit(civicPriority, action);
  const proposalNextStep = resolved ? "Outcome resolved. Choose another civic role or reset the scenario." : submitted ? "Proposal submitted. Resolve today’s outcome when ready." : "Draft proposal. Submit it before resolving today’s outcome.";
  const dailyOutcomeReportText = lastEndOfDaySummary === "No day has been resolved yet."
    ? "No daily outcome report is available yet. Resolve today’s outcome to generate the report."
    : lastEndOfDaySummary;
  const latestCivicEffectText = lastStateChange === "No civic proposal has been resolved yet."
    ? "No civic effect is available yet. Submit and resolve a civic proposal first."
    : lastStateChange;

  function addPlaytestRecord(entry: string) {
    setPlaytestRecord((previous) => [entry, ...previous].slice(0, 20));
  }

  const playtestSnapshot = {
    version: "1.2.3",
    sessionId,
    playerCode,
    playtestGroup,
    day,
    role,
    action,
    disposition,
    districtStats,
    publicStorage,
    treasury,
    certifiedPlayers,
    moderatorApproval,
    routeGateReady,
    routeGatePassedCount,
    routeGateTotalChecks: routeGateChecks.length,
    routeGateAttemptResult,
    lastStateChange,
    lastEndOfDaySummary,
    playtestRecord,
  };

  const playtestSnapshotJson = JSON.stringify(playtestSnapshot, null, 2);

  async function copyTextToClipboard(text: string, successMessage: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(successMessage);
    } catch {
      setCopyStatus("Clipboard copy failed. Select and copy the JSON preview manually.");
    }
  }

  function downloadJsonSnapshot() {
    const blob = new Blob([playtestSnapshotJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `silence-city-day-${day}-snapshot.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setCopyStatus("JSON snapshot downloaded.");
  }

  async function submitSnapshotToLocalQueue(reason = "manual") {
    const submissionEntry = `Submitted snapshot — ${reason} — ${sessionId} — ${playerCode} — Day ${day} — ${routeGatePassedCount}/${routeGateChecks.length} Route Gate ready — ${new Date().toLocaleString()}`;

    try {
      const response = await fetch("/api/playtest-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...playtestSnapshot,
          submitReason: reason,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || "Backend submit failed.");
      }

      const confirmedEntry = `${submissionEntry} — backend id ${result.id}`;
      setSubmittedSnapshots((previous) => [confirmedEntry, ...previous].slice(0, 10));
      addPlaytestRecord(confirmedEntry);
      setCopyStatus(`Snapshot submitted automatically/manual to backend API. Reason: ${reason}.`);
    } catch {
      const fallbackEntry = `${submissionEntry} — backend failed, saved to local queue only`;
      setSubmittedSnapshots((previous) => [fallbackEntry, ...previous].slice(0, 10));
      addPlaytestRecord(fallbackEntry);
      setCopyStatus(`Backend submit failed. Snapshot saved locally only. Reason: ${reason}.`);
    }
  }

  useEffect(() => {
    if (!autoSubmitOnResolve) return;
    if (lastEndOfDaySummary === "No day has been resolved yet.") return;
    if (lastEndOfDaySummary === lastAutoSubmittedSummary) return;

    setLastAutoSubmittedSummary(lastEndOfDaySummary);
    void submitSnapshotToLocalQueue("auto-resolve-day");
  }, [autoSubmitOnResolve, lastEndOfDaySummary, lastAutoSubmittedSummary]);

  function attemptRouteGate() {
    if (routeGateReady) {
      const successMessage = `Success. Old Industrial Sector stabilized on Day ${day}. Route Gate Platform powered and Transit Hub signal recovered.`;
      setRouteGateAttemptResult(successMessage);
      setCityMemory((previous) => [
        `Route Gate Platform was powered on Day ${day}. Transit Hub signal recovered.`,
        ...previous,
      ].slice(0, 5));
      addPlaytestRecord(`Day ${day} — Route Gate Attempt — SUCCESS — ${routeGatePassedCount}/${routeGateChecks.length} ready`);
      return;
    }

    const missing = routeGateChecks.filter((item) => !item.passed).map((item) => item.label).join(" / ");
    setRouteGateAttemptResult(`Attempt blocked. Missing requirements: ${missing}.`);
    addPlaytestRecord(`Day ${day} — Route Gate Attempt — BLOCKED — Missing: ${missing}`);
  }

  function adjustStorageItem(label: keyof PublicStorage, amount: number) {
    setPublicStorage((previous) => ({
      ...previous,
      [label]: Math.max(0, previous[label] + amount),
    }));
    const logEntry = `Day ${day} — Moderator adjusted ${label} ${amount > 0 ? "+" : ""}${amount}`;
    setModeratorLog((previous) => [logEntry, ...previous].slice(0, 6));
    addPlaytestRecord(logEntry);
    setRouteGateAttemptResult("Route Gate readiness changed by moderator adjustment.");
  }

  function adjustTreasury(amount: number) {
    setTreasury((previous) => Math.max(0, previous + amount));
    const logEntry = `Day ${day} — Moderator adjusted Treasury ${amount > 0 ? "+" : ""}${amount}`;
    setModeratorLog((previous) => [logEntry, ...previous].slice(0, 6));
    addPlaytestRecord(logEntry);
    setRouteGateAttemptResult("Route Gate readiness changed by moderator adjustment.");
  }

  function changeRole(nextRole: RoleName) {
    setRole(nextRole);
    setAction(roles[nextRole].actions[0]);
    setSubmitted(false);
    setResolved(false);
    setLastStateChange("New civic role selected. Choose a proposal and submit.");
  }

  function resolveDay() {
    if (!submitted) {
      setLastStateChange("Submit a civic proposal before resolving today’s outcome.");
      return;
    }

    if (resolved) {
      setLastStateChange("This submitted proposal has already been resolved. Choose a new proposal or reset the scenario.");
      return;
    }

    const resolutionResult = createResolution();
    const changes: string[] = [];
    const startingStats = { ...districtStats };
    const startingStorage = { ...publicStorage };
    const startingTreasury = treasury;

    setSubmitted(true);

    setDistrictStats((previous) => {
      const next = { ...previous };

      if (action === "Stabilize Power") {
        next.Power = clampStat(next.Power + 3);
        changes.push("Power +3 from Stabilize Power");
      }

      if (action === "Repair Infrastructure") {
        next.Infrastructure = clampStat(next.Infrastructure + 3);
        changes.push("Infrastructure +3 from Repair Infrastructure");
      }

      if (action === "AI Diagnostic") {
        next["AI Stability"] = clampStat(next["AI Stability"] + 2);
        changes.push("AI Stability +2 from AI Diagnostic");
      }

      if (action === "Risk Salvage") {
        next.Security = clampStat(next.Security - 1);
        changes.push("Security -1 from Risk Salvage");
      }

      if (action === "Security Route Check") {
        next.Security = clampStat(next.Security + 2);
        changes.push("Security +2 from Security Route Check");
      }

      if (action === "Patrol Route" || action === "Escort Public Delivery") {
        next.Security = clampStat(next.Security + 2);
        changes.push(`Security +2 from ${action}`);
      }

      if (action === "Medical Triage" || action === "Fatigue Check" || action === "Shelter Health Review") {
        next.Infrastructure = clampStat(next.Infrastructure + 1);
        changes.push(`Infrastructure +1 from ${action}`);
      }

      if (action === "Recover Civic Record" || action === "Decode Old Map" || action === "Verify Rumor") {
        next["AI Stability"] = clampStat(next["AI Stability"] + 1);
        changes.push(`AI Stability +1 from ${action}`);
      }

      if (action === "Draft Recovery Plan" || action === "Coordinate Work Crews" || action === "Prioritize Route Gate") {
        next.Infrastructure = clampStat(next.Infrastructure + 1);
        next.Security = clampStat(next.Security + 1);
        changes.push(`Infrastructure +1 and Security +1 from ${action}`);
      }

      if (action === "Support Market Setup" || action === "Broker Supply Deal" || action === "Sell at Civic Price") {
        next.Infrastructure = clampStat(next.Infrastructure + 1);
        changes.push(`Infrastructure +1 from ${action}`);
      }

      next.Power = clampStat(next.Power + dailyDecay.Power);
      next.Infrastructure = clampStat(next.Infrastructure + dailyDecay.Infrastructure);
      next.Security = clampStat(next.Security + dailyDecay.Security);
      next["AI Stability"] = clampStat(next["AI Stability"] + dailyDecay["AI Stability"]);
      changes.push(
        `End-of-day decay applied: Power ${dailyDecay.Power} / Infrastructure ${dailyDecay.Infrastructure} / Security ${dailyDecay.Security} / AI Stability ${dailyDecay["AI Stability"]}`
      );

      if (next.Power < 30) {
        next["AI Stability"] = clampStat(next["AI Stability"] - 1);
        changes.push("Low Power penalty applied: AI Stability -1");
      }

      return next;
    });

    setPublicStorage((previous) => {
      const next = { ...previous };

      if (action === "Stabilize Power" || action === "Repair Infrastructure") {
        next.Scrap = Math.max(0, next.Scrap - 1);
        changes.push("Scrap -1");
      }

      if (action.includes("Salvage") && disposition === "Deposit to Public Storage") {
        next.Scrap += 1;
        next["Data Fragment"] += 1;
        changes.push("Scrap +1");
        changes.push("Data Fragment +1");
      }

      if (action === "Archive Lead" && next["Data Fragment"] === 0) {
        next["Data Fragment"] += 1;
        changes.push("Data Fragment +1 from Archive Lead");
      }

      if (action === "Recover Civic Record" || action === "Decode Old Map" || action === "Archive Lead") {
        next["Data Fragment"] += 1;
        changes.push(`Data Fragment +1 from ${action}`);
      }

      if (action === "Route Survey") {
        next["Data Fragment"] += 1;
        changes.push("Data Fragment +1 from Route Survey");
      }

      if (action === "Broker Supply Deal") {
        next.Scrap += 1;
        changes.push("Scrap +1 from Broker Supply Deal");
      }

      if (action === "Coordinate Work Crews") {
        next.Scrap = Math.max(0, next.Scrap - 1);
        next["Structural Part"] += 1;
        changes.push("Scrap -1 and Structural Part +1 from Coordinate Work Crews");
      }

      return next;
    });

    setTreasury((previous) => {
      if (disposition === "List on Market") {
        changes.push("Treasury +1");
        return previous + 1;
      }
      if (action === "Create Public Treasury") {
        changes.push("Treasury +5");
        return previous + 5;
      }
      if (action.includes("Price")) {
        changes.push("Treasury +1 from Public Price Hearing");
        return previous + 1;
      }
      if (action === "List Item on Market" || action === "Sell at Civic Price" || action === "Broker Supply Deal") {
        changes.push(`Treasury +1 from ${action}`);
        return previous + 1;
      }
      if (action === "Draft Recovery Plan" || action === "Prioritize Route Gate") {
        changes.push(`Treasury +2 from ${action}`);
        return previous + 2;
      }
      return previous;
    });

    const resolvedDay = day;
    const nextDay = Math.min(14, day + 1);

    setResolved(true);
    setLastResolvedDay(resolvedDay);
    setDay(nextDay);
    changes.push(`Day ${resolvedDay} resolved → Day ${nextDay}`);
    const changeSummary = changes.length > 0 ? changes.join(" / ") : "No numeric change for this action.";
    setCityMemory((previous) => [resolutionResult.memory, ...previous].slice(0, 5));
    setActionHistory((previous) => [
      `Day ${resolvedDay} — ${role} — ${action} — ${changeSummary}`,
      ...previous,
    ].slice(0, 8));
    setLastStateChange(changeSummary);
    const projectedStats = { ...startingStats };

    if (action === "Stabilize Power") projectedStats.Power = clampStat(projectedStats.Power + 3);
    if (action === "Repair Infrastructure") projectedStats.Infrastructure = clampStat(projectedStats.Infrastructure + 3);
    if (action === "AI Diagnostic") projectedStats["AI Stability"] = clampStat(projectedStats["AI Stability"] + 2);
    if (action === "Risk Salvage") projectedStats.Security = clampStat(projectedStats.Security - 1);
    if (action === "Security Route Check") projectedStats.Security = clampStat(projectedStats.Security + 2);
    if (action === "Patrol Route" || action === "Escort Public Delivery") projectedStats.Security = clampStat(projectedStats.Security + 2);
    if (action === "Medical Triage" || action === "Fatigue Check" || action === "Shelter Health Review") projectedStats.Infrastructure = clampStat(projectedStats.Infrastructure + 1);
    if (action === "Recover Civic Record" || action === "Decode Old Map" || action === "Verify Rumor") projectedStats["AI Stability"] = clampStat(projectedStats["AI Stability"] + 1);
    if (action === "Draft Recovery Plan" || action === "Coordinate Work Crews" || action === "Prioritize Route Gate") {
      projectedStats.Infrastructure = clampStat(projectedStats.Infrastructure + 1);
      projectedStats.Security = clampStat(projectedStats.Security + 1);
    }
    if (action === "Support Market Setup" || action === "Broker Supply Deal" || action === "Sell at Civic Price") projectedStats.Infrastructure = clampStat(projectedStats.Infrastructure + 1);

    projectedStats.Power = clampStat(projectedStats.Power + dailyDecay.Power);
    projectedStats.Infrastructure = clampStat(projectedStats.Infrastructure + dailyDecay.Infrastructure);
    projectedStats.Security = clampStat(projectedStats.Security + dailyDecay.Security);
    projectedStats["AI Stability"] = clampStat(projectedStats["AI Stability"] + dailyDecay["AI Stability"]);
    if (projectedStats.Power < 30) projectedStats["AI Stability"] = clampStat(projectedStats["AI Stability"] - 1);

    const projectedStorage = { ...startingStorage };
    if (action === "Stabilize Power" || action === "Repair Infrastructure") projectedStorage.Scrap = Math.max(0, projectedStorage.Scrap - 1);
    if (action.includes("Salvage") && disposition === "Deposit to Public Storage") {
      projectedStorage.Scrap += 1;
      projectedStorage["Data Fragment"] += 1;
    }
    if (action === "Archive Lead" && projectedStorage["Data Fragment"] === 0) projectedStorage["Data Fragment"] += 1;
    if (action === "Recover Civic Record" || action === "Decode Old Map" || action === "Archive Lead") projectedStorage["Data Fragment"] += 1;
    if (action === "Route Survey") projectedStorage["Data Fragment"] += 1;
    if (action === "Broker Supply Deal") projectedStorage.Scrap += 1;
    if (action === "Coordinate Work Crews") {
      projectedStorage.Scrap = Math.max(0, projectedStorage.Scrap - 1);
      projectedStorage["Structural Part"] += 1;
    }

    let projectedTreasury = startingTreasury;
    if (disposition === "List on Market") projectedTreasury += 1;
    if (action === "Create Public Treasury") projectedTreasury += 5;
    if (action.includes("Price")) projectedTreasury += 1;
    if (action === "List Item on Market" || action === "Sell at Civic Price" || action === "Broker Supply Deal") projectedTreasury += 1;
    if (action === "Draft Recovery Plan" || action === "Prioritize Route Gate") projectedTreasury += 2;

    setLastNetStatChanges([
      `Power ${startingStats.Power} → ${projectedStats.Power}`,
      `Infrastructure ${startingStats.Infrastructure} → ${projectedStats.Infrastructure}`,
      `Security ${startingStats.Security} → ${projectedStats.Security}`,
      `AI Stability ${startingStats["AI Stability"]} → ${projectedStats["AI Stability"]}`,
      `Scrap ${startingStorage.Scrap} → ${projectedStorage.Scrap}`,
      `Data Fragment ${startingStorage["Data Fragment"]} → ${projectedStorage["Data Fragment"]}`,
      `Treasury ${startingTreasury} → ${projectedTreasury}`,
    ]);

    const endOfDaySummary = `Resolved Day ${resolvedDay}. ${role} used ${action}. The civic proposal and world decay were applied. Current day is ${nextDay} / 14.`;
    setLastEndOfDaySummary(endOfDaySummary);
    addPlaytestRecord(`Day ${resolvedDay} — ${role} — ${action} — ${disposition} — ${changeSummary}`);
  }

  function resetScenario() {
    setDay(4);
    setDistrictStats(initialDistrictStats);
    setPublicStorage(initialPublicStorage);
    setTreasury(22);
    setRole("Exploration");
    setAction("Safe Salvage");
    setDisposition("Deposit to Public Storage");
    setIntent("Help find Data without risking the district too much.");
    setSubmitted(false);
    setResolved(false);
    setCityMemory(startingCityMemory);
    setActionHistory(startingActionHistory);
    setLastResolvedDay(null);
    setLastEndOfDaySummary("No day has been resolved yet.");
    setLastNetStatChanges([]);
    setCertifiedPlayers(1);
    setModeratorApproval(false);
    setRouteGateAttemptResult("Route Gate has not been attempted yet.");
    setModeratorLog([]);
    setPlaytestRecord([]);
    setCopyStatus("Nothing copied yet.");
    setSubmittedSnapshots([]);
    setAutoSubmitOnResolve(true);
    setLastAutoSubmittedSummary("");
    const generatedSessionId = `SC-${Date.now().toString(36).toUpperCase()}`;
    setSessionId(generatedSessionId);
    window.localStorage.setItem("silence-city-session-id-v1", generatedSessionId);
    setPlayerCode("Player-A");
    setPlaytestGroup("Internal UI Test");
    setViewMode("player");
    setSelectedWarningStatus("all");
    setSelectedDecisionFrame("Knowledge");
    setShowModeratorData(false);
    window.localStorage.removeItem("silence-city-playtest-record-v1");
    window.localStorage.removeItem("silence-city-submitted-snapshots-v1");
    setLastStateChange("No civic proposal has been resolved yet.");
  }

  function createResolution() {
    if (action.includes("Salvage")) {
      return {
        result: `${role} recovered Scrap x1 and Data Fragment x1.`,
        publicChange:
          disposition === "Deposit to Public Storage"
            ? "Public Storage: Scrap +1, Data Fragment +1."
            : disposition === "List on Market"
              ? "Market: new listing created. Treasury receives +1 listing fee."
              : disposition === "Sell directly to Treasury / Public Order"
                ? "Treasury purchase prepared. Market transaction fee may apply."
                : disposition === "Keep in Personal Inventory"
                  ? "Resources remain private. Public reserve pressure continues."
                  : "Moderator will ask for final disposition after revealing the result.",
        contribution: `${role} converted field uncertainty into usable supply pressure.`,
        memory: `${role} shaped the first public supply decision after Market unlock.`,
      };
    }

    if (action.includes("Price")) {
      return {
        result: `${role} held a Public Price Hearing around scarce public supply.`,
        publicChange: "Treasury +1. Public trust improves slightly as market pricing becomes visible.",
        contribution: `${role} turned private pricing into a public discussion.`,
        memory: `${role} helped define civic pricing norms in the district.`,
      };
    }

    if (action.includes("Treasury") || action.includes("Charter")) {
      return {
        result: `${role} strengthened public coordination around Treasury / Charter behavior.`,
        publicChange: "Public trust improves slightly. Treasury pressure becomes easier to discuss.",
        contribution: `${role} turned private choices into a public discussion.`,
        memory: `${role} helped define how the district handles public funds and civic authority.`,
      };
    }

    if (action.includes("AI") || action.includes("Archive")) {
      return {
        result: `${role} clarified system uncertainty and exposed a route-related signal.`,
        publicChange: "AI Stability or Archive confidence improves. Data remains strategically important.",
        contribution: `${role} made hidden system pressure easier to interpret.`,
        memory: `${role} connected damaged AI records to public decision-making.`,
      };
    }

    if (action.includes("Storage") || action.includes("Delivery") || action.includes("Route")) {
      return {
        result: `${role} improved public handling of storage, delivery, or route safety.`,
        publicChange: "Transfer risk is reduced. Future public purchases become easier to resolve.",
        contribution: `${role} made public logistics visible instead of invisible.`,
        memory: `${role} strengthened the district's supply chain discipline.`,
      };
    }

    return {
      result: `${role} completed ${action}.`,
      publicChange: "District pressure shifts slightly based on moderator resolution.",
      contribution: `${role} contributed to the district recovery path.`,
      memory: `${role} left a trace in the Day 4 civic record.`,
    };
  }

  const resolution = createResolution();

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Silence City — District Council Interface v1.2.3
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold">Old Industrial Sector — Day {day} / 14</h1>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-2xl border bg-white px-4 py-2 text-sm font-semibold text-slate-600">
                Player View
              </span>
              <button
                onClick={resetScenario}
                className="rounded-2xl border bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Reset Scenario
              </button>
            </div>
          </div>
          <p className="mt-2 text-slate-600">
            Zone Condition: Functional but weak · Market and Treasury systems are becoming available
          </p>

          <div className="mt-4 rounded-2xl border bg-slate-50 p-3">
            <div className="flex items-center justify-between text-sm">
              <p className="font-bold text-slate-700">Campaign Clock</p>
              <p className="font-semibold text-slate-600">Day {day} / 14 · {dayProgress}%</p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-slate-900 transition-all"
                style={{ width: `${dayProgress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Each resolved civic outcome advances the 14-day district test.
            </p>
          </div>

          <p className="mt-2 text-sm font-semibold text-slate-500">
            Current View: {viewMode === "player" ? "Player-facing playtest UI" : "Moderator / backend testing UI"}
          </p>
        </header>

        

        {viewMode === "player" && (
          <section className="rounded-3xl border border-amber-200 bg-gradient-to-br from-white via-amber-50 to-slate-50 p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">First Time?</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">Guide a damaged district through 14 days.</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  Each day, choose one civic role and one action. Your goal is to prepare the district to open the Route Gate before Day 14 ends.
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  You do not need to maximize every stat. You need enough Power, resources, Treasury, and civic readiness to open the gate.
                </p>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-3 lg:min-w-[280px]">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Start Here</p>
                <ol className="mt-2 space-y-1 text-sm text-slate-700">
                  <li><strong>1.</strong> Read today&apos;s problem.</li>
                  <li><strong>2.</strong> Choose who acts today.</li>
                  <li><strong>3.</strong> Choose one action.</li>
                  <li><strong>4.</strong> Submit, then End Day.</li>
                  <li><strong>5.</strong> Read what changed.</li>
                </ol>
              </div>
            </div>
          </section>
        )}

        




        {viewMode === "player" && (
          <section className="rounded-3xl border bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-slate-700">District Brief</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">Today&apos;s Priority: {civicPriority}</h2>
                <p className="mt-2 text-sm text-slate-600">{civicPriorityReason}</p>
              </div>
            </div>
          </section>
        )}

        {viewMode === "player" && (
          <section className="rounded-2xl border bg-white px-4 py-3 shadow-sm">
            <div className="mb-4 rounded-3xl border border-amber-200 bg-gradient-to-br from-white via-amber-50 to-slate-50 p-4 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Mission</p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-950">Open the Route Gate by Day 14</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Route Gate: {visibleRouteGatePassedCount} of {visibleRouteGateChecks.length} requirements met
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[360px]">
                  <div className="rounded-2xl border bg-slate-50 p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Current Step</p>
                    <p className="mt-1 text-base font-bold text-slate-900">{currentStepText}</p>
                    <p className="mt-1 text-xs text-slate-500">{currentStepDetail}</p>
                  </div>

                  <div className="rounded-2xl border bg-slate-50 p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Route Gate Readiness</p>
                    <p className="mt-1 text-base font-bold text-slate-900">{visibleRouteGatePassedCount} / {visibleRouteGateChecks.length} ready</p>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className={`h-full rounded-full ${visibleRouteGatePassedCount === visibleRouteGateChecks.length ? "bg-emerald-500" : "bg-amber-400"}`} style={{ width: `${visibleRouteGateProgress}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs font-bold uppercase tracking-wide text-slate-700">How Today Works</p>
            <div className="mt-2 grid gap-2 md:grid-cols-4">
              {[
                { step: "1", label: "Choose Role", detail: role },
                { step: "2", label: "Propose Action", detail: action },
                { step: "3", label: "End Day", detail: submitted ? proposalStatus : "Submit first" },
                { step: "4", label: "Read Outcome", detail: resolved ? `Day ${lastResolvedDay}` : "After End Day" },
              ].map((item) => (
                <div key={item.step} className="rounded-2xl border bg-slate-50 p-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">{item.step}</span>
                    <p className="font-bold text-slate-700">{item.label}</p>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{item.detail}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Each day, choose one role, propose one action, end the day, then read what changed.
            </p>
          </section>
        )}



        {viewMode === "player" && (
          <section className="rounded-3xl border bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-indigo-700">Step 1 — Choose Who Acts Today</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">Who speaks for the district today?</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Select one civic role. Each role opens a different set of district actions.
                </p>
              </div>
            </div>

            <div className="mt-3 grid auto-rows-fr gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {(Object.keys(roles) as RoleName[]).map((item) => (
                <button
                  key={item}
                  onClick={() => changeRole(item)}
                  className={`rounded-2xl border p-3 text-left text-sm transition ${
                    role === item ? "bg-slate-900 text-white" : "bg-slate-50 hover:bg-white"
                  }`}
                >
                  <p className="flex items-center gap-2 font-bold">
                    <span className="text-lg leading-none">{roles[item].icon}</span>
                    <span>{item}</span>
                  </p>
                  <p className={`mt-2 line-clamp-3 flex-1 text-xs leading-5 ${role === item ? "text-slate-200" : "text-slate-600"}`}>{roles[item].focus}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {viewMode === "player" && (
          <section className="grid gap-4 lg:grid-cols-1">
            <Panel title={`Step 2 — Choose Today’s Action — ${role}`}>
              <div className="rounded-2xl border bg-slate-50 p-3 text-sm text-slate-700">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Role Concern</p>
                <p className="mt-1 font-semibold text-slate-900">{currentRole.pressure}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Best use: {currentRole.focus} · Tradeoff: {currentRole.risk}
                </p>
              </div>

              <div className="mt-3">
                <p className="text-sm font-semibold">Choose district action</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {currentRole.actions.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      if (resolved && item === action) {
                        setLastStateChange("This submitted proposal has already been resolved. Choose a different proposal before submitting again.");
                        return;
                      }

                      setAction(item);
                      setSubmitted(false);
                      setResolved(false);
                      setLastStateChange(item === action ? "Same proposal selected. No new submission created." : "New proposal selected. Ready to submit.");
                    }}
                    className={`min-h-14 rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      action === item ? "bg-slate-900 text-white" : "bg-slate-50 hover:bg-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
                </div>
              </div>

              <div className="mt-3 rounded-2xl border bg-white p-3 text-sm">
                <p className="font-bold text-slate-700">Proposed Action: {action}</p>
                <p className="mt-1 text-slate-600">{selectedActionEffectPreview}</p>
                <p className="mt-2 text-xs text-slate-500">Civic fit: {proposalFit}</p>
              </div>

              <div className="mt-3 block text-sm">
                <span className="font-semibold text-slate-700">Resource Destination</span>
                <select
                  value={action.includes("Salvage") ? disposition : "Not applicable"}
                  onChange={(event) => setDisposition(event.target.value)}
                  disabled={!action.includes("Salvage")}
                  className="mt-2 w-full rounded-2xl border bg-white p-3 disabled:bg-slate-50 disabled:text-slate-500"
                >
                  {action.includes("Salvage") ? (
                    <>
                      <option>Deposit to Public Storage</option>
                      <option>List on Market</option>
                    </>
                  ) : (
                    <option>Not applicable</option>
                  )}


                </select>
              </div>

              <label className="mt-3 block text-sm">
                <span className="font-semibold text-slate-700">Council Reason</span>
                <select
                  value={selectedDecisionFrame}
                  onChange={(event) => setSelectedDecisionFrame(event.target.value as DecisionFrameName)}
                  className="mt-2 w-full rounded-2xl border bg-white p-3"
                >
                  {(Object.keys(decisionFrames) as DecisionFrameName[]).map((item) => (
                    <option key={item} value={item}>
                      {item} — {decisionFrames[item].summary}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-slate-500">Use this to explain what kind of civic logic supports the proposal.</p>
              </label>

              <label className="mt-3 block text-sm">
                <span className="font-semibold text-slate-700">Optional Council Note</span>
                <textarea
                  value={intent}
                  onChange={(event) => setIntent(event.target.value)}
                  placeholder="Optional context for other players or the moderator."
                  className="mt-2 min-h-20 w-full rounded-2xl border bg-white p-3"
                />
              </label>

              <p className="mt-3 text-xs font-semibold text-slate-500">
                Next step: {submitted && !resolved ? "End the day to apply the proposal." : resolved ? "Outcome resolved. Start the next proposal for the new day." : "Submit the proposal to unlock End Day."}
              </p>

              <div className="mt-4 grid gap-2 md:grid-cols-2">
                <button
                  onClick={() => {
                    setSubmitted(true);
                    setResolved(false);
                    setLastStateChange("Civic proposal submitted. Resolve today’s outcome when ready.");
                  }}
                  disabled={resolved}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed ${submitted && !resolved ? "border bg-white text-slate-500" : "bg-slate-900 text-white disabled:bg-slate-300"}`}
                >
                  Submit to Council
                </button>
                <button
                  onClick={resolveDay}
                  disabled={!submitted || resolved}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 ${submitted && !resolved ? "bg-slate-900 text-white shadow-sm hover:bg-slate-800" : "bg-slate-50 text-slate-700 hover:bg-white"}`}
                >
                  {submitted ? "End Day" : "Submit First"}
                </button>
                <button
                  onClick={() => {
                    if (resolved) {
                      setSubmitted(false);
                      setResolved(false);
                      setLastStateChange("New day started. Choose or revise the next proposal.");
                      return;
                    }

                    setSubmitted(false);
                    setLastStateChange("Proposal returned to draft. You may revise before resolving.");
                  }}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${resolved ? "bg-slate-900 text-white shadow-sm hover:bg-slate-800" : "bg-white text-slate-700 hover:bg-slate-50"}`}
                >
                  {resolved ? "Start Next Proposal" : "Return to Draft"}
                </button>
              </div>
            </Panel>
          </section>
        )}

        {viewMode === "player" && (
          <section className="rounded-2xl border bg-white px-4 py-3 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-700">Latest Outcome</p>
                <p className="mt-1 text-sm text-slate-600">{latestCivicEffectText}</p>
              </div>
              <div className="rounded-2xl border bg-slate-50 px-3 py-2 text-xs text-slate-600 md:max-w-md">
                <span className="font-semibold text-slate-700">End-of-Day:</span> {dailyOutcomeReportText}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {(lastNetStatChanges.length > 0 ? lastNetStatChanges : ["No stat change has been resolved yet."]).map((item) => (
                <span key={item} className={`rounded-full border bg-slate-50 px-3 py-1 ${getOutcomeChangeTextClass(item)}`}>
                  {item}
                </span>
              ))}
            </div>
          </section>
        )}

        {viewMode === "player" && (
          <section className="grid gap-4 lg:grid-cols-1">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-slate-700">Moderator Data</p>
              <p className="mt-1 text-sm text-slate-600">
                Auto-submit is {autoSubmitOnResolve ? "enabled" : "disabled"}. {playtestRecord.length} records saved · {submittedSnapshots.length} submitted snapshots.
              </p>
            </div>
            </div>

            {showModeratorData && (
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border bg-slate-50 p-3 text-sm text-slate-700">
                  <p className="font-bold uppercase tracking-wide text-slate-700">Playtest Record Log</p>
                  <p className="mt-1 text-xs text-slate-500">Saved in browser localStorage, exportable as JSON, and submitted to the local backend API.</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button onClick={() => copyTextToClipboard(playtestRecord.join("\n"), "Playtest log copied.")} className="rounded-xl border bg-white px-3 py-2 text-xs font-semibold hover:bg-slate-50">Copy Log</button>
                    <button onClick={() => copyTextToClipboard(playtestSnapshotJson, "JSON snapshot copied.")} className="rounded-xl border bg-white px-3 py-2 text-xs font-semibold hover:bg-slate-50">Copy JSON Snapshot</button>
                    <button onClick={downloadJsonSnapshot} className="rounded-xl border bg-white px-3 py-2 text-xs font-semibold hover:bg-slate-50">Download JSON Snapshot</button>
                    <button onClick={() => void submitSnapshotToLocalQueue("manual")} className="rounded-xl border bg-white px-3 py-2 text-xs font-semibold hover:bg-slate-50">Submit Snapshot</button>
                    <button onClick={() => setPlaytestRecord([])} className="rounded-xl border bg-white px-3 py-2 text-xs font-semibold hover:bg-slate-50">Clear Saved Log</button>
                  </div>

                  <label className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                    <input
                      type="checkbox"
                      checked={autoSubmitOnResolve}
                      onChange={(event) => setAutoSubmitOnResolve(event.target.checked)}
                    />
                    Auto-submit snapshot when End Day completes
                  </label>
                </div>

                <div className="rounded-2xl border bg-slate-50 p-3 text-sm text-slate-700">
                  <p className="font-bold uppercase tracking-wide text-slate-700">Backend Snapshot Preview</p>
                  <p className="mt-1 text-xs text-slate-500">{sessionId} · {playerCode} · {playtestGroup}</p>
                  <p className="mt-2 text-xs text-slate-600">
                    Day {day} · {routeGatePassedCount}/{routeGateChecks.length} full Route Gate ready · {playtestRecord.length} records saved · {submittedSnapshots.length} submitted snapshots
                  </p>
                  <p className="mt-2 text-xs text-slate-500">Copy status: {copyStatus}</p>
                </div>

                <div className="rounded-2xl border bg-slate-50 p-3 text-sm text-slate-700 lg:col-span-2">
                  <p className="font-bold uppercase tracking-wide text-slate-700">Submitted Snapshot Queue</p>
                  <div className="mt-2 max-h-48 space-y-2 overflow-y-auto pr-2 text-xs text-slate-600">
                    {(submittedSnapshots.length > 0 ? submittedSnapshots : ["No submitted snapshots yet."]).map((item) => (
                      <p key={item} className="rounded-xl border bg-white p-2">{item}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        <section className="rounded-3xl border bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-slate-700">District Records</p>
              <p className="mt-1 text-sm text-slate-600">Review the district outcome, civic memory, and past actions after ending the day.</p>
            </div>
            <div className="rounded-2xl border bg-slate-50 px-3 py-2 text-xs text-slate-600">
              Last resolved day: <strong className="text-slate-900">{lastResolvedDay ?? "None"}</strong>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border bg-slate-50 p-3 text-sm text-slate-700 lg:col-span-2">
              <p className="font-bold uppercase tracking-wide text-slate-700">Today’s Outcome</p>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border bg-white p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Immediate Effect</p>
                  <p className="mt-1 text-sm text-slate-700">{latestCivicEffectText}</p>
                </div>
                <div className="rounded-xl border bg-white p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">End-of-Day Report</p>
                  <p className="mt-1 text-sm text-slate-700">{dailyOutcomeReportText}</p>
                </div>
              </div>

              <div className="mt-3 rounded-xl border bg-white p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Numeric Changes</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {(lastNetStatChanges.length > 0 ? lastNetStatChanges : ["No numeric change has been resolved yet."]).map((item) => (
                    <span key={item} className={`rounded-full border bg-slate-50 px-3 py-1 ${getOutcomeChangeTextClass(item)}`}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-3 text-sm text-slate-700">
              <p className="font-bold uppercase tracking-wide text-slate-700">Civic Memory</p>
              <ul className="mt-2 max-h-48 space-y-2 overflow-y-auto pr-2 text-xs">
                {cityMemory.map((item, index) => (
                  <li key={`${item}-${index}`} className="rounded-xl border bg-white p-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border bg-slate-50 p-3 text-sm text-slate-700">
              <p className="font-bold uppercase tracking-wide text-slate-700">District Readiness</p>
              <div className="mt-2 grid gap-2 text-xs">
                <Readiness label="Operational Stability" value="strained but recoverable" />
                <Readiness label="Public Reserve" value="thin; Data missing" />
                <Readiness label="Civic Authority" value="forming" />
                <Readiness label="Supply Infrastructure" value="not licensed yet" />
                <Readiness label="Route Readiness" value="uncertain" />
              </div>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-3 text-sm text-slate-700">
              <p className="font-bold uppercase tracking-wide text-slate-700">Past Actions</p>
              <ul className="mt-2 max-h-56 space-y-2 overflow-y-auto pr-2 text-xs">
                {actionHistory.map((item, index) => (
                  <li key={`${item}-${index}`} className="rounded-xl border bg-white p-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border bg-slate-50 p-3 text-sm text-slate-700">
              <p className="font-bold uppercase tracking-wide text-slate-700">Scenario Background</p>
              <p className="mt-1 text-xs text-slate-500">Fixed opening context for this prototype, not generated by the current player action.</p>
              <ul className="mt-2 space-y-2 text-xs">
                <li className="rounded-xl border bg-white p-2">A stabilized Power before it slipped below safe range.</li>
                <li className="rounded-xl border bg-white p-2">B recovered Structural Parts and helped refill basic supply.</li>
                <li className="rounded-xl border bg-white p-2">E advanced Charter to 3 / 5, unlocking civic systems.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-700">{title}</h2>
      {children}
    </section>
  );
}

function Status({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <div className="rounded-2xl border bg-slate-50 p-3">
      <div className="flex items-center justify-between">
        <span className="font-medium">{label}</span>
        <span className="text-xl font-bold">{value}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-200">
        <div className="h-2 rounded-full bg-slate-800" style={{ width: `${value}%` }} />
      </div>
      <p className="mt-1 text-sm text-slate-500">{note}</p>
    </div>
  );
}

function Readiness({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-slate-50 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}