/**
 * Home Page Component
 */
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      <header className="header">
        <div className="container">
          <div className="header-content">
            <Link to="/" className="logo">
              ARC Privus AI Madre
            </Link>
            <nav className="nav">
              <Link to="/login" className="nav-link">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn btn-primary">
                Registrarse
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <div className="container">
          <section className="hero">
            <h1 className="hero-title">ARC Privus AI Madre</h1>
            <p className="hero-subtitle">
              Plataforma central de inteligencia artificial matriz
              <br />
              Autónoma, escalable y ética para el futuro
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Link to="/register" className="btn btn-primary">
                Comenzar Ahora
              </Link>
              <Link to="/login" className="btn btn-outline">
                Iniciar Sesión
              </Link>
            </div>
          </section>

          <section style={{ padding: '4rem 0' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem' }}>
              Características Principales
            </h2>
            <div className="grid grid-cols-3">
              <div className="card">
                <h3 className="card-title">🚀 Escalable</h3>
                <p>
                  Arquitectura diseñada para crecer desde pequeños proyectos hasta
                  implementaciones globales con millones de usuarios.
                </p>
              </div>
              <div className="card">
                <h3 className="card-title">🧩 Modular</h3>
                <p>
                  Sistema de módulos extensible que permite agregar funcionalidades
                  específicas para educación, empresas y gobiernos.
                </p>
              </div>
              <div className="card">
                <h3 className="card-title">🛡️ Ética y Segura</h3>
                <p>
                  Diseñada con seguridad y ética como prioridades fundamentales,
                  cumpliendo con estándares internacionales de privacidad.
                </p>
              </div>
              <div className="card">
                <h3 className="card-title">💡 Inteligente</h3>
                <p>
                  Capacidades avanzadas de procesamiento de lenguaje natural y
                  aprendizaje automático para resolver problemas complejos.
                </p>
              </div>
              <div className="card">
                <h3 className="card-title">💰 Monetización</h3>
                <p>
                  Módulos especializados para generar valor y oportunidades de
                  negocio sostenibles a largo plazo.
                </p>
              </div>
              <div className="card">
                <h3 className="card-title">📚 Educación</h3>
                <p>
                  Herramientas diseñadas específicamente para el ámbito educativo,
                  potenciando el aprendizaje y la enseñanza.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 ARC Privus AI Madre. Todos los derechos reservados.</p>
          <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>
            Plataforma de IA autónoma, escalable y ética
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
