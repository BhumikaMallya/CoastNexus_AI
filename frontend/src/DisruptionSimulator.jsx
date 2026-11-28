
import { useState } from 'react'
import {
  BrainCircuit, AlertTriangle, Ship, Package,
  ArrowRight, ShieldCheck, Zap
} from 'lucide-react'

function DisruptionSimulator() {
  const [port, setPort] = useState('Mangaluru')
  const [disruption, setDisruption] = useState('Port Congestion')
  const [cargo, setCargo] = useState('250')
  const [result, setResult] = useState(null)
  const [cargoError, setCargoError] = useState('')

  const analyzeDisruption = () => {
    const quantity = Number(cargo)

    if (
      cargo.trim() === '' ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 10000
    ) {
      setCargoError(
        'Enter a whole number between 1 and 10,000.'
      )
      setResult(null)
      return
    }

    setCargoError('')

    const alternatives = {
      Mangaluru: 'Kochi',
      Kochi: 'Goa',
      Goa: 'Mumbai',
      Mumbai: 'Goa',
      Chennai: 'Kochi'
    }

    const delay = {
      'Port Congestion': 8,
      'Bad Weather': 12,
      'Transport Delay': 6
    }

    const alternative = alternatives[port]
    const estimatedDelay = delay[disruption]

    const newResult = {
      port,
      alternative,
      quantity,
      disruption,
      estimatedDelay,
      action: `Evaluate redirecting ${quantity} cargo units from ${port} to ${alternative}, subject to port capacity and transport availability.`
    }

    setResult(newResult)

    window.dispatchEvent(
      new CustomEvent('coastnexus-scenario-updated', {
        detail: newResult
      })
    )
  }

  const cardStyle = {
    background: '#102438',
    border: '1px solid #263b4e',
    borderRadius: '12px',
    padding: '20px'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '9px',
    color: '#b9cad8',
    fontSize: '14px'
  }

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #38536a',
    background: '#071421',
    color: '#e7f1f8',
    fontSize: '15px',
    outline: 'none'
  }

  return (
    <div style={{ display: 'grid', gap: '22px' }}>
      <section className="welcome">
        <div>
          <p className="welcome-tag">
            INTERACTIVE DISRUPTION ANALYSIS
          </p>
          <h2>Disruption Simulator</h2>
          <p>
            Simulate a coastal supply-chain disruption and
            explore an alternative cargo recovery strategy.
          </p>
        </div>

        <div className="welcome-icon">
          <BrainCircuit size={54} />
        </div>
      </section>

      <section style={cardStyle}>
        <div className="panel-heading">
          <div>
            <h3>Configure Disruption Scenario</h3>
            <p>Enter the example disruption details</p>
          </div>
          <AlertTriangle size={22} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginTop: '22px'
        }}>
          <div>
            <label style={labelStyle}>Affected Port</label>

            <select
              style={inputStyle}
              value={port}
              onChange={(e) => {
                setPort(e.target.value)
                setResult(null)
              }}
            >
              <option>Mangaluru</option>
              <option>Kochi</option>
              <option>Goa</option>
              <option>Mumbai</option>
              <option>Chennai</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Disruption Type</label>

            <select
              style={inputStyle}
              value={disruption}
              onChange={(e) => {
                setDisruption(e.target.value)
                setResult(null)
              }}
            >
              <option>Port Congestion</option>
              <option>Bad Weather</option>
              <option>Transport Delay</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Affected Cargo Units</label>

            <input
              style={{
                ...inputStyle,
                border: cargoError
                  ? '1px solid #ef4444'
                  : inputStyle.border
              }}
              type="number"
              min="1"
              max="10000"
              step="1"
              value={cargo}
              onChange={(e) => {
                setCargo(e.target.value)
                setCargoError('')
                setResult(null)
              }}
              placeholder="Enter cargo quantity"
              aria-invalid={Boolean(cargoError)}
              aria-describedby="cargo-error"
            />

            {cargoError && (
              <p
                id="cargo-error"
                role="alert"
                style={{
                  color: '#f87171',
                  fontSize: '13px',
                  marginTop: '8px'
                }}
              >
                {cargoError}
              </p>
            )}

            <p style={{
              color: '#8da5b8',
              fontSize: '12px',
              marginTop: '7px'
            }}>
              Allowed quantity: 1-10,000 whole units
            </p>
          </div>
        </div>

        <button
          onClick={analyzeDisruption}
          style={{
            marginTop: '24px',
            padding: '13px 22px',
            border: 'none',
            borderRadius: '8px',
            background: '#0ea5e9',
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '15px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '9px'
          }}
        >
          <Zap size={18} />
          Run AI Analysis
        </button>
      </section>

      {result && (
        <>
          <section style={cardStyle}>
            <div className="panel-heading">
              <div>
                <h3>Disruption Analysis Results</h3>
                <p>Simulated scenario assessment</p>
              </div>
              <ShieldCheck size={22} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '15px',
              marginTop: '22px'
            }}>
              <div>
                <p style={labelStyle}>Affected Port</p>
                <h2>{result.port}</h2>
              </div>

              <div>
                <p style={labelStyle}>Disruption</p>
                <h2 style={{ fontSize: '19px' }}>
                  {result.disruption}
                </h2>
              </div>

              <div>
                <p style={labelStyle}>Cargo Affected</p>
                <h2>{result.quantity}</h2>
              </div>

              <div>
                <p style={labelStyle}>Illustrative Delay</p>
                <h2>{result.estimatedDelay} Hrs</h2>
              </div>
            </div>
          </section>

          <section style={cardStyle}>
            <div className="panel-heading">
              <div>
                <h3>Alternative Port Recommendation</h3>
                <p>Illustrative recovery route</p>
              </div>
              <Ship size={22} />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              gap: '20px',
              margin: '28px 0'
            }}>
              <div style={{ textAlign: 'center' }}>
                <Ship size={30} />
                <h3 style={{ marginTop: '10px' }}>
                  {result.port}
                </h3>
                <p style={{ color: '#f59e0b' }}>
                  Affected Port
                </p>
              </div>

              <ArrowRight size={30} color="#38bdf8" />

              <div style={{ textAlign: 'center' }}>
                <Package size={30} />
                <h3 style={{ marginTop: '10px' }}>
                  {result.alternative}
                </h3>
                <p style={{ color: '#34d399' }}>
                  Suggested Alternative
                </p>
              </div>
            </div>

            <div style={{
              background: '#0b3040',
              borderRadius: '10px',
              padding: '18px'
            }}>
              <h3 style={{ marginBottom: '10px' }}>
                <Zap size={18} /> Recommended Recovery Action
              </h3>

              <p style={{ lineHeight: 1.7 }}>
                {result.action}
              </p>
            </div>
          </section>
        </>
      )}

      <p className="prototype-note">
        This simulator uses illustrative rule-based logic and
        simulated values. Alternative port recommendations must
        be validated against actual capacity, weather and transport
        availability. It is not a live AI prediction system.
      </p>
    </div>
  )
}

export default DisruptionSimulator
