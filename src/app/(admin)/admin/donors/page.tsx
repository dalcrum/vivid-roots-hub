import { getDonorSummaries } from "@/lib/givebutter";
import Link from "next/link";

export default async function DonorsPage() {
  let data;
  let error: string | null = null;

  try {
    data = await getDonorSummaries();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load donor data";
  }

  if (error || !data) {
    return (
      <div className="max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Donors</h1>
          <p className="text-gray-500 text-sm mt-1">
            View and manage your donor relationships.
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-2xl mb-2">⚠️</p>
          <p className="text-gray-600 font-medium">
            Could not load donor data
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
    { label: "Total Donors", value: data.totalDonors.toString(), icon: "🤝" },
    {
      label: "New This Month",
      value: data.newDonorsThisMonth.toString(),
      icon: "🆕",
    },
    {
      label: "Retention Rate",
      value: `${data.retentionRate}%`,
      icon: "🔄",
    },
    {
      label: "Top Donor",
      value: data.topDonorAmount > 0 ? fmt(data.topDonorAmount) : "—",
      icon: "⭐",
    },
  ];

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Donors</h1>
        <p className="text-gray-500 text-sm mt-1">
          View and manage your donor relationships.
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
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Donor list */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            All Donors ({data.donors.length})
          </h2>
        </div>
        {data.donors.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {data.donors.map((donor) => {
              const initial = (
                donor.firstName?.[0] ||
                donor.email?.[0] ||
                "?"
              ).toUpperCase();

              return (
                <li key={donor.email} className="p-5">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {initial}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-gray-900">
                            {donor.firstName} {donor.lastName}
                          </p>
                          {donor.isRecurring && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                              Recurring
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{donor.email}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                          <span>
                            {donor.donationCount} donation
                            {donor.donationCount !== 1 ? "s" : ""}
                          </span>
                          <span>
                            Last:{" "}
                            {new Date(
                              donor.lastDonation
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-14 md:ml-0">
                      <span className="text-lg font-bold text-emerald-600">
                        {fmt(donor.totalDonated)}
                      </span>
                      <Link
                        href={`/admin/donors/${encodeURIComponent(donor.email)}`}
                        className="text-sm text-emerald-600 hover:underline font-medium"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-400">
            <p>No donors found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
