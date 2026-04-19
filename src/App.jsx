import React, { useCallback, useEffect, useMemo, useState } from "react";

const DEFAULT_INPUTS = {
  ubank_aud: 50856, bnz_nzd: 10612, fhsss_aud: 3500, deposit_target_aud: 150000,
  aud_nzd: 1.08, salary_nzd: 6377, rent_nzd: 1462, joint_nzd: 1300, wise_nzd: 696,
  bills_nzd: 215, espp_nzd: 640, expected_au_taxable_income_aud: 90000,
  current_tax_residency: "NZ", can_claim_super_deduction: "Review",
};

const DEFAULT_HOLDINGS = [
  { ticker: "DHHF", type: "ETF",    units: 221,    cost_aud: 28.88, price_aud: 39.58 },
  { ticker: "NDQ",  type: "ETF",    units: 46,     cost_aud: 33.66, price_aud: 53.28 },
  { ticker: "VDHG", type: "ETF",    units: 39,     cost_aud: 58.26, price_aud: 74.05 },
  { ticker: "PLS",  type: "Stock",  units: 373,    cost_aud: 2.71,  price_aud: 5.39  },
  { ticker: "SRL",  type: "Stock",  units: 69,     cost_aud: 0,     price_aud: 12.3  },
  { ticker: "CNQ",  type: "Stock",  units: 34,     cost_aud: 0,     price_aud: 0.36  },
  { ticker: "ETH",  type: "Crypto", units: 0.86,   cost_aud: 0,     price_aud: 3254.65 },
  { ticker: "SOL",  type: "Crypto", units: 4.563,  cost_aud: 0,     price_aud: 116.37  },
  { ticker: "BTC",  type: "Crypto", units: 0.003,  cost_aud: 0,     price_aud: 108333.33 },
  { ticker: "ADA",  type: "Crypto", units: 463.73, cost_aud: 0,     price_aud: 0.34  },
  { ticker: "TRX",  type: "Crypto", units: 320.27, cost_aud: 0,     price_aud: 0.45  },
  { ticker: "XLM",  type: "Crypto", units: 521.35, cost_aud: 0,     price_aud: 0.22  },
  { ticker: "TRUMP",type: "Crypto", units: 1.01,   cost_aud: 0,     price_aud: 3.96  },
  { ticker: "SUPER",type: "Super",  units: 1,      cost_aud: 0,     price_aud: 43867 },
  { ticker: "ESPP", type: "ESPP",   units: 1,      cost_aud: 0,     price_aud: 7200  },
];

const DEFAULT_SPENDING = [
  ["2025-07","Rent",1462],["2025-07","Joint",1300],["2025-07","Wise",696],["2025-07","Eating Out",596],["2025-07","Other",710],["2025-07","Other People",400],["2025-07","Travel",278],["2025-07","To Casey",223],["2025-07","Bills",195],["2025-07","Groceries",160],["2025-07","Shopping",155],["2025-07","Transport",144],["2025-07","Health",141],["2025-07","Gaming & Subs",85],
  ["2025-08","Rent",1462],["2025-08","Joint",1300],["2025-08","Wise",696],["2025-08","Eating Out",526],["2025-08","Other",1221],["2025-08","Other People",400],["2025-08","Groceries",240],["2025-08","Bills",195],["2025-08","Transport",132],["2025-08","Health",131],["2025-08","Gaming & Subs",130],
  ["2025-09","Rent",1462],["2025-09","Joint",1416],["2025-09","Wise",696],["2025-09","Eating Out",542],["2025-09","Other",1368],["2025-09","Transport",255],["2025-09","Health",247],["2025-09","Other People",200],["2025-09","Bills",195],["2025-09","Gaming & Subs",176],["2025-09","To Casey",132],
  ["2025-10","Rent",1462],["2025-10","Joint",1400],["2025-10","Wise",696],["2025-10","Eating Out",353],["2025-10","Other",1077],["2025-10","Other People",600],["2025-10","Transport",292],["2025-10","Bills",215],["2025-10","Gaming & Subs",181],["2025-10","Health",64],
  ["2025-11","Rent",1462],["2025-11","Joint",1475],["2025-11","Wise",696],["2025-11","Eating Out",980],["2025-11","Other",727],["2025-11","To Casey",415],["2025-11","Other People",400],["2025-11","Shopping",400],["2025-11","Bills",215],["2025-11","Transport",191],["2025-11","Health",161],["2025-11","Groceries",159],["2025-11","Gaming & Subs",82],
  ["2025-12","Rent",1462],["2025-12","Joint",1300],["2025-12","Wise",696],["2025-12","Eating Out",626],["2025-12","Other",1265],["2025-12","To Casey",1485],["2025-12","Shopping",390],["2025-12","Bills",215],["2025-12","Transport",239],["2025-12","Health",206],["2025-12","Other People",200],["2025-12","Gaming & Subs",165],
  ["2026-01","Rent",1462],["2026-01","Joint",1300],["2026-01","Wise",696],["2026-01","Eating Out",875],["2026-01","Other",1190],["2026-01","Other People",200],["2026-01","Groceries",234],["2026-01","Bills",215],["2026-01","Transport",208],["2026-01","Health",131],["2026-01","To Casey",69],["2026-01","Gaming & Subs",41],
  ["2026-02","Rent",1462],["2026-02","Joint",1300],["2026-02","Wise",696],["2026-02","Eating Out",1246],["2026-02","Other",844],["2026-02","To Casey",895],["2026-02","Other People",400],["2026-02","Bills",215],["2026-02","Groceries",199],["2026-02","Transport",184],["2026-02","Health",184],["2026-02","Gaming & Subs",100],["2026-02","Shopping",410],
  ["2026-03","Rent",1462],["2026-03","Joint",1300],["2026-03","Wise",696],["2026-03","Eating Out",1019],["2026-03","Other",1231],["2026-03","Travel",884],["2026-03","To Casey",775],["2026-03","Other People",421],["2026-03","Bills",215],["2026-03","Health",326],["2026-03","Groceries",292],["2026-03","Transport",228],["2026-03","Gaming & Subs",93],["2026-03","Shopping",92],
];

