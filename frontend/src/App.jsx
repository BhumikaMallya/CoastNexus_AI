
import { useEffect, useState } from 'react'
import {
  Anchor, Activity, AlertTriangle, BarChart3, Bell, Boxes,
  BrainCircuit, CloudRain, LayoutDashboard, Map, Network,
  Search, ShieldCheck, Ship, Waves, Wind, Zap,
  TrendingDown, DollarSign, Clock, Truck, ArrowRight,
  Route, PackageCheck, Leaf, Gauge, Recycle, CloudLightning
} from 'lucide-react'

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, PieChart, Pie, Cell
} from 'recharts'

import { getPorts, getRoutes, getRoute } from './api'
import { SCENARIOS, UTIL } from './scenarios'
import MapView from './MapView'
import DisruptionSimulator from './DisruptionSimulator'
import './App.css'

const cargoData = [
  { name: 'Mangaluru', cargo: 420 },
  { name: 'Kochi', cargo: 680 },
  { name: 'Mumbai', cargo: 850 },
  { name: 'Chennai', cargo: 590 },
  { name: 'Goa', cargo: 350 },
]

const menuItems = [
  { name: 'Overview', icon: LayoutDashboard },
  { name: 'Network Map', icon: Map },
  { name: 'Disruption Simulator', icon: Zap },
  { name: 'FuturePort AI', icon: BrainCircuit },
  { name: 'PortGenesis AI', icon: Anchor },
  { name: 'ImpactVision AI', icon: BarChart3 },
  { name: 'TradeTwin AI', icon: Network },
  { name: 'CargoMorph AI', icon: PackageCheck },
  { name: 'CoastGenesis AI', icon: Waves },
  { name: 'CarbonLens AI', icon: Leaf },
  { name: 'TideGuard AI', icon: CloudLightning },
]

const portPerformance = [
  { name: 'Mumbai', score: 92 },
  { name: 'Kochi', score: 89 },
  { name: 'Mangaluru', score: 76 },
  { name: 'Goa', score: 83 },
  { name: 'Chennai', score: 87 },
]

const impactData = [
  { name: 'Cargo Delay', amount: 35 },
  { name: 'Storage', amount: 25 },
  { name: 'Transport', amount: 20 },
  { name: 'Other', amount: 20 },
]

const impactColors = ['#38bdf8', '#818cf8', '#f59e0b', '#34d399']

const routeData = [
  { name: 'Current Route', hours: 18 },
  { name: 'Alternative', hours: 10 },
]

const cargoMorphData = [
  { name: 'Mangaluru', cargo: 420 },
  { name: 'Kochi', cargo: 680 },
  { name: 'Goa', cargo: 350 },
]

