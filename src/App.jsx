import React, { useState } from "react";
import InvestmentInput from "./components/InvestmentInput";
import AllocationManager from "./components/AllocationManager";
import AssetDetailConfig from "./components/AssetDetailConfig";
import PortfolioSummary from "./components/PortfolioSummary";

export default function App() {
  const [investment, setInvestment] = useState({
    amount: 100,
    frequency: "monthly",
    currency: "AUD",
  });

  const [allocations, setAllocations] = useState({
    Stocks: 40,
    ETFs: 30,
    Crypto: 20,
    Commodities: 10,
  });

  const [assetDetails, setAssetDetails] = useState({
    Stocks: [],
    ETFs: [],
    Crypto: [],
    Commodities: [],
  });

  return (
    <div className="container">
      <h1>InvestaPro - Ultimate Investment Calculator</h1>

      <InvestmentInput investment={investment} setInvestment={setInvestment} />

      <AllocationManager
        allocations={allocations}
        setAllocations={setAllocations}
      />

      <AssetDetailConfig
        allocations={allocations}
        assetDetails={assetDetails}
        setAssetDetails={setAssetDetails}
      />

      <PortfolioSummary
        investment={investment}
        allocations={allocations}
        assetDetails={assetDetails}
      />
    </div>
  );
}
