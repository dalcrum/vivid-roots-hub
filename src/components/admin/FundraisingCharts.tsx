"use client";

export default function FundraisingCharts({
  monthlyTotals,
}: {
  monthlyTotals: { month: string; amount: number }[];
}) {
  const maxAmount = Math.max(...monthlyTotals.map((m) => m.amount), 1);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Monthly Giving</h2>

      <div className="flex items-end gap-1.5 sm:gap-2 h-52">
        {monthlyTotals.map((m) => {
          const heightPercent =
            maxAmount > 0 ? (m.amount / maxAmount) * 100 : 0;
          return (
            <div
              key={m.month}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <span className="text-[10px] sm:text-xs text-gray-500 font-medium truncate w-full text-center">
                {m.amount > 0
                  ? `$${Math.round(m.amount).toLocaleString()}`
                  : ""}
              </span>
              <div
                className="w-full flex items-end justify-center"
                style={{ height: "160px" }}
              >
                <div
                  className="w-full max-w-[40px] bg-emerald-500 rounded-t-md transition-all duration-300 hover:bg-emerald-600 cursor-default"
                  style={{ height: `${Math.max(heightPercent, 2)}%` }}
                  title={`${m.month}: $${m.amount.toLocaleString()}`}
                />
              </div>
              <span className="text-[9px] sm:text-[10px] text-gray-400 text-center leading-tight">
                {m.month.split(" ")[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
