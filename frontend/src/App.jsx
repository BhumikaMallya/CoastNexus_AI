import { useState } from 'react'
import {
  Anchor, Activity, AlertTriangle, BarChart3, Bell, Boxes,
  BrainCircuit, CloudRain, LayoutDashboard, Map, Search,
  ShieldCheck, Ship, Waves, TrendingDown, DollarSign,
  ArrowRight, Leaf, Container, Recycle, CloudLightning,
  Link2, Zap
} from 'lucide-react'

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend
} from 'recharts'

import './App.css'

const menuItems = [
  { name: 'Overview', icon: LayoutDashboard },
  { name: 'CarbonLens AI', icon: Leaf },
  { name: 'FuturePort AI', icon: BrainCircuit },
  { name: 'ImpactVision AI', icon: BarChart3 },
  { name: 'TideGuard AI', icon: CloudLightning },
  { name: 'PortGenesis AI', icon: Anchor }
]

const cargoData = [
  { name: 'Mangaluru', cargo: 420 },
  { name: 'Kochi', cargo: 680 },
  { name: 'Mumbai', cargo: 850 },
  { name: 'Chennai', cargo: 590 },
  { name: 'Goa', cargo: 350 }
]

const portPerformance = [
  { name: 'Mumbai', score: 92 },
  { name: 'Kochi', score: 89 },
  { name: 'Mangaluru', score: 76 },
  { name: 'Goa', score: 83 },
  { name: 'Chennai', score: 87 }
]

const impactData = [
  { name: 'Cargo Delay', amount: 35 },
  { name: 'Storage', amount: 25 },
  { name: 'Transport', amount: 20 },
  { name: 'Other', amount: 20 }
]

const impactColors = ['#38bdf8', '#818cf8', '#f59e0b', '#34d399']

