import React from "react";

const ASSET_CLASSES = [
  "Stocks",
  "Bonds",
  "ETFs",
  "Mutual Funds",
  "Index Funds",
  "Commodities",
  "Property",
  "Forex",
  "Crypto",
  "Savings Accounts",
];

export default function AllocationManager({ allocations, setAllocations }) {
  // Calculate total to display % sum and allow adjustments
  const totalAllocation = Object.values(allocations).reduce(
    (sum, val) => sum + val,
    0
  );

  const handleChange = (asset, value) => {
    if (value < 0) value = 0;
    if (value > 100) value = 100;
    setAllocations((prev) => ({
      ...prev,
      [asset]: Number(value),
    }));
  };

  return (
    <section style={{ marginBottom: "2rem" }}>
      <h2>Step 2: Allocate Your Investment (%)</h2>
      <p style={{ marginBottom: "0.5rem" }}>
        Total allocation:{" "}
        <strong
          style={{
            color: totalAllocation === 100 ? "var(--color-primary-green)" : "red",
          }}
        >
          {totalAllocation}%
        </strong>{" "}
        (must equal 100%)
      </p>

      {ASSET_CLASSES.map((asset) => (
        <div
          key={asset}
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.6rem",
            alignItems: "center",
          }}
        >
          <label
            htmlFor={asset}
            style={{ flex: "1", color: "var(--color-primary-blue)" }}
          >
            {asset}
          </label>
          <input
            type="number"
            id={asset}
            min="0"
            max="100"
            step="1"
            value={allocations[asset] || 0}
            onChange={(e) => handleChange(asset, e.target.value)}
            style={{
              width: "80px",
              padding: "0.3rem 0.5rem",
              borderRadius: "5px",
              border: "1px solid var(--color-border)",
              backgroundColor: "#111",
              color: "var(--color-text-light)",
              textAlign: "right",
            }}
          />
          <span style={{ marginLeft: "8px", color: "var(--color-text-light)" }}>
            %
          </span>
        </div>
      ))}
    </section>
  );
}
