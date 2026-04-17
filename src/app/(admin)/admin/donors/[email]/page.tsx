import { getDonorDetail } from "@/lib/givebutter";
import Link from "next/link";

export default async function DonorDetailPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const { email } = await params;
  const decodedEmail = decodeURIComponent(email);

  let donor;
  let error: string | null = null;

  try {
    donor = await getDonorDetail(decodedEmail);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load donor data";
  }

  if (error) {
    return (
      <div className="max-w-3xl">
        <div className="mb-6">
          <Link
            href="/admin/donors"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to donors
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="text-gray-600 font-medium">
            Could not load donor data
          </p>
          <p className="text-sm text-gray-400 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!donor) {
    return (
      <div className="max-w-3xl text-center py-12">
        <h1 className="text-2xl font-bold text-[var(--brand-navy)] mb-2">
          Donor not found
        </h1>
        <p className="text-gray-500 mb-4">
          No donations found for {decodedEmail}
        </p>
        <Link
          href="/admin/donors"
          className="text-[var(--brand-sky)] hover:underline"
        >
          Back to donors
        </Link>
      </div>
    );
  }

  const fmt = (n: number) =>
    "$" +
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const fmtWhole = (n: number) =>
    "$" +
    n.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

  return (
    <div className="max-w-3xl">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/admin/donors"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to donors
        </Link>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-[var(--brand-sky)] flex items-center justify-center text-white text-xl font-bold shrink-0">
            {(
              donor.firstName?.[0] ||
              donor.email?.[0] ||
              "?"
            ).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--brand-navy)]">
              {donor.firstName} {donor.lastName}
            </h1>
            <p className="text-gray-500">{donor.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Given</p>
            <p className="text-xl font-bold text-[var(--brand-sky)]">
              {fmtWhole(donor.totalDonated)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Donations</p>
            <p className="text-xl font-bold text-[var(--brand-navy)]">
              {donor.donationCount}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Average</p>
            <p className="text-xl font-bold text-[var(--brand-navy)]">
              {fmt(donor.averageDonation)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">First Gift</p>
            <p className="text-xl font-bold text-[var(--brand-navy)]">
              {new Date(donor.firstDonation).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Recurring plan banner */}
        {donor.recurringPlan && (
          <div className="mt-4 bg-[var(--brand-cream-warm)] border border-[var(--brand-sky)]/30 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔄</span>
              <div>
                <p className="font-bold text-[var(--brand-navy)]">
                  {fmt(donor.recurringPlan.amount)}/
                  {donor.recurringPlan.frequency}
                </p>
                <p className="text-sm text-[var(--brand-sky)]">
                  Recurring plan ({donor.recurringPlan.status})
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Campaign breakdown */}
      {donor.campaignBreakdown.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-[var(--brand-navy)]">
              Campaign Breakdown
            </h2>
          </div>
          <ul className="divide-y divide-gray-100">
            {donor.campaignBreakdown.map((cb) => (
              <li
                key={cb.campaignId ?? "none"}
                className="p-5 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-[var(--brand-navy)]">
                    {cb.campaignName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {cb.count} donation{cb.count !== 1 ? "s" : ""}
                  </p>
                </div>
                <span className="text-lg font-bold text-[var(--brand-sky)]">
                  {fmtWhole(cb.totalDonated)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Donation history */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[var(--brand-navy)]">
            Donation History ({donor.transactions.length})
          </h2>
        </div>
        <ul className="divide-y divide-gray-100">
          {donor.transactions.map((tx) => (
            <li
              key={tx.id}
              className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <p className="font-medium text-[var(--brand-navy)]">
                  {new Date(tx.transacted_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-500">
                  via {tx.payment_method}
                  {tx.plan_id ? " (recurring)" : ""}
                  {tx.campaign_code ? ` · ${tx.campaign_code}` : ""}
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-[var(--brand-sky)]">
                  {fmt(tx.donated / 100)}
                </span>
                {tx.fee > 0 && (
                  <p className="text-xs text-gray-400">
                    Fee: {fmt(tx.fee / 100)}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