function App() {
  const [activePage, setActivePage] = useState('Overview')
  const [cargoUnits, setCargoUnits] = useState(250)
  const [roadKm, setRoadKm] = useState(100)
  const [seaKm, setSeaKm] = useState(100)
  const [railKm, setRailKm] = useState(100)
  const [portCongestion, setPortCongestion] = useState(65)
  const [weatherRisk, setWeatherRisk] = useState('Medium')
  const [delayHours, setDelayHours] = useState(8)
  const [cargoValue, setCargoValue] = useState(480000)
  const [tideLevel, setTideLevel] = useState(2.4)
  const [windSpeed, setWindSpeed] = useState(28)
  const [rainfall, setRainfall] = useState(18)
  const [selectedPort, setSelectedPort] = useState('Kochi')
  const [ports, setPorts] = useState([])
  const [routes, setRoutes] = useState([])
  const [scenario, setScenario] = useState('cyclone')
  const [status, setStatus] = useState({ ...SCENARIOS.cyclone.status })
  const [selected, setSelected] = useState('INMAA')
  const [origin, setOrigin] = useState('INVTZ')
  const [dest, setDest] = useState('INPNY')
  const [route, setRoute] = useState(null)
  const [base, setBase] = useState(null)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')

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
    portCongestion >= 80 ? 'High' : portCongestion >= 55 ? 'Moderate' : 'Low'
  const expectedDelayHours = Math.round(
    portCongestion / 10 + (weatherRisk === 'High' ? 6 : weatherRisk === 'Medium' ? 3 : 1)
  )
  const bestTransport = [
    { name: 'Road', value: roadEmission },
    { name: 'Sea', value: seaEmission },
    { name: 'Rail', value: railEmission },
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
    delayHours >= 24,
  ].filter(Boolean).length
  const carbonData = [
    { name: 'Road', emission: roadEmission },
    { name: 'Sea', emission: seaEmission },
    { name: 'Rail', emission: railEmission },
  ]

  const closedKey = Object.keys(status)
    .filter((id) => status[id] === 'closed')
    .sort()
    .join(',')

  useEffect(() => {
    let stale = false
    Promise.all([getPorts(), getRoutes()])
      .then(([portData, routeData]) => {
        if (stale) return
        setPorts(portData)
        setRoutes(routeData)
        setLoadError('')
      })
      .catch((loadFailure) => {
        if (!stale) setLoadError(loadFailure.message)
      })
    return () => { stale = true }
  }, [])

  useEffect(() => {
    if (!ports.length) return undefined
    let stale = false
    const closed = closedKey ? closedKey.split(',') : []
    Promise.all([
      getRoute(origin, dest, closed).catch((routeFailure) => routeFailure),
      getRoute(origin, dest, []).catch(() => null),
    ]).then(([currentRoute, baselineRoute]) => {
      if (stale) return
      setBase(baselineRoute)
      if (currentRoute instanceof Error) {
        setRoute(null)
        setError(currentRoute.message)
      } else {
        setRoute(currentRoute)
        setError('')
      }
    })
    return () => { stale = true }
  }, [origin, dest, closedKey, ports.length])

  const pickScenario = (key) => {
    setScenario(key)
    setStatus({ ...SCENARIOS[key].status })
  }

  const setNodeStatus = (id, value) => setStatus((current) => {
    const next = { ...current }
    if (value === 'operational') delete next[id]
    else next[id] = value
    return next
  })

  const openModule = (module) => setActivePage(module)
  const portName = (id) => ports.find((port) => port.id === id)?.name ?? id
  const selectedNode = ports.find((port) => port.id === selected)
  const selectedStatus = status[selected] || 'operational'
  const delay = route && base ? route.hours - base.hours : null
  const closedCount = Object.values(status).filter((value) => value === 'closed').length
  const degradedCount = Object.values(status).filter((value) => value === 'degraded').length
  const portSelect = (value, onChange) => (
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {ports.map((port) => (
        <option key={port.id} value={port.id}>{port.name}</option>
      ))}
    </select>
  )

  return (
    <div className="app-layout">

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Waves size={25} />
          </div>
          <div>
            <h2>COAST NEXUS</h2>
            <span>INTELLIGENT LOGISTICS</span>
          </div>
        </div>

        <div className="sidebar-label">MAIN MENU</div>

        <nav className="sidebar-section">
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
        </nav>

        <div className="sidebar-bottom">
          <div className="system-status">
            <span className="status-dot"></span>
            <span>{loadError ? 'Backend unavailable' : 'CoastNexus system'}</span>
          </div>
        </div>
      </aside>

      <main className="main-content">

        <header className="topbar">
          <div className="topbar-title">
            <p className="breadcrumb">
              COAST NEXUS / {activePage.toUpperCase()}
            </p>
            <h1>{activePage === 'Overview' ? 'Command Center' : activePage}</h1>
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

        {loadError && <p className="err" role="alert">{loadError}</p>}

        {activePage === 'Network Map' && (
          <section className="network-page">
            <div className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Coastal digital twin and route recovery</h3>
                  <p>Live port and route data from the CoastNexus backend</p>
                </div>
                <Map size={21} />
              </div>

              <div className="network-controls">
                <div>
                  <span className="control-label">Disruption scenario</span>
                  <div className="seg">
                    {Object.entries(SCENARIOS).map(([key, item]) => (
                      <button
                        key={key}
                        className={scenario === key ? 'on' : ''}
                        onClick={() => pickScenario(key)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <p className="mu small">{closedCount} closed · {degradedCount} degraded</p>
                </div>
                <label>
                  Origin
                  {portSelect(origin, setOrigin)}
                </label>
                <label>
                  Destination
                  {portSelect(dest, setDest)}
                </label>
              </div>

              <div className="network-map-wrap">
                {ports.length > 0 && (
                  <MapView
                    ports={ports}
                    routes={routes}
                    status={status}
                    route={route}
                    origin={origin}
                    dest={dest}
                    selected={selected}
                    cyclone={SCENARIOS[scenario].cyclone}
                    onSelect={setSelected}
                  />
                )}
              </div>
              <div className="network-legend">
                <span><i className="operational" /> Operational</span>
                <span><i className="degraded" /> Degraded</span>
                <span><i className="closed" /> Closed</span>
                <span><i className="route-line" /> Rebuilt route</span>
              </div>

              {selectedNode && (
                <div className="network-details">
                  <div>
                    <strong>{selectedNode.name}</strong>
                    <span className="mono mu"> {selectedNode.id}</span>
                    <p className="mu small">
                      {selectedNode.type === 'hub' ? 'Inland / cold hub' : 'Port'} ·
                      {' '}utilisation {UTIL[selectedNode.id] ?? '--'}%
                    </p>
                  </div>
                  <div className="seg three">
                    {['operational', 'degraded', 'closed'].map((value) => (
                      <button
                        key={value}
                        className={`${value} ${selectedStatus === value ? 'on' : ''}`}
                        onClick={() => setNodeStatus(selectedNode.id, value)}
                      >
                        {value === 'operational' ? 'Operational' : value}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="route-summary">
                <h3>AI rebuilt route</h3>
                {error && <p className="err" role="alert">{error}</p>}
                {route && (
                  <>
                    <p className="chain">{route.path.map(portName).join(' → ')}</p>
                    <div className="stats">
                      <div><small>Time</small><b>{route.hours.toFixed(1)} h</b></div>
                      <div><small>Cost</small><b>${route.cost.toLocaleString()}</b></div>
                      <div><small>CO₂</small><b>{route.co2_kg.toLocaleString()} kg</b></div>
                    </div>
                    {delay !== null && (
                      <p className={delay > 0 ? 'warn' : 'mu'}>
                        {delay > 0
                          ? `+${delay.toFixed(1)} h vs normal route (${base.hours.toFixed(1)} h)`
                          : 'Same as the normal route'}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {activePage === 'Disruption Simulator' && <DisruptionSimulator />}

        {/* OVERVIEW */}
        {activePage === 'Overview' && (
          <>
            <section className="welcome">
              <div>
                <p className="welcome-tag">COASTAL INTELLIGENCE PLATFORM</p>
                <h2>Welcome to Coast Nexus</h2>
                <p>
                  Monitor coastal logistics, predict disruptions and
                  discover smarter recovery strategies.
                </p>
              </div>
              <div className="welcome-icon"><Waves size={54} /></div>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon blue"><Ship size={22} /></div>
                <p>Ports Monitored</p>
                <h2>{ports.length || '—'}</h2>
                <span>{routes.length} connected routes</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange"><AlertTriangle size={22} /></div>
                <p>Active Risk Alerts</p>
                <h2>{activeAlerts}</h2>
                <span>Current overall risk: {overallRisk}</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon green"><Boxes size={22} /></div>
                <p>Cargo Under Monitoring</p>
                <h2>{cargoUnits.toLocaleString('en-IN')}</h2>
                <span>Illustrative cargo units</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple"><Activity size={22} /></div>
                <p>Network Efficiency</p>
                <h2>87%</h2>
                <span>Simulated performance score</span>
              </div>
            </section>

            <section className="content-grid">
              <div className="panel map-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Coastal Network Overview</h3>
                    <p>Illustrative coastal logistics network</p>
                  </div>
                  <Map size={21} />
                </div>
                <div className="map-area">
                  <div className="map-watermark">INDIAN COAST</div>
                  <div className="map-line"></div>
                  <div className="map-point point-one"><span></span><label>Mangaluru</label></div>
                  <div className="map-point point-two"><span></span><label>Goa</label></div>
                  <div className="map-point point-three"><span></span><label>Mumbai</label></div>
                  <div className="map-point point-four"><span></span><label>Kochi</label></div>
                  <div className="map-point point-five"><span></span><label>Chennai</label></div>
                </div>
              </div>

              <div className="panel alerts-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Recent Risk Alerts</h3>
                    <p>Illustrative system alerts</p>
                  </div>
                  <Bell size={20} />
                </div>
                <div className="alert-item">
                  <div className="alert-symbol danger"><CloudRain size={19} /></div>
                  <div><h4>Weather Disruption</h4><p>High weather risk near Mangaluru</p></div>
                  <span className="risk-high">HIGH</span>
                </div>
                <div className="alert-item">
                  <div className="alert-symbol warning"><Ship size={19} /></div>
                  <div><h4>Port Congestion</h4><p>Increased congestion at Mumbai</p></div>
                  <span className="risk-medium">MEDIUM</span>
                </div>
                <div className="alert-item">
                  <div className="alert-symbol info"><Wind size={19} /></div>
                  <div><h4>Transport Delay</h4><p>Possible cargo movement delay</p></div>
                  <span className="risk-medium">MEDIUM</span>
                </div>
              </div>
            </section>

            <section className="content-grid">
              <div className="panel">
                <div className="panel-heading">
                  <div><h3>Cargo Movement Analysis</h3><p>Illustrative cargo volume by port</p></div>
                  <BarChart3 size={21} />
                </div>
                <div className="chart-area">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={cargoData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#263b4e" />
                      <XAxis dataKey="name" stroke="#9aafc0" />
                      <YAxis stroke="#9aafc0" />
                      <Tooltip />
                      <Bar dataKey="cargo" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="panel recommendation-panel">
                <div className="panel-heading">
                  <div><h3>AI Recovery Insight</h3><p>Illustrative recommendation</p></div>
                  <BrainCircuit size={21} />
                </div>
                <div className="recommendation-icon"><Zap size={28} /></div>
                <h3>Consider Alternative Routing</h3>
                <p>
                  If congestion increases at the primary port,
                  consider shifting suitable cargo to {selectedPort}.
                </p>
                <div className="recommendation-footer">
                  <ShieldCheck size={17} /><span>Prototype recommendation</span>
                </div>
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Connected Intelligence Network</h3>
                  <p>Shared example estimates and direct access to each core module.</p>
                </div>
                <Zap size={21} />
              </div>
              <div className="module-links">
                {[
                  ['CarbonLens AI', `Lowest emission estimate: ${bestTransport.name}`],
                  ['FuturePort AI', `${expectedDelayHours} hours predicted delay`],
                  ['ImpactVision AI', `Current impact estimate: ₹${financialImpact.toLocaleString('en-IN')}`],
                  ['TideGuard AI', `Current coastal risk: ${coastalRisk}`],
                  ['PortGenesis AI', `${selectedPort} selected as alternative`],
                ].map(([module, summary]) => (
                  <div className="module-shortcut" key={module}>
                    <strong>{module}</strong>
                    <span>{summary}</span>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => openModule(module)}
                    >
                      Open module <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="recommendation">
                <ShieldCheck size={22} />
                <div>
                  <strong>Network Intelligence Recommendation</strong>
                  <p>
                    {overallRisk === 'High'
                      ? `Elevated operational risk. Review conditions at ${selectedPort} and verify official coastal advisories.`
                      : overallRisk === 'Moderate'
                        ? `Moderate network risk. Monitor conditions at ${selectedPort} and prepare alternative cargo arrangements.`
                        : `Current entered conditions indicate relatively low risk. Continue monitoring and consider ${bestTransport.name} for the lowest illustrative emission estimate.`}
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {/* FUTUREPORT AI */}
        {activePage === 'FuturePort AI' && (
          <>
            <section className="welcome">
              <div>
                <p className="welcome-tag">PREDICTIVE PORT INTELLIGENCE</p>
                <h2>FuturePort AI</h2>
                <p>
                  Identify potential port congestion and weather
                  disruptions before they affect cargo movement.
                </p>
              </div>
              <div className="welcome-icon"><BrainCircuit size={54} /></div>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon orange"><Ship size={22} /></div>
                <p>Port Congestion</p><h2>{portCongestion}%</h2>
                <span>{congestionLabel} congestion level</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple"><CloudRain size={22} /></div>
                <p>Weather Risk</p><h2>{weatherRisk.toUpperCase()}</h2>
                <span>Selected scenario input</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon blue"><Clock size={22} /></div>
                <p>Estimated Delay</p><h2>{expectedDelayHours} Hrs</h2>
                <span>Illustrative scenario estimate</span>
              </div>
            </section>

            <section className="panel module-controls">
              <div className="panel-heading">
                <div><h3>Adjust forecast inputs</h3><p>Changes update the shared scenario estimates.</p></div>
                <BrainCircuit size={21} />
              </div>
              <label>
                Port capacity utilization: {portCongestion}%
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={portCongestion}
                  onChange={(event) => setPortCongestion(Number(event.target.value))}
                />
              </label>
              <label>
                Weather risk
                <select value={weatherRisk} onChange={(event) => setWeatherRisk(event.target.value)}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </label>
              <div className="recommendation">
                <ShieldCheck size={22} />
                <div>
                  <strong>Connected Recommendation</strong>
                  <p>
                    {congestionLabel === 'High' || weatherRisk === 'High' || coastalRisk === 'High'
                      ? `Elevated operational risk. Review ${selectedPort} as an alternative and verify official conditions before moving cargo.`
                      : congestionLabel === 'Moderate' || coastalRisk === 'Moderate'
                        ? `Monitor berth utilization and coastal conditions. Keep ${selectedPort} available as an alternative.`
                        : 'Entered conditions are relatively low risk. Continue routine monitoring.'}
                  </p>
                </div>
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div><h3>Port Risk Monitoring</h3><p>Illustrative risk assessment across ports</p></div>
                <Activity size={21} />
              </div>
              {[
                ['Mangaluru', 'High', 'risk-high'],
                ['Kochi', 'Medium', 'risk-medium'],
                ['Mumbai', 'Low', 'risk-low'],
                ['Goa', 'Medium', 'risk-medium'],
                ['Chennai', 'Low', 'risk-low'],
              ].map(([port, risk, className]) => (
                <div className="alert-item" key={port}>
                  <div className="alert-symbol info"><Anchor size={19} /></div>
                  <div><h4>{port} Port</h4><p>Simulated disruption assessment</p></div>
                  <span className={className}>{risk.toUpperCase()}</span>
                </div>
              ))}
            </section>
          </>
        )}

        {/* PORTGENESIS AI */}
        {activePage === 'PortGenesis AI' && (
          <>
            <section className="welcome">
              <div>
                <p className="welcome-tag">SMART PORT OPTIMIZATION</p>
                <h2>PortGenesis AI</h2>
                <p>Smart port performance and capacity analysis.</p>
              </div>
              <div className="welcome-icon"><Anchor size={54} /></div>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon green"><Activity size={22} /></div>
                <p>Port Efficiency</p><h2>89%</h2>
                <span>Illustrative efficiency score</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon blue"><Boxes size={22} /></div>
                <p>Cargo Capacity</p><h2>82%</h2>
                <span>Simulated capacity utilization</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple"><Ship size={22} /></div>
                <p>Best Alternative</p><h2>{selectedPort}</h2>
                <span>Selected PortGenesis alternative</span>
              </div>
            </section>

            <section className="panel module-controls">
              <div className="panel-heading">
                <div><h3>Alternative Port Selection</h3><p>This selection is shared with the module recommendations.</p></div>
                <Anchor size={21} />
              </div>
              <label>
                Choose alternative port
                <select value={selectedPort} onChange={(event) => setSelectedPort(event.target.value)}>
                  <option>Kochi</option>
                  <option>Mumbai</option>
                  <option>Mangaluru</option>
                  <option>Goa</option>
                  <option>Chennai</option>
                </select>
              </label>
              <p className="mu small">{selectedPort} is selected as the proposed alternative.</p>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div><h3>Port Performance Comparison</h3><p>Illustrative port efficiency scores</p></div>
                <BarChart3 size={21} />
              </div>
              {portPerformance.map((port) => (
                <div className="performance-row" key={port.name}>
                  <span>{port.name}</span>
                  <div className="performance-track">
                    <div className="performance-fill" style={{ width: `${port.score}%` }}></div>
                  </div>
                  <strong>{port.score}%</strong>
                </div>
              ))}
            </section>
          </>
        )}

        {/* IMPACTVISION AI */}
        {activePage === 'ImpactVision AI' && (
          <>
            <section className="welcome">
              <div>
                <p className="welcome-tag">DISRUPTION IMPACT ANALYTICS</p>
                <h2>ImpactVision AI</h2>
                <p>
                  Understand the financial and operational impact
                  of coastal supply-chain disruptions.
                </p>
              </div>
              <div className="welcome-icon"><TrendingDown size={54} /></div>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon orange"><DollarSign size={22} /></div>
                <p>Estimated Financial Loss</p><h2>₹{financialImpact.toLocaleString('en-IN')}</h2>
                <span>Illustrative disruption estimate</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon blue"><Clock size={22} /></div>
                <p>Cargo Delay Impact</p><h2>{delayHours} Hrs</h2>
                <span>Simulated delay duration</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple"><AlertTriangle size={22} /></div>
                <p>Disruption Severity</p><h2>{overallRisk.toUpperCase()}</h2>
                <span>Illustrative severity level</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon green"><Truck size={22} /></div>
                <p>Recovery Cost</p><h2>₹{recoveryCost.toLocaleString('en-IN')}</h2>
                <span>Simulated recovery estimate</span>
              </div>
            </section>

            <section className="panel module-controls">
              <div className="panel-heading">
                <div><h3>Impact scenario inputs</h3><p>Estimate impact from delay and cargo value.</p></div>
                <TrendingDown size={21} />
              </div>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setDelayHours(expectedDelayHours)}
              >
                Use FuturePort predicted delay ({expectedDelayHours} hours)
              </button>
              <label>
                Delay duration (hours)
                <input
                  type="number"
                  min="0"
                  max="720"
                  value={delayHours}
                  onChange={(event) => setDelayHours(Math.min(720, Math.max(0, Number(event.target.value) || 0)))}
                />
              </label>
              <label>
                Cargo value (₹)
                <input
                  type="number"
                  min="0"
                  value={cargoValue}
                  onChange={(event) => setCargoValue(Math.max(0, Number(event.target.value) || 0))}
                />
              </label>
              <p className="mu small">
                Current selected alternative port: {selectedPort}. Values are illustrative estimates.
              </p>
            </section>

            <section className="content-grid">
              <div className="panel">
                <div className="panel-heading">
                  <div><h3>Disruption Cost Breakdown</h3><p>Illustrative share of total impact</p></div>
                  <BarChart3 size={21} />
                </div>
                <div className="chart-area">
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={impactData} dataKey="amount" nameKey="name" cx="50%" cy="50%" outerRadius={95} label>
                        {impactData.map((entry, index) => (
                          <Cell key={entry.name} fill={impactColors[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="impact-legend">
                  {impactData.map((item, index) => (
                    <div className="legend-item" key={item.name}>
                      <span className="legend-dot" style={{ background: impactColors[index] }}></span>
                      <span>{item.name}</span><strong>{item.amount}%</strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="panel-heading">
                  <div><h3>Disruption Impact Analysis</h3><p>Example scenario: port congestion</p></div>
                  <AlertTriangle size={21} />
                </div>
                <div className="impact-detail">
                  <div className="impact-detail-icon"><Ship size={21} /></div>
                  <div><h4>Port Congestion</h4><p>Possible interruption to cargo handling</p></div>
                </div>
                <div className="impact-detail">
                  <div className="impact-detail-icon"><Clock size={21} /></div>
                  <div><h4>Delivery Delay</h4><p>Estimated delay of {delayHours} hours</p></div>
                </div>
                <div className="impact-detail">
                  <div className="impact-detail-icon"><DollarSign size={21} /></div>
                  <div><h4>Financial Impact</h4><p>Estimated loss of ₹{financialImpact.toLocaleString('en-IN')}</p></div>
                </div>
                <div className="recommendation-box">
                  <div className="recommendation-icon"><BrainCircuit size={25} /></div>
                  <h3>Suggested Recovery Action</h3>
                  <p>
                    Evaluate alternative port routing and cargo
                    redistribution to reduce delays and recovery costs.
                  </p>
                  <span><ShieldCheck size={16} />Illustrative AI recommendation</span>
                </div>
              </div>
            </section>
            <p className="prototype-note">
              All financial figures, percentages and impact estimates are
              simulated for the hackathon prototype. They are not live
              predictions or actual port financial data.
            </p>
          </>
        )}

        {/* TRADETWIN AI */}
        {activePage === 'TradeTwin AI' && (
          <>
            <section className="welcome">
              <div>
                <p className="welcome-tag">INTELLIGENT CARGO REDISTRIBUTION</p>
                <h2>TradeTwin AI</h2>
                <p>
                  Compare alternative routes and redistribute cargo
                  to reduce supply-chain disruption.
                </p>
              </div>
              <div className="welcome-icon"><Network size={54} /></div>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon orange"><PackageCheck size={22} /></div>
                <p>Cargo to Redirect</p>
                <h2>250</h2>
                <span>Simulated cargo units</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon green"><Clock size={22} /></div>
                <p>Estimated Time Saved</p>
                <h2>8 Hrs</h2>
                <span>Illustrative time saving</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon blue"><Route size={22} /></div>
                <p>Recommended Port</p>
                <h2>Kochi</h2>
                <span>Illustrative alternative port</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple"><Truck size={22} /></div>
                <p>Route Efficiency</p>
                <h2>44%</h2>
                <span>Illustrative improvement</span>
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Smart Cargo Redistribution</h3>
                  <p>Example scenario: Mangaluru port disruption</p>
                </div>
                <Network size={21} />
              </div>

              <div className="route-comparison">
                <div className="route-port">
                  <div className="route-port-icon"><Ship size={25} /></div>
                  <p>ORIGINAL PORT</p>
                  <h3>Mangaluru</h3>
                  <span className="risk-high">HIGH RISK</span>
                </div>

                <div className="route-arrow">
                  <ArrowRight size={30} />
                  <span>Redirect Cargo</span>
                </div>

                <div className="route-port">
                  <div className="route-port-icon"><Anchor size={25} /></div>
                  <p>ALTERNATIVE PORT</p>
                  <h3>Kochi</h3>
                  <span className="risk-low">LOWER RISK</span>
                </div>
              </div>
            </section>

            <section className="content-grid">
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h3>Route Time Comparison</h3>
                    <p>Illustrative estimated travel duration</p>
                  </div>
                  <Clock size={21} />
                </div>

                <div className="chart-area">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={routeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#263b4e" />
                      <XAxis dataKey="name" stroke="#9aafc0" />
                      <YAxis stroke="#9aafc0" />
                      <Tooltip />
                      <Bar dataKey="hours" name="Travel hours" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h3>AI Redistribution Plan</h3>
                    <p>Illustrative recovery recommendation</p>
                  </div>
                  <BrainCircuit size={21} />
                </div>

                <div className="impact-detail">
                  <div className="impact-detail-icon"><Boxes size={21} /></div>
                  <div><h4>Identify Cargo</h4><p>Select 250 suitable cargo units for redirection</p></div>
                </div>
                <div className="impact-detail">
                  <div className="impact-detail-icon"><Route size={21} /></div>
                  <div><h4>Choose Alternative</h4><p>Evaluate Kochi as an alternative port</p></div>
                </div>
                <div className="impact-detail">
                  <div className="impact-detail-icon"><Clock size={21} /></div>
                  <div><h4>Reduce Delays</h4><p>Potentially save 8 hours in this scenario</p></div>
                </div>

                <div className="recommendation-box">
                  <div className="recommendation-icon"><Zap size={25} /></div>
                  <h3>Recommended Action</h3>
                  <p>
                    Consider redirecting suitable cargo from Mangaluru
                    to Kochi, subject to capacity and transport availability.
                  </p>
                  <span><ShieldCheck size={16} />Illustrative AI recommendation</span>
                </div>
              </div>
            </section>

            <p className="prototype-note">
              Cargo quantities, route durations, risk levels and estimated
              savings are simulated for the hackathon prototype. No live
              port or transport data is currently connected.
            </p>
          </>
        )}

        {/* CARGOMORPH AI */}
        {activePage === 'CargoMorph AI' && (
          <>
            <section className="welcome">
              <div>
                <p className="welcome-tag">SMART CARGO TRANSFORMATION</p>
                <h2>CargoMorph AI</h2>
                <p>
                  Adapt cargo distribution during disruptions by identifying
                  suitable alternative ports and transport options.
                </p>
              </div>
              <div className="welcome-icon"><PackageCheck size={54} /></div>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon orange"><Boxes size={22} /></div>
                <p>Cargo Identified</p><h2>420</h2>
                <span>Simulated cargo units</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon green"><Truck size={22} /></div>
                <p>Cargo Reallocated</p><h2>250</h2>
                <span>Illustrative redistribution</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon blue"><Anchor size={22} /></div>
                <p>Suggested Destination</p><h2>Kochi</h2>
                <span>Illustrative alternative port</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple"><Clock size={22} /></div>
                <p>Potential Delay Reduction</p><h2>8 Hrs</h2>
                <span>Simulated time saving</span>
              </div>
            </section>

            <section className="content-grid">
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h3>Cargo Distribution by Port</h3>
                    <p>Illustrative cargo allocation</p>
                  </div>
                  <BarChart3 size={21} />
                </div>
                <div className="chart-area">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={cargoMorphData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#263b4e" />
                      <XAxis dataKey="name" stroke="#9aafc0" />
                      <YAxis stroke="#9aafc0" />
                      <Tooltip />
                      <Bar dataKey="cargo" name="Cargo units" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h3>Cargo Transformation Plan</h3>
                    <p>Example disruption recovery scenario</p>
                  </div>
                  <BrainCircuit size={21} />
                </div>
                <div className="impact-detail">
                  <div className="impact-detail-icon"><AlertTriangle size={21} /></div>
                  <div><h4>Detect Disruption</h4><p>Identify cargo affected by port congestion</p></div>
                </div>
                <div className="impact-detail">
                  <div className="impact-detail-icon"><Boxes size={21} /></div>
                  <div><h4>Classify Cargo</h4><p>Identify suitable cargo for redistribution</p></div>
                </div>
                <div className="impact-detail">
                  <div className="impact-detail-icon"><Route size={21} /></div>
                  <div><h4>Reassign Destination</h4><p>Evaluate Kochi as an alternative port</p></div>
                </div>
                <div className="recommendation-box">
                  <div className="recommendation-icon"><Zap size={25} /></div>
                  <h3>Suggested Cargo Action</h3>
                  <p>Consider reallocating 250 suitable cargo units to Kochi after checking capacity and transport availability.</p>
                  <span><ShieldCheck size={16} />Illustrative AI recommendation</span>
                </div>
              </div>
            </section>
            <p className="prototype-note">
              Cargo quantities and redistribution suggestions are simulated
              for this prototype. No live cargo manifest is connected.
            </p>
          </>
        )}

        {/* COASTGENESIS AI */}
        {activePage === 'CoastGenesis AI' && (
          <>
            <section className="welcome">
              <div>
                <p className="welcome-tag">COASTAL NETWORK PLANNING</p>
                <h2>CoastGenesis AI</h2>
                <p>
                  Build smarter coastal logistics strategies by analysing
                  port connectivity, capacity and possible disruption scenarios.
                </p>
              </div>
              <div className="welcome-icon"><Waves size={54} /></div>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon blue"><Anchor size={22} /></div>
                <p>Ports Analysed</p><h2>05</h2>
                <span>Illustrative coastal network</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon green"><Network size={22} /></div>
                <p>Network Connectivity</p><h2>88%</h2>
                <span>Simulated connectivity score</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple"><Route size={22} /></div>
                <p>Alternative Routes</p><h2>12</h2>
                <span>Illustrative route options</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange"><ShieldCheck size={22} /></div>
                <p>Network Resilience</p><h2>84%</h2>
                <span>Simulated resilience score</span>
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Coastal Network Planning</h3>
                  <p>Illustrative port connectivity assessment</p>
                </div>
                <Network size={21} />
              </div>
              {[
                ['Mangaluru', 'Kochi', 'Primary coastal connection'],
                ['Kochi', 'Goa', 'Alternative cargo connection'],
                ['Goa', 'Mumbai', 'Western coastal connection'],
                ['Mumbai', 'Chennai', 'Extended network connection'],
              ].map(([from, to, description]) => (
                <div className="alert-item" key={from + to}>
                  <div className="alert-symbol info"><Route size={19} /></div>
                  <div>
                    <h4>{from} → {to}</h4>
                    <p>{description}</p>
                  </div>
                  <span className="risk-low">PLANNED</span>
                </div>
              ))}
            </section>

            <section className="content-grid">
              <div className="panel">
                <div className="panel-heading">
                  <div><h3>Port Efficiency</h3><p>Illustrative network scores</p></div>
                  <BarChart3 size={21} />
                </div>
                {portPerformance.map((port) => (
                  <div className="performance-row" key={port.name}>
                    <span>{port.name}</span>
                    <div className="performance-track">
                      <div className="performance-fill" style={{ width: `${port.score}%` }}></div>
                    </div>
                    <strong>{port.score}%</strong>
                  </div>
                ))}
              </div>

              <div className="panel recommendation-panel">
                <div className="panel-heading">
                  <div><h3>Network Recovery Strategy</h3><p>Illustrative AI recommendation</p></div>
                  <BrainCircuit size={21} />
                </div>
                <div className="recommendation-icon"><Zap size={28} /></div>
                <h3>Build a Resilient Coastal Network</h3>
                <p>
                  Evaluate alternative ports and connected transport routes
                  so cargo can continue moving during local disruptions.
                </p>
                <div className="recommendation-footer">
                  <ShieldCheck size={17} /><span>Prototype recommendation</span>
                </div>
              </div>
            </section>
            <p className="prototype-note">
              Network scores and route assessments are illustrative
              prototype values, not live port connectivity data.
            </p>
          </>
        )}

        {/* CARBONLENS AI */}
        {activePage === 'CarbonLens AI' && (
          <>
            <section className="welcome">
              <div>
                <p className="welcome-tag">SUSTAINABLE LOGISTICS INTELLIGENCE</p>
                <h2>CarbonLens AI</h2>
                <p>
                  Estimate transport-related carbon emissions and explore
                  lower-emission alternatives for coastal cargo movement.
                </p>
              </div>
              <div className="welcome-icon"><Leaf size={54} /></div>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon green"><Leaf size={22} /></div>
                <p>Estimated Emissions</p>
                <h2>{(roadEmission + seaEmission + railEmission).toLocaleString('en-IN')} kg</h2>
                <span>Illustrative transport index</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange"><Truck size={22} /></div>
                <p>Road Transport Share</p><h2>{roadEmission.toLocaleString('en-IN')} kg</h2>
                <span>Illustrative estimate</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon blue"><Ship size={22} /></div>
                <p>Sea Transport Share</p><h2>{seaEmission.toLocaleString('en-IN')} kg</h2>
                <span>Illustrative estimate</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple"><Recycle size={22} /></div>
                <p>Potential Reduction</p><h2>20%</h2>
                <span>Illustrative reduction target</span>
              </div>
            </section>

            <section className="panel module-controls">
              <div className="panel-heading">
                <div><h3>Transport Emission Calculator</h3><p>Enter cargo quantity and distance for each mode.</p></div>
                <Recycle size={21} />
              </div>
              <label>
                Cargo units
                <input
                  type="number"
                  min="1"
                  value={cargoUnits}
                  onChange={(event) => setCargoUnits(Math.max(1, Number(event.target.value) || 1))}
                />
              </label>
              <label>
                Road distance (km)
                <input
                  type="number"
                  min="1"
                  value={roadKm}
                  onChange={(event) => setRoadKm(Math.max(1, Number(event.target.value) || 1))}
                />
              </label>
              <label>
                Sea distance (km)
                <input
                  type="number"
                  min="1"
                  value={seaKm}
                  onChange={(event) => setSeaKm(Math.max(1, Number(event.target.value) || 1))}
                />
              </label>
              <label>
                Rail distance (km)
                <input
                  type="number"
                  min="1"
                  value={railKm}
                  onChange={(event) => setRailKm(Math.max(1, Number(event.target.value) || 1))}
                />
              </label>
              <p className="mu small">
                Lowest illustrative estimate: {bestTransport.name} ({bestTransport.value.toLocaleString('en-IN')} units).
                Factors are examples, not verified emission factors.
              </p>
            </section>

            <section className="content-grid">
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h3>Transport Emission Comparison</h3>
                    <p>Illustrative CO₂ equivalent by transport mode</p>
                  </div>
                  <BarChart3 size={21} />
                </div>
                <div className="chart-area">
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={carbonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#263b4e" />
                      <XAxis dataKey="name" stroke="#9aafc0" />
                      <YAxis stroke="#9aafc0" />
                      <Tooltip />
                      <Bar dataKey="emission" name="Emission estimate (tonnes)" fill="#34d399" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="panel">
                <div className="panel-heading">
                  <div><h3>Green Logistics Suggestions</h3><p>Illustrative sustainability actions</p></div>
                  <Leaf size={21} />
                </div>
                <div className="impact-detail">
                  <div className="impact-detail-icon"><Ship size={21} /></div>
                  <div><h4>Prefer Efficient Sea Routes</h4><p>Evaluate suitable sea transport options</p></div>
                </div>
                <div className="impact-detail">
                  <div className="impact-detail-icon"><Truck size={21} /></div>
                  <div><h4>Optimize Road Distance</h4><p>Reduce unnecessary truck travel</p></div>
                </div>
                <div className="impact-detail">
                  <div className="impact-detail-icon"><Recycle size={21} /></div>
                  <div><h4>Improve Load Utilization</h4><p>Explore better cargo consolidation</p></div>
                </div>
                <div className="recommendation-box">
                  <div className="recommendation-icon"><Leaf size={25} /></div>
                  <h3>Suggested Green Action</h3>
                  <p>Compare route emissions and consider lower-emission transport combinations where practical.</p>
                  <span><ShieldCheck size={16} />Illustrative sustainability recommendation</span>
                </div>
              </div>
            </section>
            <p className="prototype-note">
              Emission values are simulated examples for demonstration.
              Actual carbon estimates require real distances, cargo weights,
              fuel use and transport-specific emission factors.
            </p>
          </>
        )}

        {/* TIDEGUARD AI */}
        {activePage === 'TideGuard AI' && (
          <>
            <section className="welcome">
              <div>
                <p className="welcome-tag">COASTAL ENVIRONMENTAL RISK MONITORING</p>
                <h2>TideGuard AI</h2>
                <p>
                  Monitor illustrative tide, rainfall and coastal weather
                  conditions to identify possible logistics disruptions.
                </p>
              </div>
              <div className="welcome-icon"><CloudLightning size={54} /></div>
            </section>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon blue"><Waves size={22} /></div>
                <p>Tide Level</p><h2>{tideLevel} m</h2>
                <span>Simulated water level</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange"><Wind size={22} /></div>
                <p>Wind Speed</p><h2>{windSpeed} km/h</h2>
                <span>Illustrative wind reading</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple"><CloudRain size={22} /></div>
                <p>Coastal Risk</p><h2>{coastalRisk.toUpperCase()}</h2>
                <span>Simulated risk level</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon green"><ShieldCheck size={22} /></div>
                <p>Rainfall</p><h2>{rainfall} mm</h2>
                <span>Illustrative reading</span>
              </div>
            </section>

            <section className="panel module-controls">
              <div className="panel-heading">
                <div><h3>Coastal conditions input</h3><p>Update example values to recalculate the local risk category.</p></div>
                <CloudLightning size={21} />
              </div>
              <label>
                Tide level (m)
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={tideLevel}
                  onChange={(event) => setTideLevel(Math.min(10, Math.max(0, Number(event.target.value) || 0)))}
                />
              </label>
              <label>
                Wind speed (km/h)
                <input
                  type="number"
                  min="0"
                  max="200"
                  value={windSpeed}
                  onChange={(event) => setWindSpeed(Math.min(200, Math.max(0, Number(event.target.value) || 0)))}
                />
              </label>
              <label>
                Rainfall (mm)
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={rainfall}
                  onChange={(event) => setRainfall(Math.min(500, Math.max(0, Number(event.target.value) || 0)))}
                />
              </label>
              <div className="recommendation">
                <CloudLightning size={22} />
                <div>
                  <strong>Safety Guidance</strong>
                  <p>
                    {coastalRisk === 'High'
                      ? 'High illustrative risk: review coastal operations and verify official marine and weather advisories.'
                      : coastalRisk === 'Moderate'
                        ? 'Moderate illustrative risk: monitor conditions and review port-side safety procedures.'
                        : 'Low illustrative risk from entered values: continue routine monitoring and follow official advisories.'}
                  </p>
                </div>
              </div>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <h3>Coastal Risk Monitoring</h3>
                  <p>Illustrative environmental conditions by location</p>
                </div>
                <Activity size={21} />
              </div>
              {[
                ['Mangaluru', 'High', 'risk-high', 'Possible coastal weather disruption'],
                ['Kochi', 'Medium', 'risk-medium', 'Moderate rainfall scenario'],
                ['Goa', 'Low', 'risk-low', 'Lower illustrative disruption risk'],
                ['Mumbai', 'Medium', 'risk-medium', 'Monitor wind and sea conditions'],
              ].map(([place, risk, className, description]) => (
                <div className="alert-item" key={place}>
                  <div className="alert-symbol info"><Waves size={19} /></div>
                  <div><h4>{place} Coast</h4><p>{description}</p></div>
                  <span className={className}>{risk.toUpperCase()}</span>
                </div>
              ))}
            </section>

            <section className="content-grid">
              <div className="panel">
                <div className="panel-heading">
                  <div><h3>Coastal Safety Indicators</h3><p>Example monitoring parameters</p></div>
                  <Gauge size={21} />
                </div>
                <div className="impact-detail">
                  <div className="impact-detail-icon"><Waves size={21} /></div>
                  <div><h4>Tide Monitoring</h4><p>Track changing water levels near port areas</p></div>
                </div>
                <div className="impact-detail">
                  <div className="impact-detail-icon"><Wind size={21} /></div>
                  <div><h4>Wind Monitoring</h4><p>Identify conditions that may affect vessel movement</p></div>
                </div>
                <div className="impact-detail">
                  <div className="impact-detail-icon"><CloudRain size={21} /></div>
                  <div><h4>Rainfall Monitoring</h4><p>Assess possible weather-related cargo delays</p></div>
                </div>
              </div>

              <div className="panel recommendation-panel">
                <div className="panel-heading">
                  <div><h3>Coastal Risk Response</h3><p>Illustrative AI recommendation</p></div>
                  <BrainCircuit size={21} />
                </div>
                <div className="recommendation-icon"><AlertTriangle size={28} /></div>
                <h3>Monitor High-Risk Coastal Areas</h3>
                <p>
                  If adverse conditions are confirmed, review vessel schedules,
                  cargo handling plans and alternative port options.
                </p>
                <div className="recommendation-footer">
                  <ShieldCheck size={17} /><span>Prototype recommendation</span>
                </div>
              </div>
            </section>
            <p className="prototype-note">
              Tide, wind, rainfall and risk values are simulated examples.
              This prototype is not connected to live weather, tide or
              marine warning services.
            </p>
          </>
        )}

        <footer className="app-footer">
          COAST NEXUS • INTELLIGENT COASTAL SUPPLY CHAIN COMMAND CENTER
        </footer>
      </main>
    </div>
  );
}

export default App
