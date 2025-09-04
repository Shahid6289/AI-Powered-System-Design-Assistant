import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const featureInterval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearInterval(featureInterval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const features = [
    {
      title: "AI-Powered Architecture Design",
      description: "Generate complete system architectures with intelligent AI assistance",
      icon: "🏗️",
      color: "from-blue-500 to-blue-700"
    },
    {
      title: "Automated API Specifications",
      description: "Create detailed API endpoints with request/response schemas automatically",
      icon: "🔌",
      color: "from-green-500 to-green-700"
    },
    {
      title: "Visual System Diagrams",
      description: "Generate professional architecture diagrams with Mermaid.js integration",
      icon: "📊",
      color: "from-purple-500 to-purple-700"
    },
    {
      title: "Technology Recommendations",
      description: "Get tailored technology suggestions based on your requirements",
      icon: "💡",
      color: "from-orange-500 to-orange-700"
    }
  ];

  const testimonials = [
    {
      quote: "This platform reduced our system design time by 65%. The AI suggestions are incredibly accurate.",
      author: "Sarah Chen",
      role: "Lead Architect at FinTech Solutions",
      avatar: "👩‍💼"
    },
    {
      quote: "The automated API documentation alone saved our team hundreds of hours. Absolutely invaluable.",
      author: "Michael Rodriguez",
      role: "CTO at StartupHub",
      avatar: "👨‍💼"
    },
    {
      quote: "Finally, a tool that understands microservices complexity and provides practical solutions.",
      author: "David Kim",
      role: "DevOps Engineer",
      avatar: "👨‍💻"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Systems Designed" },
    { value: "98%", label: "Accuracy Rate" },
    { value: "5x", label: "Faster Development" },
    { value: "2.5M+", label: "APIs Generated" }
  ];

  return (
    <div className="professional-homepage">
      {/* Progress Bar */}
      <div className="progress-bar" style={{ width: `${scrollProgress}%` }}></div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="floating-particles">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="particle" style={{
                animationDelay: `${i * 0.5}s`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}></div>
            ))}
          </div>
        </div>
        
        <div className="hero-content">
          <div className={`hero-text ${isVisible ? 'visible' : ''}`}>
            <h1 className="hero-title">
              Design Complex Systems with
              <span className="gradient-text"> AI Precision</span>
            </h1>
            <p className="hero-description">
              Transform your ideas into fully architected systems with our AI-powered design assistant. 
              Generate complete architectures, API specifications, and visual diagrams in minutes.
            </p>
            <div className="hero-actions">
              <Link to="/dashboard" className="cta-button primary">
                Start Designing Now
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
              </Link>
              <Link to="/demo" className="cta-button secondary">
                View Live Demo
              </Link>
            </div>
          </div>
          
          <div className="hero-visual">
            {/* API Specification Card */}
            <div className="floating-card api-card" style={{ animationDelay: '0s' }}>
              <div className="card-header">
                <div className="card-badge">API Spec</div>
                <div className="card-actions">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
              <div className="card-content">
                <div className="api-method post">POST</div>
                <div className="api-path">/api/v1/users</div>
                <div className="api-status">201 Created</div>
                <div className="code-preview">
                  <div className="code-line"></div>
                  <div className="code-line short"></div>
                  <div className="code-line"></div>
                </div>
              </div>
            </div>

            {/* Database Schema Card */}
            <div className="floating-card db-card" style={{ animationDelay: '1.5s' }}>
              <div className="card-header">
                <div className="card-badge">Database</div>
                <div className="card-actions">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
              <div className="card-content">
                <div className="db-type">PostgreSQL</div>
                <div className="schema-preview">
                  <div className="schema-line"></div>
                  <div className="schema-line short"></div>
                  <div className="schema-line"></div>
                  <div className="schema-line"></div>
                </div>
              </div>
            </div>

            {/* Architecture Diagram Card */}
            <div className="floating-card arch-card" style={{ animationDelay: '3s' }}>
              <div className="card-header">
                <div className="card-badge">Architecture</div>
                <div className="card-actions">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
              <div className="card-content">
                <div className="architecture-preview">
                  <div className="node main-node">
                    <span>API Gateway</span>
                  </div>
                  <div className="node service-node">
                    <span>Auth</span>
                  </div>
                  <div className="node service-node">
                    <span>Users</span>
                  </div>
                  <div className="node service-node">
                    <span>Orders</span>
                  </div>
                  <div className="connection"></div>
                  <div className="connection"></div>
                  <div className="connection"></div>
                </div>
              </div>
            </div>

            {/* Microservice Card */}
            <div className="floating-card microservice-card" style={{ animationDelay: '4.5s' }}>
              <div className="card-header">
                <div className="card-badge">Microservice</div>
                <div className="card-actions">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
              <div className="card-content">
                <div className="service-info">
                  <div className="service-name">User Service</div>
                  <div className="service-tech">Node.js + MongoDB</div>
                  <div className="service-stats">
                    <span className="stat">5 APIs</span>
                    <span className="stat">2 DB Tables</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-stats">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Powerful Features for Modern Architects</h2>
            <p>Everything you need to design, document, and deploy complex systems</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`feature-card ${index === currentFeature ? 'active' : ''}`}
                onMouseEnter={() => setCurrentFeature(index)}
              >
                <div className={`feature-icon ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-indicator"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="process-section">
        <div className="section-container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Transform your ideas into fully designed systems in four simple steps</p>
          </div>
          
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Describe Your System</h3>
                <p>Tell us what you need to build in plain English</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>AI Analysis</h3>
                <p>Our AI understands your requirements and constraints</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Generate Design</h3>
                <p>Receive complete architecture and specifications</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Implement & Iterate</h3>
                <p>Use the generated artifacts to build your system</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Trusted by Architects Worldwide</h2>
            <p>See what professionals are saying about our platform</p>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-content">
                  <p>"{testimonial.quote}"</p>
                </div>
                <div className="testimonial-author">
                  <div className="avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <h4>{testimonial.author}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-background">
          <div className="cta-shape cta-shape-1"></div>
          <div className="cta-shape cta-shape-2"></div>
        </div>
        
        <div className="section-container">
          <div className="cta-content">
            <h2>Ready to Transform Your Design Process?</h2>
            <p>Join thousands of architects who are building better systems faster</p>
            <div className="cta-actions">
              <Link to="/register" className="cta-button primary large">
                Get Started Free
              </Link>
              <Link to="/demo" className="cta-button secondary large">
                Schedule a Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;  