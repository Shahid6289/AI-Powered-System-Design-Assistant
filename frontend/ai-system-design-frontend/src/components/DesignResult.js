import React, { useState } from "react";
import DiagramRenderer from "./DiagramRenderer";

const DesignResult = ({ design }) => {
  const [activeTab, setActiveTab] = useState("diagram");
  const [expandedSections, setExpandedSections] = useState({
    prompt: true,
    architecture: true,
    apis: true,
    components: true
  });

  if (!design) return null;

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const hasDiagrams = design.rawOutput?.diagrams?.length > 0;
  const hasArchitecture = design.rawOutput?.architecture;
  const hasApis = design.rawOutput?.apis?.length > 0;
  const hasComponents = design.rawOutput?.components?.length > 0;

  return (
    <div className="design-result">
      <div className="result-header">
        <h2 className="result-title">Design Result</h2>
        {/* <div className="design-id">ID: #{design.id}</div> */}
      </div>

      {/* Navigation Tabs */}
      <div className="result-tabs">
        <button 
          className={`tab-btn ${activeTab === "diagram" ? "active" : ""}`}
          onClick={() => setActiveTab("diagram")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
          </svg>
          Diagram
        </button>
        <button 
          className={`tab-btn ${activeTab === "details" ? "active" : ""}`}
          onClick={() => setActiveTab("details")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V18z"/>
          </svg>
          Details
        </button>
        <button 
          className={`tab-btn ${activeTab === "raw" ? "active" : ""}`}
          onClick={() => setActiveTab("raw")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
          Raw Output
        </button>
      </div>

      <div className="result-content">
        {activeTab === "diagram" && (
          <div className="tab-panel">
            <h3 className="panel-title">System Architecture Diagram</h3>
            {hasDiagrams ? (
              <div className="diagrams-container">
                {design.rawOutput.diagrams.map((d, i) =>
                  d.type === "mermaid" ? (
                    <div key={i} className="diagram-card">
                      <DiagramRenderer content={d.content} />
                    </div>
                  ) : (
                    <div key={i} className="diagram-card">
                      <div className="unsupported-diagram">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-10h2v8h-2V7z"/>
                        </svg>
                        <h4>Unsupported Diagram Type</h4>
                        <p>This diagram type cannot be rendered in the preview.</p>
                        <button 
                          className="view-raw-btn"
                          onClick={() => setActiveTab("raw")}
                        >
                          View Raw Data
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="no-content">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z"/>
                </svg>
                <h4>No Diagrams Generated</h4>
                <p>This design doesn't contain any visual diagrams.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "details" && (
          <div className="tab-panel">
            {/* Prompt Section */}
            <div className="detail-section">
              <div className="section-header" onClick={() => toggleSection("prompt")}>
                <h3 className="section-title">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                  </svg>
                  Original Prompt
                </h3>
                <svg 
                  className={`collapse-icon ${expandedSections.prompt ? "expanded" : ""}`} 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
                </svg>
              </div>
              {expandedSections.prompt && (
                <div className="section-content">
                  <p className="prompt-text">{design.prompt}</p>
                </div>
              )}
            </div>

            {/* Architecture Section */}
            {hasArchitecture && (
              <div className="detail-section">
                <div className="section-header" onClick={() => toggleSection("architecture")}>
                  <h3 className="section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                    </svg>
                    Architecture Overview
                  </h3>
                  <svg 
                    className={`collapse-icon ${expandedSections.architecture ? "expanded" : ""}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
                  </svg>
                </div>
                {expandedSections.architecture && (
                  <div className="section-content">
                    <div className="architecture-content">
                      {design.rawOutput.architecture}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* APIs Section */}
            {hasApis && (
              <div className="detail-section">
                <div className="section-header" onClick={() => toggleSection("apis")}>
                  <h3 className="section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 8h-3V6c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6h6v2H9V6zm11 14H4V10h16v10zm-6-2h2v-2h-2v2zm-4 0h2v-2h-2v2zm-4 0h2v-2H6v2zm8-4h2v-2h-2v2zm-4 0h2v-2h-2v2zm-4 0h2v-2H6v2z"/>
                    </svg>
                    API Specifications ({design.rawOutput.apis.length})
                  </h3>
                  <svg 
                    className={`collapse-icon ${expandedSections.apis ? "expanded" : ""}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
                  </svg>
                </div>
                {expandedSections.apis && (
                  <div className="section-content">
                    <div className="apis-list">
                      {design.rawOutput.apis.map((api, index) => (
                        <div key={index} className="api-item">
                          <h4 className="api-name">{api.name || `API ${index + 1}`}</h4>
                          {api.description && (
                            <p className="api-description">{api.description}</p>
                          )}
                          {api.endpoint && (
                            <div className="api-endpoint">
                              <span className="endpoint-method">{api.method || 'GET'}</span>
                              <span className="endpoint-path">{api.endpoint}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Components Section */}
            {hasComponents && (
              <div className="detail-section">
                <div className="section-header" onClick={() => toggleSection("components")}>
                  <h3 className="section-title">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 3H5c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 7H5V5h5v5zm7 7h-5c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h5c1.1 0 2-.9 2-2v-5c0-1.1-.9-2-2-2zm0 7h-5v-5h5v5zm0-17h-5c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 7h-5V5h5v5z"/>
                    </svg>
                    System Components ({design.rawOutput.components.length})
                  </h3>
                  <svg 
                    className={`collapse-icon ${expandedSections.components ? "expanded" : ""}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor"
                  >
                    <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/>
                  </svg>
                </div>
                {expandedSections.components && (
                  <div className="section-content">
                    <div className="components-grid">
                      {design.rawOutput.components.map((component, index) => (
                        <div key={index} className="component-card">
                          <h4 className="component-name">{component.name || `Component ${index + 1}`}</h4>
                          {component.description && (
                            <p className="component-description">{component.description}</p>
                          )}
                          {component.technology && (
                            <span className="component-tech">{component.technology}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "raw" && (
          <div className="tab-panel">
            <h3 className="panel-title">Raw Output Data</h3>
            <div className="raw-output">
              <pre className="json-code">
                {JSON.stringify(design.rawOutput, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesignResult;