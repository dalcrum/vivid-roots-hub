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

// ---- Donor types ----

export interface DonorSummary {
  email: string;
  firstName: string;
  lastName: string;
  totalDonated: number; // dollars
  donationCount: number;
  averageDonation: number; // dollars
  firstDonation: string; // ISO date
  lastDonation: string; // ISO date
  isRecurring: boolean;
  campaigns: string[];
}

export interface DonorListMetrics {
  totalDonors: number;
  newDonorsThisMonth: number;
  topDonorEmail: string | null;
  topDonorAmount: number;
  retentionRate: number; // percentage
  donors: DonorSummary[];
}

export interface DonorDetail {
  email: string;
  firstName: string;
  lastName: string;
  totalDonated: number;
  donationCount: number;
  averageDonation: number;
  firstDonation: string;
  lastDonation: string;
  isRecurring: boolean;
  transactions: GivebutterTransaction[];
  campaignBreakdown: {
    campaignId: number | null;
    campaignName: string;
    totalDonated: number;
    count: number;
  }[];
  recurringPlan: {
    frequency: string;
    amount: number;
    status: string;
  } | null;
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

// ---- Donor aggregation ----

export async function getDonorSummaries(): Promise<DonorListMetrics> {
  const [transactions, campaigns, plans] = await Promise.all([
    getTransactions(),
    getCampaigns(),
    getPlans(),
  ]);

  const succeeded = transactions.filter((t) => t.status === "succeeded");

  // Build campaign name lookup
  const campaignNames = new Map<number, string>();
  campaigns.forEach((c) => campaignNames.set(c.id, c.title));

  // Aggregate by email
  const donorMap = new Map<
    string,
    {
      email: string;
      firstName: string;
      lastName: string;
      totalCents: number;
      count: number;
      firstDate: string;
      lastDate: string;
      hasRecurring: boolean;
      campaignIds: Set<number>;
    }
  >();

  for (const tx of succeeded) {
    const key = tx.email?.toLowerCase();
    if (!key) continue;

    const existing = donorMap.get(key);
    if (existing) {
      existing.totalCents += tx.donated;
      existing.count += 1;
      if (tx.transacted_at < existing.firstDate)
        existing.firstDate = tx.transacted_at;
      if (tx.transacted_at > existing.lastDate) {
        existing.lastDate = tx.transacted_at;
        existing.firstName = tx.first_name;
        existing.lastName = tx.last_name;
      }
      if (tx.plan_id) existing.hasRecurring = true;
      if (tx.campaign_id) existing.campaignIds.add(tx.campaign_id);
    } else {
      donorMap.set(key, {
        email: key,
        firstName: tx.first_name,
        lastName: tx.last_name,
        totalCents: tx.donated,
        count: 1,
        firstDate: tx.transacted_at,
        lastDate: tx.transacted_at,
        hasRecurring: !!tx.plan_id,
        campaignIds: tx.campaign_id ? new Set([tx.campaign_id]) : new Set(),
      });
    }
  }

  const donors: DonorSummary[] = Array.from(donorMap.values()).map((d) => ({
    email: d.email,
    firstName: d.firstName,
    lastName: d.lastName,
    totalDonated: d.totalCents / 100,
    donationCount: d.count,
    averageDonation: d.totalCents / d.count / 100,
    firstDonation: d.firstDate,
    lastDonation: d.lastDate,
    isRecurring: d.hasRecurring,
    campaigns: Array.from(d.campaignIds).map(
      (id) => campaignNames.get(id) || `Campaign #${id}`
    ),
  }));

  donors.sort((a, b) => b.totalDonated - a.totalDonated);

  const now = new Date();
  const thisMonth = now.toISOString().slice(0, 7);
  const newDonorsThisMonth = donors.filter((d) =>
    d.firstDonation.startsWith(thisMonth)
  ).length;

  const topDonor = donors[0] || null;
  const repeatDonors = donors.filter((d) => d.donationCount > 1).length;
  const retentionRate =
    donors.length > 0 ? Math.round((repeatDonors / donors.length) * 100) : 0;

  return {
    totalDonors: donors.length,
    newDonorsThisMonth,
    topDonorEmail: topDonor?.email || null,
    topDonorAmount: topDonor?.totalDonated || 0,
    retentionRate,
    donors,
  };
}

export async function getDonorDetail(
  email: string
): Promise<DonorDetail | null> {
  const [transactions, campaigns, plans] = await Promise.all([
    getTransactions(),
    getCampaigns(),
    getPlans(),
  ]);

  const campaignNames = new Map<number, string>();
  campaigns.forEach((c) => campaignNames.set(c.id, c.title));

  const lowerEmail = email.toLowerCase();
  const donorTxs = transactions
    .filter(
      (t) =>
        t.status === "succeeded" && t.email?.toLowerCase() === lowerEmail
    )
    .sort(
      (a, b) =>
        new Date(b.transacted_at).getTime() -
        new Date(a.transacted_at).getTime()
    );

  if (donorTxs.length === 0) return null;

  const latest = donorTxs[0];
  const totalCents = donorTxs.reduce((sum, t) => sum + t.donated, 0);
  const dates = donorTxs.map((t) => t.transacted_at).sort();
  const planIds = new Set(
    donorTxs.filter((t) => t.plan_id).map((t) => t.plan_id!)
  );

  // Campaign breakdown
  const campaignMap = new Map<
    number | null,
    { totalCents: number; count: number }
  >();
  for (const tx of donorTxs) {
    const cid = tx.campaign_id;
    const existing = campaignMap.get(cid);
    if (existing) {
      existing.totalCents += tx.donated;
      existing.count += 1;
    } else {
      campaignMap.set(cid, { totalCents: tx.donated, count: 1 });
    }
  }

  const campaignBreakdown = Array.from(campaignMap.entries())
    .map(([campaignId, data]) => ({
      campaignId,
      campaignName: campaignId
        ? campaignNames.get(campaignId) || `Campaign #${campaignId}`
        : "General",
      totalDonated: data.totalCents / 100,
      count: data.count,
    }))
    .sort((a, b) => b.totalDonated - a.totalDonated);

  // Recurring plan info
  let recurringPlan: DonorDetail["recurringPlan"] = null;
  if (planIds.size > 0) {
    const activePlan = plans.find(
      (p) => planIds.has(p.id) && p.status === "active"
    );
    const plan = activePlan || plans.find((p) => planIds.has(p.id));
    if (plan) {
      recurringPlan = {
        frequency: plan.frequency,
        amount: plan.amount / 100,
        status: plan.status,
      };
    }
  }

  return {
    email: lowerEmail,
    firstName: latest.first_name,
    lastName: latest.last_name,
    totalDonated: totalCents / 100,
    donationCount: donorTxs.length,
    averageDonation: totalCents / donorTxs.length / 100,
    firstDonation: dates[0],
    lastDonation: dates[dates.length - 1],
    isRecurring: planIds.size > 0,
    transactions: donorTxs,
    campaignBreakdown,
    recurringPlan,
  };
}
