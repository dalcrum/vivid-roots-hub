// Givebutter API client — server-side only
// Docs: https://docs.givebutter.com/reference

const GIVEBUTTER_BASE = "https://api.givebutter.com/v1";

// ---- Types ----

export interface GivebutterCampaign {
  id: number;
  type: string;
  status: string;
  title: string;
  goal: number; // cents
  raised: number; // cents
  slug: string;
  created_at: string;
  end_at: string | null;
}

export interface GivebutterTransaction {
  id: number;
  campaign_id: number | null;
  campaign_code: string | null;
  first_name: string;
  last_name: string;
  email: string;
  amount: number; // cents
  fee: number; // cents
  donated: number; // cents
  payout: number; // cents
  currency: string;
  status: string;
  payment_method: string;
  plan_id: number | null;
  transacted_at: string;
}

export interface GivebutterPlan {
  id: number;
  campaign_id: number | null;
  amount: number; // cents
  frequency: string;
  status: string;
  created_at: string;
}

interface PaginatedResponse<T> {
  data: T[];
  links: { next: string | null };
  meta: { total: number; last_page: number; current_page: number };
}

// ---- Fetch helpers ----

async function givebutterFetch<T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<PaginatedResponse<T>> {
  const apiKey = process.env.GIVEBUTTER_API_KEY;
  if (!apiKey) throw new Error("GIVEBUTTER_API_KEY is not set");

  const url = new URL(`${GIVEBUTTER_BASE}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    next: { revalidate: 300 }, // 5-min cache
  });

  if (!res.ok) {
    throw new Error(`Givebutter API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

async function fetchAllPages<T>(
  endpoint: string,
  maxPages: number = 20
): Promise<T[]> {
  const all: T[] = [];
  let page = 1;

  while (page <= maxPages) {
    const response = await givebutterFetch<T>(endpoint, {
      page: page.toString(),
    });
    all.push(...response.data);
    if (page >= response.meta.last_page) break;
    page++;
  }

  return all;
}

// ---- Public API ----

export async function getCampaigns() {
  return fetchAllPages<GivebutterCampaign>("/campaigns");
}

export async function getTransactions() {
  return fetchAllPages<GivebutterTransaction>("/transactions", 75);
}

export async function getPlans() {
  return fetchAllPages<GivebutterPlan>("/plans");
}

// ---- Metrics aggregation ----

export interface FundraisingMetrics {
  totalRaised: number;
  totalDonors: number;
  totalTransactions: number;
  averageDonation: number;
  recurringDonors: number;
  recurringMonthlyTotal: number;
  campaignCount: number;
  recentTransactions: GivebutterTransaction[];
  campaignPerformance: {
    id: number;
    title: string;
    goal: number;
    raised: number;
    percentFunded: number;
    status: string;
  }[];
  monthlyTotals: { month: string; amount: number }[];
}

export async function getFundraisingMetrics(): Promise<FundraisingMetrics> {
  const [campaigns, transactions, plans] = await Promise.all([
    getCampaigns(),
    getTransactions(),
    getPlans(),
  ]);

  const succeeded = transactions.filter((t) => t.status === "succeeded");

  const totalRaised = succeeded.reduce((sum, t) => sum + t.donated, 0) / 100;

  const uniqueEmails = new Set(
    succeeded.map((t) => t.email?.toLowerCase()).filter(Boolean)
  );
  const totalDonors = uniqueEmails.size;

  const averageDonation =
    succeeded.length > 0 ? totalRaised / succeeded.length : 0;

  const recurringEmails = new Set(
    succeeded
      .filter((t) => t.plan_id)
      .map((t) => t.email?.toLowerCase())
      .filter(Boolean)
  );
  const recurringDonors = recurringEmails.size;

  const activePlans = plans.filter((p) => p.status === "active");
  const recurringMonthlyTotal =
    activePlans.reduce((sum, p) => sum + p.amount, 0) / 100;

  const recentTransactions = succeeded
    .sort(
      (a, b) =>
        new Date(b.transacted_at).getTime() -
        new Date(a.transacted_at).getTime()
    )
    .slice(0, 10);

  const campaignPerformance = campaigns.map((c) => ({
    id: c.id,
    title: c.title,
    goal: c.goal / 100,
    raised: c.raised / 100,
    percentFunded: c.goal > 0 ? Math.round((c.raised / c.goal) * 100) : 0,
    status: c.status,
  }));

  // Monthly totals — last 12 months
  const now = new Date();
  const monthlyTotals: { month: string; amount: number }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = d.toISOString().slice(0, 7);
    const monthLabel = d.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    const monthAmount =
      succeeded
        .filter((t) => t.transacted_at.startsWith(monthKey))
        .reduce((sum, t) => sum + t.donated, 0) / 100;
    monthlyTotals.push({ month: monthLabel, amount: monthAmount });
  }

  return {
    totalRaised,
    totalDonors,
    totalTransactions: succeeded.length,
    averageDonation,
    recurringDonors,
    recurringMonthlyTotal,
    campaignCount: campaigns.length,
    recentTransactions,
    campaignPerformance,
    monthlyTotals,
  };
}
