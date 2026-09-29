"use client";

import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingAnalyze, setLoadingAnalyze] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  async function handleSearch(e) {
    const value = e.target.value;
    setQuery(value);
    setSelectedMatch(null);
    setAnalysis(null);
    setError(null);

    if (value.trim().length < 2) {
      setMatches([]);
      return;
    }

    setLoadingSearch(true);
    try {
      const res = await fetch(`/api/search?team=${encodeURIComponent(value)}`);
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (err) {
      setError("Erreur lors de la recherche des matchs.");
    } finally {
      setLoadingSearch(false);
    }
  }

  function selectMatch(match) {
    setSelectedMatch(match);
    setMatches([]);
    setQuery(`${match.home} - ${match.away}`);
  }

  async function handleAnalyze() {
    if (!selectedMatch) return;
    setLoadingAnalyze(true);
    setError(null);
    setAnalysis(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fixtureId: selectedMatch.id }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setAnalysis(data);
      }
    } catch (err) {
      setError("Erreur lors de l'analyse du match.");
    } finally {
      setLoadingAnalyze(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "80px 20px",
      }}
    >
      <h1
        style={{
          fontSize: "28px",
          fontWeight: 600,
          marginBottom: "8px",
          letterSpacing: "-0.5px",
        }}
      >
        Prono Foot
      </h1>
      <p style={{ color: "var(--text-dim)", marginBottom: "40px", fontSize: "14px" }}>
        Analyse complete d'un match avant qu'il ait lieu
      </p>

      <div style={{ width: "100%", maxWidth: "480px", position: "relative" }}>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Cherchez votre match"
          style={{
            width: "100%",
            padding: "16px 20px",
            fontSize: "16px",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            background: "var(--bg-panel)",
            color: "var(--text)",
            outline: "none",
          }}
        />

        {matches.length > 0 && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              right: 0,
              background: "var(--bg-panel)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              overflow: "hidden",
              zIndex: 10,
            }}
          >
            {matches.map((m) => (
              <div
                key={m.id}
                onClick={() => selectMatch(m)}
                style={{
                  padding: "14px 20px",
                  cursor: "pointer",
                  borderBottom: "1px solid var(--border)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-panel-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ fontSize: "15px" }}>
                  {m.home} - {m.away}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "4px" }}>
                  {m.competition} - {m.date}
                </div>
              </div>
            ))}
          </div>
        )}

        {loadingSearch && (
          <div style={{ marginTop: "10px", fontSize: "13px", color: "var(--text-dim)" }}>
            Recherche en cours...
          </div>
        )}
      </div>

      {selectedMatch && !analysis && (
        <button
          onClick={handleAnalyze}
          disabled={loadingAnalyze}
          style={{
            marginTop: "24px",
            padding: "14px 32px",
            fontSize: "15px",
            fontWeight: 600,
            borderRadius: "10px",
            border: "none",
            background
