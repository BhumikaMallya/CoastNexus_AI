
import {
  Anchor,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bell,
  Boxes,
  BrainCircuit,
  CloudRain,
  LayoutDashboard,
  Map,
  Network,
  Search,
  Settings,
  ShieldCheck,
  Ship,
  Waves,
  Wind,
  Zap
} from 'lucide-react'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts'

import './App.css'

const cargoData = [
  { port: 'Mangaluru', cargo: 420 },
  { port: 'Kochi', cargo: 680 },
  { port: 'Mumbai', cargo: 850 },
  { port: 'Chennai', cargo: 590 },
  { port: 'Goa', cargo: 350 }
]

const menuItems = [
  { name: 'Overview', icon: LayoutDashboard },
  { name: 'FuturePort AI', icon: Map },
  { name: 'PortGenesis AI', icon: BrainCircuit },
  { name: 'ImpactVision AI', icon: BarChart3 },
  { name: 'TradeTwin AI', icon: Network },
  { name: 'ColdChain Guardian', icon: Boxes }
]

function App() {
  return (
    <div className="dashboard">

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon"><Anchor size={25} /></div>
          <div>
            <h2>COAST NEXUS</h2>
            <span>INTELLIGENT LOGISTICS</span>
          </div>
        </div>

        <p className="menu-label">MAIN MENU</p>

        <nav>
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <button
                key={item.name}
                className={`nav-item ${index === 0 ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </button>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item">
            <Settings size={18} />
            Settings
          </button>
          <div className="system-status">
            <span className="status-dot"></span>
            All systems operational
          </div>
        </div>
      </aside>

      <main className="main-content">

        <header className="topbar">
          <div>
            <p className="breadcrumb">COAST NEXUS / OVERVIEW</p>
            <h1>Command Center</h1>
          </div>

          <div className="top-actions">
            <div className="search-box">
              <Search size={17} />
              <span>Search ports, cargo...</span>
            </div>
            <button className="icon-button"><Bell size={19} /></button>
            <div className="profile">CN</div>
          </div>
        </header>

        <section className="welcome">
          <div>
            <span className="eyebrow">COASTAL INTELLIGENCE PLATFORM</span>
            <h2>Welcome to Coast Nexus</h2>
            <p>
              Predict disruptions. Connect resources.
              Build resilient coastal supply chains.
            </p>
          </div>
          <div className="welcome-icon"><Waves size={55} /></div>
        </section>

        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-top">
              <span>Monitored Ports</span>
              <Anchor size={20} />
            </div>
            <h2>05</h2>
            <p>Coastal network coverage</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Active Disruptions</span>
              <AlertTriangle size={20} />
            </div>
            <h2>03</h2>
            <p>Simulated alerts</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Cargo Monitored</span>
              <Ship size={20} />
            </div>
            <h2>2.89M</h2>
            <p>Simulated cargo volume</p>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span>Network Health</span>
              <ShieldCheck size={20} />
            </div>
            <h2>94.8%</h2>
            <p>Illustrative system score</p>
          </div>

        </section>

        <section className="content-grid">

          <div className="panel map-panel">
            <div className="panel-heading">
              <div>
                <h3>Coastal Network Overview</h3>
                <p>Major Indian coastal port connections</p>
              </div>
              <span className="live-tag">SIMULATED DATA</span>
            </div>

            <div className="map-area">
              <div className="ocean-label">ARABIAN SEA</div>
              <div className="map-point point-one">
                <span></span>
                <b>Mumbai</b>
              </div>
              <div className="map-point point-two">
                <span></span>
                <b>Goa</b>
              </div>
              <div className="map-point point-three">
                <span></span>
                <b>Mangaluru</b>
              </div>
              <div className="map-point point-four">
                <span></span>
                <b>Kochi</b>
              </div>
              <div className="map-point point-five">
                <span></span>
                <b>Chennai</b>
              </div>
              <div className="map-caption">
                <Map size={15} />
                Interactive coastal map coming next
              </div>
            </div>
          </div>

          <div className="panel alerts-panel">
            <div className="panel-heading">
              <div>
                <h3>Disruption Alerts</h3>
                <p>Supply chain risk monitoring</p>
              </div>
              <Bell size={19} />
            </div>

            <div className="alert-item">
              <CloudRain size={20} />
              <div>
                <b>Weather Warning</b>
                <p>Heavy rainfall near Mangaluru</p>
                <small>HIGH RISK · SIMULATED</small>
              </div>
            </div>

            <div className="alert-item">
              <Boxes size={20} />
              <div>
                <b>Port Congestion</b>
                <p>Increased cargo waiting time</p>
                <small>MEDIUM RISK · SIMULATED</small>
              </div>
            </div>

            <div className="alert-item">
              <Wind size={20} />
              <div>
                <b>Sea Condition</b>
                <p>Strong winds along the coast</p>
                <small>HIGH RISK · SIMULATED</small>
              </div>
            </div>
          </div>

        </section>

        <section className="content-grid bottom-grid">

          <div className="panel chart-panel">
            <div className="panel-heading">
              <div>
                <h3>Cargo Distribution</h3>
                <p>Illustrative cargo volume by port</p>
              </div>
              <BarChart3 size={20} />
            </div>

            <div className="chart-area">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cargoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#263b4c" />
                  <XAxis dataKey="port" stroke="#91a5b6" />
                  <YAxis stroke="#91a5b6" />
                  <Tooltip />
                  <Bar dataKey="cargo" fill="#22c5c9" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="panel recommendation-panel">
            <div className="panel-heading">
              <div>
                <h3>AI Recovery Insight</h3>
                <p>Suggested response</p>
              </div>
              <BrainCircuit size={21} />
            </div>

            <div className="ai-icon"><Zap size={25} /></div>
            <h3>Alternative Port Recommendation</h3>
            <p>
              If congestion increases at Mangaluru,
              evaluate cargo diversion to nearby ports.
            </p>
            <div className="recommendation-footer">
              <Activity size={16} />
              <span>Illustrative AI recommendation</span>
            </div>
          </div>

        </section>

        <footer>
          Coast Nexus · Hackathon Prototype · All displayed figures are simulated
        </footer>

      </main>
    </div>
  )
}

export default App
