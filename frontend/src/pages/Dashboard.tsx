/**
 * Dashboard Page Component
 */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import type { HealthStatus } from '../types/api';

const Dashboard: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadHealthStatus();
  }, []);

  const loadHealthStatus = async () => {
    try {
      const status = await apiClient.getHealthStatus();
      setHealthStatus(status);
    } catch (error) {
      console.error('Error loading health status:', error);
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
          <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Dashboard</h1>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2">
              <div className="card">
                <h2 className="card-title">Estado del Sistema</h2>
                {healthStatus && (
                  <>
                    <p>
                      <strong>Estado:</strong>{' '}
                      <span style={{ color: 'var(--success-color)' }}>
                        {healthStatus.status}
                      </span>
                    </p>
                    <p>
                      <strong>Servicio:</strong> {healthStatus.service}
                    </p>
                    <p>
                      <strong>Versión:</strong> {healthStatus.version}
                    </p>
                    {healthStatus.uptime_seconds && (
                      <p>
                        <strong>Tiempo activo:</strong>{' '}
                        {Math.floor(healthStatus.uptime_seconds / 60)} minutos
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="card">
                <h2 className="card-title">Recursos del Sistema</h2>
                {healthStatus?.system && (
                  <>
                    <p>
                      <strong>CPU:</strong> {healthStatus.system.cpu_percent.toFixed(1)}%
                    </p>
                    <p>
                      <strong>Memoria:</strong>{' '}
                      {healthStatus.system.memory_percent.toFixed(1)}%
                    </p>
                    <p>
                      <strong>Disco:</strong> {healthStatus.system.disk_percent.toFixed(1)}%
                    </p>
                  </>
                )}
              </div>

              <div className="card">
                <h2 className="card-title">Acceso Rápido</h2>
                <Link
                  to="/ai-playground"
                  className="btn btn-primary"
                  style={{ marginTop: '1rem', display: 'block', textAlign: 'center' }}
                >
                  Probar AI Playground
                </Link>
              </div>

              <div className="card">
                <h2 className="card-title">Módulos Disponibles</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ padding: '0.5rem 0' }}>✅ Procesamiento de Lenguaje Natural</li>
                  <li style={{ padding: '0.5rem 0' }}>✅ Análisis de Sentimientos</li>
                  <li style={{ padding: '0.5rem 0' }}>✅ Clasificación de Texto</li>
                  <li style={{ padding: '0.5rem 0' }}>🔄 Reconocimiento de Entidades</li>
                  <li style={{ padding: '0.5rem 0' }}>🔄 Traducción de Idiomas</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
