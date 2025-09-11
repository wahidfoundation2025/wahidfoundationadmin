export default function InfoRow({ label, value }) {
  return (
    <div className="flex items-start space-x-2 text-sm text-gray-700">
      <span className="font-medium">{label}:</span>
      <div>
        {Array.isArray(value) && value.length > 0 ? (
          value.map((val, idx) => (
            <span key={idx}>
              {val}
              {idx < value.length - 1 ? ", " : ""}
            </span>
          ))
        ) : typeof value === "string" || typeof value === "number" ? (
          <span>{value}</span>
        ) : (
          <span>{value || "N/A"}</span>
        )}
      </div>
    </div>
  );
}