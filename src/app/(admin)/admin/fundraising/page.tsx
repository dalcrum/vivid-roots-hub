import { getFundraisingMetrics } from "@/lib/givebutter";
import FundraisingCharts from "@/components/admin/FundraisingCharts";

export default async function FundraisingPage() {
  let metrics;
  let error: string | null = null;

  try {
    metrics = await getFundraisingMetrics();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load fundraising data";
  }

  if (error || !metrics) {
    return (
      <div className="max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[var(--brand-navy)]">Fundraising</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track your Givebutter fundraising performance.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="text-gray-600 font-medium">
            Could not load fundraising data
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {error ||
              "Please check your GIVEBUTTER_API_KEY environment variable."}
          </p>
        </div>
      </div>
    );
  }

  const fmt = (n: number) =>
    "$" +
    n.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  const stats = [
    { label: "Total Raised", value: fmt(metrics.totalRaised), icon: "💰" },
    { label: "Donors", value: metrics.totalDonors.toString(), icon: "❤️" },
    {
      label: "Avg. Donation",
      value: fmt(metrics.averageDonation),
      icon: "📊",
    },
    {
      label: "Recurring Donors",
      value: metrics.recurringDonors.toString(),
      icon: "🔄",
    },
  ];

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--brand-navy)]">Fundraising</h1>
        <p className="text-gray-500 text-sm mt-1">
          Track your Givebutter fundraising performance.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold text-[var(--brand-navy)]">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Recurring giving banner */}
      {metrics.recurringMonthlyTotal > 0 && (
        <div className="bg-[var(--brand-cream-warm)] border border-[var(--brand-sky)]/30 rounded-xl p-5 mb-8">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔄</span>
            <div>
              <p className="font-bold text-[var(--brand-navy)]">
                {fmt(metrics.recurringMonthlyTotal)}/month
              </p>
              <p className="text-sm text-[var(--brand-sky)]">
                Active recurring giving from {metrics.recurringDonors} donor
                {metrics.recurringDonors !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Monthly trend chart */}
      <FundraisingCharts monthlyTotals={metrics.monthlyTotals} />

      {/* Campaign performance */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[var(--brand-navy)]">
            Campaign Performance ({metrics.campaignCount})
          </h2>
        </div>
        {metrics.campaignPerformance.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {metrics.campaignPerformance.map((campaign) => (
              <li key={campaign.id} className="p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-[var(--brand-navy)]">
                        {campaign.title}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          campaign.status === "active"
                            ? "bg-[var(--brand-sky-light)]/20 text-[var(--brand-sky)]"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>💰 {fmt(campaign.raised)} raised</span>
                      {campaign.goal > 0 && (
                        <span>
                          🎯 {fmt(campaign.goal)} goal (
                          {campaign.percentFunded}%)
                        </span>
                      )}
                    </div>
                  </div>
                  {campaign.goal > 0 && (
                    <div className="w-full md:w-32">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            campaign.percentFunded >= 100
                              ? "bg-[var(--brand-sky)]"
                              : "bg-amber-500"
                          }`}
                          style={{
                            width: `${Math.min(campaign.percentFunded, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-400">
            <p>No campaigns found.</p>
          </div>
        )}
      </div>

      {/* Recent donations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[var(--brand-navy)]">Recent Donations</h2>
        </div>
        {metrics.recentTransactions.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {metrics.recentTransactions.map((tx) => (
              <li
                key={tx.id}
                className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                <div>
                  <p className="font-medium text-[var(--brand-navy)]">
                    {tx.first_name} {tx.last_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(tx.transacted_at).toLocaleDateString()} via{" "}
                    {tx.payment_method}
                    {tx.plan_id ? " (recurring)" : ""}
                  </p>
                </div>
                <span className="text-lg font-bold text-[var(--brand-sky)]">
                  ${(tx.donated / 100).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-400">
            <p>No transactions found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
