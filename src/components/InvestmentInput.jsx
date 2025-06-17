import React from "react";

const FREQUENCIES = [
  "daily",
  "weekly",
  "fortnightly",
  "monthly",
  "yearly",
  "custom",
];

// Common Forex currencies for demo. This can be expanded or dynamically loaded.
const CURRENCIES = [
  "AUD",
  "USD",
  "EUR",
  "JPY",
  "GBP",
  "CAD",
  "CHF",
  "CNY",
  "NZD",
  "SGD",
];

export default function InvestmentInput({ investment, setInvestment }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvestment((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <section style={{ marginBottom: "2rem" }}>
      <h2>Step 1: Investment Amount & Frequency</h2>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <input
          type="number"
          min="0"
          name="amount"
          value={investment.amount}
          onChange={handleChange}
          placeholder="Amount"
          style={{
            padding: "0.6rem",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "1px solid var(--color-border)",
            backgroundColor: "#111",
            color: "var(--color-text-light)",
            width: "150px",
          }}
        />

        <select
          name="frequency"
          value={investment.frequency}
          onChange={handleChange}
          style={{
            padding: "0.6rem",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "1px solid var(--color-border)",
            backgroundColor: "#111",
            color: "var(--color-text-light)",
            width: "160px",
          }}
        >
          {FREQUENCIES.map((freq) => (
            <option key={freq} value={freq}>
              {freq.charAt(0).toUpperCase() + freq.slice(1)}
            </option>
          ))}
        </select>

        <select
          name="currency"
          value={investment.currency}
          onChange={handleChange}
          style={{
            padding: "0.6rem",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "1px solid var(--color-border)",
            backgroundColor: "#111",
            color: "var(--color-text-light)",
            width: "100px",
          }}
        >
          {CURRENCIES.map((cur) => (
            <option key={cur} value={cur}>
              {cur}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
