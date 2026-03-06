export default function FundraisingLoading() {
  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-72 bg-gray-100 rounded animate-pulse mt-2" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm p-5 border border-gray-100"
          >
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-7 w-24 bg-gray-200 rounded animate-pulse mb-1" />
            <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8">
        <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-4" />
        <div className="h-48 bg-gray-50 rounded animate-pulse" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-5 border-b border-gray-100">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        </div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 border-b border-gray-100 last:border-b-0"
          >
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-56 bg-gray-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
