// src/components/PortfolioSummary.jsx
import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function compoundGrowth(principal, ratePercent, years) {
  const rate = ratePercent / 100;
  return principal * Math.pow(1 + rate, years);
}

export default function PortfolioSummary({ investment, allocations, assetDetails }) {
  // Calculate total yearly investment from monthly/weekly/etc. input
  const yearlyInvestment = useMemo(() => {
    const freq = investment.frequency.toLowerCase();
    const val = investment.amount;

    switch (freq) {
      case "day":
        return val * 365;
      case "week":
        return val * 52;
      case "fortnight":
        return val * 26;
      case "month":
        return val * 12;
      case "year":
        return val;
      default:
        return val; // default yearly
    }
  }, [investment]);

  // Calculate portfolio weighted CAGR (average annual return)
  const portfolioCAGR = useMemo(() => {
    if (!allocations.length) return 0;

    let totalReturn = 0;
    let totalAlloc = 0;

    allocations.forEach(({ assetCategory, percent, subAllocations }) => {
      if (!subAllocations || subAllocations.length === 0) return;

      // Calculate weighted return for this category
      let categoryReturn = 0;
      let categoryPercentSum = 0;

      subAllocations.forEach(({ assetId, percent: subPercent }) => {
        const asset = assetDetails[assetId];
        if (!asset) return;

        const assetReturn = asset.averageReturn || 0;
        categoryReturn += (assetReturn * subPercent) / 100;
        categoryPercentSum += subPercent;
      });

      // Adjust by category percent allocation
      if (categoryPercentSum > 0) {
        categoryReturn = categoryReturn * (percent / 100);
        totalReturn += categoryReturn;
        totalAlloc += percent;
      }
    });

    return totalAlloc > 0 ? totalReturn : 0;
  }, [allocations, assetDetails]);

  // Generate portfolio value projection data for next 30 years
  const chartData = useMemo(() => {
    const years = 30;
    const data = [];

    for (let year = 0; year <= years; year++) {
      // Compound growth of yearly investment + compound interest on previous years
      // FV of a series formula approximation
      let totalValue = 0;
      for (let i = 0; i <= year; i++) {
        const yearsInvested = year - i;
        totalValue += compoundGrowth(yearlyInvestment, portfolioCAGR, yearsInvested);
      }
      data.push({
        year,
        value: Number(totalValue.toFixed(2)),
      });
    }

    return data;
  }, [yearlyInvestment, portfolioCAGR]);

  return (
    <section style={{ marginBottom: "3rem" }}>
      <h2 style={{ color: "var(--color-primary-green)" }}>Step 4: Portfolio Summary & Projection</h2>

      <p style={{ color: "var(--color-text-light)" }}>
        <strong>Annual Investment Amount:</strong> {investment.amount.toLocaleString()}{" "}
        {investment.currency.toUpperCase()} ({investment.frequency})
      </p>
      <p style={{ color: "var(--color-text-light)" }}>
        <strong>Estimated Portfolio CAGR:</strong> {portfolioCAGR.toFixed(2)}%
      </p>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
          style={{ backgroundColor: "var(--color-bg-secondary)", borderRadius: "8px", padding: "1rem" }}
        >
          <CartesianGrid stroke="#333" strokeDasharray="3 3" />
          <XAxis
            dataKey="year"
            label={{ value: "Years", position: "insideBottomRight", offset: -10, fill: "var(--color-text-light)" }}
            stroke="var(--color-text-light)"
          />
          <YAxis
            label={{
              value: `Value (${investment.currency.toUpperCase()})`,
              angle: -90,
              position: "insideLeft",
              fill: "var(--color-text-light)",
            }}
            tickFormatter={(val) => val.toLocaleString()}
            stroke="var(--color-text-light)"
          />
          <Tooltip
            formatter={(val) =>
              val.toLocaleString(undefined, {
                style: "currency",
                currency: investment.currency.toUpperCase(),
              })
            }
            labelFormatter={(year) => `Year ${year}`}
            contentStyle={{ backgroundColor: "#222", borderRadius: "6px", border: "none" }}
            itemStyle={{ color: "var(--color-primary-blue)" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-primary-blue)"
            strokeWidth={3}
            dot={{ r: 3, stroke: "var(--color-primary-green)", strokeWidth: 2 }}
            activeDot={{ r: 6, stroke: "var(--color-primary-green)", strokeWidth: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}
