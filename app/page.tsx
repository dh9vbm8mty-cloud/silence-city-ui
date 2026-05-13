"use client";

import { useState } from "react";

const roles = {
  Engineering: {
    pressure: "Power is unstable. Repeated manual stabilization may consume Scrap.",
    actions: ["Stabilize Power", "Repair Infrastructure", "Support Market Setup"],
  },
  Exploration: {
    pressure: "Public reserves depend on new supply. Data and Power Cell shortages matter.",
    actions: ["Safe Salvage", "Risk Salvage", "List Item on Market", "Sell at Civic Price"],
  },
  "AI Systems": {
    pressure: "Route protocols are not reliable. Public Data reserve is empty.",
    actions: ["AI Diagnostic", "Archive Lead", "System Warning Review"],
  },
  Logistics: {
    pressure: "Public transfers may soon matter. Route staging is not reliable.",
    actions: ["Storage Audit", "Public Delivery Support", "Security Route Check"],
  },
  Negotiation: {
    pressure: "Public funds are weak. Market pricing may affect public trust.",
    actions: ["Create Public Treasury", "Charter Hearing", "Public Price Hearing"],
  },
};

type RoleName = keyof typeof roles;

const districtStats = [
  ["Power", 34, "Unstable"],
  ["Infrastructure", 39, "Functional"],
  ["Security", 37, "Thin"],
  ["AI Stability", 56, "Stable"],
] as const;

const publicStorage = [
  ["Scrap", 3, "near target"],
  ["Power Cell", 1, "below target"],
  ["Data Fragment", 0, "empty"],
  ["Electronic Component", 1, "thin"],
  ["Structural Part", 2, "stable"],
] as const;

const districtPressure = [
  "Public Data reserve is empty.",
  "Treasury can fund one major purchase, not several mistakes.",
  "Market and Treasury can now exist, but public purchasing power is limited.",
  "No licensed supply point currently anchors public demand.",
];

const startingCityMemory = [
  "D created the first trusted Public Storage record.",
  "B recovered the first Power Cell.",
  "E advanced Charter toward public rule formation.",
];

export default function SilenceCityPage() {
  const [role, setRole] = useState<RoleName>("Exploration");
  const [action, setAction] = useState("Safe Salvage");
  const [disposition, setDisposition] = useState("Deposit to Public Storage");
  const [intent, setIntent] = useState("Help find Data without risking the district too much.");
  const [submitted, setSubmitted] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [cityMemory, setCityMemory] = useState(startingCityMemory);

  const currentRole = roles[role];

  function changeRole(nextRole: RoleName) {
    setRole(nextRole);
    setAction(roles[nextRole].actions[0]);
    setSubmitted(false);
    setResolved(false);
  }

  function resolveDay() {
    if (!submitted) return;
    setResolved(true);
    const newMemory = createResolution().memory;
    setCityMemory((previous) => [newMemory, ...previous].slice(0, 5));
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

    if (action.includes("Treasury") || action.includes("Charter") || action.includes("Price")) {
      return {
        result: `${role} strengthened public coordination around Treasury / Market behavior.`,
        publicChange: "Public trust improves slightly. Treasury pressure becomes easier to discuss.",
        contribution: `${role} turned private choices into a public discussion.`,
        memory: `${role} helped define how the district handles civic pricing and public funds.`,
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
            Silence City — Daily Operations Interface v0.1.1
          </p>
          <h1 className="mt-2 text-3xl font-bold">Old Industrial Sector — Day 4 / 14</h1>
          <p className="mt-2 text-slate-600">
            Zone Condition: Functional but weak · Market and Treasury systems are becoming available
          </p>
        </header>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4">
            <Panel title="District Status">
              <div className="grid gap-3">
                {districtStats.map(([label, value, note]) => (
                  <Status key={label} label={label} value={value} note={note} />
                ))}
              </div>
            </Panel>

            <Panel title="Public Storage">
              <div className="space-y-2">
                {publicStorage.map(([label, value, note]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl border bg-slate-50 p-3">
                    <span className="font-medium">{label}</span>
                    <span className="text-right">
                      <span className="block text-lg font-bold">{value}</span>
                      <span className="text-xs text-slate-500">{note}</span>
                    </span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Treasury / Market">
              <div className="rounded-2xl border bg-slate-50 p-3">
                <p className="text-sm text-slate-500">Public Treasury</p>
                <p className="text-2xl font-bold">22 Credits</p>
                <p className="text-sm text-slate-500">Public buying power: limited</p>
              </div>
              <div className="mt-3 rounded-2xl border bg-slate-50 p-3">
                <p className="font-semibold">Market: Active</p>
                <p className="mt-1 text-sm text-slate-600">
                  Successful market sales add +1 transaction fee to Treasury.
                </p>
              </div>
            </Panel>
          </div>

          <div className="space-y-4">
            <Panel title="District Pressure">
              <div className="space-y-2">
                {districtPressure.map((item) => (
                  <div key={item} className="rounded-2xl border bg-slate-50 p-3 text-sm">
                    {item}
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Role Pressure">
              <div className="space-y-2">
                {(Object.keys(roles) as RoleName[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => changeRole(key)}
                    className={`w-full rounded-2xl border p-3 text-left transition ${
                      role === key ? "bg-slate-900 text-white" : "bg-slate-50 hover:bg-white"
                    }`}
                  >
                    <p className="font-semibold">{key}</p>
                    <p className={`mt-1 text-sm ${role === key ? "text-slate-200" : "text-slate-500"}`}>
                      {roles[key].pressure}
                    </p>
                  </button>
                ))}
              </div>
            </Panel>

            <Panel title="Stabilization Readiness">
              <div className="grid gap-2">
                <Readiness label="Operational Stability" value="strained but recoverable" />
                <Readiness label="Public Reserve" value="thin; Data missing" />
                <Readiness label="Civic Authority" value="forming" />
                <Readiness label="Supply Infrastructure" value="not licensed yet" />
                <Readiness label="Route Readiness" value="uncertain" />
              </div>
            </Panel>
          </div>

          <div className="space-y-4">
            <Panel title={`You Are: ${role}`}>
              <p className="text-sm text-slate-600">{currentRole.pressure}</p>

              <div className="mt-4 space-y-2">
                <p className="text-sm font-semibold">Choose Main Action</p>
                {currentRole.actions.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setAction(item);
                      setSubmitted(false);
                      setResolved(false);
                    }}
                    className={`w-full rounded-2xl border p-3 text-left text-sm transition ${
                      action === item ? "bg-slate-900 text-white" : "bg-slate-50 hover:bg-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </Panel>

            <Panel title="Submit Action">
              <p className="text-sm text-slate-500">Main Action</p>
              <p className="rounded-2xl border bg-slate-50 p-3 font-semibold">{action}</p>

              <label className="mt-3 block text-sm text-slate-500">Resource Disposition if Salvage</label>
              <select
                value={disposition}
                onChange={(event) => setDisposition(event.target.value)}
                className="mt-1 w-full rounded-2xl border bg-white p-3"
              >
                <option>Deposit to Public Storage</option>
                <option>Keep in Personal Inventory</option>
                <option>List on Market</option>
                <option>Sell directly to Treasury / Public Order</option>
                <option>Decide after result</option>
              </select>

              <label className="mt-3 block text-sm text-slate-500">Intent</label>
              <textarea
                value={intent}
                onChange={(event) => setIntent(event.target.value)}
                className="mt-1 w-full rounded-2xl border bg-white p-3"
                rows={4}
              />

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button
                  onClick={() => {
                    setSubmitted(true);
                    setResolved(false);
                  }}
                  className="rounded-2xl bg-slate-900 p-3 font-semibold text-white"
                >
                  Submit Action
                </button>
                <button
                  onClick={resolveDay}
                  disabled={!submitted}
                  className={`rounded-2xl border p-3 font-semibold ${
                    submitted ? "bg-white text-slate-900" : "bg-slate-100 text-slate-400"
                  }`}
                >
                  Resolve Day
                </button>
              </div>

              {submitted && (
                <div className="mt-4 rounded-2xl bg-slate-900 p-4 text-sm text-white">
                  <p className="font-bold">Submitted</p>
                  <p>{role} chooses {action}.</p>
                  <p>Disposition: {disposition}</p>
                  <p>Intent: {intent}</p>
                </div>
              )}

              {resolved && (
                <div className="mt-4 space-y-2 rounded-2xl border bg-white p-3 text-sm">
                  <p className="font-bold">Simulated Day Result</p>
                  <p className="rounded-xl bg-slate-50 p-2">{resolution.result}</p>
                  <p className="rounded-xl bg-slate-50 p-2">{resolution.publicChange}</p>
                  <p className="rounded-xl bg-slate-50 p-2">
                    Visible Contribution: {resolution.contribution}
                  </p>
                  <p className="rounded-xl bg-slate-900 p-2 text-white">
                    City Memory: {resolution.memory}
                  </p>
                </div>
              )}
            </Panel>

            <Panel title="New Player Assist">
              <div className="space-y-2 text-sm text-slate-600">
                <p>“Public supply” usually relates to Market, Facility, Storage, or Logistics.</p>
                <p>“Formal authority” usually relates to Charter, Certification, or public approval.</p>
                <p>This panel explains terms. It does not tell you the optimal move.</p>
              </div>
            </Panel>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Panel title="City Memory">
            <ul className="space-y-2 text-sm">
              {cityMemory.map((item) => (
                <li key={item} className="rounded-2xl border bg-slate-50 p-3">
                  {item}
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Previous Daily Log">
            <ul className="space-y-2 text-sm">
              <li className="rounded-2xl border bg-slate-50 p-3">
                A stabilized Power before it slipped below safe range.
              </li>
              <li className="rounded-2xl border bg-slate-50 p-3">
                B recovered Structural Parts and helped refill basic supply.
              </li>
              <li className="rounded-2xl border bg-slate-50 p-3">
                E advanced Charter to 3 / 5, unlocking civic systems.
              </li>
            </ul>
          </Panel>
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
