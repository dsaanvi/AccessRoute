import './App.css'
import AccessMap from './components/AccessMap'

function App() {
  return (
    <>
    <main className="app-shell">
      <section className="left-panel">

        <div className="brand-row">
          <div className="logo-mark">A</div>

          <div>
            <h1>AccessRoute</h1>
            <p>Mobility-aware navigation</p>
          </div>
        </div>


        <div className="intro">

          <div className="hero-brand">
            Access<span>Route</span>
          </div>

          <span className="eyebrow">
            BETTER ROUTES, NOT JUST SHORTER ONES
          </span>

          <h2>
            Move through the city
            <span> with more confidence.</span>
          </h2>

          <p>
            Compare routes based on stairs, slopes, surfaces and other
            accessibility factors that matter to you.
          </p>
        </div>


        <div className="feature-list">

          <div className="feature">
            <span>01</span>

            <div>
              <strong>Personalised routing</strong>
              <p>
                Choose the accessibility factors that matter most.
              </p>
            </div>
          </div>

          <div className="feature">
            <span>02</span>

            <div>
              <strong>Clear route trade-offs</strong>
              <p>
                Understand why one route may be more suitable than another.
              </p>
            </div>
          </div>

          <div className="feature">
            <span>03</span>

            <div>
              <strong>Accessibility-first</strong>
              <p>
                Designed around mobility needs from the beginning.
              </p>
            </div>
          </div>

        </div>

      </section>


      <section className="planner-panel">

        <div className="planner-card">

          <div className="planner-heading">
            <p className="small-label">PLAN A ROUTE</p>
            <h3>Where are you going?</h3>
          </div>


          <div className="location-group">
            <label>Starting point</label>

            <div className="input-wrap">
              <span className="dot start-dot"></span>

              <input
                type="text"
                placeholder="Enter your starting location"
              />
            </div>
          </div>


          <div className="route-line"></div>


          <div className="location-group">
            <label>Destination</label>

            <div className="input-wrap">
              <span className="dot end-dot"></span>

              <input
                type="text"
                placeholder="Enter your destination"
              />
            </div>
          </div>


          <div className="preferences-header">

            <div>
              <p className="small-label">PREFERENCES</p>
              <h4>Make the route work for you</h4>
            </div>

            <span className="optional">Optional</span>

          </div>


          <div className="preferences-grid">

            <label className="preference-card">
              <input type="checkbox" />

              <div className="preference-icon">
                ↗
              </div>

              <div className="preference-text">
                <strong>Avoid stairs</strong>
              </div>
            </label>


            <label className="preference-card">
              <input type="checkbox" />

              <div className="preference-icon">
                ◒
              </div>

              <div className="preference-text">
                <strong>Gentler slopes</strong>
              </div>
            </label>


            <label className="preference-card">
              <input type="checkbox" />

              <div className="preference-icon">
                ≋
              </div>

              <div className="preference-text">
                <strong>Smoother paths</strong>
              </div>
            </label>


            <label className="preference-card">
              <input type="checkbox" />

              <div className="preference-icon">
                ◢
              </div>

              <div className="preference-text">
                <strong>Prefer ramps</strong>
              </div>
            </label>


            <label className="preference-card">
              <input type="checkbox" />

              <div className="preference-icon">
                ━
              </div>

              <div className="preference-text">
                <strong>Avoid high kerbs</strong>
              </div>
            </label>


            <label className="preference-card">
              <input type="checkbox" />

              <div className="preference-icon">
                ↔
              </div>

              <div className="preference-text">
                <strong>Wider paths</strong>
              </div>
            </label>


            <label className="preference-card">
              <input type="checkbox" />

              <div className="preference-icon">
                ╫
              </div>

              <div className="preference-text">
                <strong>Accessible crossings</strong>
              </div>
            </label>


            <label className="preference-card">
              <input type="checkbox" />

              <div className="preference-icon">
                →
              </div>

              <div className="preference-text">
                <strong>Shorter distance</strong>
              </div>
            </label>

          </div>


          <button className="primary-button">
            Find accessible route
            <span>→</span>
          </button>


          <p className="disclaimer">
            Route suitability depends on available accessibility data.
          </p>

        </div>

      </section>

    </main>
    <section className="map-section">
      <AccessMap />
    </section>
    </>
  )
}

export default App