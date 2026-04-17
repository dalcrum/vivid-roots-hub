const steps = ["Basic Info", "The Story", "Photos", "Preview"];

export default function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((label, index) => (
        <div key={label} className="flex items-center">
          {/* Step circle */}
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                index < currentStep
                  ? "bg-[var(--brand-sky)] text-white"
                  : index === currentStep
                    ? "bg-[var(--brand-sky)] text-white ring-4 ring-[var(--brand-sky-light)]/30"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {index < currentStep ? "✓" : index + 1}
            </div>
            <span
              className={`text-xs mt-1.5 font-medium ${
                index <= currentStep ? "text-[var(--brand-sky)]" : "text-gray-400"
              }`}
            >
              {label}
            </span>
          </div>
          {/* Connector line */}
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-1 mx-2 rounded-full ${
                index < currentStep ? "bg-[var(--brand-sky)]" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