const DEFAULT_HISTORY = [{ d: "2026-04-15", t: 115753 }];
const DISCRETIONARY = ["Eating Out","Transport","Groceries","Health","Shopping","Gaming & Subs","Travel","To Casey","Other People","Other"];
const STRUCTURAL    = ["Rent","Joint","Wise","Bills"];
const ALL_CATEGORIES = [...STRUCTURAL, ...DISCRETIONARY];
const COLORS = {
  "Eating Out":"#F97316", Transport:"#6366F1", Groceries:"#22C55E", Health:"#06B6D4",
  Shopping:"#EC4899", "Gaming & Subs":"#A855F7", Travel:"#8B5CF6", "To Casey":"#FB7185",
  "Other People":"#A8A29E", Rent:"#EF4444", Joint:"#10B981", Wise:"#0EA5E9",
  Bills:"#475569", Other:"#A8A29E",
};

function n(v, fb=0){ const x=Number(v); return Number.isFinite(x)?x:fb; }
function fmtMoney(v, prefix="$", digits=0) {
  const sign = v < 0 ? "-" : "";
  return `${sign}${prefix}${Math.abs(v).toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
}
function monthLabel(yyyymm){ const [y,m]=String(yyyymm).split("-"); return new Date(Number(y),Number(m)-1,1).toLocaleString("en-US",{month:"short"}); }
function currentYYYYMM(){ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; }
function projectedDate(m){ const d=new Date(); d.setMonth(d.getMonth()+Math.round(m)); return d.toLocaleString("en-AU",{month:"short",year:"numeric"}); }

const storageApi = {
  async get(key) {
    try {
      if (typeof window !== "undefined" && window.storage?.get) return await window.storage.get(key);
      if (typeof window !== "undefined" && window.localStorage) {
        const value = window.localStorage.getItem(key);
        return value == null ? null : { value };
      }
    } catch {}
    return null;
  },
  async set(key, value) {
    try {
      if (typeof window !== "undefined" && window.storage?.set) return await window.storage.set(key, value);
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
        return true;
      }
    } catch {}
    return false;
  },
};


function normalizeHolding(raw) {
  return {
    ticker:    raw.ticker    || raw.Ticker || raw.symbol || raw.Symbol || "",
    type:      raw.type      || raw.Type   || "Other",
    units:     n(raw.units   ?? raw.Units, 1),
    cost_aud:  n(raw.cost_aud ?? raw.cost  ?? raw.Cost_AUD ?? raw.avg_cost_aud),
    price_aud: n(raw.price_aud ?? raw.price ?? raw.Price_AUD),
  };
}

function readHoldings(payload) {
  if (Array.isArray(payload)) return payload.map(normalizeHolding).filter((r) => r.ticker);
  if (payload?.holdings && Array.isArray(payload.holdings)) return payload.holdings.map(normalizeHolding).filter((r) => r.ticker);
  return DEFAULT_HOLDINGS;
}

async function fetchHoldings(url) {
  const cleanUrl = String(url || "").trim();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(cleanUrl, {
      redirect: "follow",
      signal: controller.signal,
      headers: { Accept: "application/json, text/plain, */*" },
    });
    const rawText = await response.text();
    const text = rawText.replace(/^\)\]\}'\s*/, "").trim();

    if (!response.ok) {
      throw new Error(`Endpoint returned ${response.status}. Make sure the Apps Script web app is deployed and publicly accessible.`);
    }

    let payload;
    try {
      payload = JSON.parse(text);
    } catch {
      const preview = text.slice(0, 160);
      if (/^<!doctype|^<html/i.test(text)) {
        throw new Error("Endpoint returned HTML instead of JSON. Use the deployed /exec web app URL, not the spreadsheet or Apps Script editor link.");
      }
      throw new Error(`Endpoint did not return valid JSON. Response started with: ${preview}`);
    }

    const holdings = readHoldings(payload);
    if (!holdings.length) {
      throw new Error("Endpoint returned JSON, but there were no holdings in the response.");
    }
    return holdings;
  } finally { clearTimeout(timer); }
}

function buildRules(metrics, inputs, holdings) {
  const rules = [];
  const cryptoTail     = holdings.filter((h) => h.type === "Crypto" && h.value_aud < 200).reduce((a, h) => a + h.value_aud, 0);
  const etfGain        = holdings.filter((h) => h.type === "ETF").reduce((a, h) => a + h.gain_aud, 0);
  const fhsssRemaining = Math.max(0, 50000 - n(inputs.fhsss_aud));
  const expectedAuIncome = n(inputs.expected_au_taxable_income_aud);
  const canClaim  = String(inputs.can_claim_super_deduction || "Review");
  const residency = String(inputs.current_tax_residency || "Unknown");
  const certainty = residency === "AU" && canClaim.toLowerCase() === "yes" && expectedAuIncome >= 45000;

  if (metrics.recentEatOutAvg > 850) {
    const saving = fmtMoney((metrics.recentEatOutAvg - 700) * metrics.nzdToAud, "A$");
    rules.push({ title:"Eating out is absorbing real deposit money", tone:"orange", tag:"Action",
      body:`3-month eating-out average is ${fmtMoney(metrics.recentEatOutAvg,"NZ$")}/mo. Getting this under NZ$700 adds roughly ${saving}/mo to your deposit pace — a bigger lever than anything in the portfolio.` });
  }
  if (fhsssRemaining > 0) {
    rules.push({ title: certainty ? "FHSS looks worth modelling seriously" : "FHSS: not a default yes — model it properly",
      tone: certainty ? "green" : "blue", tag: certainty ? "Model" : "Review",
      body: certainty
        ? `You have ${fmtMoney(fhsssRemaining,"A$")} of FHSS room left. With AU tax residency and expected income of ${fmtMoney(expectedAuIncome,"A$")}, FHSS likely beats plain cash — but compare against ESPP returns and liquidity before committing.`
        : `You have ${fmtMoney(fhsssRemaining,"A$")} of FHSS room, but residency is ${residency} and deduction status is "${canClaim}". Treat as a scenario to model, not a current action.` });
  }
  if (cryptoTail > 0) {
    rules.push({ title:"Small crypto positions add admin, not value", tone:"stone", tag:"Simplify",
      body:`${fmtMoney(cryptoTail,"A$")} sits in sub-A$200 positions. Tax reporting complexity likely outweighs the upside at these sizes.` });
  }
  if (etfGain > 0) {
    rules.push({ title:"ETF sale timing is a tax decision, not a market one", tone:"blue", tag:"Tax",
      body:`Unrealised ETF gains are ~${fmtMoney(etfGain,"A$")}. When you sell should be driven by AU return date, tax residency status, and CGT discount eligibility — not by market timing.` });
  }
  if (metrics.depositGapAud > 0) {
    const surplusAud = metrics.monthlySurplusNzd * metrics.nzdToAud;
    const monthsToClose = surplusAud > 0 ? Math.round(metrics.depositGapAud / surplusAud) : null;
    rules.push({ title:"Closing the gap is a cashflow problem", tone:"green", tag:"Focus",
      body: monthsToClose != null
        ? `Gap is ${fmtMoney(metrics.depositGapAud,"A$")}. At ~${fmtMoney(surplusAud,"A$")}/mo surplus, you're roughly ${monthsToClose} months from target — projected ${projectedDate(monthsToClose)}.`
        : `Gap is ${fmtMoney(metrics.depositGapAud,"A$")}. Current surplus is negative — review discretionary spend or adjust your salary/ESPP inputs.` });
  }
  return rules;
}