function App() {
  const [activePage, setActivePage] = useState('Overview')

  // CarbonLens AI
  const [cargoUnits, setCargoUnits] = useState(250)
  const [roadKm, setRoadKm] = useState(100)
  const [seaKm, setSeaKm] = useState(100)
  const [railKm, setRailKm] = useState(100)

  // FuturePort AI
  const [portCongestion, setPortCongestion] = useState(65)
  const [weatherRisk, setWeatherRisk] = useState('Medium')

  // ImpactVision AI
  const [delayHours, setDelayHours] = useState(8)
  const [cargoValue, setCargoValue] = useState(480000)

  // TideGuard AI
  const [tideLevel, setTideLevel] = useState(2.4)
  const [windSpeed, setWindSpeed] = useState(28)
  const [rainfall, setRainfall] = useState(18)

  // PortGenesis AI
  const [selectedPort, setSelectedPort] = useState('Kochi')

  // Shared calculations
  const roadEmission = Math.round(cargoUnits * roadKm * 0.12)
  const seaEmission = Math.round(cargoUnits * seaKm * 0.035)
  const railEmission = Math.round(cargoUnits * railKm * 0.025)

  const financialImpact = Math.round(cargoValue * delayHours / 100)
  const recoveryCost = Math.round(cargoValue * 0.025)

  const coastalRisk =
    tideLevel >= 3.5 || windSpeed >= 45 || rainfall >= 50
      ? 'High'
      : tideLevel >= 2.5 || windSpeed >= 30 || rainfall >= 25
        ? 'Moderate'
        : 'Low'

  const congestionLabel =
    portCongestion >= 80
      ? 'High'
      : portCongestion >= 55
        ? 'Moderate'
        : 'Low'

  const expectedDelayHours = Math.round(
    portCongestion / 10 +
    (weatherRisk === 'High' ? 6 : weatherRisk === 'Medium' ? 3 : 1)
  )

  const bestTransport = [
    { name: 'Road', value: roadEmission },
    { name: 'Sea', value: seaEmission },
    { name: 'Rail', value: railEmission }
  ].sort((a, b) => a.value - b.value)[0]

  const overallRisk =
    coastalRisk === 'High' || congestionLabel === 'High'
      ? 'High'
      : coastalRisk === 'Moderate' || congestionLabel === 'Moderate'
        ? 'Moderate'
        : 'Low'

  const activeAlerts = [
    congestionLabel === 'High',
    coastalRisk === 'High',
    delayHours >= 24
  ].filter(Boolean).length

  const inputStyle = {
    width: '100%',
    padding: '11px 12px',
    marginTop: '7px',
    borderRadius: '8px',
    border: '1px solid #29465a',
    background: '#091a29',
    color: '#e7f1f8',
    fontSize: '13px'
  }

  const fieldStyle = {
    display: 'block',
    color: '#a8bfce',
    fontSize: '12px',
    marginBottom: '15px'
  }

  const responsiveGrid = {
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))'
  }

  const openModule = (module) => setActivePage(module)

  return (
    <div className="app-layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Waves size={25} />
          </div>
          <div>
            <h2>CoastNexus</h2>
            <span>INTELLIGENT LOGISTICS</span>
          </div>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">MAIN MENU</p>

          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.name}
                className={`nav-item ${activePage === item.name ? 'active' : ''}`}
                onClick={() => setActivePage(item.name)}
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </button>
            )
          })}
        </div>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot"></span>
            Prototype System Online
          </div>
          <p>CoastNexus AI © 2026</p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* TOPBAR */}
        <header className="topbar">
          <div className="breadcrumb">
            <span>Workspace</span>
            <ArrowRight size={15} />
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-actions">
            <div className="search-box">
              <Search size={17} />
              <span>Search ports, cargo...</span>
            </div>
            <button className="icon-button">
              <Bell size={19} />
            </button>
            <div className="profile-avatar">CN</div>
          </div>
        </header>

        {/* OVERVIEW */}
        {activePage === 'Overview' && (
          <>
            <section className="welcome-section">
              <div>
                <p className="eyebrow">
                  COASTAL SUPPLY CHAIN INTELLIGENCE
                </p>
                <h1>Command Center Overview</h1>
                <p>
                  Monitor, predict and optimize coastal logistics operations.
                </p>
              </div>
              <div className="welcome-icon">
                <Ship size={42} />
              </div>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-top">
                  <span>Monitored Ports</span>
                  <Anchor size={20} />
                </div>
                <h2>12</h2>
                <p>Across coastal network</p>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>Cargo Monitored</span>
                  <Container size={20} />
                </div>
                <h2>{cargoUnits.toLocaleString('en-IN')}</h2>
                <p>Entered cargo units</p>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>Active Alerts</span>
                  <AlertTriangle size={20} />
                </div>
                <h2>{String(activeAlerts).padStart(2, '0')}</h2>
                <p>Calculated demo alerts</p>
              </div>

              <div className="stat-card">
                <div className="stat-top">
                  <span>Overall Risk</span>
                  <Activity size={20} />
                </div>
                <h2>{overallRisk}</h2>
                <p>Combined module assessment</p>
              </div>
            </section>

            {/* INTEGRATION PANEL */}
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>
                    <Link2 size={18} style={{ display: 'inline', marginRight: 8 }} />
                    Connected Intelligence Network
                  </h3>
                  <p>Information shared between all five AI modules</p>
                </div>
                <Zap size={21} />
              </div>

              <div className="stats-grid" style={responsiveGrid}>
                <div className="stat-card">
                  <span>Lowest Emission Mode</span>
                  <h2>{bestTransport.name}</h2>
                  <p>{bestTransport.value.toLocaleString('en-IN')} demo units</p>
                  <button className="nav-item" onClick={() => openModule('CarbonLens AI')}>
                    Open CarbonLens <ArrowRight size={14} />
                  </button>
                </div>

                <div className="stat-card">
                  <span>Port Congestion</span>
                  <h2>{congestionLabel}</h2>
                  <p>{expectedDelayHours} hours predicted delay</p>
                  <button className="nav-item" onClick={() => openModule('FuturePort AI')}>
                    Open FuturePort <ArrowRight size={14} />
                  </button>
                </div>

                <div className="stat-card">
                  <span>Coastal Risk</span>
                  <h2>{coastalRisk}</h2>
                  <p>Based on entered conditions</p>
                  <button className="nav-item" onClick={() => openModule('TideGuard AI')}>
                    Open TideGuard <ArrowRight size={14} />
                  </button>
                </div>

                <div className="stat-card">
                  <span>Alternative Port</span>
                  <h2>{selectedPort}</h2>
                  <p>Current selected alternative</p>
                  <button className="nav-item" onClick={() => openModule('PortGenesis AI')}>
                    Open PortGenesis <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              <div className="recommendation">
                <ShieldCheck size={22} />
                <div>
                  <strong>Network Intelligence Recommendation</strong>
                  <p>
                    {overallRisk === 'High'
                      ? `High operational risk detected. Review conditions at ${selectedPort}, coordinate cargo planning and verify official coastal advisories.`
                      : overallRisk === 'Moderate'
                        ? `Moderate network risk. Monitor conditions at ${selectedPort} and prepare alternative cargo arrangements.`
                        : `Current entered conditions indicate relatively low risk. Continue monitoring and consider ${bestTransport.name} for the lowest demo emission index.`}
                  </p>
                </div>
              </div>
            </section>

            <section className="dashboard-grid">
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h3>Coastal Network Overview</h3>
                    <p>Illustrative port activity</p>
                  </div>
                  <Map size={21} />
                </div>

                <div className="map-visual">
                  <div className="map-water">
                    <div className="map-route route-one"></div>
                    <div className="map-route route-two"></div>
                    <div className="map-point point-one">Mumbai</div>
                    <div className="map-point point-two">Goa</div>
                    <div className="map-point point-three">Mangaluru</div>
                    <div className="map-point point-four">Kochi</div>
                    <div className="map-point point-five">Chennai</div>
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h3>Recent Alerts</h3>
                    <p>Connected module notifications</p>
                  </div>
                  <Bell size={20} />
                </div>

                <div className="alert-item">
                  <CloudRain size={19} />
                  <div>
                    <strong>Coastal monitoring</strong>
                    <p>TideGuard risk: {coastalRisk}</p>
                  </div>
                </div>

                <div className="alert-item">
                  <Ship size={19} />
                  <div>
                    <strong>Port capacity update</strong>
                    <p>FuturePort congestion: {congestionLabel}</p>
                  </div>
                </div>

                <div className="alert-item">
                  <ShieldCheck size={19} />
                  <div>
                    <strong>Alternative port selection</strong>
                    <p>{selectedPort} selected in PortGenesis</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Cargo Distribution</h3>
                  <p>Illustrative cargo units across ports</p>
                </div>
                <Boxes size={21} />
              </div>

              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={cargoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#263849" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="cargo" fill="#38bdf8" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </section>
          </>
        )}

        {/* FUTUREPORT AI */}
        {activePage === 'FuturePort AI' && (
          <>
            <section className="welcome-section">
              <div>
                <p className="eyebrow">PREDICTIVE INTELLIGENCE</p>
                <h1>FuturePort AI</h1>
                <p>Forecast port congestion and operational risks.</p>
              </div>
              <BrainCircuit size={42} />
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <span>Predicted Congestion</span>
                <h2>{congestionLabel}</h2>
                <p>Based on entered utilization</p>
              </div>

              <div className="stat-card">
                <span>Weather Risk</span>
                <h2>{weatherRisk}</h2>
                <p>Selected scenario</p>
              </div>

              <div className="stat-card">
                <span>Expected Delay</span>
                <h2>{expectedDelayHours}h</h2>
                <p>Illustrative calculation</p>
              </div>

              <div className="stat-card">
                <span>Coastal Risk</span>
                <h2>{coastalRisk}</h2>
                <p>Shared from TideGuard AI</p>
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Port Risk Analysis</h3>
                  <p>Adjust conditions to update the connected prediction.</p>
                </div>
                <BrainCircuit size={21} />
              </div>

              <div className="stats-grid" style={responsiveGrid}>
                <label style={fieldStyle}>
                  Port capacity utilization: {portCongestion}%
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={portCongestion}
                    onChange={e => setPortCongestion(Number(e.target.value))}
                    style={inputStyle}
                  />
                </label>

                <label style={fieldStyle}>
                  Weather risk
                  <select
                    value={weatherRisk}
                    onChange={e => setWeatherRisk(e.target.value)}
                    style={inputStyle}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </label>
              </div>

              <div className="recommendation">
                <ShieldCheck size={22} />
                <div>
                  <strong>Connected Recommendation</strong>
                  <p>
                    {congestionLabel === 'High' || weatherRisk === 'High' || coastalRisk === 'High'
                      ? `Elevated operational risk. Review the ${selectedPort} alternative port and coordinate with TideGuard coastal monitoring before moving cargo.`
                      : congestionLabel === 'Moderate' || coastalRisk === 'Moderate'
                        ? `Monitor berth utilization and coastal conditions. Keep ${selectedPort} available as an alternative.`
                        : 'Entered conditions are relatively low risk. Continue routine monitoring.'}
                  </p>
                </div>
              </div>

              <div className="recommendation">
                <Link2 size={22} />
                <div>
                  <strong>Module Connection</strong>
                  <p>
                    This module receives coastal risk from TideGuard AI and the proposed alternative port from PortGenesis AI.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* IMPACTVISION AI */}
        {activePage === 'ImpactVision AI' && (
          <>
            <section className="welcome-section">
              <div>
                <p className="eyebrow">DISRUPTION IMPACT ANALYSIS</p>
                <h1>ImpactVision AI</h1>
                <p>Estimate the operational and financial impact of disruptions.</p>
              </div>
              <TrendingDown size={42} />
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <span>Estimated Delay</span>
                <h2>{delayHours}h</h2>
                <p>Entered scenario</p>
              </div>

              <div className="stat-card">
                <span>Financial Exposure</span>
                <h2>₹{financialImpact.toLocaleString('en-IN')}</h2>
                <p>Illustrative calculation</p>
              </div>

              <div className="stat-card">
                <span>Risk Severity</span>
                <h2>{delayHours >= 24 ? 'High' : delayHours >= 8 ? 'Medium' : 'Low'}</h2>
                <p>Demo scenario assessment</p>
              </div>

              <div className="stat-card">
                <span>Recovery Cost</span>
                <h2>₹{recoveryCost.toLocaleString('en-IN')}</h2>
                <p>Illustrative 2.5% estimate</p>
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Disruption Impact Breakdown</h3>
                  <p>Illustrative percentage distribution</p>
                </div>
                <DollarSign size={21} />
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={impactData}
                      dataKey="amount"
                      nameKey="name"
                      outerRadius={90}
                      label={({ percent }) => `${Math.round(percent * 100)}%`}
                    >
                      {impactData.map((entry, index) => (
                        <Cell key={entry.name} fill={impactColors[index]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={value => [`${value}%`, 'Impact']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Interactive Financial Impact Calculator</h3>
                  <p>Change scenario inputs to estimate exposure.</p>
                </div>
                <DollarSign size={21} />
              </div>

              <button
                className="nav-item"
                onClick={() => setDelayHours(expectedDelayHours)}
              >
                <Link2 size={17} />
                Use FuturePort predicted delay ({expectedDelayHours} hours)
              </button>

              <div className="stats-grid" style={responsiveGrid}>
                <label style={fieldStyle}>
                  Delay duration (hours)
                  <input
                    type="number"
                    min="0"
                    max="720"
                    value={delayHours}
                    onChange={e => setDelayHours(Math.max(0, Number(e.target.value) || 0))}
                    style={inputStyle}
                  />
                </label>

                <label style={fieldStyle}>
                  Cargo value (₹)
                  <input
                    type="number"
                    min="0"
                    value={cargoValue}
                    onChange={e => setCargoValue(Math.max(0, Number(e.target.value) || 0))}
                    style={inputStyle}
                  />
                </label>
              </div>

              <div className="recommendation">
                <Link2 size={22} />
                <div>
                  <strong>Connected Impact Assessment</strong>
                  <p>
                    This calculation can use the delay forecast from FuturePort AI.
                    Current selected alternative port: {selectedPort}.
                  </p>
                </div>
              </div>

              <p style={{ color: '#8faabd', fontSize: 11 }}>
                Demo formula: cargo value × delay hours ÷ 100. This is not a real financial loss model.
              </p>
            </section>
          </>
        )}

        {/* CARBONLENS AI */}
        {activePage === 'CarbonLens AI' && (
          <>
            <section className="welcome-section">
              <div>
                <p className="eyebrow">SUSTAINABLE LOGISTICS</p>
                <h1>CarbonLens AI</h1>
                <p>Compare transport modes and estimate emissions.</p>
              </div>
              <Leaf size={42} />
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <span>Road Emission Index</span>
                <h2>{roadEmission}</h2>
                <p>Demo emission units</p>
              </div>

              <div className="stat-card">
                <span>Sea Emission Index</span>
                <h2>{seaEmission}</h2>
                <p>Demo emission units</p>
              </div>

              <div className="stat-card">
                <span>Rail Emission Index</span>
                <h2>{railEmission}</h2>
                <p>Demo emission units</p>
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Transport Emission Calculator</h3>
                  <p>Enter cargo quantity and distance for each transport mode.</p>
                </div>
                <Recycle size={21} />
              </div>

              <div className="stats-grid" style={responsiveGrid}>
                <label style={fieldStyle}>
                  Cargo units
                  <input
                    type="number"
                    min="1"
                    value={cargoUnits}
                    onChange={e => setCargoUnits(Math.max(1, Number(e.target.value) || 1))}
                    style={inputStyle}
                  />
                </label>

                <label style={fieldStyle}>
                  Road distance (km)
                  <input
                    type="number"
                    min="1"
                    value={roadKm}
                    onChange={e => setRoadKm(Math.max(1, Number(e.target.value) || 1))}
                    style={inputStyle}
                  />
                </label>

                <label style={fieldStyle}>
                  Sea distance (km)
                  <input
                    type="number"
                    min="1"
                    value={seaKm}
                    onChange={e => setSeaKm(Math.max(1, Number(e.target.value) || 1))}
                    style={inputStyle}
                  />
                </label>

                <label style={fieldStyle}>
                  Rail distance (km)
                  <input
                    type="number"
                    min="1"
                    value={railKm}
                    onChange={e => setRailKm(Math.max(1, Number(e.target.value) || 1))}
                    style={inputStyle}
                  />
                </label>
              </div>

              <p style={{ color: '#8faabd', fontSize: 11 }}>
                Demo-only factors: road 0.12, sea 0.035 and rail 0.025.
                These are illustrative indices, not verified emission factors.
              </p>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Transport Emission Comparison</h3>
                  <p>Calculated demo emission indices</p>
                </div>
                <BarChart3 size={21} />
              </div>

              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  data={[
                    { name: 'Road', emission: roadEmission },
                    { name: 'Sea', emission: seaEmission },
                    { name: 'Rail', emission: railEmission }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#263849" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="emission" fill="#34d399" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section className="panel">
              <div className="recommendation">
                <Leaf size={22} />
                <div>
                  <strong>Connected Sustainability Recommendation</strong>
                  <p>
                    {bestTransport.name} currently has the lowest calculated demo emission index.
                    The Overview dashboard automatically displays this result.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* TIDEGUARD AI */}
        {activePage === 'TideGuard AI' && (
          <>
            <section className="welcome-section">
              <div>
                <p className="eyebrow">COASTAL WEATHER AND SAFETY</p>
                <h1>TideGuard AI</h1>
                <p>Monitor environmental conditions and coastal risk indicators.</p>
              </div>
              <CloudLightning size={42} />
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <span>Tide Level</span>
                <h2>{tideLevel}m</h2>
                <p>Entered demo reading</p>
              </div>

              <div className="stat-card">
                <span>Wind Speed</span>
                <h2>{windSpeed} km/h</h2>
                <p>Entered demo reading</p>
              </div>

              <div className="stat-card">
                <span>Rainfall</span>
                <h2>{rainfall} mm</h2>
                <p>Entered demo reading</p>
              </div>

              <div className="stat-card">
                <span>Coastal Risk</span>
                <h2>{coastalRisk}</h2>
                <p>Shared with FuturePort AI</p>
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Environmental Risk Assessment</h3>
                  <p>Adjust environmental inputs to update the connected risk.</p>
                </div>
                <CloudLightning size={21} />
              </div>

              <div className="stats-grid" style={responsiveGrid}>
                <label style={fieldStyle}>
                  Tide level (m)
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={tideLevel}
                    onChange={e => setTideLevel(Math.max(0, Number(e.target.value) || 0))}
                    style={inputStyle}
                  />
                </label>

                <label style={fieldStyle}>
                  Wind speed (km/h)
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={windSpeed}
                    onChange={e => setWindSpeed(Math.max(0, Number(e.target.value) || 0))}
                    style={inputStyle}
                  />
                </label>

                <label style={fieldStyle}>
                  Rainfall (mm)
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={rainfall}
                    onChange={e => setRainfall(Math.max(0, Number(e.target.value) || 0))}
                    style={inputStyle}
                  />
                </label>
              </div>

              <div className="recommendation">
                <CloudLightning size={22} />
                <div>
                  <strong>Safety Guidance</strong>
                  <p>
                    {coastalRisk === 'High'
                      ? 'High demo risk: pause exposed coastal operations and verify official marine and weather advisories.'
                      : coastalRisk === 'Moderate'
                        ? 'Moderate demo risk: monitor conditions and review port-side safety procedures.'
                        : 'Low demo risk from entered values: continue routine monitoring and follow official advisories.'}
                  </p>
                </div>
              </div>

              <div className="recommendation">
                <Link2 size={22} />
                <div>
                  <strong>Connected Module Status</strong>
                  <p>
                    FuturePort AI now receives this coastal risk assessment.
                    Current overall network risk: {overallRisk}.
                  </p>
                </div>
              </div>

              <p style={{ color: '#8faabd', fontSize: 11 }}>
                Thresholds are illustrative only. Do not use this prototype for real-world marine safety decisions.
              </p>
            </section>
          </>
        )}

        {/* PORTGENESIS AI */}
        {activePage === 'PortGenesis AI' && (
          <>
            <section className="welcome-section">
              <div>
                <p className="eyebrow">PORT PERFORMANCE INTELLIGENCE</p>
                <h1>PortGenesis AI</h1>
                <p>Analyze port performance and identify alternative capacity.</p>
              </div>
              <Anchor size={42} />
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <span>Port Efficiency</span>
                <h2>89%</h2>
                <p>Illustrative efficiency score</p>
              </div>

              <div className="stat-card">
                <span>Cargo Capacity</span>
                <h2>82%</h2>
                <p>Illustrative capacity utilization</p>
              </div>

              <div className="stat-card">
                <span>Selected Alternative</span>
                <h2>{selectedPort}</h2>
                <p>Shared with Overview and other modules</p>
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Port Performance Comparison</h3>
                  <p>Illustrative efficiency scores</p>
                </div>
                <BarChart3 size={21} />
              </div>

              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={portPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#263849" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="score" fill="#38bdf8" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Alternative Port Selection</h3>
                  <p>Select a port to update the connected network.</p>
                </div>
                <Anchor size={21} />
              </div>

              <label style={fieldStyle}>
                Choose alternative port
                <select
                  value={selectedPort}
                  onChange={e => setSelectedPort(e.target.value)}
                  style={inputStyle}
                >
                  <option>Kochi</option>
                  <option>Mumbai</option>
                  <option>Mangaluru</option>
                  <option>Goa</option>
                  <option>Chennai</option>
                </select>
              </label>

              <div className="recommendation">
                <Anchor size={22} />
                <div>
                  <strong>Port Selection Preview</strong>
                  <p>
                    {selectedPort} is selected as the proposed alternative.
                    This selection is now shared with the Overview,
                    FuturePort AI and ImpactVision AI.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* FOOTER */}
        <footer className="app-footer">
          <p>
            CoastNexus AI — Intelligent Coastal Supply Chain Command Center
          </p>
          <span>Hackathon Prototype • Illustrative Data</span>
        </footer>

      </main>
    </div>
  )
}

export default App