
import DisruptionSimulator from './DisruptionSimulator'
import { useState } from 'react'
import {
  Anchor, Activity, AlertTriangle, BarChart3, Bell, Boxes,
  BrainCircuit, CloudRain, LayoutDashboard, Map, Network,
  Search, Settings, ShieldCheck, Ship, Waves, Wind, Zap,
  TrendingDown, DollarSign, Clock, Truck, ArrowRight,
  Route, PackageCheck, Leaf, Container, Droplets, Gauge,
  Recycle, Thermometer, CloudLightning
} from 'lucide-react'

import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, PieChart, Pie, Cell
} from 'recharts'

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
  { name: 'FuturePort AI', icon: BrainCircuit },
  { name: 'PortGenesis AI', icon: Anchor },
  { name: 'ImpactVision AI', icon: BarChart3 },
  { name: 'TradeTwin AI', icon: Network },
  { name: 'CargoMorph AI', icon: PackageCheck },
  { name: 'CoastGenesis AI', icon: Waves },
  { name: 'CarbonLens AI', icon: Leaf },
  { name: 'TideGuard AI', icon: CloudLightning },
  { name: 'Disruption Simulator', icon: BrainCircuit },
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

const carbonData = [
  { name: 'Road', emission: 80 },
  { name: 'Sea', emission: 35 },
  { name: 'Rail', emission: 25 },
]

function App() {
  const [activePage, setActivePage] = useState('Overview')

  return (
    <div className="dashboard">

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

        <nav className="navigation">
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
          <button className="nav-item">
            <Settings size={19} />
            <span>Settings</span>
          </button>
          <div className="system-status">
            <span className="status-dot"></span>
            <span>Prototype System Online</span>
          </div>
        </div>
      </aside>

      <main className="main-content">

        <header className="topbar">
          <div>
            <p className="breadcrumb">
              COAST NEXUS / {activePage.toUpperCase()}
            </p>
            <h1>
              {activePage === 'Overview' ? 'Command Center' : activePage}
            </h1>
          </div>

          <div className="top-actions">
            <div className="search-box">
              <Search size={17} />
              <span>Search ports, cargo...</span>
            </div>
            <button className="icon-button">
              <Bell size={19} />
            </button>
            <div className="profile">CN</div>
          </div>
        </header>

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
                <h2>05</h2>
                <span>Illustrative network coverage</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange"><AlertTriangle size={22} /></div>
                <p>Active Risk Alerts</p>
                <h2>08</h2>
                <span>Simulated risk notifications</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon green"><Boxes size={22} /></div>
                <p>Cargo Under Monitoring</p>
                <h2>2.4K</h2>
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
                  consider shifting suitable cargo to Kochi.
                </p>
                <div className="recommendation-footer">
                  <ShieldCheck size={17} /><span>Prototype recommendation</span>
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
                <p>Port Congestion</p><h2>72%</h2>
                <span>Simulated congestion score</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple"><CloudRain size={22} /></div>
                <p>Weather Risk</p><h2>HIGH</h2>
                <span>Illustrative risk level</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon blue"><Clock size={22} /></div>
                <p>Estimated Delay</p><h2>6 Hrs</h2>
                <span>Simulated delay estimate</span>
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
                <p>Best Alternative</p><h2>Kochi</h2>
                <span>Illustrative recommendation</span>
              </div>
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
                <p>Estimated Financial Loss</p><h2>₹12.5L</h2>
                <span>Illustrative disruption estimate</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon blue"><Clock size={22} /></div>
                <p>Cargo Delay Impact</p><h2>18 Hrs</h2>
                <span>Simulated delay duration</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple"><AlertTriangle size={22} /></div>
                <p>Disruption Severity</p><h2>HIGH</h2>
                <span>Illustrative severity level</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon green"><Truck size={22} /></div>
                <p>Recovery Cost</p><h2>₹3.2L</h2>
                <span>Simulated recovery estimate</span>
              </div>
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
                  <div><h4>Delivery Delay</h4><p>Estimated delay of 18 hours</p></div>
                </div>
                <div className="impact-detail">
                  <div className="impact-detail-icon"><DollarSign size={21} /></div>
                  <div><h4>Financial Impact</h4><p>Estimated loss of ₹12.5 lakh</p></div>
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
                <p>Estimated Emissions</p><h2>140 t</h2>
                <span>Illustrative CO₂ equivalent</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange"><Truck size={22} /></div>
                <p>Road Transport Share</p><h2>80 t</h2>
                <span>Simulated emission estimate</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon blue"><Ship size={22} /></div>
                <p>Sea Transport Share</p><h2>35 t</h2>
                <span>Simulated emission estimate</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple"><Recycle size={22} /></div>
                <p>Potential Reduction</p><h2>20%</h2>
                <span>Illustrative reduction target</span>
              </div>
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
        {/* DISRUPTION SIMULATOR */}
        {activePage === 'Disruption Simulator' && (
          <DisruptionSimulator />
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
                <p>Tide Level</p><h2>2.4 m</h2>
                <span>Simulated water level</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange"><Wind size={22} /></div>
                <p>Wind Speed</p><h2>38 km/h</h2>
                <span>Illustrative wind reading</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple"><CloudRain size={22} /></div>
                <p>Rainfall Risk</p><h2>MEDIUM</h2>
                <span>Simulated risk level</span>
              </div>
              <div className="stat-card">
                <div className="stat-icon green"><ShieldCheck size={22} /></div>
                <p>Coastal Risk Score</p><h2>68%</h2>
                <span>Illustrative risk score</span>
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

        <footer className="footer">
          COAST NEXUS • INTELLIGENT COASTAL SUPPLY CHAIN COMMAND CENTER
        </footer>
      </main>
    </div>
  )
}

export default App
