/* eslint-disable react-hooks/set-state-in-effect, react-hooks/immutability, react-hooks/exhaustive-deps, @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  BadgeCheck,
  Building2,
  Clock,
  EyeOff,
  GitBranch,
  Handshake,
  Landmark,
  Link2Off,
  Package,
  RadioTower,
  ReceiptText,
  Route,
  Scale,
  Shield,
  ShieldCheck,
  TriangleAlert,
  UserX,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

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

const dashboardConnections = [
  { from: "Silence City", to: "Port District", status: "Contested" },
  { from: "Port District", to: "Industrial Ward", status: "Blocked" },
  { from: "Industrial Ward", to: "Silence City", status: "Delayed" },
];

const initialDashboardCities = [
  {
    name: "Silence City",
    role: "Council seat / public storage",
    routeStatus: "Unknown",
    stats: { supplies: 56, infrastructure: 39, civicOrder: 37, publicTrust: 34 },
  },
  {
    name: "Port District",
    role: "Cargo yards / water access",
    routeStatus: "Contested",
    stats: { supplies: 62, infrastructure: 32, civicOrder: 33, publicTrust: 41 },
  },
  {
    name: "Industrial Ward",
    role: "Repair crews / power relays",
    routeStatus: "Blocked",
    stats: { supplies: 36, infrastructure: 51, civicOrder: 35, publicTrust: 47 },
  },
];

const initialDashboardMetrics = {
  publicTrust: 49,
  lawCapacity: 37,
  underworldInfluence: 54,
  publicFear: 60,
  legitimacy: 45,
};

const initialResponseResources = {
  emergencySupplies: 3,
  laborPool: 3,
};

type DashboardCityStats = typeof initialDashboardCities[number]["stats"];
type DashboardMetricState = typeof initialDashboardMetrics;
type ResponseResources = typeof initialResponseResources;
type ResponseCosts = Partial<ResponseResources & { lawCapacity: number }>;
type DashboardDecisionOption = {
  label: string;
  action: string;
  role: RoleName;
  consequence: string;
  previewBadges: string[];
  summary: string;
  Icon: LucideIcon;
  cityDeltas: Partial<Record<string, Partial<Record<keyof DashboardCityStats, number>>>>;
  metricDeltas: Partial<Record<keyof DashboardMetricState, number>>;
  routeUpdates: Array<{ from: string; to: string; status: string }>;
};

type DashboardDeltas = {
  cityDeltas: Partial<Record<string, Partial<Record<keyof DashboardCityStats, number>>>>;
  metricDeltas: Partial<Record<keyof DashboardMetricState, number>>;
  routeUpdates: Array<{ from: string; to: string; status: string }>;
};

type PressureResponse = DashboardDeltas & {
  id: string;
  title: string;
  strategyType: "formal" | "underworld" | "redirect";
  outcomeType: "resolved" | "contained" | "compromised";
  description: string;
  previewBadges: string[];
  costs: ResponseCosts;
  summary: string;
  Icon: LucideIcon;
};

type PressureCrisis = {
  id: string;
  title: string;
  city: string;
  source: string;
  risk: "Low" | "Guarded" | "Unstable" | "Critical";
  affectedSystems: string;
  description: string;
  recommendedCrewIds: string[];
  escalated?: boolean;
  unresolvedPenalty: DashboardDeltas & { summary: string };
  responses: PressureResponse[];
};

type CrewMember = {
  id: string;
  name: string;
  specialty: string;
  fatigue: number;
  status: "available" | "assigned";
};

type PlannedOperation = {
  crisisId: string;
  responseId: string;
  crewId: string;
};

type OperationSlot = {
  id: "slot-1" | "slot-2";
  label: string;
  crisisId: string | null;
  crewId: string | null;
  responseId: string | null;
};

type MissionReportEntry =
  | {
    id: string;
    kind: "planned";
    crewId: string;
    crewName: string;
    crisisTitle: string;
    city: string;
    responseTitle: string;
    outcomeType: PressureResponse["outcomeType"];
    crewMatched: boolean;
    fatigueStatus: "Ready" | "Strained" | "Exhausted";
    fatigueChange: number;
    fatigueNote: string;
    summary: string;
  }
  | {
    id: string;
    kind: "unresolved";
    crisisTitle: string;
    city: string;
    previousRisk: PressureCrisis["risk"];
    newRisk: PressureCrisis["risk"];
    summary: string;
  };

const dashboardCrises = [
  {
    title: "Local boss demands cargo access at the Port locks",
    source: "Harbor Local Boss / Port District",
    urgency: "Critical",
    risk: "Critical",
    affected: "Port District",
    systems: "Supplies / Trust / Law",
    options: [
      {
        label: "Deploy Law Force",
        action: "Patrol Route",
        role: "Security" as RoleName,
        consequence: "+Legitimacy, -Law Capacity, possible retaliation",
        previewBadges: ["+Legitimacy", "-Law Capacity", "-Underworld", "-Fear"],
        summary: "Law Force secured the Port locks, but the corridor now depends on exhausted officers.",
        Icon: ShieldCheck,
        cityDeltas: { "Port District": { civicOrder: 10, publicTrust: -3 } },
        metricDeltas: { lawCapacity: -9, underworldInfluence: -5, publicFear: -4, legitimacy: 7 },
        routeUpdates: [{ from: "Silence City", to: "Port District", status: "Delayed" }],
      },
      {
        label: "Negotiate with Local Boss",
        action: "Broker Supply Deal",
        role: "Merchant" as RoleName,
        consequence: "+Supplies, +Underworld Debt, -Legitimacy",
        previewBadges: ["+Supplies", "+Underworld", "-Legitimacy", "-Trust"],
        summary: "Cargo moved again after a private bargain, and the public noticed who controlled the lock.",
        Icon: EyeOff,
        cityDeltas: { "Port District": { supplies: 12, publicTrust: -6 } },
        metricDeltas: { publicTrust: -4, underworldInfluence: 9, publicFear: -3, legitimacy: -6 },
        routeUpdates: [{ from: "Silence City", to: "Port District", status: "Delayed" }],
      },
      {
        label: "Delay and Support Another City",
        action: "Coordinate Work Crews",
        role: "Planner" as RoleName,
        consequence: "+Industrial Infrastructure, -Port Trust",
        previewBadges: ["+Infrastructure", "+Law Capacity", "+Fear", "-Trust"],
        summary: "Industrial crews gained time, while Port workers marked the delay as abandonment.",
        Icon: Clock,
        cityDeltas: { "Industrial Ward": { infrastructure: 10 }, "Port District": { publicTrust: -7 } },
        metricDeltas: { lawCapacity: 3, publicTrust: -3, publicFear: 5, legitimacy: -2 },
        routeUpdates: [{ from: "Port District", to: "Industrial Ward", status: "Unknown" }],
      },
    ],
  },
  {
    title: "Industrial generator failure darkens the relay sheds",
    source: "Relay Engineers / Industrial Ward",
    urgency: "High",
    risk: "Unstable",
    affected: "Industrial Ward",
    systems: "Infrastructure / Public Fear / Trust",
    options: [
      {
        label: "Deploy Law Force",
        action: "Escort Public Delivery",
        role: "Security" as RoleName,
        consequence: "+Civic Order, -Law Capacity, fear contained",
        previewBadges: ["+Civic Order", "-Law Capacity", "-Fear", "Route Risk"],
        summary: "Escorts kept repair crews moving, though Law Force capacity thinned further.",
        Icon: ShieldCheck,
        cityDeltas: { "Industrial Ward": { civicOrder: 8, publicTrust: 2 } },
        metricDeltas: { lawCapacity: -7, publicFear: -5, legitimacy: 3 },
        routeUpdates: [],
      },
      {
        label: "Negotiate with Local Boss",
        action: "Broker Supply Deal",
        role: "Merchant" as RoleName,
        consequence: "+Supplies, +Underworld Influence, -Legitimacy",
        previewBadges: ["+Supplies", "+Infrastructure", "+Underworld", "-Legitimacy"],
        summary: "Private fuel restored the shed lights, but the source became part of the story.",
        Icon: EyeOff,
        cityDeltas: { "Industrial Ward": { supplies: 10, infrastructure: 3 } },
        metricDeltas: { underworldInfluence: 7, publicFear: -2, legitimacy: -5 },
        routeUpdates: [],
      },
      {
        label: "Delay and Support Another City",
        action: "Coordinate Work Crews",
        role: "Planner" as RoleName,
        consequence: "+Industrial Infrastructure, -Silence City Trust",
        previewBadges: ["+Infrastructure", "-Trust", "+Fear", "Risk: Delay"],
        summary: "Repair plans stabilized the generator, while Silence City saw another promise postponed.",
        Icon: Clock,
        cityDeltas: { "Industrial Ward": { infrastructure: 8 }, "Silence City": { publicTrust: -8, infrastructure: -4 } },
        metricDeltas: { publicTrust: -5, publicFear: 6 },
        routeUpdates: [{ from: "Industrial Ward", to: "Silence City", status: "Delayed" }],
      },
    ],
  },
  {
    title: "Workers refuse dangerous repairs on the Port relay",
    source: "Crew Delegates / Industrial Ward",
    urgency: "High",
    risk: "Unstable",
    affected: "Industrial Ward",
    systems: "Infrastructure / Route Gate / Legitimacy",
    options: [
      {
        label: "Deploy Law Force",
        action: "Patrol Route",
        role: "Security" as RoleName,
        consequence: "+Civic Order, -Trust, -Law Capacity",
        previewBadges: ["+Civic Order", "-Trust", "-Law Capacity", "+Fear"],
        summary: "The refusal ended under pressure, but the crews logged the order as coercion.",
        Icon: ShieldCheck,
        cityDeltas: { "Industrial Ward": { civicOrder: 9, publicTrust: -6 } },
        metricDeltas: { lawCapacity: -8, publicFear: 3, legitimacy: 2 },
        routeUpdates: [{ from: "Port District", to: "Industrial Ward", status: "Contested" }],
      },
      {
        label: "Negotiate with Local Boss",
        action: "Broker Supply Deal",
        role: "Merchant" as RoleName,
        consequence: "+Supplies, +Underworld Influence, route delay reduced",
        previewBadges: ["+Supplies", "+Infrastructure", "+Underworld", "-Legitimacy"],
        summary: "A side channel supplied safer gear and made the underworld look more useful than council.",
        Icon: EyeOff,
        cityDeltas: { "Industrial Ward": { supplies: 8, infrastructure: 4 } },
        metricDeltas: { underworldInfluence: 6, legitimacy: -4 },
        routeUpdates: [{ from: "Port District", to: "Industrial Ward", status: "Delayed" }],
      },
      {
        label: "Delay and Support Another City",
        action: "Coordinate Work Crews",
        role: "Planner" as RoleName,
        consequence: "+Silence City Infrastructure, -Industrial Trust",
        previewBadges: ["+Infrastructure", "+Law Capacity", "-Trust", "+Fear"],
        summary: "The dangerous repair was deferred, shifting crews to safer work and leaving the relay strained.",
        Icon: Clock,
        cityDeltas: { "Silence City": { infrastructure: 7 }, "Industrial Ward": { publicTrust: -6 } },
        metricDeltas: { publicTrust: -2, lawCapacity: 2, publicFear: 4 },
        routeUpdates: [{ from: "Industrial Ward", to: "Silence City", status: "Stable" }],
      },
    ],
  },
  {
    title: "Rumor of hidden medicine fractures the ration line",
    source: "Clinic Archivist / Silence City",
    urgency: "Medium",
    risk: "Guarded",
    affected: "Silence City",
    systems: "Public Trust / Supplies / Underworld",
    options: [
      {
        label: "Deploy Law Force",
        action: "Investigate Dispute",
        role: "Security" as RoleName,
        consequence: "+Legitimacy, -Law Capacity, fear rises",
        previewBadges: ["+Legitimacy", "-Law Capacity", "+Fear", "Risk: Unrest"],
        summary: "The ration line held, but people remembered the uniforms more than the explanation.",
        Icon: ShieldCheck,
        cityDeltas: { "Silence City": { civicOrder: 7, publicTrust: -2 } },
        metricDeltas: { lawCapacity: -6, publicFear: 3, legitimacy: 5 },
        routeUpdates: [],
      },
      {
        label: "Negotiate with Local Boss",
        action: "Broker Supply Deal",
        role: "Merchant" as RoleName,
        consequence: "+Supplies, +Underworld Debt, -Public Trust",
        previewBadges: ["+Supplies", "+Underworld", "-Trust", "-Legitimacy"],
        summary: "Medicine appeared quickly and the rumor shifted from panic to suspicion.",
        Icon: EyeOff,
        cityDeltas: { "Silence City": { supplies: 9, publicTrust: -5 } },
        metricDeltas: { publicTrust: -4, underworldInfluence: 8, legitimacy: -4 },
        routeUpdates: [],
      },
      {
        label: "Delay and Support Another City",
        action: "Medical Triage",
        role: "Medicine" as RoleName,
        consequence: "+Port Trust, -Silence City Supplies",
        previewBadges: ["+Trust", "-Supplies", "+Fear", "Risk: Delay"],
        summary: "Medical triage helped the Port, while Silence City saw shelves thin again.",
        Icon: Clock,
        cityDeltas: { "Port District": { publicTrust: 7 }, "Silence City": { supplies: -6 } },
        metricDeltas: { publicTrust: 2, publicFear: 4 },
        routeUpdates: [{ from: "Silence City", to: "Port District", status: "Stable" }],
      },
    ],
  },
  {
    title: "Medical convoy blocked outside the eastern gate",
    source: "Clinic Drivers / Route Gate",
    urgency: "High",
    risk: "Unstable",
    affected: "Silence City",
    systems: "Supplies / Route Gate / Public Fear",
    options: [
      {
        label: "Deploy Law Force",
        action: "Escort Public Delivery",
        role: "Security" as RoleName,
        consequence: "+Supplies, -Law Capacity, -Fear",
        previewBadges: ["+Supplies", "-Law Capacity", "-Fear", "+Legitimacy"],
        summary: "The convoy reached the clinics under escort, but the route guard rotation is stretched.",
        Icon: ShieldCheck,
        cityDeltas: { "Silence City": { supplies: 10, civicOrder: 4 } },
        metricDeltas: { lawCapacity: -7, publicFear: -6, legitimacy: 4 },
        routeUpdates: [{ from: "Industrial Ward", to: "Silence City", status: "Delayed" }],
      },
      {
        label: "Negotiate with Local Boss",
        action: "Broker Supply Deal",
        role: "Merchant" as RoleName,
        consequence: "+Supplies, +Underworld, -Legitimacy",
        previewBadges: ["+Supplies", "+Underworld", "-Legitimacy", "-Trust"],
        summary: "The convoy passed through a private guarantee, making public authority look optional.",
        Icon: EyeOff,
        cityDeltas: { "Silence City": { supplies: 12, publicTrust: -4 } },
        metricDeltas: { underworldInfluence: 8, legitimacy: -5, publicTrust: -3 },
        routeUpdates: [{ from: "Industrial Ward", to: "Silence City", status: "Stable" }],
      },
      {
        label: "Delay and Support Another City",
        action: "Medical Triage",
        role: "Medicine" as RoleName,
        consequence: "+Port Trust, -Silence Supplies, +Fear",
        previewBadges: ["+Trust", "-Supplies", "+Fear", "Risk: Delay"],
        summary: "Port clinics received help first, and Silence City residents counted the missing crates.",
        Icon: Clock,
        cityDeltas: { "Port District": { publicTrust: 8 }, "Silence City": { supplies: -8 } },
        metricDeltas: { publicTrust: 2, publicFear: 5 },
        routeUpdates: [],
      },
    ],
  },
  {
    title: "Route Gate overload stalls cross-city dispatch",
    source: "Gate Operators / Silence City",
    urgency: "High",
    risk: "Critical",
    affected: "Route Gate",
    systems: "Infrastructure / Route Network / Law Capacity",
    options: [
      {
        label: "Deploy Law Force",
        action: "Security Route Check",
        role: "Logistics" as RoleName,
        consequence: "+Civic Order, -Law Capacity, route contested",
        previewBadges: ["+Civic Order", "-Law Capacity", "-Fear", "Route Risk"],
        summary: "Law Force cleared the gate queue, but the network still feels brittle.",
        Icon: ShieldCheck,
        cityDeltas: { "Silence City": { civicOrder: 6 }, "Port District": { civicOrder: 4 } },
        metricDeltas: { lawCapacity: -8, publicFear: -3, legitimacy: 3 },
        routeUpdates: [{ from: "Silence City", to: "Port District", status: "Contested" }],
      },
      {
        label: "Negotiate with Local Boss",
        action: "Broker Supply Deal",
        role: "Merchant" as RoleName,
        consequence: "+Supplies, +Underworld, -Legitimacy",
        previewBadges: ["+Supplies", "+Underworld", "-Legitimacy", "-Trust"],
        summary: "Priority cargo moved through private scheduling, angering crews left in queue.",
        Icon: EyeOff,
        cityDeltas: { "Port District": { supplies: 8 }, "Industrial Ward": { supplies: 5 } },
        metricDeltas: { underworldInfluence: 7, legitimacy: -5, publicTrust: -2 },
        routeUpdates: [{ from: "Silence City", to: "Port District", status: "Delayed" }],
      },
      {
        label: "Delay and Support Another City",
        action: "Prioritize Route Gate",
        role: "Planner" as RoleName,
        consequence: "+Infrastructure, -Trust, route stabilized",
        previewBadges: ["+Infrastructure", "-Trust", "-Fear", "+Route"],
        summary: "Dispatch slowed for a day while operators rebuilt the queue discipline.",
        Icon: Clock,
        cityDeltas: { "Industrial Ward": { infrastructure: 7 }, "Silence City": { publicTrust: -4 } },
        metricDeltas: { publicTrust: -3, publicFear: -2, legitimacy: 2 },
        routeUpdates: [{ from: "Port District", to: "Industrial Ward", status: "Stable" }],
      },
    ],
  },
  {
    title: "Law Force demands black market warehouse inspection",
    source: "Law Force Command / Port District",
    urgency: "Medium",
    risk: "Guarded",
    affected: "Port District",
    systems: "Law Capacity / Underworld / Legitimacy",
    options: [
      {
        label: "Deploy Law Force",
        action: "Investigate Dispute",
        role: "Security" as RoleName,
        consequence: "+Legitimacy, -Underworld, -Law Capacity",
        previewBadges: ["+Legitimacy", "-Underworld", "-Law Capacity", "+Fear"],
        summary: "The inspection found contraband and made every warehouse owner choose a side.",
        Icon: ShieldCheck,
        cityDeltas: { "Port District": { civicOrder: 8, publicTrust: -2 } },
        metricDeltas: { lawCapacity: -9, underworldInfluence: -8, publicFear: 4, legitimacy: 7 },
        routeUpdates: [{ from: "Silence City", to: "Port District", status: "Contested" }],
      },
      {
        label: "Negotiate with Local Boss",
        action: "Public Price Hearing",
        role: "Negotiation" as RoleName,
        consequence: "+Trust, +Underworld, -Legitimacy",
        previewBadges: ["+Trust", "+Underworld", "-Legitimacy", "Debt +1"],
        summary: "The inspection became a hearing, and the warehouse stayed open under uneasy terms.",
        Icon: EyeOff,
        cityDeltas: { "Port District": { publicTrust: 5, supplies: 4 } },
        metricDeltas: { publicTrust: 4, underworldInfluence: 5, legitimacy: -3 },
        routeUpdates: [],
      },
      {
        label: "Delay and Support Another City",
        action: "Storage Audit",
        role: "Logistics" as RoleName,
        consequence: "+Supplies, -Trust, +Law Capacity",
        previewBadges: ["+Supplies", "+Law Capacity", "-Trust", "+Fear"],
        summary: "Council audited public stores instead, preserving Law Force capacity but dodging the warehouse fight.",
        Icon: Clock,
        cityDeltas: { "Silence City": { supplies: 5 }, "Port District": { publicTrust: -5 } },
        metricDeltas: { lawCapacity: 4, publicTrust: -2, publicFear: 3 },
        routeUpdates: [],
      },
    ],
  },
];

const routeGateMilestone = {
  title: "Route Gate Stabilization Vote",
  source: "Intercity Council / Route Gate",
  urgency: "Milestone",
  risk: "Critical",
  affected: "Route Gate",
  systems: "Route Stability / Civic Mandate / Phase II Access",
  options: [
    {
      label: "Seek Civic Mandate",
      action: "Charter Hearing",
      role: "Negotiation" as RoleName,
      consequence: "+Public Trust, +Legitimacy, slower Route progress",
      previewBadges: ["+Trust", "+Legitimacy", "Route Slow", "Mandate"],
      summary: "The council authorized Route Gate stabilization through public mandate. Phase II planning opens with stronger legitimacy and slower route work.",
      Icon: Handshake,
      cityDeltas: { "Silence City": { publicTrust: 9 }, "Port District": { publicTrust: 5 }, "Industrial Ward": { publicTrust: 5 } },
      metricDeltas: { publicTrust: 8, legitimacy: 10, publicFear: -3 },
      routeUpdates: [{ from: "Port District", to: "Industrial Ward", status: "Delayed" }],
    },
    {
      label: "Invoke Emergency Authority",
      action: "Prioritize Route Gate",
      role: "Security" as RoleName,
      consequence: "+Route Stability, +Public Fear, -Public Trust",
      previewBadges: ["+Route", "+Fear", "-Trust", "+Stability"],
      summary: "Emergency authority pushed stabilization through. Phase II opens quickly, but the public reads the mandate as thinner and more coercive.",
      Icon: ShieldCheck,
      cityDeltas: { "Silence City": { civicOrder: 8, publicTrust: -5 }, "Industrial Ward": { infrastructure: 7 } },
      metricDeltas: { publicTrust: -6, publicFear: 8, legitimacy: 3, lawCapacity: -5 },
      routeUpdates: [{ from: "Port District", to: "Industrial Ward", status: "Stable" }],
    },
    {
      label: "Accept Underworld Logistics Pact",
      action: "Broker Supply Deal",
      role: "Merchant" as RoleName,
      consequence: "+Supplies, +Route Access, +Underworld Influence, -Legitimacy",
      previewBadges: ["+Supplies", "+Route", "+Underworld", "-Legitimacy"],
      summary: "The underworld pact opened Route Gate access with immediate cargo support. Phase II begins with a logistics debt attached.",
      Icon: EyeOff,
      cityDeltas: { "Port District": { supplies: 12 }, "Industrial Ward": { supplies: 8 }, "Silence City": { publicTrust: -4 } },
      metricDeltas: { underworldInfluence: 12, legitimacy: -8, publicTrust: -3, publicFear: -2 },
      routeUpdates: [{ from: "Silence City", to: "Port District", status: "Stable" }],
    },
  ],
};

const pressureResponseTitles = [
  ["Secure port access with City Watch", "Trade lock access for cargo release", "Divert crews to Industrial repairs"],
  ["Escort generator repair crews", "Buy private fuel for the relays", "Shift load to Silence City reserves"],
  ["Order crews back under watch", "Trade for safer repair gear", "Reassign crews to safer grid work"],
  ["Investigate the ration rumor", "Source medicine through side channels", "Send triage teams to the Port"],
  ["Escort the medical convoy", "Trade warehouse access for medicine release", "Divert medicine from Silence City reserves"],
  ["Clear the Gate queue by force", "Sell priority access to private haulers", "Rebuild dispatch discipline"],
  ["Inspect the warehouse now", "Turn inspection into a public hearing", "Audit public stores first"],
];

const pressureResponseDescriptions = [
  [
    "Formal authority opens the lock with public visibility and strained officers.",
    "A private bargain moves cargo quickly while increasing informal control.",
    "The Port waits while scarce attention protects industrial infrastructure.",
  ],
  [
    "Escorts keep technicians moving through a fearful, darkened district.",
    "Private fuel restores power quickly and shifts credit away from council.",
    "Silence City absorbs the delay so relay crews can stabilize the generator.",
  ],
  [
    "Law Force pressure ends the refusal, but trust with repair crews weakens.",
    "Safer gear arrives through a side channel with political debt attached.",
    "Crews avoid the dangerous repair and reinforce safer civic systems instead.",
  ],
  [
    "A visible inquiry contains the line, though uniforms raise public anxiety.",
    "Medicine appears fast through unofficial channels and public suspicion rises.",
    "Port clinics get support first while Silence City absorbs supply strain.",
  ],
  [
    "The convoy reaches clinics under escort, spending scarce Law Force capacity.",
    "The convoy passes under a private guarantee that weakens public authority.",
    "Medicine is rerouted to stabilize another city while local fear grows.",
  ],
  [
    "Law Force clears movement at the gate but leaves the network brittle.",
    "Private scheduling moves key cargo and angers crews stuck in queue.",
    "Dispatch slows for a day while operators repair the system discipline.",
  ],
  [
    "A direct inspection challenges the underworld and risks retaliation.",
    "A hearing preserves supply access while blurring public authority.",
    "Council preserves Law Force capacity but dodges the warehouse confrontation.",
  ],
];

const initialCrewRoster: CrewMember[] = [
  { id: "city-watch", name: "City Watch", specialty: "Route security / public order", fatigue: 12, status: "available" },
  { id: "engineer-crew", name: "Engineer Crew", specialty: "Infrastructure / Route Gate repair", fatigue: 18, status: "available" },
  { id: "medical-team", name: "Medical Team", specialty: "Clinics / convoy triage", fatigue: 10, status: "available" },
  { id: "civic-mediator", name: "Civic Mediator", specialty: "Rumors / labor disputes / legitimacy", fatigue: 8, status: "available" },
];

const initialOperationSlots: OperationSlot[] = [
  { id: "slot-1", label: "Operation Slot 1", crisisId: null, crewId: null, responseId: null },
  { id: "slot-2", label: "Operation Slot 2", crisisId: null, crewId: null, responseId: null },
];

const pressureRecommendedCrewIds = [
  ["city-watch", "civic-mediator"],
  ["engineer-crew"],
  ["engineer-crew", "civic-mediator"],
  ["civic-mediator", "medical-team"],
  ["city-watch", "medical-team"],
  ["engineer-crew", "city-watch"],
  ["city-watch", "civic-mediator"],
];

const pressureUnresolvedPenalties: Array<PressureCrisis["unresolvedPenalty"]> = [
  {
    summary: "Unresolved Port lock pressure cut cargo flow and strengthened local bosses.",
    cityDeltas: { "Port District": { supplies: -7, publicTrust: -5, civicOrder: -3 } },
    metricDeltas: { underworldInfluence: 5, publicFear: 4, legitimacy: -3 },
    routeUpdates: [{ from: "Silence City", to: "Port District", status: "Blocked" }],
  },
  {
    summary: "The generator strain spread through relay sheds and raised public fear.",
    cityDeltas: { "Industrial Ward": { infrastructure: -8, supplies: -3 } },
    metricDeltas: { publicFear: 6, publicTrust: -3 },
    routeUpdates: [{ from: "Port District", to: "Industrial Ward", status: "Delayed" }],
  },
  {
    summary: "Repair crews stayed off the dangerous relay and infrastructure slipped.",
    cityDeltas: { "Industrial Ward": { infrastructure: -7, publicTrust: -4 } },
    metricDeltas: { legitimacy: -3, publicFear: 4 },
    routeUpdates: [{ from: "Port District", to: "Industrial Ward", status: "Contested" }],
  },
  {
    summary: "The medicine rumor hardened into public suspicion and ration pressure.",
    cityDeltas: { "Silence City": { publicTrust: -6, supplies: -4 } },
    metricDeltas: { publicTrust: -4, publicFear: 5, underworldInfluence: 3 },
    routeUpdates: [],
  },
  {
    summary: "The blocked convoy spoiled supplies and made route access feel unsafe.",
    cityDeltas: { "Silence City": { supplies: -8, publicTrust: -3 } },
    metricDeltas: { publicFear: 6, lawCapacity: -2 },
    routeUpdates: [{ from: "Industrial Ward", to: "Silence City", status: "Blocked" }],
  },
  {
    summary: "Route Gate overload damaged dispatch confidence across the network.",
    cityDeltas: { "Silence City": { infrastructure: -5 }, "Port District": { supplies: -4 }, "Industrial Ward": { infrastructure: -4 } },
    metricDeltas: { publicFear: 5, legitimacy: -4 },
    routeUpdates: [{ from: "Port District", to: "Industrial Ward", status: "Blocked" }],
  },
  {
    summary: "The uninspected warehouse expanded underworld leverage over public cargo.",
    cityDeltas: { "Port District": { civicOrder: -5, publicTrust: -4 } },
    metricDeltas: { underworldInfluence: 7, legitimacy: -4, lawCapacity: -2 },
    routeUpdates: [{ from: "Silence City", to: "Port District", status: "Contested" }],
  },
];

function getResponseCosts(optionIndex: number): ResponseCosts {
  if (optionIndex === 0) return { lawCapacity: 10, emergencySupplies: 0, laborPool: 1 };
  if (optionIndex === 1) return { lawCapacity: 0, emergencySupplies: 1, laborPool: 0 };
  return { lawCapacity: 0, emergencySupplies: 1, laborPool: 2 };
}

function getMilestoneResponseCosts(optionIndex: number): ResponseCosts {
  if (optionIndex === 0) return { lawCapacity: 0, emergencySupplies: 1, laborPool: 1 };
  if (optionIndex === 1) return { lawCapacity: 12, emergencySupplies: 0, laborPool: 2 };
  return { lawCapacity: 0, emergencySupplies: 2, laborPool: 0 };
}

function getOutcomeType(strategyType: PressureResponse["strategyType"], optionIndex: number): PressureResponse["outcomeType"] {
  if (strategyType === "underworld") return "compromised";
  if (strategyType === "formal") return "resolved";
  return optionIndex === 2 ? "contained" : "compromised";
}

function getFallbackResponse(crisisId: string): PressureResponse {
  return {
    id: `${crisisId}-fallback`,
    title: "Minimal Containment",
    strategyType: "redirect",
    outcomeType: "contained",
    description: "No-cost emergency option. It keeps the crisis playable, but mostly buys time and leaves public confidence strained.",
    previewBadges: ["No Cost", "-Trust", "+Fear", "Low Effect"],
    costs: {},
    summary: "Council issued a minimal containment order. The crisis did not receive real resources, so pressure remains visible.",
    Icon: Clock,
    cityDeltas: {},
    metricDeltas: { publicTrust: -2, publicFear: 2, legitimacy: -1 },
    routeUpdates: [],
  };
}

const dailyPressureCrisisPool: PressureCrisis[] = dashboardCrises.map((crisis, crisisIndex) => ({
  id: `pressure-${crisisIndex + 1}`,
  title: crisis.title,
  city: crisis.affected,
  source: crisis.source,
  risk: crisis.risk as PressureCrisis["risk"],
  affectedSystems: crisis.systems,
  description: `${crisis.urgency} pressure across ${crisis.systems}. Choose whether to spend action capacity here today.`,
  recommendedCrewIds: pressureRecommendedCrewIds[crisisIndex],
  unresolvedPenalty: pressureUnresolvedPenalties[crisisIndex],
  responses: [
    ...crisis.options.map((option, optionIndex) => ({
      id: `${crisisIndex + 1}-${optionIndex + 1}`,
      title: pressureResponseTitles[crisisIndex][optionIndex],
      strategyType: (optionIndex === 0 ? "formal" : optionIndex === 1 ? "underworld" : "redirect") as PressureResponse["strategyType"],
      outcomeType: getOutcomeType(optionIndex === 0 ? "formal" : optionIndex === 1 ? "underworld" : "redirect", optionIndex),
      description: pressureResponseDescriptions[crisisIndex][optionIndex],
      previewBadges: option.previewBadges,
      costs: getResponseCosts(optionIndex),
      summary: option.summary,
      Icon: option.Icon,
      cityDeltas: option.cityDeltas,
      metricDeltas: option.metricDeltas,
      routeUpdates: option.routeUpdates,
    })),
    getFallbackResponse(`pressure-${crisisIndex + 1}`),
  ],
}));

const routeGatePressureCrisis: PressureCrisis = {
  id: "route-gate-stabilization-vote",
  title: routeGateMilestone.title,
  city: routeGateMilestone.affected,
  source: routeGateMilestone.source,
  risk: routeGateMilestone.risk as PressureCrisis["risk"],
  affectedSystems: routeGateMilestone.systems,
  description: "Milestone vote for authorizing the next phase of intercity route operations.",
  recommendedCrewIds: ["engineer-crew", "civic-mediator"],
  unresolvedPenalty: {
    summary: "The council delayed Route Gate authorization and Phase II remains politically blocked.",
    cityDeltas: { "Silence City": { publicTrust: -4 }, "Port District": { publicTrust: -3 }, "Industrial Ward": { publicTrust: -3 } },
    metricDeltas: { legitimacy: -5, publicFear: 4 },
    routeUpdates: [{ from: "Port District", to: "Industrial Ward", status: "Contested" }],
  },
  responses: [
    ...routeGateMilestone.options.map((option, optionIndex) => ({
      id: `route-gate-${optionIndex + 1}`,
      title: option.label,
      strategyType: (optionIndex === 0 ? "formal" : optionIndex === 1 ? "redirect" : "underworld") as PressureResponse["strategyType"],
      outcomeType: getOutcomeType(optionIndex === 0 ? "formal" : optionIndex === 1 ? "redirect" : "underworld", optionIndex),
      description: option.consequence,
      previewBadges: option.previewBadges,
      costs: getMilestoneResponseCosts(optionIndex),
      summary: option.summary,
      Icon: option.Icon,
      cityDeltas: option.cityDeltas,
      metricDeltas: option.metricDeltas,
      routeUpdates: option.routeUpdates,
    })),
    getFallbackResponse("route-gate-stabilization-vote"),
  ],
};

const pressureCrisisPool: PressureCrisis[] = [...dailyPressureCrisisPool, routeGatePressureCrisis];

function getDailyPressureCrisisIds(dayNumber: number) {
  const startIndex = ((dayNumber - 1) * 3) % dailyPressureCrisisPool.length;
  const dailyIds = [0, 1, 2].map((offset) => dailyPressureCrisisPool[(startIndex + offset) % dailyPressureCrisisPool.length].id);
  return dayNumber === 14 ? [routeGatePressureCrisis.id, ...dailyIds.slice(0, 2)] : dailyIds;
}

const initialPressureCrisisIds = getDailyPressureCrisisIds(4);

function escalateRisk(risk: PressureCrisis["risk"]): PressureCrisis["risk"] {
  if (risk === "Low") return "Guarded";
  if (risk === "Guarded") return "Unstable";
  if (risk === "Unstable") return "Critical";
  return "Critical";
}

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

function getDistrictStatIcon(label: keyof DistrictStats) {
  if (label === "Power") return "⚡";
  if (label === "Infrastructure") return "🏗️";
  if (label === "Security") return "🛡️";
  if (label === "AI Stability") return "🧠";
  return "•";
}

function getPublicResourceIcon(label: keyof PublicStorage | "Treasury") {
  if (label === "Scrap") return "🔩";
  if (label === "Power Cell") return "🔋";
  if (label === "Data Fragment") return "💾";
  if (label === "Electronic Component") return "🧩";
  if (label === "Structural Part") return "🧱";
  if (label === "Treasury") return "🪙";
  return "•";
}

function getRouteStatusClass(status: string) {
  if (status === "Stable") return "border-emerald-300/40 bg-emerald-300/10 text-emerald-100";
  if (status === "Delayed") return "border-amber-300/40 bg-amber-300/10 text-amber-100";
  if (status === "Blocked") return "border-rose-300/40 bg-rose-300/10 text-rose-100";
  if (status === "Contested") return "border-orange-300/40 bg-orange-300/10 text-orange-100";
  return "border-slate-300/30 bg-slate-300/10 text-slate-200";
}

function getRiskClass(risk: string) {
  if (risk === "Critical") return "border-rose-300/60 bg-rose-300/15 text-rose-100";
  if (risk === "Unstable") return "border-orange-300/60 bg-orange-300/15 text-orange-100";
  if (risk === "Guarded") return "border-amber-300/60 bg-amber-300/15 text-amber-100";
  return "border-sky-300/40 bg-sky-300/10 text-sky-100";
}

function getRiskCardClass(risk: string) {
  if (risk === "Critical") return "border-rose-300/40 bg-rose-950/20";
  if (risk === "Unstable") return "border-orange-300/35 bg-orange-950/15";
  if (risk === "Guarded") return "border-amber-300/35 bg-amber-950/15";
  return "border-sky-300/25 bg-slate-950/70";
}

function getRiskStripeClass(risk: string) {
  if (risk === "Critical") return "bg-rose-300/80";
  if (risk === "Unstable") return "bg-orange-300/80";
  if (risk === "Guarded") return "bg-amber-300/80";
  return "bg-sky-300/70";
}

function getCrewAccentClass(crewId: string) {
  if (crewId === "city-watch") return "border-cyan-300/40 bg-cyan-300/10 text-cyan-100";
  if (crewId === "engineer-crew") return "border-amber-300/45 bg-amber-300/10 text-amber-100";
  if (crewId === "medical-team") return "border-teal-300/45 bg-teal-300/10 text-teal-100";
  if (crewId === "civic-mediator") return "border-violet-300/45 bg-violet-300/10 text-violet-100";
  return "border-slate-300/30 bg-slate-300/10 text-slate-200";
}

function getCrewStripeClass(crewId: string) {
  if (crewId === "city-watch") return "bg-cyan-300/75";
  if (crewId === "engineer-crew") return "bg-amber-300/75";
  if (crewId === "medical-team") return "bg-teal-300/75";
  if (crewId === "civic-mediator") return "bg-violet-300/75";
  return "bg-slate-300/60";
}

function getStrategyClass(strategyType: PressureResponse["strategyType"], outcomeType: PressureResponse["outcomeType"]) {
  if (strategyType === "formal") return "border-sky-300/45 bg-sky-300/10 text-sky-100";
  if (strategyType === "underworld") return "border-fuchsia-300/45 bg-fuchsia-300/10 text-fuchsia-100";
  if (outcomeType === "contained") return "border-slate-300/35 bg-slate-300/10 text-slate-200";
  return "border-amber-300/45 bg-amber-300/10 text-amber-100";
}

function getMissionMatchClass(crewMatched: boolean) {
  return crewMatched
    ? "border-emerald-300/45 bg-emerald-300/10 text-emerald-100"
    : "border-rose-300/45 bg-rose-300/10 text-rose-100";
}

function getEscalatedClass() {
  return "border-rose-300/55 bg-rose-300/15 text-rose-100";
}

function getPreviewBadgeClass(label: string) {
  if (label.startsWith("+")) return "border-emerald-300/40 bg-emerald-300/10 text-emerald-100";
  if (label.startsWith("-")) return "border-rose-300/40 bg-rose-300/10 text-rose-100";
  return "border-slate-300/30 bg-slate-300/10 text-slate-200";
}

function getDashboardLedgerIcon(item: string) {
  if (item.includes("Treasury") || item.includes("Market")) return ReceiptText;
  if (item.includes("Security") || item.includes("Law")) return Scale;
  if (item.includes("trust")) return UserX;
  if (item.includes("Route")) return Link2Off;
  if (item.includes("Broker")) return EyeOff;
  return AlertCircle;
}

function getRouteGateIcon(label: string) {
  if (label.includes("Power")) return "⚡";
  if (label.includes("Scrap")) return "🔩";
  if (label.includes("Structural")) return "🧱";
  if (label.includes("Power Cell")) return "🔋";
  if (label.includes("Data")) return "💾";
  if (label.includes("Treasury")) return "🪙";
  if (label.includes("Certified")) return "👥";
  return "🧭";
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

function getCostText(costs: ResponseCosts) {
  const entries = [
    (costs.lawCapacity ?? 0) > 0 ? `Law Capacity ${costs.lawCapacity}` : "",
    (costs.emergencySupplies ?? 0) > 0 ? `Emergency Supplies ${costs.emergencySupplies}` : "",
    (costs.laborPool ?? 0) > 0 ? `Labor Pool ${costs.laborPool}` : "",
  ].filter(Boolean);

  return entries.length > 0 ? entries : ["No resource cost"];
}

function getOutcomeLabel(outcomeType: PressureResponse["outcomeType"]) {
  if (outcomeType === "resolved") return "Resolved";
  if (outcomeType === "compromised") return "Compromised";
  return "Contained";
}

function getOutcomeClass(outcomeType: PressureResponse["outcomeType"]) {
  if (outcomeType === "resolved") return "border-emerald-300/40 bg-emerald-300/10 text-emerald-100";
  if (outcomeType === "compromised") return "border-fuchsia-300/45 bg-fuchsia-300/10 text-fuchsia-100";
  return "border-amber-300/40 bg-amber-300/10 text-amber-100";
}

function getCrewFatigueClass(fatigue: number) {
  if (fatigue >= 70) return "border-rose-300/40 bg-rose-300/10 text-rose-100";
  if (fatigue >= 40) return "border-amber-300/40 bg-amber-300/10 text-amber-100";
  return "border-emerald-300/40 bg-emerald-300/10 text-emerald-100";
}

function getCrewFatigueStatus(fatigue: number): "Ready" | "Strained" | "Exhausted" {
  if (fatigue >= 70) return "Exhausted";
  if (fatigue >= 40) return "Strained";
  return "Ready";
}

function getFatigueStatusNote(status: "Ready" | "Strained" | "Exhausted") {
  if (status === "Exhausted") return "Crew status: Exhausted — operational strain caused public confidence loss.";
  if (status === "Strained") return "Crew status: Strained — performance under pressure.";
  return "Crew status: Ready.";
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
  const [dashboardCityState, setDashboardCityState] = useState(initialDashboardCities);
  const [dashboardMetricState, setDashboardMetricState] = useState(initialDashboardMetrics);
  const [responseResources, setResponseResources] = useState(initialResponseResources);
  const [dashboardRouteState, setDashboardRouteState] = useState(dashboardConnections);
  const [activeCrisisIndex, setActiveCrisisIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [activeCrisisIds, setActiveCrisisIds] = useState(initialPressureCrisisIds);
  const [selectedCrisisId, setSelectedCrisisId] = useState(initialPressureCrisisIds[0]);
  const [carriedOverCrises, setCarriedOverCrises] = useState<PressureCrisis[]>([]);
  const [crewRoster, setCrewRoster] = useState(initialCrewRoster);
  const [operationSlots, setOperationSlots] = useState<OperationSlot[]>(initialOperationSlots);
  const [activeOperationSlotId, setActiveOperationSlotId] = useState<OperationSlot["id"]>("slot-1");
  const [dashboardLedgerEntries, setDashboardLedgerEntries] = useState(startingActionHistory);
  const [latestDashboardSummary, setLatestDashboardSummary] = useState("No dashboard decision has been resolved yet.");
  const [lastMissionReport, setLastMissionReport] = useState<MissionReportEntry[]>([]);
  const [routeGatePhase, setRouteGatePhase] = useState("Locked");

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

  const screenLabel = resolved ? "Result Screen" : "Decision Screen";
  const screenHint = resolved
    ? "Read what changed, then continue to the next day."
    : "Choose one role and one action, then end the day.";
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
  const milestoneActive = day === 14 && routeGatePhase !== "Stabilization Authorized";
  const activeDashboardCrisis = milestoneActive ? routeGateMilestone : dashboardCrises[activeCrisisIndex];
  const dashboardCities = dashboardCityState.map((city) => ({
    ...city,
    stats: [
      { label: "Supplies", value: city.stats.supplies, Icon: Package },
      { label: "Infrastructure", value: city.stats.infrastructure, Icon: Wrench },
      { label: "Civic Order", value: city.stats.civicOrder, Icon: Shield },
      { label: "Public Trust", value: city.stats.publicTrust, Icon: Users },
    ],
  }));
  const dashboardRouteNetworkStatus = dashboardRouteState.some((connection) => connection.status === "Blocked")
    ? "Unstable"
    : dashboardRouteState.some((connection) => connection.status === "Contested")
      ? "Contested"
      : dashboardRouteState.some((connection) => connection.status === "Delayed")
        ? "Delayed"
        : "Stable";
  const dashboardPressureMetrics = [
    { label: "Public Trust", value: dashboardMetricState.publicTrust, status: dashboardMetricState.publicTrust < 45 ? "Fraying" : "Watchful", Icon: Handshake },
    { label: "Law Capacity", value: dashboardMetricState.lawCapacity, status: dashboardMetricState.lawCapacity < 35 ? "Thin" : "Holding", Icon: Scale },
    { label: "Underworld Influence", value: dashboardMetricState.underworldInfluence, status: dashboardMetricState.underworldInfluence > 62 ? "Rising" : "Embedded", Icon: EyeOff },
    { label: "Public Fear", value: dashboardMetricState.publicFear, status: dashboardMetricState.publicFear > 64 ? "High" : "Managed", Icon: AlertCircle },
    { label: "Legitimacy", value: dashboardMetricState.legitimacy, status: dashboardMetricState.legitimacy < 45 ? "Contested" : "Credible", Icon: Landmark },
  ];
  const dashboardLedger = dashboardLedgerEntries.slice(0, 5);
  const carriedOverCrisisIds = new Set(carriedOverCrises.map((crisis) => crisis.id));
  const freshPressureCrises = activeCrisisIds
    .map((crisisId) => pressureCrisisPool.find((crisis) => crisis.id === crisisId))
    .filter((crisis): crisis is PressureCrisis => Boolean(crisis))
    .filter((crisis) => !carriedOverCrisisIds.has(crisis.id));
  const activePressureCrises = [...carriedOverCrises, ...freshPressureCrises]
    .filter((crisis): crisis is PressureCrisis => Boolean(crisis))
    .slice(0, 3);
  const activeOperationSlot = operationSlots.find((slot) => slot.id === activeOperationSlotId) ?? operationSlots[0];
  const plannedActions = operationSlots
    .filter((slot) => slot.crisisId && slot.crewId && slot.responseId)
    .map((slot) => ({
      crisisId: slot.crisisId as string,
      crewId: slot.crewId as string,
      responseId: slot.responseId as string,
    }));
  const readyOperationCount = plannedActions.length;
  const selectedPressureCrisis = activePressureCrises.find((crisis) => crisis.id === activeOperationSlot.crisisId)
    ?? activePressureCrises.find((crisis) => crisis.id === selectedCrisisId)
    ?? activePressureCrises[0];
  const totalResponseResources = {
    lawCapacity: dashboardMetricState.lawCapacity,
    emergencySupplies: responseResources.emergencySupplies,
    laborPool: responseResources.laborPool,
  };

  function getPlannedResponse(plannedAction: PlannedOperation) {
    const crisis = activePressureCrises.find((item) => item.id === plannedAction.crisisId) ?? pressureCrisisPool.find((item) => item.id === plannedAction.crisisId);
    return crisis?.responses.find((item) => item.id === plannedAction.responseId);
  }

  function getReservedCosts(excludedCrisisId?: string) {
    return plannedActions.reduce<ResponseCosts>((total, plannedAction) => {
      if (plannedAction.crisisId === excludedCrisisId) return total;

      const response = getPlannedResponse(plannedAction);
      if (!response) return total;

      return {
        lawCapacity: (total.lawCapacity ?? 0) + (response.costs.lawCapacity ?? 0),
        emergencySupplies: (total.emergencySupplies ?? 0) + (response.costs.emergencySupplies ?? 0),
        laborPool: (total.laborPool ?? 0) + (response.costs.laborPool ?? 0),
      };
    }, { lawCapacity: 0, emergencySupplies: 0, laborPool: 0 });
  }

  function getAvailableResources(excludedCrisisId?: string) {
    const reservedCosts = getReservedCosts(excludedCrisisId);
    return {
      lawCapacity: Math.max(0, totalResponseResources.lawCapacity - (reservedCosts.lawCapacity ?? 0)),
      emergencySupplies: Math.max(0, totalResponseResources.emergencySupplies - (reservedCosts.emergencySupplies ?? 0)),
      laborPool: Math.max(0, totalResponseResources.laborPool - (reservedCosts.laborPool ?? 0)),
    };
  }

  function getResourceShortfall(costs: ResponseCosts, excludedCrisisId?: string) {
    const availableResources = getAvailableResources(excludedCrisisId);

    if ((costs.lawCapacity ?? 0) > availableResources.lawCapacity) return "Insufficient Law Capacity";
    if ((costs.emergencySupplies ?? 0) > availableResources.emergencySupplies) return "Insufficient Emergency Supplies";
    if ((costs.laborPool ?? 0) > availableResources.laborPool) return "Insufficient Labor Pool";
    return "";
  }

  const availableResponseResources = getAvailableResources();

  function addPlaytestRecord(entry: string) {
    setPlaytestRecord((previous) => [entry, ...previous].slice(0, 20));
  }

  function applyDashboardDeltas(deltas: DashboardDeltas) {
    setDashboardCityState((previous) => previous.map((city) => {
      const cityDeltas = deltas.cityDeltas[city.name];
      if (!cityDeltas) return city;

      return {
        ...city,
        stats: {
          supplies: clampStat(city.stats.supplies + (cityDeltas.supplies ?? 0)),
          infrastructure: clampStat(city.stats.infrastructure + (cityDeltas.infrastructure ?? 0)),
          civicOrder: clampStat(city.stats.civicOrder + (cityDeltas.civicOrder ?? 0)),
          publicTrust: clampStat(city.stats.publicTrust + (cityDeltas.publicTrust ?? 0)),
        },
      };
    }));
    setDashboardMetricState((previous) => ({
      publicTrust: clampStat(previous.publicTrust + (deltas.metricDeltas.publicTrust ?? 0)),
      lawCapacity: clampStat(previous.lawCapacity + (deltas.metricDeltas.lawCapacity ?? 0)),
      underworldInfluence: clampStat(previous.underworldInfluence + (deltas.metricDeltas.underworldInfluence ?? 0)),
      publicFear: clampStat(previous.publicFear + (deltas.metricDeltas.publicFear ?? 0)),
      legitimacy: clampStat(previous.legitimacy + (deltas.metricDeltas.legitimacy ?? 0)),
    }));
    setDashboardRouteState((previous) => previous.map((connection) => {
      const update = deltas.routeUpdates.find((item) => item.from === connection.from && item.to === connection.to);
      return update ? { ...connection, status: update.status } : connection;
    }));
  }

  function applyResponseCosts(costs: ResponseCosts) {
    setDashboardMetricState((previous) => ({
      ...previous,
      lawCapacity: clampStat(previous.lawCapacity - (costs.lawCapacity ?? 0)),
    }));
    setResponseResources((previous) => ({
      emergencySupplies: Math.max(0, previous.emergencySupplies - (costs.emergencySupplies ?? 0)),
      laborPool: Math.max(0, previous.laborPool - (costs.laborPool ?? 0)),
    }));
  }

  function getDefaultResponseId(crisis: PressureCrisis) {
    const availableResponse = crisis.responses.find((response) => !getResourceShortfall(response.costs, crisis.id));
    return availableResponse?.id ?? crisis.responses[crisis.responses.length - 1].id;
  }

  function syncCrewStatuses(slots: OperationSlot[]) {
    setCrewRoster((previous) => previous.map((crew) => ({
      ...crew,
      status: slots.some((slot) => slot.crewId === crew.id) ? "assigned" : "available",
    })));
  }

  function updateOperationSlots(nextSlots: OperationSlot[]) {
    setOperationSlots(nextSlots);
    syncCrewStatuses(nextSlots);
  }

  function assignCrisisToActiveSlot(crisisId: string) {
    const crisis = activePressureCrises.find((item) => item.id === crisisId);
    const claimedSlot = operationSlots.find((slot) => slot.crisisId === crisisId && slot.id !== activeOperationSlotId);
    if (!crisis) return;

    if (claimedSlot) {
      setActiveOperationSlotId(claimedSlot.id);
      setSelectedCrisisId(crisisId);
      setLatestDashboardSummary(`${crisis.title} is already assigned to ${claimedSlot.label}.`);
      return;
    }

    const nextSlots = operationSlots.map((slot) => {
      if (slot.id !== activeOperationSlotId) return slot;
      return {
        ...slot,
        crisisId,
        responseId: slot.crisisId === crisisId ? slot.responseId : null,
      };
    });

    updateOperationSlots(nextSlots);
    setSelectedCrisisId(crisisId);
    setLatestDashboardSummary(`${crisis.title} assigned to ${activeOperationSlot.label}. Choose a crew and response.`);
  }

  function assignCrewToActiveSlot(crewId: string) {
    const crew = crewRoster.find((item) => item.id === crewId);
    const crisis = activePressureCrises.find((item) => item.id === activeOperationSlot.crisisId);
    if (!crew || !crisis) {
      setLatestDashboardSummary("Select a crisis for the active operation slot before assigning a crew.");
      return;
    }

    const crewClaimedElsewhere = operationSlots.some((slot) => slot.crewId === crewId && slot.id !== activeOperationSlotId);
    if (crewClaimedElsewhere) {
      setLatestDashboardSummary(`${crew.name} is already assigned to another operation slot.`);
      return;
    }

    const response = crisis.responses.find((item) => item.id === activeOperationSlot.responseId);
    const resourceShortfall = response ? getResourceShortfall(response.costs, crisis.id) : "";
    if (resourceShortfall) {
      setLatestDashboardSummary(resourceShortfall);
      return;
    }

    const nextSlots = operationSlots.map((slot) => slot.id === activeOperationSlotId ? { ...slot, crewId } : slot);
    updateOperationSlots(nextSlots);
    setLatestDashboardSummary(`${crew.name} assigned to ${crisis.title}.`);
  }

  function planPressureResponse(crisisId: string, responseId: string) {
    const selectedCrisis = activePressureCrises.find((crisis) => crisis.id === crisisId);
    const selectedResponse = selectedCrisis?.responses.find((response) => response.id === responseId);
    const activeSlotHasCrisis = activeOperationSlot.crisisId === crisisId;
    const resourceShortfall = selectedResponse ? getResourceShortfall(selectedResponse.costs, crisisId) : "Unavailable response";

    if (!selectedCrisis || !selectedResponse || !activeSlotHasCrisis) {
      setLatestDashboardSummary("Assign a crisis to the active operation slot before choosing a response.");
      return;
    }

    if (resourceShortfall) {
      setLatestDashboardSummary(resourceShortfall);
      return;
    }

    const nextSlots = operationSlots.map((slot) => slot.id === activeOperationSlotId ? { ...slot, responseId } : slot);
    updateOperationSlots(nextSlots);
    setSelectedCrisisId(crisisId);
    setLatestDashboardSummary(`${activeOperationSlot.label} response set: ${selectedResponse.title}.`);
  }

  function clearOperationSlot(slotId: OperationSlot["id"]) {
    const nextSlots = operationSlots.map((slot) => slot.id === slotId ? { ...slot, crisisId: null, crewId: null, responseId: null } : slot);
    updateOperationSlots(nextSlots);
    if (activeOperationSlotId === slotId) {
      setSelectedCrisisId(activePressureCrises[0]?.id ?? initialPressureCrisisIds[0]);
    }
    setLatestDashboardSummary(`${operationSlots.find((slot) => slot.id === slotId)?.label ?? "Operation slot"} cleared.`);
  }

  function applyCrewMismatchPenalty(crewMatched: boolean) {
    if (crewMatched) return;

    applyDashboardDeltas({
      cityDeltas: {},
      metricDeltas: { publicTrust: -2, legitimacy: -2, publicFear: 2 },
      routeUpdates: [],
    });
  }

  function updateCrewFatigueAfterDispatch(currentPlans: PlannedOperation[], currentCrises: PressureCrisis[]) {
    setCrewRoster((previous) => previous.map((crew) => {
      const assignedOperation = currentPlans.find((operation) => operation.crewId === crew.id);
      const assignedCrisis = currentCrises.find((crisis) => crisis.id === assignedOperation?.crisisId);
      const matchedCrew = assignedOperation && assignedCrisis ? assignedCrisis.recommendedCrewIds.includes(assignedOperation.crewId) : false;
      const fatigueStatus = getCrewFatigueStatus(crew.fatigue);
      const fatigueStatusIncrease = fatigueStatus === "Exhausted" ? 10 : fatigueStatus === "Strained" ? 5 : 0;

      return {
        ...crew,
        fatigue: assignedOperation ? clampStat(crew.fatigue + (matchedCrew ? 15 : 20) + fatigueStatusIncrease) : Math.max(0, crew.fatigue - 10),
        status: "available",
      };
    }));
  }

  function submitPressureDay() {
    if (plannedActions.length === 0) return;

    const resolvedDay = day;
    const currentCrises = activePressureCrises;
    const currentPlans = plannedActions;
    const handledEntries: string[] = [];
    const unresolvedEntries: string[] = [];
    const missionReportEntries: MissionReportEntry[] = [];
    const nextCarriedOverCrises: PressureCrisis[] = [];

    currentCrises.forEach((crisis) => {
      const plannedAction = currentPlans.find((item) => item.crisisId === crisis.id);

      if (plannedAction) {
        const response = crisis.responses.find((item) => item.id === plannedAction.responseId);
        const assignedCrew = crewRoster.find((crew) => crew.id === plannedAction.crewId);
        const crewMatched = crisis.recommendedCrewIds.includes(plannedAction.crewId);
        const fatigueStatus = getCrewFatigueStatus(assignedCrew?.fatigue ?? 0);
        const fatigueStatusIncrease = fatigueStatus === "Exhausted" ? 10 : fatigueStatus === "Strained" ? 5 : 0;
        const fatigueChange = (crewMatched ? 15 : 20) + fatigueStatusIncrease;
        const fatigueNote = getFatigueStatusNote(fatigueStatus);
        if (!response) return;

        applyResponseCosts(response.costs);
        applyDashboardDeltas(response);
        applyCrewMismatchPenalty(crewMatched);
        if (fatigueStatus === "Exhausted") {
          applyDashboardDeltas({
            cityDeltas: {},
            metricDeltas: { publicTrust: -3, publicFear: 3 },
            routeUpdates: [],
          });
        }
        missionReportEntries.push({
          id: `${resolvedDay}-${crisis.id}-planned`,
          kind: "planned",
          crewId: assignedCrew?.id ?? plannedAction.crewId,
          crewName: assignedCrew?.name ?? "Assigned crew",
          crisisTitle: crisis.title,
          city: crisis.city,
          responseTitle: response.title,
          outcomeType: response.outcomeType,
          crewMatched,
          fatigueStatus,
          fatigueChange,
          fatigueNote,
          summary: response.summary,
        });
        handledEntries.push(`Day ${String(resolvedDay).padStart(2, "0")} | ${getOutcomeLabel(response.outcomeType)}: ${assignedCrew?.name ?? "Assigned crew"} → ${crisis.title}: ${response.title}. ${crewMatched ? "Crew match." : "Crew mismatch caused weaker public confidence."} Cost: ${getCostText(response.costs).join(", ")}. ${response.summary}${fatigueStatus === "Ready" ? "" : ` ${fatigueNote}`}`);
        setRole(response.strategyType === "formal" ? "Security" : response.strategyType === "underworld" ? "Merchant" : "Planner");
        setAction(response.title);
        if (crisis.id === routeGatePressureCrisis.id) {
          setRouteGatePhase("Stabilization Authorized");
        }
        return;
      }

      applyDashboardDeltas(crisis.unresolvedPenalty);
      const escalatedRisk = escalateRisk(crisis.risk);
      nextCarriedOverCrises.push({ ...crisis, risk: escalatedRisk, escalated: true });
      missionReportEntries.push({
        id: `${resolvedDay}-${crisis.id}-unresolved`,
        kind: "unresolved",
        crisisTitle: crisis.title,
        city: crisis.city,
        previousRisk: crisis.risk,
        newRisk: escalatedRisk,
        summary: crisis.unresolvedPenalty.summary,
      });
      unresolvedEntries.push(`Day ${String(resolvedDay).padStart(2, "0")} | Unresolved: ${crisis.title} escalated to ${escalatedRisk}. ${crisis.unresolvedPenalty.summary}`);
    });

    const dayEntries = [...handledEntries, ...unresolvedEntries];
    const nextDay = resolvedDay + 1;
    const nextCrisisIds = getDailyPressureCrisisIds(nextDay);
    const outcomeCounts = currentPlans.reduce<Record<PressureResponse["outcomeType"], number>>((counts, plannedAction) => {
      const crisis = currentCrises.find((item) => item.id === plannedAction.crisisId);
      const response = crisis?.responses.find((item) => item.id === plannedAction.responseId);
      if (!response) return counts;

      return { ...counts, [response.outcomeType]: counts[response.outcomeType] + 1 };
    }, { resolved: 0, contained: 0, compromised: 0 });
    const summary = `Resolved Day ${resolvedDay}. Outcomes: ${outcomeCounts.resolved} resolved, ${outcomeCounts.contained} contained, ${outcomeCounts.compromised} compromised; ${unresolvedEntries.length} unresolved pressure${unresolvedEntries.length === 1 ? "" : "s"} worsened.`;

    setSelectedOptionIndex(null);
    setSubmitted(false);
    setResolved(false);
    setLastStateChange(dayEntries[0] ?? summary);
    setLastResolvedDay(resolvedDay);
    setLatestDashboardSummary(summary);
    setLastEndOfDaySummary(summary);
    setLastMissionReport(missionReportEntries);
    setDashboardLedgerEntries((previous) => [...dayEntries, ...previous].slice(0, 8));
    setActionHistory((previous) => [...dayEntries, ...previous].slice(0, 8));
    dayEntries.forEach(addPlaytestRecord);
    updateCrewFatigueAfterDispatch(currentPlans, currentCrises);
    setDay(nextDay);
    setActiveCrisisIndex((previous) => (previous + 1) % dashboardCrises.length);
    setCarriedOverCrises(nextCarriedOverCrises);
    setActiveCrisisIds(nextCrisisIds);
    setSelectedCrisisId(nextCarriedOverCrises[0]?.id ?? nextCrisisIds[0]);
    setOperationSlots(initialOperationSlots);
    setActiveOperationSlotId("slot-1");
    setResponseResources((previous) => ({
      emergencySupplies: Math.min(5, previous.emergencySupplies + 1),
      laborPool: Math.min(5, previous.laborPool + 1),
    }));
  }

  function applyDashboardDecision(option: DashboardDecisionOption) {
    const resolvedDay = day;
    const ledgerEntry = `Day ${String(resolvedDay).padStart(2, "0")} | ${activeDashboardCrisis.title}: ${option.label}. ${option.consequence}.`;
    const resolvedMilestone = milestoneActive;

    setSelectedOptionIndex(null);
    setRole(option.role);
    setAction(option.action);
    setSubmitted(false);
    setResolved(false);
    setLastStateChange(ledgerEntry);
    setLastResolvedDay(resolvedDay);
    setLatestDashboardSummary(option.summary);
    setLastEndOfDaySummary(option.summary);
    setDashboardCityState((previous) => previous.map((city) => {
      const deltas = option.cityDeltas[city.name];
      if (!deltas) return city;

      return {
        ...city,
        stats: {
          supplies: clampStat(city.stats.supplies + (deltas.supplies ?? 0)),
          infrastructure: clampStat(city.stats.infrastructure + (deltas.infrastructure ?? 0)),
          civicOrder: clampStat(city.stats.civicOrder + (deltas.civicOrder ?? 0)),
          publicTrust: clampStat(city.stats.publicTrust + (deltas.publicTrust ?? 0)),
        },
      };
    }));
    setDashboardMetricState((previous) => ({
      publicTrust: clampStat(previous.publicTrust + (option.metricDeltas.publicTrust ?? 0)),
      lawCapacity: clampStat(previous.lawCapacity + (option.metricDeltas.lawCapacity ?? 0)),
      underworldInfluence: clampStat(previous.underworldInfluence + (option.metricDeltas.underworldInfluence ?? 0)),
      publicFear: clampStat(previous.publicFear + (option.metricDeltas.publicFear ?? 0)),
      legitimacy: clampStat(previous.legitimacy + (option.metricDeltas.legitimacy ?? 0)),
    }));
    setDashboardRouteState((previous) => previous.map((connection) => {
      const update = option.routeUpdates.find((item) => item.from === connection.from && item.to === connection.to);
      return update ? { ...connection, status: update.status } : connection;
    }));
    setDashboardLedgerEntries((previous) => [ledgerEntry, ...previous].slice(0, 8));
    setActionHistory((previous) => [ledgerEntry, ...previous].slice(0, 8));
    addPlaytestRecord(ledgerEntry);
    if (resolvedMilestone) {
      setRouteGatePhase("Stabilization Authorized");
    }
    setDay((previous) => previous + 1);
    setActiveCrisisIndex((previous) => (previous + 1) % dashboardCrises.length);
  }

  const playtestSnapshot = {
    version: "1.4.0",
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

  function continueToNextDay() {
    setSubmitted(false);
    setResolved(false);
    setRouteGateAttemptResult("Route Gate has not been attempted yet.");
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
    setDashboardCityState(initialDashboardCities);
    setDashboardMetricState(initialDashboardMetrics);
    setResponseResources(initialResponseResources);
    setDashboardRouteState(dashboardConnections);
    setActiveCrisisIndex(0);
    setSelectedOptionIndex(null);
    setActiveCrisisIds(initialPressureCrisisIds);
    setSelectedCrisisId(initialPressureCrisisIds[0]);
    setCarriedOverCrises([]);
    setCrewRoster(initialCrewRoster);
    setOperationSlots(initialOperationSlots);
    setActiveOperationSlotId("slot-1");
    setDashboardLedgerEntries(startingActionHistory);
    setLatestDashboardSummary("No dashboard decision has been resolved yet.");
    setLastMissionReport([]);
    setRouteGatePhase("Locked");
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
        <section className="rounded-3xl border border-slate-700 bg-slate-950 p-4 text-slate-100 shadow-xl">
          <div className="flex flex-col gap-3 border-b border-slate-800 pb-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-cyan-200">Crew Assignment Prototype v0.4</p>
              <h2 className="mt-1 text-xl font-bold text-white">Three-city civic dispatch board</h2>
            </div>
            <div className="grid gap-2 text-xs sm:grid-cols-2 lg:grid-cols-4">
              <OpsTopItem label="Day" value={String(day).padStart(2, "0")} />
              <OpsTopItem label="Route Network" value={dashboardRouteNetworkStatus} />
              <OpsTopItem label="Civic Risk" value={dashboardMetricState.publicFear > 64 ? "High" : "Elevated"} warning />
              <OpsTopItem label="Phase" value={routeGatePhase === "Stabilization Authorized" ? "Phase II Unlocked" : "Emergency Response"} />
            </div>
          </div>

          {routeGatePhase === "Stabilization Authorized" && (
            <div className="mt-4 rounded-2xl border border-emerald-300/40 bg-emerald-300/10 p-3 text-sm font-bold text-emerald-100">
              Phase II: Intercity Route Operations Unlocked
            </div>
          )}

          <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                <Landmark className="h-4 w-4 text-cyan-200" />
                Power Balance
              </span>
              {dashboardPressureMetrics.map((metric) => {
                const Icon = metric.Icon;

                return (
                  <div key={metric.label} className="min-w-[120px] flex-1 rounded-xl border border-slate-800 bg-slate-950/70 px-2 py-1.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                        <Icon className="h-3.5 w-3.5 text-cyan-200" />
                        {metric.label}
                      </span>
                      <span className="font-bold text-white">{metric.value}</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-slate-800">
                      <div
                        className={`h-1.5 rounded-full ${metric.label === "Underworld Influence" || metric.label === "Public Fear" ? "bg-amber-300" : "bg-cyan-300"}`}
                        style={{ width: `${metric.value}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-2 py-1.5 text-xs font-bold text-slate-200">
                Emergency Supplies: {availableResponseResources.emergencySupplies}
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-2 py-1.5 text-xs font-bold text-slate-200">
                Labor Pool: {availableResponseResources.laborPool}
              </div>
            </div>
          </div>

          <div className="mt-3 grid gap-3 xl:grid-cols-[0.48fr_2.25fr]">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-2">
              <div className="flex items-center justify-between gap-2">
                <OpsPanelTitle icon={<RadioTower className="h-4 w-4" />} title="City Network" />
                <span className="rounded-full border border-slate-700 bg-slate-950/70 px-2 py-1 text-[11px] font-bold text-slate-300">
                  Compact
                </span>
              </div>
              <div className="mt-2 space-y-1.5">
                {dashboardCities.map((city) => (
                  <article key={city.name} className="rounded-xl border border-slate-800 bg-slate-950/70 p-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <Building2 className="h-4 w-4 shrink-0 text-cyan-200" />
                        <div>
                          <p className="truncate text-sm font-bold text-white">{city.name}</p>
                        </div>
                      </div>
                      <span className={`rounded-full border px-1.5 py-0.5 text-[11px] font-bold ${getRouteStatusClass(city.routeStatus)}`}>
                        {city.routeStatus}
                      </span>
                    </div>
                    <div className="mt-1.5 grid grid-cols-2 gap-1">
                      {city.stats.map((stat) => (
                        <div key={`${city.name}-${stat.label}`} className="flex items-center justify-between gap-1 rounded-lg border border-slate-800 bg-slate-900/80 px-1.5 py-1 text-[11px]">
                          <span className="flex min-w-0 items-center gap-1 text-slate-400">
                            <stat.Icon className="h-3 w-3 shrink-0 text-cyan-200" />
                            <span className="truncate">{stat.label}</span>
                          </span>
                          <span className="font-bold text-slate-100">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-2 grid gap-1.5">
                {dashboardRouteState.map((connection) => (
                  <div key={`${connection.from}-${connection.to}`} className="flex items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-950/70 px-2 py-1.5 text-[11px]">
                    <span className="flex min-w-0 items-center gap-1.5 text-slate-300">
                      <GitBranch className="h-3.5 w-3.5 shrink-0 text-cyan-200" />
                      {connection.from} → {connection.to}
                    </span>
                    <span className={`rounded-full border px-1.5 py-0.5 font-bold ${getRouteStatusClass(connection.status)}`}>
                      {connection.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-300/30 bg-slate-900/80 p-3">
              {lastMissionReport.length > 0 && (
                <div className="mb-3 rounded-2xl border border-cyan-200/30 bg-cyan-300/10 p-2.5">
                  <p className="text-xs font-bold uppercase tracking-wide text-cyan-100">Mission Report</p>
                  <div className="mt-2 grid gap-2 lg:grid-cols-2">
                    {lastMissionReport.map((entry) => (
                      <div key={entry.id} className="rounded-xl border border-slate-700 bg-slate-950/70 p-2 text-xs leading-5 text-slate-300">
                        <div className="flex flex-wrap gap-1.5">
                          {entry.kind === "planned" ? (
                            <>
                              <span className={`rounded-md border px-2 py-0.5 font-bold ${getOutcomeClass(entry.outcomeType)}`}>
                                {getOutcomeLabel(entry.outcomeType)}
                              </span>
                              <span className={`rounded-md border px-2 py-0.5 font-bold ${getCrewAccentClass(entry.crewId)}`}>
                                {entry.crewName}
                              </span>
                              <span className={`rounded-md border px-2 py-0.5 font-bold ${getMissionMatchClass(entry.crewMatched)}`}>
                                {entry.crewMatched ? "Recommended" : "Mismatch"}
                              </span>
                              <span className="rounded-md border border-slate-700 bg-slate-900 px-2 py-0.5 font-semibold text-slate-200">
                                Fatigue +{entry.fatigueChange}
                              </span>
                              <span className={`rounded-md border px-2 py-0.5 font-bold ${getCrewFatigueClass(entry.fatigueStatus === "Ready" ? 0 : entry.fatigueStatus === "Strained" ? 40 : 70)}`}>
                                {entry.fatigueStatus}
                              </span>
                            </>
                          ) : (
                            <>
                              <span className={`rounded-md border px-2 py-0.5 font-bold ${getEscalatedClass()}`}>
                                Escalated
                              </span>
                              <span className={`rounded-md border px-2 py-0.5 font-bold ${getRiskClass(entry.newRisk)}`}>
                                {entry.newRisk}
                              </span>
                            </>
                          )}
                        </div>
                        {entry.kind === "planned" ? (
                          <p className="mt-1">
                            <span className="font-bold text-white">{entry.crewName}</span> handled {entry.crisisTitle} in {entry.city} with {entry.responseTitle}. {entry.fatigueNote} {entry.summary}
                          </p>
                        ) : (
                          <p className="mt-1">
                            <span className="font-bold text-white">{entry.crisisTitle}</span> in {entry.city} was left unresolved and escalated from {entry.previousRisk} to {entry.newRisk}. {entry.summary}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <OpsPanelTitle icon={<TriangleAlert className="h-4 w-4 text-amber-200" />} title="Today's Pressure Queue" />
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-cyan-200/40 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">
                    Operation Slots Ready: {readyOperationCount} / 2
                  </span>
                  <span className="rounded-full border border-cyan-200/40 bg-cyan-300/10 px-3 py-1 text-xs font-bold text-cyan-100">
                    Crews Available: {crewRoster.filter((crew) => crew.status === "available").length} / {crewRoster.length}
                  </span>
                  <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs font-bold text-slate-200">
                    Law Capacity: {availableResponseResources.lawCapacity}
                  </span>
                  <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs font-bold text-slate-200">
                    Emergency Supplies: {availableResponseResources.emergencySupplies}
                  </span>
                  <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs font-bold text-slate-200">
                    Labor Pool: {availableResponseResources.laborPool}
                  </span>
                </div>
              </div>

              <div className="mt-3 grid gap-3 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="space-y-3">
              <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-2.5">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Crew Roster</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2 2xl:grid-cols-4">
                  {crewRoster.map((crew) => {
                    const recommended = selectedPressureCrisis?.recommendedCrewIds.includes(crew.id);
                    const selectedCrewForCrisis = activeOperationSlot.crewId === crew.id;
                    const assignedElsewhere = operationSlots.some((slot) => slot.crewId === crew.id && slot.id !== activeOperationSlotId);
                    const unavailable = assignedElsewhere || !activeOperationSlot.crisisId;
                    const crewStatusLabel = selectedCrewForCrisis
                      ? "Active Crew"
                      : assignedElsewhere
                        ? "Assigned / Unavailable"
                        : !activeOperationSlot.crisisId
                          ? "select crisis first"
                          : "available";

                    return (
                      <button
                        key={crew.id}
                        type="button"
                        onClick={() => {
                          if (unavailable) return;
                          assignCrewToActiveSlot(crew.id);
                        }}
                        disabled={unavailable}
                        className={`relative overflow-hidden rounded-xl border p-2 pl-3 text-left transition hover:border-cyan-200/70 disabled:cursor-not-allowed ${selectedCrewForCrisis ? "border-cyan-200 bg-cyan-300/15 shadow-md shadow-cyan-950/40 ring-2 ring-cyan-200/40" : assignedElsewhere ? "border-slate-700 bg-slate-900/80 opacity-60" : getCrewAccentClass(crew.id)}`}
                      >
                        <span className={`absolute inset-y-2 left-0 w-1 rounded-r-full ${getCrewStripeClass(crew.id)}`} />
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold text-white">{crew.name}</p>
                            <p className="mt-1 text-[11px] leading-4 text-slate-400">{crew.specialty}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {selectedCrewForCrisis && <BadgeCheck className="h-4 w-4 text-cyan-100" />}
                            <span className={`rounded-full border px-2 py-1 text-[11px] font-bold ${getCrewFatigueClass(crew.fatigue)}`}>
                              Fatigue {crew.fatigue}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            <span className={`rounded-md border px-2 py-0.5 text-[11px] font-bold ${getCrewAccentClass(crew.id)}`}>
                              {crew.name}
                            </span>
                            <span className={`rounded-md border px-2 py-0.5 text-[11px] font-bold ${selectedCrewForCrisis ? "border-cyan-200/50 bg-cyan-300/10 text-cyan-100" : assignedElsewhere ? "border-slate-600 bg-slate-950/70 text-slate-400" : "border-slate-700 bg-slate-950/70 text-slate-200"}`}>
                              {crewStatusLabel}
                            </span>
                          <span className={`rounded-md border px-2 py-0.5 text-[11px] font-bold ${getCrewFatigueClass(crew.fatigue)}`}>
                            {getCrewFatigueStatus(crew.fatigue)}
                          </span>
                          {crew.fatigue >= 80 && (
                            <span className="rounded-md border border-rose-300/50 bg-rose-300/15 px-2 py-0.5 text-[11px] font-bold text-rose-100">
                              Fatigued
                            </span>
                          )}
                          {recommended && (
                              <span className="rounded-md border border-emerald-300/45 bg-emerald-300/10 px-2 py-0.5 text-[11px] font-bold text-emerald-100">
                                Recommended
                              </span>
                          )}
                        </div>
                        {getCrewFatigueStatus(crew.fatigue) === "Exhausted" && (
                          <p className="mt-2 text-[11px] font-semibold text-rose-100">High fatigue may reduce mission quality.</p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 grid gap-2">
                {activePressureCrises.map((crisis) => {
                  const selected = selectedPressureCrisis?.id === crisis.id;
                  const assignedSlot = operationSlots.find((slot) => slot.crisisId === crisis.id);
                  const assignedCrew = crewRoster.find((crew) => crew.id === assignedSlot?.crewId);
                  const crisisStatus = assignedSlot ? `Assigned to ${assignedSlot.label.replace("Operation ", "")}` : selected ? "Selected" : "Unassigned";

                  return (
                    <button
                      key={crisis.id}
                      type="button"
                      onClick={() => {
                        if (assignedSlot) {
                          setActiveOperationSlotId(assignedSlot.id);
                          setSelectedCrisisId(crisis.id);
                          return;
                        }
                        assignCrisisToActiveSlot(crisis.id);
                      }}
                      className={`relative overflow-hidden rounded-2xl border p-2.5 pl-3 text-left transition hover:border-cyan-200/70 ${selected ? "border-cyan-200 bg-cyan-300/10" : assignedSlot ? "border-emerald-300/50 bg-emerald-300/10" : getRiskCardClass(crisis.risk)}`}
                    >
                      <span className={`absolute inset-y-3 left-0 w-1 rounded-r-full ${getRiskStripeClass(crisis.risk)}`} />
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`rounded-full border px-2 py-1 text-[11px] font-bold ${getRiskClass(crisis.risk)}`}>
                              {crisis.risk}
                            </span>
                            <span className="rounded-full border border-slate-700 bg-slate-950/70 px-2 py-1 text-[11px] font-semibold text-slate-200">
                              {crisis.city}
                            </span>
                            <span className="rounded-full border border-slate-700 bg-slate-950/70 px-2 py-1 text-[11px] font-semibold text-slate-200">
                              {crisisStatus}
                            </span>
                            {assignedCrew && (
                              <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${getCrewAccentClass(assignedCrew.id)}`}>
                                Crew: {assignedCrew.name}
                              </span>
                            )}
                            {crisis.escalated && (
                              <span className={`rounded-full border px-2 py-1 text-[11px] font-bold ${getEscalatedClass()}`}>
                                Escalated
                              </span>
                            )}
                          </div>
                          <h3 className="mt-2 text-sm font-bold text-white">{crisis.title}</h3>
                          <p className="mt-1 text-xs leading-5 text-slate-400">{crisis.description}</p>
                        </div>
                        {assignedSlot && <BadgeCheck className="h-5 w-5 shrink-0 text-emerald-200" />}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 font-semibold text-slate-300">Source: {crisis.source}</span>
                        <span className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-1 font-semibold text-slate-300">Systems: {crisis.affectedSystems}</span>
                        {crisis.recommendedCrewIds.map((crewId) => {
                          const recommendedCrew = crewRoster.find((crew) => crew.id === crewId);

                          return recommendedCrew ? (
                            <span key={crewId} className={`rounded-full border px-3 py-1 font-semibold ${getCrewAccentClass(crewId)}`}>
                              Recommended: {recommendedCrew.name}
                            </span>
                          ) : null;
                        })}
                      </div>
                    </button>
                  );
                })}
              </div>
                </div>

                <div className="space-y-3">
              <div className="mt-3">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Selected Slot Response</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Select an operation slot, then assign one crisis, one crew, and one response. Complete slots execute together when crews dispatch.
                </p>
              </div>

              <div className="mt-3 grid gap-2 lg:grid-cols-2 2xl:grid-cols-4">
                {!activeOperationSlot.crisisId ? (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-slate-400 lg:col-span-2">
                    Assign a crisis to {activeOperationSlot.label} to choose a response.
                  </div>
                ) : selectedPressureCrisis?.responses.map((response) => {
                  const Icon = response.Icon;
                  const selected = activeOperationSlot.responseId === response.id;
                  const resourceShortfall = getResourceShortfall(response.costs, selectedPressureCrisis.id);
                  const unavailableReason = resourceShortfall;
                  const canPlan = !unavailableReason;

                  return (
                    <button
                      key={response.id}
                      type="button"
                      onClick={() => {
                        if (!canPlan) return;
                        planPressureResponse(selectedPressureCrisis.id, response.id);
                        setRole(response.strategyType === "formal" ? "Security" : response.strategyType === "underworld" ? "Merchant" : "Planner");
                        setAction(response.title);
                        setSubmitted(false);
                        setResolved(false);
                        setLastStateChange("Crew operation planned. Dispatch crews to resolve the day.");
                      }}
                      disabled={!canPlan}
                      className={`rounded-2xl border p-2.5 text-left transition hover:border-cyan-200/70 disabled:cursor-not-allowed disabled:opacity-50 ${selected ? "border-cyan-200 bg-cyan-300/10" : `bg-slate-950/70 ${getStrategyClass(response.strategyType, response.outcomeType)}`}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Icon className="h-5 w-5 text-cyan-200" />
                        {selected && <BadgeCheck className="h-5 w-5 text-emerald-200" />}
                      </div>
                      <p className="mt-2 text-sm font-bold text-white">{response.title}</p>
                      <p className="mt-1 max-h-10 overflow-hidden text-xs leading-5 text-slate-400">{response.description}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        <span className={`inline-flex rounded-full border px-2 py-1 text-[11px] font-bold capitalize ${getStrategyClass(response.strategyType, response.outcomeType)}`}>
                          {response.strategyType}
                        </span>
                        <span className={`inline-flex rounded-full border px-2 py-1 text-[11px] font-bold ${getOutcomeClass(response.outcomeType)}`}>
                          Outcome: {getOutcomeLabel(response.outcomeType)}
                        </span>
                      </div>
                      <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-slate-500">Required Cost</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {getCostText(response.costs).map((cost) => (
                          <span key={cost} className="cursor-default rounded-md border border-slate-700 bg-slate-900 px-2 py-0.5 text-[11px] font-semibold text-slate-200">
                            {cost}
                          </span>
                        ))}
                      </div>
                      {unavailableReason && (
                        <p className="mt-2 text-[11px] font-bold text-rose-200">{unavailableReason}</p>
                      )}
                      <p className="mt-3 text-[10px] font-bold uppercase tracking-wide text-slate-500">Likely System Effects</p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {response.previewBadges.map((badge) => (
                          <span key={badge} className={`cursor-default rounded-md border px-2 py-0.5 text-[11px] font-semibold ${getPreviewBadgeClass(badge)}`}>
                            {badge}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Operation Plan</p>
                  <span className="rounded-full border border-cyan-200/40 bg-cyan-300/10 px-2 py-1 text-[11px] font-bold text-cyan-100">
                    {readyOperationCount} / 2 Ready
                  </span>
                </div>
                <div className="mt-2 grid gap-2 lg:grid-cols-2">
                  {operationSlots.map((slot) => {
                    const crisis = activePressureCrises.find((item) => item.id === slot.crisisId) ?? pressureCrisisPool.find((item) => item.id === slot.crisisId);
                    const response = crisis?.responses.find((item) => item.id === slot.responseId);
                    const crew = crewRoster.find((item) => item.id === slot.crewId);
                    const ready = Boolean(crisis && response && crew);
                    const active = slot.id === activeOperationSlotId;

                    return (
                      <div
                        key={slot.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          setActiveOperationSlotId(slot.id);
                          if (slot.crisisId) setSelectedCrisisId(slot.crisisId);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            setActiveOperationSlotId(slot.id);
                            if (slot.crisisId) setSelectedCrisisId(slot.crisisId);
                          }
                        }}
                        className={`rounded-2xl border p-2 text-left transition hover:border-cyan-200/70 ${active ? "border-cyan-200 bg-cyan-300/10 ring-2 ring-cyan-200/30" : ready ? "border-emerald-300/40 bg-emerald-300/10" : "border-slate-800 bg-slate-900/80"}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{slot.label}</p>
                          <span className={`rounded-full border px-2 py-1 text-[11px] font-bold ${ready ? "border-emerald-300/40 bg-emerald-300/10 text-emerald-100" : "border-slate-700 bg-slate-950/70 text-slate-300"}`}>
                            {ready ? "Ready" : "Incomplete"}
                          </span>
                        </div>
                        <div className="mt-2 space-y-1 text-xs leading-5 text-slate-300">
                          <p><span className="font-bold text-slate-500">Crisis:</span> {crisis?.title ?? "Empty"}</p>
                          <p><span className="font-bold text-slate-500">Crew:</span> {crew?.name ?? "Empty"}</p>
                          <p><span className="font-bold text-slate-500">Response:</span> {response?.title ?? "Empty"}</p>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {response && (
                            <>
                              <span className={`rounded-md border px-2 py-0.5 text-[11px] font-bold ${getOutcomeClass(response.outcomeType)}`}>
                                {getOutcomeLabel(response.outcomeType)}
                              </span>
                              <span className="rounded-md border border-slate-700 bg-slate-950/70 px-2 py-0.5 text-[11px] font-semibold text-slate-200">
                                Cost: {getCostText(response.costs).join(", ")}
                              </span>
                            </>
                          )}
                          <span className={`rounded-md border px-2 py-0.5 text-[11px] font-bold ${active ? "border-cyan-200/50 bg-cyan-300/10 text-cyan-100" : "border-slate-700 bg-slate-950/70 text-slate-300"}`}>
                            {active ? "Active Slot" : "Click to Edit"}
                          </span>
                        </div>
                        <div className="mt-2 border-t border-slate-800 pt-2">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              clearOperationSlot(slot.id);
                            }}
                            className="inline-flex rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] font-bold text-slate-200 hover:bg-slate-900"
                          >
                            Clear Slot
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-800 pt-3">
                  <button
                    type="button"
                    onClick={submitPressureDay}
                    disabled={readyOperationCount === 0}
                    className="rounded-xl border border-cyan-200/50 bg-cyan-200 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Dispatch Crews
                  </button>
                  <button
                    type="button"
                    onClick={resetScenario}
                    className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-slate-100 hover:bg-slate-800"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="mt-3 rounded-2xl border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Latest End-of-Day Summary</p>
                <p className="mt-1 text-sm leading-5 text-slate-300">{latestDashboardSummary}</p>
              </div>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
            <OpsPanelTitle icon={<ReceiptText className="h-4 w-4" />} title="Consequence Ledger" />
            <div className="mt-3 grid max-h-44 gap-2 overflow-y-auto pr-1 lg:grid-cols-3">
              {dashboardLedger.map((item, index) => {
                const LedgerIcon = getDashboardLedgerIcon(item);

                return (
                  <div
                    key={item}
                    className={`rounded-xl border p-3 text-xs leading-5 text-slate-300 ${
                      index === 0
                        ? "border-cyan-200/60 bg-cyan-300/10 shadow-md shadow-cyan-950/30"
                        : "border-slate-800 bg-slate-950/70"
                    }`}
                  >
                    <LedgerIcon className="mb-2 h-4 w-4 text-cyan-200" />
                    {item}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-3">
              <button
                type="button"
                onClick={() => copyTextToClipboard(playtestRecord.join("\n"), "Playtest log copied.")}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-bold text-slate-100 hover:bg-slate-900"
              >
                Copy Log
              </button>
              <button
                type="button"
                onClick={downloadJsonSnapshot}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-bold text-slate-100 hover:bg-slate-900"
              >
                Export JSON
              </button>
              <button
                type="button"
                onClick={() => void submitSnapshotToLocalQueue("manual")}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-bold text-slate-100 hover:bg-slate-900"
              >
                Submit Snapshot
              </button>
              <p className="text-xs text-slate-500">{copyStatus}</p>
            </div>
          </div>
        </section>

        <details className="rounded-3xl border border-slate-300 bg-white/80 p-4 shadow-sm">
          <summary className="cursor-pointer text-sm font-bold uppercase tracking-wide text-slate-700">
            Legacy Debug Panel
          </summary>
          <div className="mt-4 space-y-5">

        {viewMode === "player" && !resolved && (
          <section className="rounded-3xl border border-amber-200 bg-gradient-to-br from-white via-amber-50 to-slate-50 p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-amber-700">🌅 New Player Guide</p>
                <h2 className="mt-1 text-xl font-bold text-slate-950">One day. One civic decision.</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                  Each day: choose one role, choose one action, then end the day.
                </p>
                <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                  Goal: prepare enough Power, resources, Treasury, and readiness to open the Route Gate.
                </p>
              </div>

              <div className="rounded-2xl border bg-slate-50 p-3 lg:min-w-[280px]">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Start Here</p>
                <ol className="mt-2 space-y-1 text-sm text-slate-700">
                  <li><strong>1.</strong> Choose a role.</li>
                  <li><strong>2.</strong> Choose an action.</li>
                  <li><strong>3.</strong> Submit → End Day.</li>
                  <li><strong>4.</strong> Read the result.</li>
                </ol>
              </div>
            </div>
          </section>
        )}

        




        {viewMode === "player" && !resolved && (
          <section className="rounded-3xl border bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-amber-700">⚠️ Today’s Crisis</p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">Problem: {civicPriority}</h2>
                <p className="mt-2 text-sm text-slate-600">{civicPriorityReason}</p>
              </div>
            </div>
          </section>
        )}

        {viewMode === "player" && !resolved && (
          <section className="rounded-2xl border bg-white px-4 py-3 shadow-sm">
            <div className="mb-4 rounded-3xl border border-amber-200 bg-gradient-to-br from-white via-amber-50 to-slate-50 p-4 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-amber-700">🎯 Main Goal</p>
                  <h2 className="mt-1 text-xl font-bold text-slate-950">Open the Route Gate by Day 14</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    🧭 Route Gate: {visibleRouteGatePassedCount} of {visibleRouteGateChecks.length} requirements met
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[360px]">
                  <div className="rounded-2xl border bg-slate-50 p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-sky-700">👉 Next Move</p>
                    <p className="mt-1 text-base font-bold text-slate-900">{currentStepText}</p>
                    <p className="mt-1 text-xs text-slate-500">{currentStepDetail}</p>
                  </div>

                  <div className="rounded-2xl border bg-slate-50 p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-amber-700">🧭 Gate Readiness</p>
                    <p className="mt-1 text-base font-bold text-slate-900">{visibleRouteGatePassedCount} / {visibleRouteGateChecks.length} ready</p>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div className={`h-full rounded-full ${visibleRouteGatePassedCount === visibleRouteGateChecks.length ? "bg-emerald-500" : "bg-amber-400"}`} style={{ width: `${visibleRouteGateProgress}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs font-bold uppercase tracking-wide text-slate-700">Daily Loop</p>
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
              Daily Loop: Situation → Decision → Result → History.
            </p>
          </section>
        )}



        {viewMode === "player" && !resolved && (
          <section className="rounded-3xl border bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-indigo-700">🧑‍🔧 Decision 1 — Choose a Role</p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">Who acts today?</h2>
                <p className="mt-2 text-sm text-slate-600">
                  Choose one role. Their actions appear below.
                </p>
              </div>
            </div>

            <div className="mt-3 grid auto-rows-fr gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {(Object.keys(roles) as RoleName[]).map((item) => (
                <button
                  key={item}
                  onClick={() => changeRole(item)}
                  className={`rounded-2xl border p-3 text-center text-sm transition ${
                    role === item ? "bg-slate-900 text-white" : "bg-slate-50 hover:bg-white"
                  }`}
                >
                  <p className="flex items-center justify-center gap-2 font-bold">
                    <span className="text-lg leading-none">{roles[item].icon}</span>
                    <span>{item}</span>
                  </p>

                </button>
              ))}
            </div>
          </section>
        )}

        {viewMode === "player" && !resolved && (
          <section className="grid gap-4 lg:grid-cols-1">
            <Panel title={`🗳️ Decision 2 — Choose an Action — ${role}`}>
              <div className="rounded-2xl border bg-slate-50 p-3 text-sm text-slate-700">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Role Focus</p>
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
                  Queue Legacy Draft
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
                  {resolved ? "Continue to Next Day" : "Return to Draft"}
                </button>
              </div>
            </Panel>
          </section>
        )}

        {viewMode === "player" && (
          <section className="rounded-2xl border bg-white px-4 py-3 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-700">Day Result</p>
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

        {viewMode === "player" && resolved && (
          <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Next</p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">Continue the district timeline</h2>
                <p className="mt-1 text-sm text-slate-600">Start the next day and make another civic decision.</p>
              </div>
              <button
                onClick={continueToNextDay}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
              >
                Continue to Next Day
              </button>
            </div>
          </section>
        )}
        {viewMode === "player" && resolved && (
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
              <p className="text-sm font-bold uppercase tracking-wide text-slate-700">City History</p>
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
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Outcome</p>
                  <p className="mt-1 text-sm text-slate-700">{latestCivicEffectText}</p>
                </div>
                <div className="rounded-xl border bg-white p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">End-of-Day Effects</p>
                  <p className="mt-1 text-sm text-slate-700">{dailyOutcomeReportText}</p>
                </div>
              </div>

              <div className="mt-3 rounded-xl border bg-white p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Stat Changes</p>
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
        </details>
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

function OpsTopItem({ label, value, warning = false }: { label: string; value: string; warning?: boolean }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2">
      <p className="font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 font-bold ${warning ? "text-amber-100" : "text-slate-100"}`}>{value}</p>
    </div>
  );
}

function OpsPanelTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-300">
      <span className="text-cyan-200">{icon}</span>
      {title}
    </div>
  );
}

function OpsMetric({
  label,
  value,
  status,
  Icon,
  inverse = false,
}: {
  label: string;
  value: number;
  status?: string;
  Icon: React.ComponentType<{ className?: string }>;
  inverse?: boolean;
}) {
  const clampedValue = Math.max(0, Math.min(100, value));
  const danger = inverse ? clampedValue > 62 : clampedValue < 38;
  const caution = inverse ? clampedValue > 48 : clampedValue < 55;
  const barClass = danger ? "bg-rose-400" : caution ? "bg-amber-300" : "bg-emerald-300";

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-2">
      <div className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-slate-300">
          <Icon className="h-3.5 w-3.5 shrink-0 text-cyan-200" />
          <span className="truncate">{label}</span>
        </span>
        <span className="text-xs font-bold text-white">{clampedValue}</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
        <div className={`h-full rounded-full ${barClass}`} style={{ width: `${clampedValue}%` }} />
      </div>
      {status && <p className="mt-1 text-xs text-slate-500">{status}</p>}
    </div>
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
