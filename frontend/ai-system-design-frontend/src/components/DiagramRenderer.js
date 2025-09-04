// src/components/DiagramRenderer.js
import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

// Initialize Mermaid once with a flexible configuration
mermaid.initialize({
  startOnLoad: true,
  theme: 'default', // Adjust based on your app's theme (e.g., 'dark')
  flowchart: { useMaxWidth: true },
});

const DiagramRenderer = ({ content }) => {
  const ref = useRef(null);
  const [error, setError] = useState(null);
  // Use a stable, unique ID per component instance
  const diagramId = useRef(`mermaid-${Math.random().toString(36).substring(2, 9)}`).current;

  useEffect(() => {
    if (content && ref.current) {
      try {
        mermaid.render(diagramId, content)
          .then(({ svg }) => {
            ref.current.innerHTML = svg;
            setError(null);
          })
          .catch((err) => {
            console.error('Mermaid rendering error:', err);
            setError('Failed to render diagram. Check console for details.');
          });
      } catch (err) {
        console.error('Mermaid initialization error:', err);
        setError('Error initializing diagram. Check console for details.');
      }
    }
  }, [content]);

  return (
    <div className="diagram-container">
      {error ? (
        <div className="diagram-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="24"
            height="24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-10h2v8h-2V7z" />
          </svg>
          <p>{error}</p>
          <pre>{content}</pre>
        </div>
      ) : (
        <div ref={ref} />
      )}
    </div>
  );
};

export default DiagramRenderer;