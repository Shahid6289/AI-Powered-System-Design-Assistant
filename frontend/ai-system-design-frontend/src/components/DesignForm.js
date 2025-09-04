import React, { useState } from "react";
import { createDesign } from "../api/designApi";

const DesignForm = ({ onCreated }) => {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("microservices");
  const [complexity, setComplexity] = useState("basic");
  const [services, setServices] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (!prompt.trim()) return setErr("Please describe your system requirements");
    setLoading(true);
    try {
      const servicesList = services.trim().split(',').map(s => s.trim()).filter(s => s);  
      const created = await createDesign({ prompt, style, complexity, services: servicesList });
      console.log('API Response:', created);
      onCreated?.(created);
      setPrompt("");
      setServices("");  
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to generate design. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="design-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">
          System Requirements
          <span className="required-asterisk">*</span>
        </label>
        <div className="input-container">
          <textarea
            className="form-textarea"
            rows={5}
            placeholder="e.g., Design a scalable e-commerce platform with search, recommendations, and payments..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />
          <div className="textarea-footer">
            <span className="char-count">{prompt.length}/1000</span>
          </div>
        </div>
      </div>
 
      <div className="form-group">
        <label className="form-label">Services (comma-separated, optional)</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g., auth, payment, notification"
          value={services}
          onChange={(e) => setServices(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Architecture Style</label>
          <div className="select-container">
            <select 
              className="form-select" 
              value={style} 
              onChange={(e) => setStyle(e.target.value)}
              disabled={loading}
            >
              <option value="microservices">Microservices</option>
              <option value="monolith">Monolithic</option>
              <option value="event-driven">Event-Driven</option>
              <option value="serverless">Serverless</option>
            </select>
            <svg className="select-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Complexity Level</label>
          <div className="complexity-buttons">
            <button
              type="button"
              className={`complexity-btn ${complexity === "basic" ? "active" : ""}`}
              onClick={() => setComplexity("basic")}
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Basic
            </button>
            <button
              type="button"
              className={`complexity-btn ${complexity === "advanced" ? "active" : ""}`}
              onClick={() => setComplexity("advanced")}
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
              Advanced
            </button>
          </div>
        </div>
      </div>

      {err && (
        <div className="form-error">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-10h2v8h-2V7z"/>
          </svg>
          {err}
        </div>
      )}

      <button 
        className={`form-submit-btn ${loading ? "loading" : ""}`} 
        type="submit" 
        disabled={loading || !prompt.trim()}
      >
        {loading ? (
          <>
            <div className="spinner"></div>
            Generating Design...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
            Generate Design
          </>
        )}
      </button>

      <div className="form-tips">
        <h4 className="tips-title">💡 Tips for better results:</h4>
        <ul className="tips-list">
          <li>Be specific about functionality requirements</li>
          <li>Mention expected traffic/scale</li>
          <li>Include any integration requirements</li>
          <li>Specify compliance or security needs</li>
        </ul>
      </div>
    </form>
  );
};

export default DesignForm;