function MiniBar({ value, max, color }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
      <div className="h-full rounded-full transition-all duration-300"
        style={{ width:`${max?Math.max(3,(value/max)*100):0}%`, backgroundColor:color }} />
    </div>
  );
}

function Badge({ children, tone="stone" }) {
  const styles = {
    stone:"bg-stone-100 text-stone-600", green:"bg-emerald-50 text-emerald-700",
    orange:"bg-orange-50 text-orange-700", red:"bg-red-50 text-red-700", blue:"bg-sky-50 text-sky-700",
  };
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${styles[tone]}`}>{children}</span>;
}

function Card({ title, subtitle, children, dark=false }) {
  return (
    <div className={dark ? "rounded-[28px] bg-stone-900 p-5 text-white shadow-sm" : "rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm"}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <div className={`text-sm font-semibold ${dark?"text-white":"text-stone-900"}`}>{title}</div>}
          {subtitle && <div className={`mt-1 text-xs ${dark?"text-stone-400":"text-stone-500"}`}>{subtitle}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

function SpendingManager({ spending, onAdd, onDeleteAt }) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(currentYYYYMM);
  const [category, setCategory] = useState("Eating Out");
  const [amount, setAmount] = useState("");
  const [viewMonth, setViewMonth] = useState(currentYYYYMM);

  const months = [...new Set(spending.map((r) => r[0]))].sort();
  const viewEntries = spending.reduce((acc, row, i) => {
    if (row[0] === viewMonth) acc.push({ row, i });
    return acc;
  }, []);
  const viewTotal = viewEntries.reduce((a, { row }) => a + n(row[2]), 0);

  function handleAdd() {
    const amt = n(amount);
    if (!month || !category || amt <= 0) return;
    onAdd([month, category, amt]);
    setAmount("");
  }

  return (
    <Card title="Spending entries" subtitle="Add and review monthly data">
      <button onClick={() => setOpen((s) => !s)}
        className="flex w-full items-center justify-between rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-100">
        <span>{open ? "Close" : "Manage spending data"}</span>
        <span className="text-stone-400">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="mt-4 space-y-5">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-stone-400">Add entry</div>
            <div className="grid grid-cols-[1fr_1.5fr_1fr_auto] gap-2">
              <input type="month" value={month} onChange={(e) => setMonth(e.target.value)}
                className="rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:bg-white" />
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:bg-white">
                {ALL_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <input type="number" min="0" placeholder="NZD" value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                className="rounded-2xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-stone-400 focus:bg-white" />
              <button onClick={handleAdd}
                className="rounded-2xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-stone-800">Add</button>
            </div>
          </div>
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-400">Review month</div>
              <select value={viewMonth} onChange={(e) => setViewMonth(e.target.value)}
                className="rounded-xl border border-stone-200 bg-stone-50 px-2 py-1 text-xs outline-none">
                {months.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            {viewEntries.length === 0 ? (
              <div className="text-sm text-stone-400">No entries for this month yet.</div>
            ) : (
              <div className="space-y-1">
                {viewEntries.map(({ row, i }) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-stone-50 px-3 py-2 text-sm">
                    <span className="text-stone-600">{row[1]}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">{fmtMoney(n(row[2]), "NZ$")}</span>
                      <button onClick={() => onDeleteAt(i)} className="text-stone-300 hover:text-red-400 transition-colors" title="Remove">×</button>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold border-t border-stone-100">
                  <span className="text-stone-500">Month total</span>
                  <span>{fmtMoney(viewTotal, "NZ$")}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

export default function App() {
  const [tab, setTab] = useState("Overview");
  const [dataUrl, setDataUrl] = useState("");
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [spending, setSpending] = useState(DEFAULT_SPENDING);
  const [history, setHistory] = useState(DEFAULT_HISTORY);
  const [holdings, setHoldings] = useState(DEFAULT_HOLDINGS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cashEdit, setCashEdit] = useState(false);
  const [showHoldings, setShowHoldings] = useState(false);
  const [connected, setConnected] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [draftCash, setDraftCash] = useState({ ubank_aud: String(DEFAULT_INPUTS.ubank_aud), bnz_nzd: String(DEFAULT_INPUTS.bnz_nzd) });
  const [storageReady, setStorageReady] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    async function loadState() {
      try { const r = await storageApi.get("zf_data_url"); if (r?.value) setDataUrl(r.value); } catch {}
      try { const r = await storageApi.get("zf_inputs");   if (r?.value) setInputs({ ...DEFAULT_INPUTS, ...JSON.parse(r.value) }); } catch {}
      try { const r = await storageApi.get("zf_spending"); if (r?.value) setSpending(JSON.parse(r.value)); } catch {}
      try { const r = await storageApi.get("zf_history");  if (r?.value) setHistory(JSON.parse(r.value)); } catch {}
      setStorageReady(true);
    }
    loadState();
  }, []);

  // Persist on change
  useEffect(() => { if (storageReady) Promise.resolve(storageApi.set("zf_data_url", dataUrl)).catch(() => {}); }, [dataUrl, storageReady]);
  useEffect(() => { if (storageReady) Promise.resolve(storageApi.set("zf_inputs", JSON.stringify(inputs))).catch(() => {}); }, [inputs, storageReady]);
  useEffect(() => { if (storageReady) Promise.resolve(storageApi.set("zf_spending", JSON.stringify(spending))).catch(() => {}); }, [spending, storageReady]);
  useEffect(() => { if (storageReady) Promise.resolve(storageApi.set("zf_history", JSON.stringify(history))).catch(() => {}); }, [history, storageReady]);

  const loadData = useCallback(async (url) => {
    if (!url) { setError(""); setConnected(false); setHoldings(DEFAULT_HOLDINGS); setLastRefreshed(null); return; }
    setLoading(true); setError("");
    try {
      const fetched = await fetchHoldings(url);
      setHoldings(fetched);
      setConnected(true);
      setLastRefreshed(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    } catch (e) {
      setError(e.name === "AbortError"
        ? "Timed out. Check Apps Script is deployed with access: Anyone."
        : (e?.message || "Could not reach the endpoint. Check the /exec URL and deployment access."));
      setConnected(false);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { if (storageReady && dataUrl) loadData(dataUrl); }, [storageReady]); // eslint-disable-line

  const enrichedHoldings = useMemo(() => holdings.map((h) => {
    const value_aud = n(h.units,1) * n(h.price_aud);
    const cost_basis_aud = n(h.units,1) * n(h.cost_aud);
    return { ...h, value_aud, cost_basis_aud, gain_aud: value_aud - cost_basis_aud };
  }), [holdings]);

  const metrics = useMemo(() => {
    const nzdToAud = 1 / n(inputs.aud_nzd, 1.08);
    const superH = enrichedHoldings.find((h) => h.type === "Super" || h.ticker === "SUPER");
    const esppH  = enrichedHoldings.find((h) => h.type === "ESPP"  || h.ticker === "ESPP");
    const shareLike  = enrichedHoldings.filter((h) => !["Crypto","Super","ESPP"].includes(h.type));
    const cryptoList = enrichedHoldings.filter((h) => h.type === "Crypto");
    const sharesAud = shareLike.reduce((a,h) => a+h.value_aud, 0);
    const cryptoAud = cryptoList.reduce((a,h) => a+h.value_aud, 0);
    const superAud  = superH?.value_aud ?? 0;
    const esppAud   = esppH?.value_aud  ?? 0;
    const fhssAud   = n(inputs.fhsss_aud);
    const cashAud   = n(inputs.ubank_aud) + n(inputs.bnz_nzd) * nzdToAud;
    const netWorthAud = sharesAud + cryptoAud + superAud + esppAud + cashAud;
    const liquidAud   = sharesAud + cryptoAud + esppAud + cashAud;
    const depositGapAud = Math.max(0, n(inputs.deposit_target_aud) - liquidAud - fhssAud);
    const depositPct = n(inputs.deposit_target_aud) ? ((liquidAud + fhssAud) / n(inputs.deposit_target_aud)) * 100 : 0;

    const months = [...new Set(spending.map((r) => r[0]))].sort();
    const byMonth = months.map((month) => {
      const rows = spending.filter((r) => r[0] === month);
      const discretionary = rows.filter((r) => DISCRETIONARY.includes(r[1])).reduce((a,r) => a+n(r[2]), 0);
      const structural   = rows.filter((r) => STRUCTURAL.includes(r[1])).reduce((a,r) => a+n(r[2]), 0);
      const eatOut       = rows.filter((r) => r[1] === "Eating Out").reduce((a,r) => a+n(r[2]), 0);
      return { month, discretionary, structural, total: discretionary + structural, eatOut };
    });

    const recent3 = byMonth.slice(-3);
    const recentDiscretionaryAvg = recent3.length ? recent3.reduce((a,r) => a+r.discretionary, 0) / recent3.length : 0;
    const recentEatOutAvg        = recent3.length ? recent3.reduce((a,r) => a+r.eatOut, 0) / recent3.length : 0;
    const avgStructural          = byMonth.length ? byMonth.reduce((a,r) => a+r.structural, 0) / byMonth.length : 0;
    const monthlySurplusNzd      = n(inputs.salary_nzd) - avgStructural - recentDiscretionaryAvg - n(inputs.espp_nzd);

    return { nzdToAud, sharesAud, cryptoAud, superAud, esppAud, fhssAud, cashAud, netWorthAud, liquidAud, depositGapAud, depositPct, byMonth, recentDiscretionaryAvg, recentEatOutAvg, avgStructural, monthlySurplusNzd };
  }, [enrichedHoldings, inputs, spending]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const total = Math.round(metrics.netWorthAud);
    setHistory((prev) => {
      const last = prev[prev.length - 1];
      if (last?.d === today) return prev.map((x, i) => i === prev.length - 1 ? { ...x, t: total } : x);
      return [...prev.slice(-29), { d: today, t: total }];
    });
  }, [metrics.netWorthAud]);

  const rules = useMemo(() => buildRules(metrics, inputs, enrichedHoldings), [metrics, inputs, enrichedHoldings]);
  const holdingsMax = Math.max(...enrichedHoldings.map((h) => h.value_aud), 1);
  const monthMax    = Math.max(...metrics.byMonth.map((m) => m.total), 1);
  const categoryTotals = Object.entries(
    spending.reduce((acc, row) => { acc[row[1]] = (acc[row[1]] || 0) + n(row[2]); return acc; }, {})
  ).sort((a, b) => b[1] - a[1]);

  function startCashEdit() { setDraftCash({ ubank_aud: String(inputs.ubank_aud), bnz_nzd: String(inputs.bnz_nzd) }); setCashEdit(true); }
  function saveCashEdit()  { setInputs((p) => ({ ...p, ubank_aud: n(draftCash.ubank_aud), bnz_nzd: n(draftCash.bnz_nzd) })); setCashEdit(false); }
  function addSpendEntry(row)  { setSpending((p) => [...p, row]); }
  function deleteSpendAt(idx)  { setSpending((p) => p.filter((_, i) => i !== idx)); }

  const holdingColor = (t) => t === "Crypto" ? "#f59e0b" : t === "ETF" ? "#10b981" : t === "Super" ? "#f97316" : t === "ESPP" ? "#0ea5e9" : "#6366f1";

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <div className="mx-auto max-w-6xl p-4 md:p-8">

        <div className="mb-6 rounded-[32px] bg-stone-900 p-6 text-white shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-400">Net worth · AUD</div>
              <div className="text-4xl font-black tracking-tight md:text-5xl">{fmtMoney(metrics.netWorthAud, "A$")}</div>
              <div className="mt-2 text-sm text-stone-400">
                {connected ? `Live${lastRefreshed ? ` · updated ${lastRefreshed}` : ""}` : "Demo data · connect your sheet to go live"}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:w-[360px]">
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-stone-400">Deposit progress</div>
                <div className="mt-1 text-2xl font-bold text-emerald-400">{metrics.depositPct.toFixed(0)}%</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-[10px] uppercase tracking-[0.18em] text-stone-400">Gap</div>
                <div className="mt-1 text-2xl font-bold text-orange-400">{fmtMoney(metrics.depositGapAud, "A$")}</div>
              </div>
            </div>
          </div>
        </div>

        <Card title="Sheet endpoint" subtitle="Paste your Apps Script /exec URL. Deployed with access: Anyone.">
          <label className="block">
            <div className="mb-2 text-xs font-semibold text-stone-600">Apps Script web app URL</div>
            <input
              className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-400 focus:bg-white"
              value={dataUrl}
              onChange={(e) => setDataUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") loadData(e.currentTarget.value); }}
              placeholder="https://script.google.com/macros/s/.../exec"
            />
          </label>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button onClick={() => loadData(dataUrl)} disabled={loading || !dataUrl.trim()}
              className="rounded-2xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-40">
              {loading ? "Loading…" : "Refresh holdings"}
            </button>
            <button onClick={() => { setDataUrl(""); setConnected(false); setHoldings(DEFAULT_HOLDINGS); setError(""); setLastRefreshed(null); }}
              className="rounded-2xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50">
              Reset to demo
            </button>
            <Badge tone={connected ? "blue" : "stone"}>{connected ? "Connected" : "Demo mode"}</Badge>
            {error && <div className="self-center text-sm text-red-600">{error}</div>}
          </div>
        </Card>

        <div className="mt-6 flex gap-2 rounded-full border border-stone-200 bg-white p-1 shadow-sm">
          {["Overview", "Money", "Strategy"].map((name) => (
            <button key={name} onClick={() => setTab(name)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${tab === name ? "bg-stone-900 text-white" : "text-stone-500 hover:text-stone-900"}`}>
              {name}
            </button>
          ))}
        </div>

        {tab === "Overview" && (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Card title="Cash" subtitle={`UBank + BNZ @ ${(1/metrics.nzdToAud).toFixed(2)} AUD/NZD`}>
                <div className="text-2xl font-bold text-sky-600">{fmtMoney(metrics.cashAud, "A$")}</div>
              </Card>
              <Card title="Shares" subtitle={`${enrichedHoldings.filter((h) => !["Crypto","Super","ESPP"].includes(h.type)).length} positions`}>
                <div className="text-2xl font-bold text-emerald-600">{fmtMoney(metrics.sharesAud, "A$")}</div>
              </Card>
              <Card title="Crypto" subtitle={`${enrichedHoldings.filter((h) => h.type === "Crypto").length} coins`}>
                <div className="text-2xl font-bold text-orange-500">{fmtMoney(metrics.cryptoAud, "A$")}</div>
              </Card>
              <Card title="Super + ESPP" subtitle={`FHSS used: ${fmtMoney(metrics.fhssAud, "A$")}`}>
                <div className="text-2xl font-bold text-stone-900">{fmtMoney(metrics.superAud + metrics.esppAud, "A$")}</div>
              </Card>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
              <Card dark title="Apartment deposit" subtitle={`Target: ${fmtMoney(n(inputs.deposit_target_aud), "A$")}`}>
                <div className="grid gap-4 md:grid-cols-3">
                  <div><div className="text-[11px] uppercase tracking-[0.18em] text-stone-400">Liquid</div><div className="mt-1 text-3xl font-black text-emerald-400">{fmtMoney(metrics.liquidAud, "A$")}</div></div>
                  <div><div className="text-[11px] uppercase tracking-[0.18em] text-stone-400">FHSS</div><div className="mt-1 text-3xl font-black text-orange-400">{fmtMoney(metrics.fhssAud, "A$")}</div></div>
                  <div><div className="text-[11px] uppercase tracking-[0.18em] text-stone-400">Gap</div><div className="mt-1 text-3xl font-black text-red-400">{fmtMoney(metrics.depositGapAud, "A$")}</div></div>
                </div>
                <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-emerald-400 transition-all duration-500" style={{ width: `${Math.min(metrics.depositPct, 100)}%` }} />
                </div>
                <div className="mt-2 text-right text-xs text-stone-400">{metrics.depositPct.toFixed(0)}% of A${(n(inputs.deposit_target_aud)/1000).toFixed(0)}k target</div>
              </Card>

              <Card title="Accounts" subtitle="Manual balances · update anytime">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between"><span className="text-stone-500">UBank</span><span className="font-semibold">{fmtMoney(n(inputs.ubank_aud), "A$")}</span></div>
                  <div className="flex items-center justify-between"><span className="text-stone-500">BNZ</span><span className="font-semibold">{fmtMoney(n(inputs.bnz_nzd), "NZ$")}</span></div>
                  <div className="flex items-center justify-between"><span className="text-stone-500">Super</span><span className="font-semibold">{fmtMoney(metrics.superAud, "A$")}</span></div>
                  <div className="flex items-center justify-between"><span className="text-stone-500">ESPP</span><span className="font-semibold">{fmtMoney(metrics.esppAud, "A$")}</span></div>
                </div>
                {!cashEdit ? (
                  <button onClick={startCashEdit} className="mt-4 w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50">Update cash balances</button>
                ) : (
                  <div className="mt-4 space-y-3">
                    <input type="number" className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-stone-400 focus:bg-white" value={draftCash.ubank_aud} onChange={(e) => setDraftCash((s) => ({ ...s, ubank_aud: e.target.value }))} placeholder="UBank AUD" />
                    <input type="number" className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-stone-400 focus:bg-white" value={draftCash.bnz_nzd}  onChange={(e) => setDraftCash((s) => ({ ...s, bnz_nzd: e.target.value }))}  placeholder="BNZ NZD"   />
                    <div className="flex gap-2">
                      <button onClick={saveCashEdit} className="rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white">Save</button>
                      <button onClick={() => setCashEdit(false)} className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700">Cancel</button>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
              <Card title="Net worth history" subtitle="Auto-snapshot · one entry per day">
                <div className="space-y-2">
                  {history.length === 0 && <div className="text-sm text-stone-400">No history yet.</div>}
                  {[...history].reverse().slice(0, 12).map((x, i, arr) => {
                    const prev = arr[i + 1];
                    const diff = prev ? x.t - prev.t : null;
                    return (
                      <div key={x.d} className="flex items-center justify-between text-sm">
                        <span className="text-stone-500">{x.d}</span>
                        <div className="flex items-center gap-3">
                          {diff != null && <span className={diff >= 0 ? "text-emerald-600" : "text-red-600"}>{diff >= 0 ? "+" : ""}{fmtMoney(diff, "A$")}</span>}
                          <span className="font-semibold">{fmtMoney(x.t, "A$")}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card title="Holdings" subtitle={`${enrichedHoldings.length} positions · ${connected ? "live" : "demo prices"}`}>
                <button onClick={() => setShowHoldings((s) => !s)}
                  className="mb-4 flex w-full items-center justify-between rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50">
                  <span>{showHoldings ? "Hide breakdown" : "Show breakdown"}</span>
                  <span className="text-stone-400">{showHoldings ? "▲" : "▼"}</span>
                </button>
                {showHoldings && (
                  <div className="space-y-3">
                    {enrichedHoldings.map((h) => (
                      <div key={h.ticker}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{h.ticker}</span>
                            <span className="text-stone-400">{h.type}</span>
                          </div>
                          <span className="font-semibold">{fmtMoney(h.value_aud, "A$")}</span>
                        </div>
                        <MiniBar value={h.value_aud} max={holdingsMax} color={holdingColor(h.type)} />
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </>
        )}

        {tab === "Money" && (
          <>
            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
              <Card title="Monthly spend" subtitle={`${metrics.byMonth.length} months · hover for details`}>
                <div className="flex h-44 items-end gap-1.5">
                  {metrics.byMonth.map((m) => (
                    <div key={m.month} className="flex flex-1 flex-col items-center gap-2 cursor-default"
                      title={`${monthLabel(m.month)}: ${fmtMoney(m.total, "NZ$")} total\nDiscretionary: ${fmtMoney(m.discretionary, "NZ$")}\nFixed: ${fmtMoney(m.structural, "NZ$")}`}>
                      <div className="flex h-36 w-full flex-col justify-end">
                        <div className="rounded-t-sm bg-orange-400" style={{ height: `${(m.discretionary / monthMax) * 100}%` }} />
                        <div className="bg-stone-300" style={{ height: `${(m.structural / monthMax) * 100}%` }} />
                      </div>
                      <div className="text-[9px] font-medium uppercase tracking-wider text-stone-400">{monthLabel(m.month)}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-5 text-xs text-stone-500">
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-sm bg-orange-400" />Discretionary</div>
                  <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-sm bg-stone-300" />Fixed</div>
                </div>
              </Card>

              <Card title="Savings math" subtitle="Based on 3-month rolling average · NZD">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm"><span className="text-stone-500">Salary (take-home)</span><span className="font-semibold">{fmtMoney(n(inputs.salary_nzd), "NZ$")}</span></div>
                  <div className="flex items-center justify-between text-sm"><span className="text-stone-500">Fixed costs avg</span><span className="font-semibold text-red-500">−{fmtMoney(metrics.avgStructural, "NZ$")}</span></div>
                  <div className="flex items-center justify-between text-sm"><span className="text-stone-500">Discretionary avg (3mo)</span><span className="font-semibold text-red-500">−{fmtMoney(metrics.recentDiscretionaryAvg, "NZ$")}</span></div>
                  <div className="flex items-center justify-between text-sm"><span className="text-stone-500">ESPP deduction</span><span className="font-semibold text-red-500">−{fmtMoney(n(inputs.espp_nzd), "NZ$")}</span></div>
                  <div className="flex items-center justify-between border-t border-stone-100 pt-3 text-sm">
                    <span className="text-stone-500">Monthly surplus</span>
                    <span className={`font-bold ${metrics.monthlySurplusNzd >= 0 ? "text-emerald-600" : "text-red-600"}`}>{fmtMoney(metrics.monthlySurplusNzd, "NZ$")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-500">Surplus in AUD</span>
                    <span className={`font-semibold ${metrics.monthlySurplusNzd >= 0 ? "text-emerald-600" : "text-red-600"}`}>~{fmtMoney(metrics.monthlySurplusNzd * metrics.nzdToAud, "A$")}/mo</span>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
              <Card title="Portfolio composition" subtitle="All positions by value · AUD">
                <div className="space-y-3">
                  {enrichedHoldings.map((h) => (
                    <div key={h.ticker}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-900">{h.ticker}</span>
                          <span className="text-stone-400">{h.type}</span>
                        </div>
                        <span className="font-semibold">{fmtMoney(h.value_aud, "A$")}</span>
                      </div>
                      <MiniBar value={h.value_aud} max={holdingsMax} color={holdingColor(h.type)} />
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Category totals" subtitle={`All-time · ${spending.length} entries`}>
                <div className="space-y-3">
                  {categoryTotals.slice(0, 10).map(([cat, total], index, arr) => (
                    <div key={cat}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-stone-700">{cat}</span>
                        <span className="font-semibold">{fmtMoney(total, "NZ$")}</span>
                      </div>
                      <MiniBar value={total} max={arr[0][1]} color={index < 3 ? "#1c1917" : COLORS[cat] || "#a8a29e"} />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="mt-4">
              <SpendingManager spending={spending} onAdd={addSpendEntry} onDeleteAt={deleteSpendAt} />
            </div>
          </>
        )}

        {tab === "Strategy" && (
          <div className="mt-6 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
            <Card title="Strategy notes" subtitle="Rule-based · updates automatically with your data">
              <div className="space-y-4">
                {rules.length === 0 && <div className="rounded-3xl bg-stone-50 p-4 text-sm text-stone-500">No active flags. Everything looks on track.</div>}
                {rules.map((rule) => (
                  <div key={rule.title} className="rounded-3xl border border-stone-200 p-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <div className="font-semibold text-stone-900">{rule.title}</div>
                      <Badge tone={rule.tone === "red" ? "red" : rule.tone === "orange" ? "orange" : rule.tone === "green" ? "green" : rule.tone === "blue" ? "blue" : "stone"}>{rule.tag}</Badge>
                    </div>
                    <div className="text-sm leading-6 text-stone-600">{rule.body}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Deposit timeline" subtitle="Projection at current pace · and with one lever pulled">
              {(() => {
                const surplusAud = metrics.monthlySurplusNzd * metrics.nzdToAud;
                const monthsNormal = surplusAud > 0 ? Math.ceil(metrics.depositGapAud / surplusAud) : null;
                const eatOutSaving = Math.max(0, metrics.recentEatOutAvg - 700) * metrics.nzdToAud;
                const monthsAggressive = (surplusAud + eatOutSaving) > 0 ? Math.ceil(metrics.depositGapAud / (surplusAud + eatOutSaving)) : null;
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-stone-50 p-4">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Monthly surplus</div>
                        <div className={`mt-1 text-xl font-bold ${surplusAud >= 0 ? "text-emerald-600" : "text-red-600"}`}>{fmtMoney(surplusAud, "A$")}</div>
                      </div>
                      <div className="rounded-2xl bg-stone-50 p-4">
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">Deposit gap</div>
                        <div className="mt-1 text-xl font-bold text-stone-900">{fmtMoney(metrics.depositGapAud, "A$")}</div>
                      </div>
                    </div>
                    {surplusAud > 0 ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3">
                          <span className="text-emerald-800">At current pace</span>
                          <span className="font-bold text-emerald-700">{monthsNormal}mo · {projectedDate(monthsNormal)}</span>
                        </div>
                        {eatOutSaving > 50 && monthsAggressive != null && (
                          <div className="flex items-center justify-between rounded-2xl bg-orange-50 px-4 py-3">
                            <span className="text-orange-800">If eating out &lt; NZ$700</span>
                            <span className="font-bold text-orange-700">{monthsAggressive}mo · {projectedDate(monthsAggressive)}</span>
                          </div>
                        )}
                        <div className="pt-1 text-xs text-stone-400">Surplus = salary minus fixed costs, 3-month discretionary avg, and ESPP deduction. Excludes one-off investment gains.</div>
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">Surplus is currently negative. Review discretionary spend or adjust salary / ESPP inputs on the Money tab.</div>
                    )}
                  </div>
                );
              })()}
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
