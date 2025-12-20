/**
 * AI Playground Page Component
 */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import type { AIResponse } from '../types/api';

const AIPlayground: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setResponse(null);

    try {
      const result = await apiClient.aiInference({
        prompt,
        max_tokens: 1000,
        temperature: 0.7,
      });
      setResponse(result);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    apiClient.logout();
    navigate('/');
  };

  return (
    <div>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link to="/dashboard" className="logo">
              ARC Privus AI Madre
            </Link>
            <nav className="nav">
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/ai-playground" className="nav-link">
                AI Playground
              </Link>
              <button onClick={handleLogout} className="btn btn-outline">
                Cerrar Sesión
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <div className="container" style={{ paddingTop: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>AI Playground</h1>

          <div className="card">
            <h2 className="card-title">Prueba la IA</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Ingresa un prompt para interactuar con el sistema de inteligencia artificial
            </p>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="prompt" className="form-label">
                  Prompt
                </label>
                <textarea
                  id="prompt"
                  className="form-input form-textarea"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Escribe tu consulta o instrucción para la IA..."
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !prompt.trim()}
              >
                {loading ? 'Procesando...' : 'Enviar'}
              </button>
            </form>
          </div>

          {loading && (
            <div className="card">
              <div className="loading">
                <div className="spinner"></div>
              </div>
            </div>
          )}

          {response && (
            <div className="card">
              <h2 className="card-title">Respuesta</h2>
              <div
                style={{
                  backgroundColor: 'var(--light)',
                  padding: '1rem',
                  borderRadius: '0.375rem',
                  marginBottom: '1rem',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {response.result}
              </div>
              <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <span>
                  <strong>Tokens:</strong> {response.tokens_used}
                </span>
                <span>
                  <strong>Tiempo:</strong> {response.processing_time.toFixed(3)}s
                </span>
                <span>
                  <strong>Modelo:</strong> {response.model_version}
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AIPlayground;
