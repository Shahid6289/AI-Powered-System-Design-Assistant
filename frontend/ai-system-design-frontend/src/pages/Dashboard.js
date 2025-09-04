import React, { useEffect, useState } from "react";
import DesignForm from "../components/DesignForm";
import DesignResult from "../components/DesignResult";
import { listDesigns, getDesign } from "../api/designApi";

const Dashboard = () => {
  const [designs, setDesigns] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loadingList, setLoadingList] = useState(false);
  const [err, setErr] = useState("");
  const [viewMode, setViewMode] = useState("create"); // "create" or "results"
  const [stats, setStats] = useState({
    total: 0,
    recent: 0,
    microservices: 0,
    monolith: 0
  });

  const refreshList = async () => {
    setErr("");
    setLoadingList(true);
    try {
      const data = await listDesigns();
      setDesigns(data);
      
      // Calculate statistics
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      setStats({
        total: data.length,
        recent: data.filter(d => new Date(d.createdAt) > sevenDaysAgo).length,
        microservices: data.filter(d => d.style === 'microservices').length,
        monolith: data.filter(d => d.style === 'monolith').length
      });
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load designs");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    refreshList();
  }, []);

  const onCreated = async (created) => {
    await refreshList();
    const full = await getDesign(created.id);
    setSelected(full);
    setViewMode("results");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="professional-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">System Design Dashboard</h1>
          <p className="dashboard-subtitle">Create and manage your AI-generated system architectures</p>
        </div>
        <div className="header-actions">
          <button className="refresh-btn" onClick={refreshList} disabled={loadingList}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.total}</h3>
            <p className="stat-label">Total Designs</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm-.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
          </div>
          <div className="stat-content">
            <h3 className="stat-value">{stats.recent}</h3>
            <p className="stat-label">Last 7 Days</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card">
            <div className="stat-icon warning">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.microservices}</h3>
              <p className="stat-label">Microservices</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card">
            <div className="stat-icon danger">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stats.monolith}</h3>
              <p className="stat-label">Monolithic</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-content">
        {/* Design Creation Panel */}
        <div className={`creation-panel ${viewMode === "create" ? "active" : ""}`}>
          <div className="panel-header">
            <h2 className="panel-title">Create New Design</h2>
            <p className="panel-subtitle">Describe your system requirements to generate an architecture</p>
          </div>
          <DesignForm onCreated={onCreated} />
        </div>

        {/* Results Panel */}
        {viewMode === "results" && (
          <div className="results-panel">
            <div className="panel-header">
              <div className="panel-title-section">
                <h2 className="panel-title">Design Results</h2>
                <button className="back-button" onClick={() => setViewMode("create")}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                  </svg>
                  Back to Create
                </button>
              </div>
            </div>
            <DesignResult design={selected} />
          </div>
        )}

        {/* Designs History Panel - Always visible on the right */}
        <div className="history-panel">
          <div className="panel-header">
            <h2 className="panel-title">Recent Designs</h2>
            <span className="designs-count">{designs.length} designs</span>
          </div>

          {loadingList && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading designs...</p>
            </div>
          )}

          {err && (
            <div className="error-state">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-10h2v8h-2V7z"/>
              </svg>
              <p>{err}</p>
            </div>
          )}

          {!loadingList && designs.length === 0 && (
            <div className="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"/>
              </svg>
              <h3>No designs yet</h3>
              <p>Create your first system design to get started</p>
            </div>
          )}

          {!loadingList && designs.length > 0 && (
            <div className="designs-list">
              {designs.slice(0, 5).map((d, index) => (
                <div 
                  key={d.id} 
                  className={`design-item ${selected?.id === d.id ? "selected" : ""}`}
                  onClick={() => {
                    setSelected(d);
                    setViewMode("results");
                  }}
                >
                  <div className="design-item-header">
                    <span className="design-type">{d.style}</span>
                    <span className="design-date">{formatDate(d.createdAt || new Date())}</span>
                  </div>
                  <h4 className="design-prompt">
                    {d.prompt.slice(0, 70)}{d.prompt.length > 70 ? "..." : ""}
                  </h4>
                  <div className="design-item-footer">
                    <span className="design-id">#{index + 1}</span>
                    <div className="design-complexity">
                      <div className={`complexity-dot ${d.complexity}`}></div>
                      {d.complexity}
                    </div>
                  </div>
                </div>
              ))}
              {designs.length > 5 && (
                <button className="view-all-btn" onClick={() => setViewMode("results")}>
                  View all designs
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;