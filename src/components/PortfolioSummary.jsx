import React, { useMemo } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Helper: Convert frequency + amount to yearly amount
function frequencyToAnnualMultiplier(freq) {
  switch (freq) {
    case "daily":
      return 365;
    case "weekly":
      return 52;
    case "fortnightly":
      return 26;
    case "monthly":
      return 12;
    case "yearly":
      return 1;
    default:
      return 1;
  }
}

// Simple compound interest projection formula
function compoundGrowth(principal, rate, years) {
  return principal * Math.pow(1 + rate / 100, years);
}

export default function PortfolioSummary({ investment, allocations, assetDetails }) {
  // Calculate yearly invested amount
  const yearlyInvestment = useMemo(() => {
    return investment.amount * frequencyToAnnualMultiplier(investment.frequency);
  }, [investment]);

  // Calculate portfolio CAGR weighted by allocations and asset returns
  const portfolioCAGR = useMemo(() => {
    let totalReturn = 0;
    let totalAlloc = 0;

    Object.entries(assetDetails).forEach(([assetClass, assets]) => {
      const classAllocationPercent = allocations[assetClass] || 0;
      assets.forEach((asset) => {
        // Use live or custom return, fallback to 7%
        const assetReturn =
          asset.useLiveData && asset.liveReturnPercent !== undefined
            ? asset.liveReturnPercent
            : asset.customReturnPercent ?? 7;

        const weightedReturn = (classAllocationPercent * asset.allocationPercent * assetReturn) / 10000;

        totalReturn += weightedReturn;
        totalAlloc += (classAllocationPercent * asset.allocationPercent) / 100;
      });
    });

    return totalAlloc
