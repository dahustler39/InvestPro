import React, { useState } from "react";

// Sample assets data per class (expandable)
const SAMPLE_ASSETS = {
  Stocks: [
    { symbol: "AAPL", name: "Apple Inc.", country: "US" },
    { symbol: "TSLA", name: "Tesla Inc.", country: "US" },
    { symbol: "BHP", name: "BHP Group", country: "Australia" },
  ],
  Crypto: [
    { symbol: "BTC", name: "Bitcoin" },
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "SOL", name: "Solana" },
  ],
  Commodities: [
    { symbol: "XAU", name: "Gold" },
    { symbol: "XAG", name: "Silver" },
    { symbol: "OIL", name: "Crude Oil" },
  ],
  ETFs: [
    { symbol: "SPY", name: "SPDR S&P 500 ETF Trust" },
    { symbol: "VTI", name: "Vanguard Total Stock Market ETF" },
  ],
  // Add more as needed
};

export default function AssetDetailConfig({
  allocations,
  assetDetails,
  setAssetDetails,
}) {
  const [selectedAssetClass, setSelectedAssetClass] = useState(null);

  // When asset class is selected, user sees asset list to add or remove assets
  const assetsForClass = selectedAssetClass
    ? SAMPLE_ASSETS[selectedAssetClass] || []
    : [];

  // Add asset to assetDetails
  const addAsset = (asset) => {
    setAssetDetails((prev) => {
      const currentAssets = prev[selectedAssetClass] || [];
      // avoid duplicates
      if (currentAssets.find((a) => a.symbol === asset.symbol)) return prev;

      return {
        ...prev,
        [selectedAssetClass]: [
          ...currentAssets,
          {
            ...asset,
            allocationPercent: 0,
            useLiveData: true,
            holdingPeriodYears: 1,
            customReturnPercent: null,
            customPrice: null,
          },
        ],
      };
    });
  };

  // Remove asset from assetDetails
  const removeAsset = (symbol) => {
    setAssetDetails((prev) => {
      return {
        ...prev,
        [selectedAssetClass]: prev[selectedAssetClass].filter(
          (a) => a.symbol !== symbol
        ),
      };
    });
  };

  // Update an asset’s detail
  const updateAssetDetail = (symbol, key, value) => {
    setAssetDetails((prev) => {
      const updatedAssets = prev[selectedAssetClass].map((a) => {
        if (a.symbol === symbol) {
          return { ...a, [key]: value };
        }
        return a;
      });
      return {
        ...prev,
        [selectedAssetClass]: updatedAssets,
      };
    });
  };

  return (
    <section style={{ marginBottom: "2rem" }}>
      <h2>Step 3: Configure Assets per Allocation</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="asset-class-select"
          style={{ color: "var(--color-primary-blue)" }}
        >
          Select Asset Class:
        </label>
        <select
          id="asset-class-select"
          value={selectedAssetClass || ""}
          onChange={(e) =>
            setSelectedAssetClass(e.target.value || null)
          }
          style={{
            marginLeft: "1rem",
            padding: "0.5rem",
            backgroundColor: "#111",
            color: "var(--color-text-light)",
            borderRadius: "6px",
            border: "1px solid var(--color-border)",
            minWidth: "180px",
          }}
        >
          <option value="">--Choose--</option>
          {Object.keys(allocations)
            .filter((k) => allocations[k] > 0)
            .map((assetClass) => (
              <option key={assetClass} value={assetClass}>
                {assetClass}
              </option>
            ))}
        </select>
      </div>

      {selectedAssetClass && (
        <>
          <h3 style={{ color: "var(--color-primary-green)" }}>
            Assets in {selectedAssetClass}
          </h3>

          <div
            style={{
              maxHeight: "200px",
              overflowY: "auto",
              border: "1px solid var(--color-border)",
              borderRadius: "6px",
              padding: "0.5rem",
              marginBottom: "1rem",
              backgroundColor: "#111",
            }}
          >
            {(assetDetails[selectedAssetClass] || []).map((asset) => (
              <div
                key={asset.symbol}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.3rem 0.5rem",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                <div>
                  <strong>{asset.name}</strong> ({asset.symbol})
                </div>
                <button
                  onClick={() => removeAsset(asset.symbol)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--color-accent)",
                    cursor: "pointer",
                    fontSize: "1.2rem",
                  }}
                  title="Remove Asset"
                >
                  &times;
                </button>
              </div>
            ))}

            {(!assetDetails[selectedAssetClass] ||
              assetDetails[selectedAssetClass].length === 0) && (
              <p style={{ color: "var(--color-text-light)" }}>
                No assets added yet.
              </p>
            )}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label
              htmlFor="asset-add-select"
              style={{ color: "var(--color-primary-blue)" }}
            >
              Add Asset:
            </label>
            <select
              id="asset-add-select"
              onChange={(e) => {
                if (e.target.value !== "") {
                  const assetToAdd = assetsForClass.find(
                    (a) => a.symbol === e.target.value
                  );
                  addAsset(assetToAdd);
                  e.target.value = "";
                }
              }}
              style={{
                marginLeft: "1rem",
                padding: "0.5rem",
                backgroundColor: "#111",
                color: "var(--color-text-light)",
                borderRadius: "6px",
                border: "1px solid var(--color-border)",
                minWidth: "200px",
              }}
            >
              <option value="">--Select Asset to Add--</option>
              {assetsForClass
                .filter(
                  (a) =>
                    !(
                      assetDetails[selectedAssetClass] || []
                    ).find((x) => x.symbol === a.symbol)
                )
                .map((asset) => (
                  <option key={asset.symbol} value={asset.symbol}>
                    {asset.name} ({asset.symbol})
                  </option>
                ))}
            </select>
          </div>

          {/* Asset details config */}
          {(assetDetails[selectedAssetClass] || []).map((asset) => (
            <div
              key={"config-" + asset.symbol}
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: "6px",
                padding: "1rem",
                marginBottom: "1rem",
                backgroundColor: "#111",
              }}
            >
              <h4 style={{ margin: "0 0 0.5rem 0" }}>
                {asset.name} ({asset.symbol})
              </h4>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <label style={{ flex: "1 0 180px" }}>
                  Allocation % (of asset class):
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={asset.allocationPercent}
                    onChange={(e) =>
                      updateAssetDetail(
                        asset.symbol,
                        "allocationPercent",
                        Number(e.target.value)
                      )
                    }
                    style={{
                      marginLeft: "0.5rem",
                      padding: "0.3rem",
                      width: "70px",
                      borderRadius: "5px",
                      border: "1px solid var(--color-border)",
                      backgroundColor: "#222",
                      color: "var(--color-text-light)",
                    }}
                  />
                  %
                </label>

                <label style={{ flex: "1 0 180px" }}>
                  Use Live Data:
                  <input
                    type="checkbox"
                    checked={asset.useLiveData}
                    onChange={(e) =>
                      updateAssetDetail(asset.symbol, "useLiveData", e.target.checked)
                    }
                    style={{ marginLeft: "0.5rem" }}
                  />
                </label>

                <label style={{ flex: "1 0 220px" }}>
                  Holding Period (years):
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={asset.holdingPeriodYears}
                    onChange={(e) =>
                      updateAssetDetail(
                        asset.symbol,
                        "holdingPeriodYears",
                        parseFloat(e.target.value)
                      )
                    }
                    style={{
                      marginLeft: "0.5rem",
                      padding: "0.3rem",
                      width: "70px",
                      borderRadius: "5px",
                      border: "1px solid var(--color-border)",
                      backgroundColor: "#222",
                      color: "var(--color-text-light)",
                    }}
                  />
                </label>

                {!asset.useLiveData && (
                  <>
                    <label style={{ flex: "1 0 180px" }}>
                      Custom Return % p.a.:
                      <input
                        type="number"
                        step="0.01"
                        value={asset.customReturnPercent ?? ""}
                        onChange={(e) =>
                          updateAssetDetail(
                            asset.symbol,
                            "customReturnPercent",
                            e.target.value === "" ? null : Number(e.target.value)
                          )
                        }
                        style={{
                          marginLeft: "0.5rem",
                          padding: "0.3rem",
                          width: "80px",
                          borderRadius: "5px",
                          border: "1px solid var(--color-border)",
                          backgroundColor: "#222",
                          color: "var(--color-text-light)",
                        }}
                      />
                      %
                    </label>

                    <label style={{ flex: "1 0 180px" }}>
                      Custom Price:
                      <input
                        type="number"
                        step="0.01"
                        value={asset.customPrice ?? ""}
                        onChange={(e) =>
                          updateAssetDetail(
                            asset.symbol,
                            "customPrice",
                            e.target.value === "" ? null : Number(e.target.value)
                          )
                        }
                        style={{
                          marginLeft: "0.5rem",
                          padding: "0.3rem",
                          width: "80px",
                          borderRadius: "5px",
                          border: "1px solid var(--color-border)",
                          backgroundColor: "#222",
                          color: "var(--color-text-light)",
                        }}
                      />
                    </label>
                  </>
                )}
              </div>
            </div>
          ))}
        </>
      )}
    </section>
  );
}
